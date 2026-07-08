import requests
import hashlib
import os

API_URL = "http://localhost:8000/api/v1/process"

def test_different_inputs_give_different_outputs():
    from PIL import Image
    import numpy as np
    
    if not os.path.exists("test_image_1.png"):
        Image.fromarray(np.random.randint(0, 255, (256, 256, 3), dtype=np.uint8)).save("test_image_1.png")
            
    if not os.path.exists("test_image_2.png"):
        Image.fromarray(np.random.randint(0, 255, (256, 256, 3), dtype=np.uint8)).save("test_image_2.png")

    print("Testing API with Image 1...")
    with open("test_image_1.png", "rb") as f:
        resp1 = requests.post(API_URL, files={"file": f}, data={"month": 7})
    
    print("Testing API with Image 2...")
    with open("test_image_2.png", "rb") as f:
        resp2 = requests.post(API_URL, files={"file": f}, data={"month": 7})
        
    if resp1.status_code != 200 or resp2.status_code != 200:
        print("API failed to process images.")
        return
        
    img1_out = resp1.json().get("output_image")
    img2_out = resp2.json().get("output_image")
    
    hash1 = hashlib.md5(img1_out.encode()).hexdigest()
    hash2 = hashlib.md5(img2_out.encode()).hexdigest()
    
    if hash1 == hash2:
        print(f"FAIL: STILL RETURNING FIXED IMAGE — bypass not removed! Hash: {hash1}")
    else:
        print("PASS: outputs are genuinely input-dependent")

if __name__ == "__main__":
    test_different_inputs_give_different_outputs()
