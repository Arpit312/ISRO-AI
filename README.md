# NOVA-SYNC: AI-Driven Satellite Intelligence Ecosystem

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8%2B-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)

> Turning cloud-blinded satellite data into actionable ground intelligence.

## 📖 Overview

Optical satellites capture critical high-resolution data, but they have a fatal flaw: **they cannot see through clouds.** During monsoons or overcast days, a vast majority of satellite imagery becomes useless.

**NOVA-SYNC** is a comprehensive, end-to-end ecosystem that mathematically reconstructs cloud-obscured areas in satellite imagery and turns that clear data into actionable disaster-response intelligence.

## ✨ Key Features

- **NOVA-SYNC AI Engine**: A 7-stage Generative AI Engine that removes clouds by fusing optical data with radar data.
- **SAFE-ROUTE**: A live open-data risk scanner that finds the safest zones and nearest rescue teams for disaster victims.
- **Semantic Search**: An NLP-driven search engine to instantly find geographical features across unlabelled satellite archives.
- **"Honest AI" (Zero Hallucinations)**: Confidence-Gated Blending ensures AI only replaces pixels when certain; otherwise, it falls back to real historical data.
- **Physics-Constrained Output**: Generates a spectral report to prove pixels are usable for scientific analysis.

## 🏗️ Architecture

1. **Spectral Domain Adapter**: Maps 3-band imagery into 13-band space.
2. **Intelligent Cloud Router (ResNet-18)**: Classifies clouds to selectively apply AI processing.
3. **Phenological Prior Injection**: Uses crop calendars to ensure seasonal accuracy.
4. **SAR-Guided Latent Diffusion**: Fuses cloud-penetrating Synthetic Aperture Radar (SAR) with optical data.
5. **Confidence-Gated Blending (MC-Dropout)**: Uncertainty heatmaps prevent AI hallucination.
6. **Physics-Based Shadow Removal**: Recovers ground hidden under cloud shadows.
7. **Spectral Physics Validator**: Strict validation against Earth science constraints.

## 🛠️ Tech Stack

- **AI & Deep Learning**: PyTorch, Latent Diffusion, ResNet-18, OpenAI CLIP
- **Geospatial & APIs**: Leaflet, OpenTopoData, Overpass API (OSM), EOX Sentinel-2, OSRM
- **Backend**: Python, FastAPI, ChromaDB
- **Frontend**: Next.js (React), TailwindCSS

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
uvicorn api_server:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📄 License
This project is licensed under the MIT License.
