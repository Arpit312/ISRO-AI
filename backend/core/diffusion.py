import torch
import torch.nn as nn

class SARFusionBlock(nn.Module):
    """
    Yeh block Optical (LISS-IV) aur SAR (Radar) features ko aapas mein fuse karta hai.
    (Memory issue fix: Cross-Attention ki jagah Convolutional fusion use kar rahe hain 
    taaki 64GB RAM allocate na ho due to O(N^2) complexity on 256x256 image).
    """
    def __init__(self, channels):
        super(SARFusionBlock, self).__init__()
        
        # Concatenation ke baad channels wapas shrink karne ke liye Conv Block
        self.fusion_conv = nn.Sequential(
            nn.Conv2d(channels * 2, channels, kernel_size=3, padding=1),
            nn.BatchNorm2d(channels),
            nn.ReLU(inplace=True),
            nn.Conv2d(channels, channels, kernel_size=1)
        )
        
        # Gated fusion parameter (AI khud seekhega ki SAR ko kitni importance deni hai)
        self.gate = nn.Parameter(torch.zeros(1))
        
    def forward(self, optical_feat, sar_feat):
        # Shape: Batch, Channels, Height, Width
        
        # Channel dimension (dim=1) ke along dono features ko jod do
        # Resulting shape: (B, C*2, H, W)
        combined = torch.cat([optical_feat, sar_feat], dim=1)
        
        # Convolution se wapas C channels mein le aao
        fused_img = self.fusion_conv(combined)
        
        # Residual connection with learned gate
        final_output = optical_feat + torch.sigmoid(self.gate) * fused_img
        
        return final_output
