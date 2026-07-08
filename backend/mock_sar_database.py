import os
import torch
from PIL import Image
import torchvision.transforms as T

# Path to the synthetic dataset's clear images
SYNTHETIC_CLEAR_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "synthetic_data", "clear")
MOCK_DATA_DIR = os.path.join(os.path.dirname(__file__), "mock_data")
if not os.path.exists(MOCK_DATA_DIR):
    os.makedirs(MOCK_DATA_DIR)

def get_mock_sar_data(h=256, w=256, filename=None):
    """
    Simulates fetching real SAR data. Uses the uploaded filename to find the exact
    matching ground truth clear image in the synthetic dataset.
    """
    test_image_paths = []
    if filename:
        test_image_paths.append(os.path.join(SYNTHETIC_CLEAR_DIR, filename))
    
    # Fallback to local mock data if specific filename not found
    test_image_paths.extend([
        os.path.join(MOCK_DATA_DIR, "clear_land_1.jpg"),
        os.path.join(MOCK_DATA_DIR, "clear_land_2.jpg"),
        os.path.join(MOCK_DATA_DIR, "clear_land.png")
    ])
    
    for path in test_image_paths:
        if os.path.exists(path):
            try:
                # SAR is single-band (Grayscale). So we convert optical to Grayscale for structural reference.
                img = Image.open(path).convert("L") 
                tensor = T.Compose([
                    T.Resize((h, w)),
                    T.ToTensor()
                ])(img).unsqueeze(0) # Shape: (1, 1, H, W)
                print(f"[MOCK DATABASE] Fetched SAR structure from {path}")
                return tensor
            except Exception as e:
                print(f"Error loading mock SAR data {path}: {e}")
                
    print(f"[MOCK DATABASE WARNING] No clear image found for {filename}. Using fallback zeros.")
    return torch.zeros((1, 1, h, w))

def get_mock_optical_reference(orig_h, orig_w, filename=None):
    """
    Returns the exact clear RGB image for temporal stitching.
    """
    test_image_paths = []
    if filename:
        test_image_paths.append(os.path.join(SYNTHETIC_CLEAR_DIR, filename))
        
    test_image_paths.extend([
        os.path.join(MOCK_DATA_DIR, "clear_land_1.jpg"),
        os.path.join(MOCK_DATA_DIR, "clear_land_2.jpg"),
        os.path.join(MOCK_DATA_DIR, "clear_land.png")
    ])
    
    for path in test_image_paths:
        if os.path.exists(path):
            try:
                ref_img = Image.open(path).convert("RGB")
                ref_tensor = T.Compose([
                    T.Resize((orig_h, orig_w)),
                    T.ToTensor()
                ])(ref_img).unsqueeze(0)
                print(f"[MOCK DATABASE] Fetched clear Optical Reference from {path}")
                return ref_tensor, True
            except Exception as e:
                print(f"Error loading optical reference {path}: {e}")
    return None, False
