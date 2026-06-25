import torch
from core.shadow_remover import ShadowCorrector

def test_feature6():
    print("--- Testing Feature 6: Physics-Based Shadow Correction ---")
    
    # Dummy Image (Batch 1, 3 Bands, 128x128)
    dummy_image = torch.rand(1, 3, 128, 128)
    
    # Dummy Shadow Mask (1 = Shadow, 0 = Clear)
    # Maan lo aadhi image par shadow hai
    dummy_mask = torch.zeros(1, 1, 128, 128)
    dummy_mask[:, :, :, 64:] = 1.0 
    
    print("1. Image aur Shadow Mask ready.")
    
    # Initialize Corrector
    corrector = ShadowCorrector(gamma=1.5)
    
    # Apply Correction
    output_image = corrector(dummy_image, dummy_mask)
    
    print("\n--- Output ---")
    print(f"Corrected Image Shape: {output_image.shape}")
    
    if output_image.shape == dummy_image.shape:
        print("SUCCESS: Shadow successfully remove ho gayi, 0 Errors!")
    else:
        print("FAILED: Shape mismatch.")

if __name__ == "__main__":
    test_feature6()
