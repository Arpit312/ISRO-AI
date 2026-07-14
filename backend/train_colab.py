import torch
import torch.nn as nn
from torch.utils.data import DataLoader, Dataset
import os
import random
from pathlib import Path
from PIL import Image
import numpy as np
def month_to_phenology_vec(month):
    angle = 2 * np.pi * month / 12
    kharif = 1.0 if month in [6,7,8,9,10] else 0.0                          
    rabi = 1.0 if month in [11,12,1,2,3] else 0.0
    vec = [np.sin(angle), np.cos(angle), kharif, rabi, 0,0,0,0]
    return torch.tensor(vec, dtype=torch.float32)
class SyntheticCloudDataset(Dataset):
    def __init__(self, root, size=256):
        self.cloudy_dir = None
        for p in Path(root).rglob("cloudy"):
            if p.is_dir():
                self.cloudy_dir = p
                break
        if self.cloudy_dir is None:
            self.cloudy_dir = Path("/content/cloudy")
        self.clear_dir = self.cloudy_dir.parent / "clear"
        if not self.cloudy_dir.exists():
            raise FileNotFoundError(f"Could not find cloudy directory. Searched in {root} and /content/cloudy")
        self.files = sorted([f.name for f in self.cloudy_dir.glob("*.png")])
        if len(self.files) == 0:
            raise FileNotFoundError(f"No .png files found in {self.cloudy_dir}")
        self.size = size
    def __len__(self):
        return len(self.files)
    def __getitem__(self, idx):
        fname = self.files[idx]
        cloudy = np.asarray(Image.open(self.cloudy_dir / fname).convert("RGB").resize((self.size, self.size)), dtype=np.float32) / 255.0
        clear = np.asarray(Image.open(self.clear_dir / fname).convert("RGB").resize((self.size, self.size)), dtype=np.float32) / 255.0
        month = random.choices(range(1, 13), weights=[1,1,1,1,1,2,3,3,3,2,1,1])[0]
        phenology = month_to_phenology_vec(month)
        sar = torch.zeros(1, self.size, self.size, dtype=torch.float32)
        cloudy_t = torch.from_numpy(cloudy).permute(2, 0, 1)
        clear_t = torch.from_numpy(clear).permute(2, 0, 1)
        return cloudy_t, clear_t, sar, phenology
class FiLMPhenology(nn.Module):
    def __init__(self, phenology_dim=5, channels=32):
        super().__init__()
        self.to_gamma_beta = nn.Linear(phenology_dim, channels * 2)
    def forward(self, feat_map, phenology_vec):
        gb = self.to_gamma_beta(phenology_vec)
        gamma, beta = gb.chunk(2, dim=-1)
        gamma = gamma[:, :, None, None]
        beta = beta[:, :, None, None]
        return feat_map * (1 + gamma) + beta
class ConvBlock(nn.Module):
    def __init__(self, in_c, out_c, p_drop=0.15):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(in_c, out_c, 3, padding=1), nn.BatchNorm2d(out_c), nn.ReLU(inplace=True),
            nn.Dropout2d(p_drop),
            nn.Conv2d(out_c, out_c, 3, padding=1), nn.BatchNorm2d(out_c), nn.ReLU(inplace=True),
        )
    def forward(self, x): 
        return self.net(x)
class NovaSyncModelReal(nn.Module):
    """Input: RGB(3) + SAR(1) = 4 channels. Phenology(5) is injected via FiLM."""
    def __init__(self, in_ch=4, base=32, phenology_dim=8):
        super().__init__()
        self.enc1 = ConvBlock(in_ch, base)
        self.film = FiLMPhenology(phenology_dim, base)
        self.enc2 = ConvBlock(base, base*2)
        self.enc3 = ConvBlock(base*2, base*4)
        self.pool = nn.MaxPool2d(2)
        self.bottleneck = ConvBlock(base*4, base*8)
        self.up3 = nn.ConvTranspose2d(base*8, base*4, 2, stride=2)
        self.dec3 = ConvBlock(base*8, base*4)
        self.up2 = nn.ConvTranspose2d(base*4, base*2, 2, stride=2)
        self.dec2 = ConvBlock(base*4, base*2)
        self.up1 = nn.ConvTranspose2d(base*2, base, 2, stride=2)
        self.dec1 = ConvBlock(base*2, base)
        self.out = nn.Conv2d(base, 3, 1)
    def forward(self, x, phenology_vec):
        e1 = self.enc1(x)
        e1 = self.film(e1, phenology_vec)
        e2 = self.enc2(self.pool(e1))
        e3 = self.enc3(self.pool(e2))
        b = self.bottleneck(self.pool(e3))
        d3 = self.dec3(torch.cat([self.up3(b), e3], dim=1))
        d2 = self.dec2(torch.cat([self.up2(d3), e2], dim=1))
        d1 = self.dec1(torch.cat([self.up1(d2), e1], dim=1))
        return torch.sigmoid(self.out(d1))
def train():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Training on {device}")
    dataset = SyntheticCloudDataset("/content/synthetic_data")
    train_loader = DataLoader(dataset, batch_size=8, shuffle=True, num_workers=2)
    model = NovaSyncModelReal().to(device)
    opt = torch.optim.Adam(model.parameters(), lr=1e-4)
    loss_fn = nn.L1Loss()
    CHECKPOINT_PATH = "/content/drive/MyDrive/nova_sync/novasync_real_weights.pth"
    os.makedirs(os.path.dirname(CHECKPOINT_PATH), exist_ok=True)
    epochs = 30
    for epoch in range(epochs):
        model.train()
        total_loss = 0
        for cloudy, clear, sar, phenology in train_loader:
            cloudy, clear, sar, phenology = cloudy.to(device), clear.to(device), sar.to(device), phenology.to(device)
            x = torch.cat([cloudy, sar], dim=1)
            pred = model(x, phenology)
            loss = loss_fn(pred, clear)
            opt.zero_grad()
            loss.backward()
            opt.step()
            total_loss += loss.item()
        avg_loss = total_loss/len(train_loader)
        print(f"epoch {epoch} avg_loss {avg_loss:.4f}")
        torch.save(model.state_dict(), CHECKPOINT_PATH)
        print("Checkpoint saved to Drive.")
if __name__ == "__main__":
    train()
