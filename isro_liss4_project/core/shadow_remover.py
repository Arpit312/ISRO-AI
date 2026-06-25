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
        # image shape: (Batch, 3, Height, Width)
        # shadow_mask shape: (Batch, 1, Height, Width) -> 1 jahan shadow hai, 0 jahan nahi
        
        # Original image ko safe rakhna
        corrected_image = image.clone()
        
        # 0 value par math error na aaye isliye ek bahut choti value add karte hain
        safe_image = torch.clamp(image, min=1e-6)
        
        # Gamma correction apply karna (Dark pixels ko naturally bright karta hai)
        brightened_pixels = torch.pow(safe_image, 1.0 / self.gamma)
        
        # Sirf shadow wale hisse mein brightened pixels dalna, baaki original rakhna
        final_output = (1.0 - shadow_mask) * image + shadow_mask * brightened_pixels
        
        return final_output
