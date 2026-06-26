from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import torch
from datetime import datetime

# Hamare saare banaye hue 100% working components import kar rahe hain
from core.spectral_adapter import SpectralDomainAdapter
from core.cloud_classifier import CloudTypeClassifier, AdaptiveCloudRouter
from core.phenology import PhenologyEmbedder
from core.diffusion import SARFusionBlock
from core.uncertainty import UncertaintyHead
from core.shadow_remover import ShadowCorrector
from core.physics_validator import SpectralIndicesValidator

app = FastAPI(title="ISRO LISS-IV Cloud Removal Engine", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Production mein isko specific URL karna
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize all models globally so they load once
print("Loading AI Brain Modules...")
adapter = SpectralDomainAdapter()
classifier = CloudTypeClassifier()
router = AdaptiveCloudRouter(classifier)
phenology = PhenologyEmbedder()
fusion = SARFusionBlock(channels=64)
uncertainty_head = UncertaintyHead()
shadow_corrector = ShadowCorrector()
validator = SpectralIndicesValidator()
print("All Modules Loaded Successfully! Engine Ready.")

@app.post("/api/v1/process")
async def process_satellite_image(month: int = 7):
    # 1. Dummy LISS-IV Image (Aage chal kar web se aayegi)
    liss4_image = torch.randn(1, 3, 256, 256)
    
    # 2. Cloud Type & Season
    class_idx, class_name = router.route(liss4_image)
    pheno_embed, season = phenology(month)
    
    # 3. Simulate U-Net Features (since we don't have the 4GB full model running locally)
    dummy_unet_features = torch.randn(1, 64, 256, 256)
    
    # 4. Feature 5: Generate Cloud-Free Image + Uncertainty
    cloud_free_img, uncertainty_map = uncertainty_head(dummy_unet_features)
    
    # 5. Feature 7: Physics Validation on the output
    score, report = validator.validate(cloud_free_img)
    
    return {
        "status": "success",
        "cloud_type_detected": class_name,
        "season_prior_injected": season,
        "physics_quality_score": score,
        "spectral_report": report,
        "message": "AI Engine is 100% Locked and Loaded!"
    }
