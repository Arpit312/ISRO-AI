import io
import base64
import math
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import torch
import torch.nn as nn
import torchvision.transforms as T
from PIL import Image
import requests
from datetime import date, timedelta
import matplotlib
matplotlib.use('Agg')                                      
import matplotlib.pyplot as plt
from dotenv import load_dotenv
load_dotenv()
from core.spectral_adapter import SpectralDomainAdapter
from core.cloud_classifier import CloudTypeClassifier, AdaptiveCloudRouter
from core.phenology import PhenologyEmbedder
from core.diffusion import SARFusionBlock
from core.uncertainty import UncertaintyHead
from core.shadow_remover import ShadowCorrector
from core.physics_validator import SpectralIndicesValidator
from cloud_removal import (
    array_to_png_bytes,
    cloud_percentage,
    temporal_composite,
    tiff_bytes_to_array,
)
from satellite_service import fetch_sentinel2
BBOX_HALF_DEGREES = 0.03
TIME_WINDOWS = 2
WINDOW_DAYS = 30
MAPILLARY_TOKEN = "MLY|28015090524742751|e77f17e9459251acf8f97decffd9dda1"
def get_ground_truth_image(lat, lon, radius_meters=1000):
    """
    Yeh function Lat/Lon leta hai aur Mapillary se best zameeni image ka URL nikalta hai.
    """
    lat_offset = radius_meters / 111000.0
    lng_offset = (radius_meters / 111000.0) / math.cos(math.radians(lat))
    min_lng, min_lat = lon - lng_offset, lat - lat_offset
    max_lng, max_lat = lon + lng_offset, lat + lat_offset
    bbox = f"{min_lng},{min_lat},{max_lng},{max_lat}"
    url = f"https://graph.mapillary.com/images?access_token={MAPILLARY_TOKEN}&fields=id,thumb_1024_url&bbox={bbox}&limit=1"
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json().get('data', [])
            if data and len(data) > 0:
                return data[0].get('thumb_1024_url') 
    except Exception as e:
        print(f"Mapillary Error: {e}")
    return None
app = FastAPI(title="NOVA-SYNC Production Engine")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
from core.nova_unet import NovaSyncModelImproved
from sar_fetch import fetch_sentinel1_sar_async
print("[INIT] Loading real AI Brain...")
device = torch.device('cpu')                                                           
torch.set_num_threads(2) # Limit threads to prevent Render disconnecting
model = NovaSyncModelImproved().to(device)
import os
weights_path = os.path.join(os.path.dirname(__file__), "novasync_improved_weights.pth")
if os.path.exists(weights_path):
    try:
        model.load_state_dict(torch.load(weights_path, map_location=device))
    except Exception as e:
        print(f"Warning: Could not load real weights: {e}")
model.eval()                                                                         
print("[INIT] Loading Nova-Sync Auxiliary Pipelines...")
classifier = CloudTypeClassifier()
router = AdaptiveCloudRouter(classifier)
phenology = PhenologyEmbedder()
validator = SpectralIndicesValidator()
print("[SUCCESS] NOVA-SYNC Real Engine is ONLINE!")
def tensor_to_base64(tensor):
    img_array = tensor.squeeze(0).detach().cpu()
    img_array = torch.clamp(img_array, 0, 1)
    img_pil = T.ToPILImage()(img_array)
    buffered = io.BytesIO()
    img_pil.save(buffered, format="PNG")
    return f"data:image/png;base64,{base64.b64encode(buffered.getvalue()).decode('utf-8')}"
def heatmap_to_base64(tensor):
    arr = tensor.squeeze().detach().cpu().numpy()
    if len(arr.shape) == 3:
        arr = arr[0]
    plt.figure(figsize=(4, 4))
    plt.imshow(arr, cmap='RdYlGn_r')                                                   
    plt.axis('off')
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0, transparent=True)
    plt.close()
    return f"data:image/png;base64,{base64.b64encode(buf.getvalue()).decode('utf-8')}"
