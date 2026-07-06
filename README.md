# ISRO AI Project Ecosystem

## Vision & Purpose
The **ISRO AI Project** is a comprehensive suite of artificial intelligence tools designed to process, enhance, and analyze remote sensing and satellite imagery, specifically targeting ISRO's sensors like LISS-IV. 

The primary challenge addressed by this project is **cloud occlusion in satellite imagery**. Optical sensors cannot penetrate clouds, rendering data completely obscured during the monsoon season or overcast days. This missing data creates a massive bottleneck for critical downstream applications like agriculture monitoring, disaster management, and defense surveillance. 

The vision of this ecosystem is to transform raw, weather-dependent satellite imagery into a highly searchable, always-clear, and scientifically valid asset. This ensures operational continuity, maximizes the utility of existing satellite data without launching new costly sensors, and provides continuous, accessible ground intelligence.

## Current Status
The project is currently a **Fully Working Prototype**, featuring an integrated ecosystem consisting of two major subsystems that solve critical challenges in Earth observation: searching through massive datasets and mathematically reconstructing cloud-obscured imagery.

## Subsystems & Pipelines Explained

### 1. NOVA-SYNC (LISS-IV Cloud Removal Engine)
NOVA-SYNC is an advanced, multi-modal Generative AI pipeline designed to reconstruct satellite imagery obscured by clouds. Instead of blindly "guessing" missing pixels, it mathematically reconstructs the ground reality using a **7-stage AI pipeline**:

1. **Spectral Domain Adapter (SDA):** Maps 3-band LISS-IV imagery to a 13-band space to utilize powerful global foundation models without the need to retrain them from scratch.
2. **NER Cloud Type Classifier:** A ResNet-18 backbone classifies the image into 5 categories (e.g., Thin Cirrus, Deep Convective, Cloud Shadow) to intelligently route processing and avoid heavy AI processing on clear areas.
3. **Phenological Prior Module:** Incorporates Indian Crop Calendars (Kharif, Rabi, Zaid) into a mathematical vector to guide the AI, ensuring reconstructed vegetation is seasonally and agriculturally accurate.
4. **SAR-Guided Latent Diffusion:** Fuses optical features with SAR (Synthetic Aperture Radar) data using Cross-Attention mechanisms. Radar penetrates clouds, allowing the Diffusion U-Net to reconstruct the image based on actual physical ground structures rather than random AI hallucinations.
5. **Uncertainty Quantification (Confidence Matrix):** Generates a Confidence Matrix Heatmap using an Uncertainty Head (MC Dropout) to highlight unreliable AI guesses, preventing errors in critical decision-making.
6. **Cloud + Shadow Dual Removal:** Targets cloud shadows via a physics-based Gamma Correction module, stretching spectral reflectance to natural brightness and recovering maximum usable surface area.
7. **Spectral Physics Validator:** Enforces hard physical bounds by calculating indices like NDVI, outputting a Quality Score (0-100) to guarantee the scientific validity of the output.

### 2. Remote Sensing Image Search Engine
An intelligent, natural-language-driven search engine for satellite imagery.
- **How it works:** It utilizes OpenAI's CLIP embeddings to understand the context of natural text queries (e.g., "airport runway", "dense forest") and maps them to image pixels. It uses ChromaDB for fast similarity matching, allowing users to quickly retrieve specific geographical features from massive unlabelled datasets.

## Technology Stack
- **AI & Deep Learning:** PyTorch, TorchVision, OpenAI CLIP, Latent Diffusion Models, ResNet-18
- **Databases:** ChromaDB (Vector Similarity Search)
- **Backend & APIs:** Python, FastAPI, Flask, Uvicorn
- **Frontend & UI:** Next.js (React), TailwindCSS, JavaScript/TypeScript
- **Data Processing:** Pandas, NumPy, PIL, Matplotlib

## Setup & Usage

### A. Run Remote Sensing Image Search Engine
```bash
pip install flask chromadb torch torchvision transformers pillow pandas
python build_database.py
python app.py
```
Open `http://localhost:5000` in your browser.

### B. Run NOVA-SYNC (Cloud Removal Engine)

**Run Backend (FastAPI / PyTorch AI Engine):**
1. Navigate to the project directory: `cd isro_liss4_project`
2. Activate the virtual environment: `venv\Scripts\activate` (or `source venv/bin/activate` on Mac/Linux)
3. Start the server: `python -m uvicorn api_server:app --port 8000 --reload`

**Run Frontend (Next.js Dashboard):**
1. Open a new terminal and navigate to the frontend folder: `cd NOVA-SYNC`
2. Start the development server: `npm run dev`
3. Open a browser and visit: `http://localhost:3000`
