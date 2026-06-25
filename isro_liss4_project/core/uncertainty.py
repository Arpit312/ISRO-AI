import torch
import torch.nn as nn

class UncertaintyHead(nn.Module):
    def __init__(self, in_channels=64, out_channels=3):
        super(UncertaintyHead, self).__init__()
        self.mean_head = nn.Sequential(
            nn.Conv2d(in_channels, 32, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(32, out_channels, kernel_size=1)
        )
        self.logvar_head = nn.Sequential(
            nn.Conv2d(in_channels, 32, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(32, 1, kernel_size=1) 
        )
        
    def forward(self, features):
        reconstructed_image = self.mean_head(features)
        log_variance = self.logvar_head(features)
        uncertainty_map = torch.sigmoid(log_variance)
        return reconstructed_image, uncertainty_map
