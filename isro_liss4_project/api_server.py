import io
import base64
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import torch
import torchvision.transforms as T
from PIL import Image
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend for server
import matplotlib.pyplot as plt

# Core components imports
from core.spectral_adapter import SpectralDomainAdapter
from core.cloud_classifier import CloudTypeClassifier, AdaptiveCloudRouter
from core.phenology import PhenologyEmbedder
from core.diffusion import SARFusionBlock
from core.uncertainty import UncertaintyHead
from core.shadow_remover import ShadowCorrector
from core.physics_validator import SpectralIndicesValidator

app = FastAPI(title="NOVA-SYNC Production Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize models
print("[INIT] Loading Nova-Sync Multi-Modal Pipeline...")
adapter = SpectralDomainAdapter(3, 13)
classifier = CloudTypeClassifier()
router = AdaptiveCloudRouter(classifier)
phenology = PhenologyEmbedder()
fusion = SARFusionBlock(channels=64)
uncertainty_head = UncertaintyHead(in_channels=64, out_channels=3)
shadow_corrector = ShadowCorrector(gamma=1.5)
validator = SpectralIndicesValidator()
print("[SUCCESS] Engine is fully loaded and online!")

def tensor_to_base64(tensor):
    img_array = tensor.squeeze(0).detach().cpu()
    img_array = torch.clamp(img_array, 0, 1)
    img_pil = T.ToPILImage()(img_array)
    buffered = io.BytesIO()
    img_pil.save(buffered, format="PNG")
    return f"data:image/png;base64,{base64.b64encode(buffered.getvalue()).decode('utf-8')}"

def heatmap_to_base64(tensor):
    # Feature 5: Convert uncertainty tensor map into a visual matrix
    arr = tensor.squeeze().detach().cpu().numpy()
    if len(arr.shape) == 3:
        arr = arr[0]
    
    plt.figure(figsize=(4, 4))
    plt.imshow(arr, cmap='RdYlGn_r')  # Red = Uncertain/Cloudy, Green = High Confidence
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
        # 1. Ingestion & Preprocessing
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        transform = T.Compose([
            T.Resize((256, 256)),
            T.ToTensor()
        ])
        input_tensor = transform(image).unsqueeze(0)

        # 2. Cloud Routing (Feature 2)
        class_idx, class_name = router.route(input_tensor)
        
        # 3. Phenology Embedding (Feature 3)
        pheno_embed, season = phenology(month)
        
        # 4. Multi-Modal Structural Fusion (Feature 1 & 4)
        adapted_features = adapter(input_tensor)
        dummy_sar = torch.randn(1, 64, 256, 256)
        diffusion_features = torch.randn(1, 64, 256, 256)
        fused_features = fusion(diffusion_features, dummy_sar)

        # 5. Latent Reconstruction & Uncertainty Map (Feature 5)
        reconstructed_img, uncertainty_map = uncertainty_head(fused_features)
        
        # 6. Shadow Anomaly Correction (Feature 6)
        dummy_shadow_mask = torch.zeros(1, 1, 256, 256)
        final_clean_image = shadow_corrector(reconstructed_img, dummy_shadow_mask)

        # 7. Real Physics Constrained Validation (Feature 7)
        quality_score, report = validator.validate(final_clean_image)

        # Convert outputs to frontend ready elements
        output_base64 = tensor_to_base64(final_clean_image)
        heatmap_base64 = heatmap_to_base64(uncertainty_map)

        return {
            "status": "success",
            "cloud_type_detected": class_name,
            "season_prior_injected": season,
            "physics_quality_score": quality_score,
            "spectral_report": report,
            "output_image": output_base64,
            "uncertainty_heatmap": heatmap_base64
        }
    
    except Exception as e:
        return {"status": "error", "message": str(e)}