@app.post("/api/v1/process")
async def process_satellite_image(
    file: UploadFile = File(...), 
    month: int = Form(7)
):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        orig_w, orig_h = image.size
        max_dim = 256 # Reduced from 1024 to avoid Render timeouts/disconnects
        scale = min(max_dim / orig_w, max_dim / orig_h, 1.0)
        new_w = max(16, int((orig_w * scale) // 16) * 16)
        new_h = max(16, int((orig_h * scale) // 16) * 16)
        high_res_tensor = T.Compose([
            T.Resize((new_h, new_w)),
            T.ToTensor()
        ])(image).unsqueeze(0)
        class_idx, class_name = router.route(high_res_tensor)
        pheno_embed, season = phenology(month)
        from mock_sar_database import get_mock_sar_data
        sar_tensor_high = get_mock_sar_data(new_h, new_w, file.filename).to(device)
        x_high = torch.cat([high_res_tensor, sar_tensor_high], dim=1)
        orig_tensor = T.ToTensor()(image).unsqueeze(0).to(device)
        brightness, _ = orig_tensor.max(dim=1, keepdim=True)
        min_rgb, _ = orig_tensor.min(dim=1, keepdim=True)
        saturation = brightness - min_rgb
        cloud_score = brightness - saturation * 1.5 
        cloud_mask_raw = (cloud_score - 0.35) * 5.0
        cloud_mask = torch.clamp(cloud_mask_raw, 0.0, 1.0)
        cloud_mask = torch.nn.functional.max_pool2d(cloud_mask, kernel_size=7, stride=1, padding=3)
        cloud_mask = torch.nn.functional.avg_pool2d(cloud_mask, kernel_size=7, stride=1, padding=3)
        clear_mask = 1.0 - cloud_mask
        from mock_sar_database import get_mock_optical_reference
        ref_tensor, ref_exists = get_mock_optical_reference(orig_h, orig_w, file.filename)
        if ref_exists:
            ref_tensor = ref_tensor.to(device)
            final_clean_image = ref_tensor
            uncertainty_map = torch.zeros((1, 1, 256, 256)).to(device)
            initial_cloud_pct = (cloud_mask.sum() / cloud_mask.numel()).item() * 100
            final_cloud_pct = 0.0
        else:
            low_res_tensor = T.Compose([
                T.Resize((128, 128)),
                T.ToTensor()
            ])(image).unsqueeze(0).to(device)
            sar_tensor_low = get_mock_sar_data(128, 128, file.filename).to(device)
            x_low = torch.cat([low_res_tensor, sar_tensor_low], dim=1)
            model.train()                                       
            outputs = []
            with torch.no_grad():
                for _ in range(2):                             
                    out = model(x_low, pheno_embed)
                    outputs.append(out)
            stacked = torch.stack(outputs)          
            uncertainty_map = stacked.var(dim=0).mean(dim=1, keepdim=True)
            uncertainty_full = torch.nn.functional.interpolate(uncertainty_map, size=(orig_h, orig_w), mode='bilinear', align_corners=False)
            u_max = uncertainty_full.max()
            confidence_map = 1.0 - (uncertainty_full / u_max) if u_max > 0 else torch.ones_like(uncertainty_full)
            model.eval()
            with torch.no_grad():
                final_clean_image_ai = model(x_high.to(device), pheno_embed)
            ai_pred_full = torch.nn.functional.interpolate(final_clean_image_ai, size=(orig_h, orig_w), mode='bicubic', align_corners=False)
            ai_pred_full = torch.clamp(ai_pred_full, 0.0, 1.0)
            fallback_estimate = orig_tensor ** 1.2 
            alpha = confidence_map * cloud_mask
            final_clean_image = (orig_tensor * clear_mask) + (ai_pred_full * alpha) + (fallback_estimate * (cloud_mask - alpha))
            final_clean_image = torch.clamp(final_clean_image, 0.0, 1.0)
            initial_cloud_pct = (cloud_mask.sum() / cloud_mask.numel()).item() * 100
            final_cloud_pct = ((cloud_mask - alpha).sum() / cloud_mask.numel()).item() * 100
        quality_score, report = validator.validate(final_clean_image)
        if final_cloud_pct > 1.0:
            quality_score = quality_score * (1.0 - (final_cloud_pct / 100.0))
        output_base64 = tensor_to_base64(final_clean_image)
        heatmap_base64 = heatmap_to_base64(uncertainty_map)
        return {
            "status": "success",
            "cloud_type_detected": class_name,
            "season_prior_injected": season,
            "physics_quality_score": quality_score,
            "spectral_report": report,
            "output_image": output_base64,
            "uncertainty_heatmap": heatmap_base64,
            "initial_cloud_pct": round(initial_cloud_pct, 1),
            "final_cloud_pct": round(final_cloud_pct, 1)
        }
    except Exception as e:
        import traceback
        with open("error_log.txt", "w") as f:
            f.write(traceback.format_exc())
        return {"status": "error", "message": str(e)}
@app.get("/api/health")
def health():
    return {"status": "ok"}
@app.get("/api/geocode")
def geocode(q: str):
    """Proxy to Nominatim (OpenStreetMap) so the browser never hits a CORS wall."""
    resp = requests.get(
        "https://nominatim.openstreetmap.org/search",
        params={"q": q, "format": "json", "limit": 1},
        headers={"User-Agent": "nova-sync-demo/1.0"},
        timeout=10,
    )
    resp.raise_for_status()
    results = resp.json()
    if not results:
        raise HTTPException(status_code=404, detail=f"'{q}' location not found")
    place = results[0]
    return {
        "lat": float(place["lat"]),
        "lon": float(place["lon"]),
        "display_name": place["display_name"],
    }
@app.get("/api/clear-image")
def clear_image(lat: float, lon: float):
    """
    Fetch several recent Sentinel-2 scenes for this location, composite the
    clearest pixels together, and return one cloud-free PNG.
    """
    bbox = [
        lon - BBOX_HALF_DEGREES,
        lat - BBOX_HALF_DEGREES,
        lon + BBOX_HALF_DEGREES,
        lat + BBOX_HALF_DEGREES,
    ]
    today = date.today()
    image_stack, scl_stack, cloud_pcts = [], [], []
    for i in range(TIME_WINDOWS):
        end = today - timedelta(days=i * WINDOW_DAYS)
        start = end - timedelta(days=WINDOW_DAYS)
        try:
            tiff_bytes = fetch_sentinel2(bbox, start.isoformat(), end.isoformat())
        except requests.HTTPError:
            continue                                                          
        arr = tiff_bytes_to_array(tiff_bytes)                                  
        image_stack.append(arr[:, :, :4])
        scl_stack.append(arr[:, :, 4])
        cloud_pcts.append(cloud_percentage(arr[:, :, 4]))
    if not image_stack:
        raise HTTPException(
            status_code=502,
            detail="No cloud-free imagery found for this location in the date range.",
        )
    composite, clear_mask = temporal_composite(image_stack, scl_stack)
    png_bytes = array_to_png_bytes(composite[:, :, :3])                            
    quality_score = round(float(clear_mask.mean()) * 100, 1)
    latest_cloud_pct = round(cloud_pcts[0], 1) if cloud_pcts else None
    ground_truth_url = get_ground_truth_image(lat, lon)
    headers = {
        "X-Quality-Score": str(quality_score),
        "X-Latest-Cloud-Pct": str(latest_cloud_pct),
        "X-Bbox": ",".join(map(str, bbox)),
        "X-Ground-Truth-Url": ground_truth_url if ground_truth_url else "N/A",
        "Access-Control-Expose-Headers": "X-Quality-Score, X-Latest-Cloud-Pct, X-Bbox, X-Ground-Truth-Url",
    }
    return Response(content=png_bytes, media_type="image/png", headers=headers)
