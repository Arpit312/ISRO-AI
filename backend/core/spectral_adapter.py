import torch
import torch.nn as nn

class SpectralDomainAdapter(nn.Module):
    """
    Yeh adapter LISS-IV ke 3 bands (G, R, NIR) ko pre-trained 
    Sentinel-2 models ke 13-band latent space mein map karega.
    """
    def __init__(self, liss4_bands=3, target_bands=13):
        super(SpectralDomainAdapter, self).__init__()
        
        # 1x1 Convolution use kar rahe hain taaki spatial resolution (image size) 
        # same rahe, sirf depth (channels) 3 se 13 ho jaye.
        self.adapter = nn.Sequential(
            nn.Conv2d(in_channels=liss4_bands, out_channels=32, kernel_size=1),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.Conv2d(in_channels=32, out_channels=target_bands, kernel_size=1)
        )
    
    def forward(self, x):
        # x shape: [Batch_Size, 3, Height, Width]
        return self.adapter(x)

# Jab directly is file ko run karenge toh ye basic structure print karega
if __name__ == "__main__":
    model = SpectralDomainAdapter()
    print("Feature 1: Spectral Domain Adapter is Ready!")
