# ISRO AI Project Ecosystem - Complete Overview

## 1. Introduction
The **ISRO AI Project** is a comprehensive suite of artificial intelligence tools designed to process, enhance, and analyze remote sensing and satellite imagery (specifically targeting ISRO's sensors like LISS-IV). 

The ecosystem currently consists of **two major subsystems** that solve critical challenges in Earth observation: searching through massive datasets and clearing cloud-obscured imagery.

---

## 2. Core Subsystems

### Subsystem A: Remote Sensing Image Search Engine
An intelligent, natural-language-driven search engine for satellite imagery.

- **What it does:** Allows users to search through vast databases of satellite images using normal text queries (e.g., "dense forest," "airport runway", "ocean").
- **Key Features:**
  - **Semantic Image Search:** Understands the context of text and matches it with image pixels.
  - **CLIP Embeddings:** Utilizes OpenAI's powerful CLIP vision-language model.
  - **High-Speed Retrieval:** Powered by **ChromaDB** (Vector Database) for fast similarity matching.
  - **Web Interface:** A lightweight, easy-to-use UI built on **Flask**.
- **Use Case:** Quickly finding specific geographical features, terrains, or infrastructure from thousands of unlabelled satellite images.

### Subsystem B: NOVA-SYNC (LISS-IV Cloud Removal Engine)
An advanced, multi-modal Generative AI pipeline designed to reconstruct satellite imagery obscured by clouds.

- **What it does:** Uses a 7-stage AI pipeline to mathematically reconstruct the ground reality hidden beneath clouds, making overcast data usable again.
- **Key Features:**
  - **Multi-Modal Data Fusion:** Combines Optical imagery, SAR (Radar imagery which penetrates clouds), and Phenological Data (Indian Crop Calendars).
  - **SAR-Guided Latent Diffusion:** Reconstructs images based on actual physical structures mapped by radar, preventing random AI hallucinations.
  - **Scientific Validation:** Calculates physical indices (like NDVI) to ensure generated images are scientifically accurate.
  - **Uncertainty Quantification:** Generates confidence heatmaps so scientists know which pixels the AI is unsure about.
  - **Modern Dashboard:** A premium web UI built with **Next.js** and **FastAPI**.
- **Use Case:** Ensuring continuous, year-round usability of satellite data for agriculture, disaster management, and defense—even during the monsoon season.

---

## 3. Unified Technology Stack
Across the entire repository, the project leverages a highly modern and powerful tech stack:

- **AI & Deep Learning:** PyTorch, TorchVision, OpenAI CLIP, Latent Diffusion Models, ResNet-18
- **Databases:** ChromaDB (Vector Similarity Search)
- **Backend & APIs:** Python, FastAPI, Flask, Uvicorn
- **Frontend & UI:** Next.js (React), TailwindCSS, JavaScript/TypeScript
- **Data Processing:** Pandas, NumPy, PIL, Matplotlib

---

## 4. Overall Impact & Vision
By integrating an **AI-powered Search Engine** with a **Cloud Removal Engine**, this ecosystem transforms raw, weather-dependent satellite imagery into a highly searchable, always-clear, and scientifically valid asset. 

It maximizes the utility and ROI of existing satellite data (like LISS-IV) and provides researchers, defense analysts, and operators with continuous, accessible ground intelligence.
