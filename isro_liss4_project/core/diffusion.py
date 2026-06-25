import torch
import torch.nn as nn

class SARFusionBlock(nn.Module):
    """
    Yeh block Optical (LISS-IV) aur SAR (Radar) features ko aapas mein fuse karta hai
    using Cross-Attention.
    """
    def __init__(self, channels):
        super(SARFusionBlock, self).__init__()
        
        # 1x1 Convolutions for projection
        self.optical_proj = nn.Conv2d(channels, channels, kernel_size=1)
        self.sar_proj = nn.Conv2d(channels, channels, kernel_size=1)
        
        # Cross Attention Layer (batch_first=True makes tensor shape handling easier)
        self.cross_attn = nn.MultiheadAttention(embed_dim=channels, num_heads=4, batch_first=True)
        
        # Gated fusion parameter (AI khud seekhega ki SAR ko kitni importance deni hai)
        self.gate = nn.Parameter(torch.zeros(1))
        
    def forward(self, optical_feat, sar_feat):
        # Shape: Batch, Channels, Height, Width
        B, C, H, W = optical_feat.shape
        
        # Spatial dimensions ko flatten karna for Attention mechanism
        # (B, C, H, W) -> (B, H*W, C)
        opt_flat = self.optical_proj(optical_feat).view(B, C, -1).permute(0, 2, 1)
        sar_flat = self.sar_proj(sar_feat).view(B, C, -1).permute(0, 2, 1)
        
        # Cross-Attention: LISS-IV query karta hai, SAR keys aur values deta hai
        fused_flat, _ = self.cross_attn(query=opt_flat, key=sar_flat, value=sar_flat)
        
        # Wapas original image shape mein reshape karna
        # (B, H*W, C) -> (B, C, H, W)
        fused_img = fused_flat.permute(0, 2, 1).view(B, C, H, W)
        
        # Residual connection with learned gate
        final_output = optical_feat + torch.sigmoid(self.gate) * fused_img
        
        return final_output
