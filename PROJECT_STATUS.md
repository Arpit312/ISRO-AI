# ISRO AI Satellite Image Search Engine & NOVA-SYNC Platform - Project Status

## 1. Current Real Status (Abhi ka kya scene hai)
Project bilkul **Complete aur Fully Functional** status mein hai. Abhi tak is project mein yeh saari cheezein successfully develop aur test ho chuki hain:

- **Virtual Environment:** Python `venv` ka setup ekdum mast ho chuka hai aur activate bhi ho gaya hai. Saari dependencies install ho chuki hain.
- **AI Brain:** OpenAI ka CLIP (`clip-vit-base-patch32`) model integrate ho chuka hai jo images aur text dono ko samajhne mein expert hai.
- **Memory Bank (Vector DB):** ChromaDB setup ho gaya hai aur `.csv` file se satellite images ke embeddings generate kar ke store karne ka script (`build_database.py`) properly work kar raha hai. 
- **Terminal App:** Command-line interface (`search_engine.py`) perfectly chal raha hai, jahan aap text type karke image dhoondh sakte hain.
- **Web App UI:** FastAPI par based ek bahut hi premium, dark-themed web interface (`app.py`) banaya gaya hai. Yeh frontend directly browser par serve hota hai jahan user natural language query likh kar turant matching satellite images dekh sakta hai.

## 2. Full Description (Bhai project aakhir hai kya?)
Yeh project ek **AI-powered Natural Language Image Search Engine** hai jo specifically **Satellite Imagery (RSICD dataset)** ke liye banaya gaya hai. 
Aam taur par, image search ke liye tags ya metadata chahiye hote hain. Lekin is project mein, user seedha proper English sentence me search query likh sakta hai (jaise: *"many planes parked"*, *"a dense forest"*, ya *"airport building"*), aur AI turant dataset se sabse best matching satellite images nikal kar samne rakh deta hai.

**Kaise kaam karta hai (Working mechanism):**
1. **CLIP Model:** Yeh text aur images dono ko deep level par samajhta hai aur unhe mathematical Vector Embeddings (numbers) me badal deta hai.
2. **ChromaDB:** Ek fast Vector Database jo in image vectors ko memory me save karke rakhta hai.
3. **Searching:** Jab user text search karta hai, toh text ko bhi vector me badal kar ChromaDB mein already saved image vectors ke sath compare kiya jata hai (cosine distance lagake). Jo sabse close match hote hain, wo user ko show ho jate hain.

## 3. Key Features (Main highlights)
- **Natural Language Search:** Bina exact keyword ke seedha sentence likh kar images search karo (Search Engine).
- **NOVA-SYNC 7-Stage AI Pipeline:** Ek advanced Next.js + FastAPI ecosystem jo satellite imagery se clouds remove karta hai using 7 distinct stages (Spectral Adapter, Cloud Classifier, Phenology, SAR Fusion, Uncertainty, Shadow Corrector, aur Physics Validator).
- **Interactive Before/After Slider:** Upload ki hui image ko real-time me process karke ek premium slider UI me 'Cloudy vs Cloud-Free' result dikhata hai.
- **Multi-Page App Architecture:** Next.js frontend ko Dashboard, Pipeline, aur Upload modules me neatly organize kiya gaya hai.
- **FastAPI Backend:** Super fast aur modern Python framework jo REST API (`/api/search` aur `/api/v1/process`) aur UI dono serve karta hai.
- **Dynamic Image Extraction:** System automatically CSV file se encoded images ko nikal kar `extracted_images` folder me save karta hai taaki web UI par image dikh sake.
- **Premium Web UI:** Ekdum jhakaas dark glowing aerospace theme, glassmorphism effect, smooth animations, aur real-time data metrics.
- **Local & Offline Execution:** AI computations ke liye kisi external API (internet) ki zaroorat nahi hai. Model aur database locally aapke pc par hi chalte hain.

## 4. Latest Progress (Abhi latest kya update hua hai)
- **Real-World Backend Integration:** `api_server.py` ko update kar diya gaya hai jisse ab real images `multipart/form-data` ke through upload hoti hain aur base64 output return hota hai.
- **Frontend Refactoring:** NOVA-SYNC frontend ko Single Page Application (SPA) se ek structured Multi-Page Application (MPA) me convert kar diya gaya hai (`/pipeline`, `/dashboard`, `/upload`).
- **Interactive UI Connect:** React frontend me `BeforeAfterSlider.tsx` banakar successfully backend ke AI-processed output image se connect kar diya gaya hai.
- **Environment Setup:** Virtual environment (`venv`) ki problem puri tarah se solve ho chuki hai.
- **FastAPI Server:** `app.py` ab FastAPI backend use kar raha hai jo pehle wale Flask se kaafi fast aur reliable hai.
- **Image Serving:** App start hote hi CSV se dynamically images extract aur serve hoti hain, jisse browser me asli image dikhai deti hai bina kisi error ke.

## 5. How to Run (Kise chalana hai)

### NOVA-SYNC Pipeline
1. **Frontend:** `cd NOVA-SYNC` karke `npm run dev` chalayein (runs on `http://localhost:3000`).
2. **Backend:** `venv` ke andar se `python -m uvicorn api_server:app --reload` chalayein (runs on `http://127.0.0.1:8000`).

### Satellite Search Engine
1. **Web Version (Recommended):** Apne terminal mein type karo: `uvicorn app:app --reload` (uske baad browser me `http://localhost:8000` open kar lo)
2. **Terminal Version:** Agar terminal pe chalana hai toh type karo: `python search_engine.py`
