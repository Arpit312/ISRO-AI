import torch
import torch.nn as nn
class ShadowCorrector(nn.Module):
    """
    Yeh module image mein jahan shadow hai, wahan ki spectral reflectance
    ko wapas normal brightness par laata hai using Gamma Correction.
    """
    def __init__(self, gamma=1.5):
        super(ShadowCorrector, self).__init__()
        self.gamma = gamma
    def forward(self, image, shadow_mask):
        corrected_image = image.clone()
        safe_image = torch.clamp(image, min=1e-6)
        brightened_pixels = torch.pow(safe_image, 1.0 / self.gamma)
        final_output = (1.0 - shadow_mask) * image + shadow_mask * brightened_pixels
        return final_output
