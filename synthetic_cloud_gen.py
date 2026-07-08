import numpy as np
from PIL import Image
import random
from pathlib import Path

def generate_cloud_mask(h, w, scale=100.0, octaves=6, thickness=0.6, seed=None):
    """Simple numpy-based procedural noise using PIL for resizing."""
    if seed is None:
        seed = random.randint(0, 9999)
    np.random.seed(seed)
    
    # Generate low resolution noise and upscale to create blobby clouds
    low_res_h, low_res_w = int(h / 8), int(w / 8)
    noise = np.random.rand(low_res_h, low_res_w)
    
    # Smooth and upscale using PIL
    noise_img = Image.fromarray((noise * 255).astype(np.uint8))
    upscaled = noise_img.resize((w, h), Image.Resampling.BICUBIC)
    mask = np.array(upscaled, dtype=np.float32) / 255.0
    
    mask = (mask - mask.min()) / (mask.max() - mask.min() + 1e-6)
    mask = np.clip((mask - (1 - thickness)) / thickness, 0, 1)
    return mask

def apply_synthetic_cloud(clear_img: np.ndarray, thickness=None):
    """clear_img: HxWx3 float32 [0,1]. Returns cloudy_img, mask."""
    h, w, _ = clear_img.shape
    thickness = thickness or random.uniform(0.3, 0.85)
    mask = generate_cloud_mask(h, w, thickness=thickness)
    cloud_color = np.ones_like(clear_img) * random.uniform(0.85, 0.98)
    mask_3ch = mask[..., None]
    cloudy = clear_img * (1 - mask_3ch) + cloud_color * mask_3ch
    # add haze scattering effect (physically motivated, not just opacity)
    haze = 1 - np.exp(-mask_3ch * 2.0)
    cloudy = cloudy * (1 - haze * 0.3) + haze * 0.3
    return np.clip(cloudy, 0, 1), mask

def build_training_set(clear_dir, out_dir, n_variants_per_image=3):
    out_dir = Path(out_dir)
    (out_dir / "cloudy").mkdir(parents=True, exist_ok=True)
    (out_dir / "clear").mkdir(parents=True, exist_ok=True)
    (out_dir / "mask").mkdir(parents=True, exist_ok=True)

    clear_files = list(Path(clear_dir).glob("*.png")) + list(Path(clear_dir).glob("*.jpg"))
    idx = 0
    for f in clear_files:
        img = np.asarray(Image.open(f).convert("RGB").resize((256, 256)), dtype=np.float32) / 255.0
        for _ in range(n_variants_per_image):
            cloudy, mask = apply_synthetic_cloud(img)
            Image.fromarray((cloudy * 255).astype(np.uint8)).save(out_dir / "cloudy" / f"{idx}.png")
            Image.fromarray((img * 255).astype(np.uint8)).save(out_dir / "clear" / f"{idx}.png")
            Image.fromarray((mask * 255).astype(np.uint8)).save(out_dir / "mask" / f"{idx}.png")
            idx += 1
    print(f"Generated {idx} synthetic training pairs")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 2:
        build_training_set(sys.argv[1], sys.argv[2])
    else:
        print("Usage: python synthetic_cloud_gen.py <clear_dir> <out_dir>")
