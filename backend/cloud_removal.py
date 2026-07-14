"""
cloud_removal.py
-----------------
The "NOVA-SYNC fast path": temporal compositing.
Idea: for the same patch of ground, fetch several images from different dates.
A pixel that is cloudy in one date is usually clear in another. For every
pixel, we pick the value from whichever date was clear there (using the
Sentinel-2 SCL band to know what's cloud/shadow), and combine those into one
clean image. These are real satellite pixels -- nothing is invented.
"""
import io
import numpy as np
import tifffile
from PIL import Image
CLOUD_SCL_VALUES = {3, 8, 9, 10}
def tiff_bytes_to_array(tiff_bytes: bytes) -> np.ndarray:
    """Decode the multi-band TIFF returned by Sentinel Hub into a (H, W, bands) array."""
    arr = tifffile.imread(io.BytesIO(tiff_bytes))
    if arr.ndim == 2:
        arr = arr[:, :, None]
    return arr.astype(np.float32)
def cloud_percentage(scl_band: np.ndarray) -> float:
    """% of pixels flagged as cloud/shadow in one scene."""
    mask = np.isin(scl_band.astype(int), list(CLOUD_SCL_VALUES))
    return float(mask.mean() * 100)
def temporal_composite(image_stack, scl_stack):
    """
    image_stack: list of (H, W, 4) arrays [R, G, B, NIR] -- same bbox, different dates
    scl_stack:   list of (H, W) SCL arrays, same order as image_stack
    Returns:
        composite:  (H, W, 4) float32 array, clearest available pixel per location
        clear_mask: (H, W) bool array, True where we found at least one clear
                    observation across all dates (used as a simple quality signal)
    """
    stack = np.stack(image_stack, axis=0)                
    scl = np.stack(scl_stack, axis=0)             
    is_clear = ~np.isin(scl.astype(int), list(CLOUD_SCL_VALUES))             
    t, h, w, c = stack.shape
    composite = np.zeros((h, w, c), dtype=np.float32)
    any_clear = is_clear.any(axis=0)          
    clear_stack = np.where(is_clear[..., None], stack, np.nan)
    with np.errstate(invalid="ignore"):
        clear_median = np.nanmedian(clear_stack, axis=0)             
    composite[any_clear] = clear_median[any_clear]
    never_clear = ~any_clear
    if never_clear.any():
        fallback = np.median(stack, axis=0)
        composite[never_clear] = fallback[never_clear]
    return composite, any_clear
def array_to_png_bytes(rgb_array: np.ndarray, brightness: float = 3.5) -> bytes:
    """rgb_array: (H, W, 3) reflectance floats (roughly 0-0.3) -> viewable PNG bytes."""
    scaled = np.clip(rgb_array * brightness, 0, 1)
    img8 = (scaled * 255).astype(np.uint8)
    im = Image.fromarray(img8, mode="RGB")
    buf = io.BytesIO()
    im.save(buf, format="PNG")
    return buf.getvalue()
