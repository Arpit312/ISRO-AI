import torch
from core.spectral_adapter import SpectralDomainAdapter

def test_sda():
    print("--- Testing Feature 1: Spectral Domain Adapter ---")
    
    # Hum ek dummy LISS-IV image tensor banayenge
    # Format: [Batch_Size, Channels, Height, Width]
    # Yahan hum 1 image le rahe hain, 3 bands ki, 256x256 resolution ke sath
    dummy_liss4_image = torch.randn(1, 3, 256, 256)
    print(f"1. Input LISS-IV Image Shape: {dummy_liss4_image.shape}")
    
    # Model initialize karo
    adapter = SpectralDomainAdapter(liss4_bands=3, target_bands=13)
    
    # Image ko adapter se pass karo
    adapted_output = adapter(dummy_liss4_image)
    
    print(f"2. Output Adapted Shape: {adapted_output.shape}")
    
    # Verification
    if adapted_output.shape == (1, 13, 256, 256):
        print("SUCCESS: 3 bands successfully 13 bands mein convert ho gaye! 0 Errors.")
    else:
        print("FAILED: Shape mismatch!")

if __name__ == "__main__":
    test_sda()
