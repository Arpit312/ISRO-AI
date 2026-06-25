# ISRO AI Satellite Image Search Engine - Project Status

## 1. Current Real Status (वर्तमान स्थिति)
Project bilkul **Complete aur Fully Functional** (पूरी तरह से काम करने वाला) status mein hai. Isme abhi tak yeh saari cheezein ban chuki hain:

- **AI Brain:** OpenAI ka CLIP model successfully integrate ho chuka hai jo images aur text dono ko samajh sakta hai.
- **Memory Bank (Vector DB):** ChromaDB setup ho chuka hai aur usme `.csv` file se satellite images ke vectors (embeddings) save karne ka script (`build_database.py`) properly ready hai. 
- **Terminal App:** Ek working command-line interface (`search_engine.py`) maujud hai jahan aap type karke search kar sakte hain.
- **Web App UI:** FastAPI par based ek bahut hi premium, dark-themed aur beautiful web interface (`app.py`) banaya gaya hai. Yeh frontend directly browser par serve hota hai jahan user "airport" ya "stadium" jaise queries likh kar turant satellite images dekh sakta hai.

## 2. Full Description (प्रोजेक्ट क्या है?)
Yeh project ek **AI-powered Natural Language Image Search Engine** hai jo specifically **Satellite Imagery (RSICD dataset)** ke liye banaya gaya hai. 
Aam taur par, kisi image ko dhoondhne ke liye uske naam ya metadata ki zaroorat hoti hai. Lekin is project ke zariye, user seedha natural English me search query likh sakta hai (jaise: *"many planes parked"*, *"a dense forest"*, ya *"airport building"*), aur AI turant dataset me se sabse best matching satellite images nikal kar samne rakh deta hai.

**Kaise kaam karta hai:**
1. **CLIP Model:** Yeh OpenAI ka ek advanced model (CLIP-ViT-B-32) use karta hai. Is model ko text aur images dono ki deep understanding hoti hai. Yeh image aur text dono ko ek hi tarah ki mathematical language (Vector Embeddings) mein badal deta hai.
2. **ChromaDB:** Ek Vector Database use kiya gaya hai jo in image vectors ko memory me save karke rakhta hai.
3. **Searching:** Jab aap koi text search karte hain, toh system us text ko vector me badal kar database me maujud image vectors ke sath compare karta hai (cosine distance). Jis image ka vector aapke text vector se sabse zyada match karta hai, wo result me show ho jati hai.

## 3. Key Features (मुख्य विशेषताएं)
- **Natural Language Search:** Kisi keyword ya tag ki zaroorat nahi, seedha proper english sentence likh kar images dhoondhi ja sakti hain.
- **FastAPI Backend:** Web interface ke liye ek bahut hi fast aur modern Python framework (FastAPI) use kiya gaya hai jo REST API (`/api/search`) provide karta hai.
- **Dynamic Image Extraction:** System automatically CSV file ke andar encoded images ko decode karke `extracted_images` folder me save kar leta hai taaki web UI par real images dikhayi ja sakein.
- **Premium Web UI:** Iska frontend bahut modern hai. Isme glassmorphism, smooth animations, dark glowing theme, aur match-percentage badges shamil hain.
- **Local & Offline Execution:** Yeh pura model aur database aapke system par locally chal raha hai. AI computation ke liye internet connection (api call) ke bajaye local Hugging Face transformer model use ho raha hai.

## How to Run (कैसे चलाएं)
1. **Web Version:** Terminal mein type karein: `uvicorn app:app --reload`
2. **Terminal Version:** Terminal mein type karein: `python search_engine.py`
