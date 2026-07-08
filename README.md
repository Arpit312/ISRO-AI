# NOVA-SYNC: AI-Driven Satellite Intelligence Ecosystem
*Turning cloud-blinded satellite data into actionable ground intelligence.*
īīīl̥
---

## 🛑 The Problem: The "Blindspot" in Earth Observation
Optical satellites (like ISRO's LISS-IV) capture critical high-resolution data, but they have a fatal flaw: **they cannot see through clouds.**
* **Data Loss:** During monsoons or overcast days, up to 90% of satellite imagery becomes useless white noise.
* **Delayed Response:** In real-life disasters like the Assam Floods, rescue agencies rely on this data to find submerged villages. Cloud cover forces them to wait days for clear weather, costing precious lives.
* **Economic Cost:** Launching new radar satellites is billions of dollars. We need a software solution to fix optical data.

## 🚀 The Solution: NOVA-SYNC Ecosystem
We built a comprehensive, end-to-end ecosystem that mathematically reconstructs cloud-obscured areas in satellite imagery and immediately turns that clear data into actionable disaster-response intelligence.

Our solution comprises three primary modules:
1. **NOVA-SYNC:** A 7-stage Generative AI Engine that removes clouds by fusing optical data with radar data.
2. **SAFE-ROUTE:** A live open-data risk scanner that finds the safest zones and nearest rescue teams for disaster victims.
3. **Semantic Search:** An NLP-driven search engine to instantly find geographical features across unlabelled satellite archives.

---

## 🧠 Core AI Architecture (How NOVA-SYNC Works)
We don't use basic image inpainting to "guess" what's under the cloud. We built a scientifically rigorous **7-Stage AI Pipeline**:

1. **Spectral Domain Adapter:** Maps 3-band satellite imagery into a 13-band space, allowing us to leverage massive pre-trained global foundation models without expensive retraining.
2. **Intelligent Cloud Router (ResNet-18):** Classifies clouds (Cirrus, Convective, Shadows) and only triggers heavy AI processing on obscured pixels, saving massive compute power.
3. **Phenological Prior Injection:** Injects Indian crop calendars (Kharif, Rabi) into the AI vector. If it's July, the AI mathematically knows the vegetation should be green, ensuring seasonal accuracy.
4. **SAR-Guided Latent Diffusion (The Core Engine):** We fuse cloud-penetrating Synthetic Aperture Radar (SAR) data with optical data using Cross-Attention mechanisms. The AI reconstructs roads, rivers, and cities based on **actual radar reflections**, not random hallucinations.
5. **Confidence-Gated Blending (MC-Dropout):** The AI generates an *Uncertainty Heatmap*. If the AI is unsure (e.g., over dense, unseen urban areas), it gracefully falls back to a gamma-corrected original or a historical clear image. **Zero hallucination risk.**
6. **Physics-Based Shadow Removal:** Recovers usable ground area hidden under dark cloud shadows using gamma correction and stretching.
7. **Spectral Physics Validator:** The final output is checked against hard Earth science constraints (e.g., NDVI indices). It calculates a strict **Physics Quality Score** and a **Cloud Coverage Reduction %**.

---

## 🌍 SAFE-ROUTE: From Pixels to Saving Lives
Fixing the image is only step one. We built **SAFE-ROUTE** to show how this data is actively used in the real world.
* **Live Risk Scanning:** Scans a radius around a user's location, pulling live OpenData (Elevation, Rivers, Roads).
* **Mathematical Risk Scoring:** Evaluates every coordinate. High elevation + far from water + near a road = **Safest Zone**.
* **Rescue Routing:** Uses OSRM to draw a direct route from the victim to the Safe Zone, and locates the nearest NDRF/SDRF camp.
* **1-Click SOS:** Generates an offline WhatsApp/SMS deep-link with exact live coordinates and a risk summary for immediate dispatch.

---

## 🏆 Hackathon Winning USP (What sets us apart?)
Most AI projects just focus on making images look visually pretty. We focused on making them **Scientifically Usable**.
* **"Honest AI" (Zero Hallucinations):** Our Confidence-Gated Blending and Multi-Temporal Priority ensures that if the AI isn't 100% sure, it steps aside. We prioritize real archive data over AI guesses.
* **Physics-Constrained Output:** We don't just output a PNG; we output a spectral report (NDVI/NDWI limits) to prove the pixels can be used for agricultural and structural analysis.
* **Production-Ready Modularity:** The AI Engine (FastAPI/PyTorch) is completely decoupled from the UI (Next.js) and the Rescue Module (Standalone JS), ensuring scalable, crash-resistant architecture.

---

## 🛠️ Technology Stack
* **AI & Deep Learning:** PyTorch, Latent Diffusion, ResNet-18, OpenAI CLIP.
* **Geospatial & APIs:** Leaflet, OpenTopoData, Overpass API (OSM), EOX Sentinel-2, OSRM.
* **Backend:** Python, FastAPI, ChromaDB (Vector Search).
* **Frontend:** Next.js (React), TailwindCSS, Vanilla JS for edge modules.

*(Note: Internal weights and proprietary datasets have been abstracted for privacy.)*
