import torch
import torchvision.transforms as T
from PIL import Image
import torch.nn as nn
import os

class DoubleConv(nn.Module):
    def __init__(self, in_ch, out_ch):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(in_ch, out_ch, 3, padding=1), nn.BatchNorm2d(out_ch), nn.ReLU(inplace=True),
            nn.Conv2d(out_ch, out_ch, 3, padding=1), nn.BatchNorm2d(out_ch), nn.ReLU(inplace=True)
        )
    def forward(self, x): return self.net(x)

class NovaSyncModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.inc = DoubleConv(3, 32)
        self.down1 = nn.Sequential(nn.MaxPool2d(2), DoubleConv(32, 64))
        self.down2 = nn.Sequential(nn.MaxPool2d(2), DoubleConv(64, 128))
        self.up1 = nn.ConvTranspose2d(128, 64, kernel_size=2, stride=2)
        self.conv1 = DoubleConv(128, 64)
        self.up2 = nn.ConvTranspose2d(64, 32, kernel_size=2, stride=2)
        self.conv2 = DoubleConv(64, 32)
        self.outc = nn.Sequential(nn.Conv2d(32, 3, 1), nn.Sigmoid())
        
    def forward(self, x):
        x1 = self.inc(x)
        x2 = self.down1(x1)
        x3 = self.down2(x2)
        x = self.up1(x3)
        x = self.conv1(torch.cat([x, x2], dim=1))
        x = self.up2(x)
        x = self.conv2(torch.cat([x, x1], dim=1))
        return self.outc(x)

def test():
    try:
        import io
        import matplotlib.pyplot as plt
        
        uncertainty_map = torch.rand(1, 256, 256) * 0.5
        arr = uncertainty_map.squeeze().detach().cpu().numpy()
        if len(arr.shape) == 3:
            arr = arr[0]
            
        plt.figure(figsize=(4, 4))
        plt.imshow(arr, cmap='RdYlGn_r')
        plt.axis('off')
        
        buf = io.BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0, transparent=True)
        
        with open("d:\\ISRO_AI_Project\\backend\\test_heatmap.png", "wb") as f:
            f.write(buf.getvalue())
        print("Heatmap saved.")
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    test()
