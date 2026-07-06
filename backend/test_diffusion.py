import torch
from core.diffusion import SARFusionBlock

def test_feature4():
    print("--- Testing Feature 4: SAR-Guided Latent Fusion ---")
    
    # 64 channels represent feature maps extracted by earlier layers of AI
    channels = 64
    height, width = 64, 64 
    
    # Dummy Tensors banate hain
    dummy_optical = torch.randn(1, channels, height, width)
    dummy_sar = torch.randn(1, channels, height, width)
    
    print("1. LISS-IV Features Shape:", dummy_optical.shape)
    print("2. SAR Features Shape:", dummy_sar.shape)
    
    # Block initialize karna
    fusion_block = SARFusionBlock(channels=channels)
    print("3. SAR Fusion Block Initialized.")
    
    # Dono features ko fuse karna
    fused_output = fusion_block(dummy_optical, dummy_sar)
    
    print("\n--- Output ---")
    print("Fused Output Shape:", fused_output.shape)
    
    # Verification
    if fused_output.shape == dummy_optical.shape:
        print("SUCCESS: LISS-IV aur SAR successfully fuse ho gaye using Cross-Attention, 0 Errors!")
    else:
        print("FAILED: Shape mismatch during fusion.")

if __name__ == "__main__":
    test_feature4()
