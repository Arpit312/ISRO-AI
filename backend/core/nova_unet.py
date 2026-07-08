import torch
import torch.nn as nn

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

class NovaSyncModelImproved(nn.Module):
    """Input: RGB(3) + SAR(1) = 4 channels. Phenology(8) is injected via FiLM."""
    def __init__(self, in_ch=4, base=64, phenology_dim=8):
        super().__init__()
        self.enc1 = ConvBlock(in_ch, base)
        self.film = FiLMPhenology(phenology_dim, base)
        self.enc2 = ConvBlock(base, base*2)
        self.enc3 = ConvBlock(base*2, base*4)
        self.enc4 = ConvBlock(base*4, base*8)
        self.pool = nn.MaxPool2d(2)
        self.bottleneck = ConvBlock(base*8, base*16)
        
        self.up4 = nn.ConvTranspose2d(base*16, base*8, 2, stride=2)
        self.dec4 = ConvBlock(base*16, base*8)
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
        e4 = self.enc4(self.pool(e3))
        b = self.bottleneck(self.pool(e4))
        
        # Decoder
        d4 = self.dec4(torch.cat([self.up4(b), e4], dim=1))
        d3 = self.dec3(torch.cat([self.up3(d4), e3], dim=1))
        d2 = self.dec2(torch.cat([self.up2(d3), e2], dim=1))
        d1 = self.dec1(torch.cat([self.up1(d2), e1], dim=1))
        
        return torch.sigmoid(self.out(d1))
