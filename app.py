import os
import io
import ast
import pandas as pd
import torch
import chromadb
from PIL import Image
from fastapi import FastAPI, Query, Response
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from transformers import CLIPProcessor, CLIPModel

print("Initializing AI Search Engine Web Service...")

# 1. AI Model Load
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# 2. ChromaDB (Memory) Connect
chroma_client = chromadb.PersistentClient(path="./vector_db")
collection = chroma_client.get_collection(name="satellite_images")

app = FastAPI(title="ISRO AI Satellite Image Search Engine")

# Static directory setup for serving satellite images
STATIC_DIR = "extracted_images"
if not os.path.exists(STATIC_DIR):
    os.makedirs(STATIC_DIR)

# Mount static folder
app.mount("/images", StaticFiles(directory=STATIC_DIR), name="images")

# Pre-extract images from train.csv at startup (so the web UI can display them)
@app.on_event("startup")
def pre_extract_images():
    csv_path = "archive/train.csv"
    if not os.path.exists(csv_path):
        print(f"[WARNING] CSV file not found at {csv_path}. Dynamic image loading will not be available.")
        return
        
    # Check if we already have files extracted
    existing_files = os.listdir(STATIC_DIR)
    if len(existing_files) >= 50:
        print("[SUCCESS] Static images already pre-extracted.")
        return

    print("[INFO] Pre-extracting indexed satellite images from train.csv for web UI...")
    try:
        df = pd.read_csv(csv_path)
        for i in range(min(50, len(df))):
            row = df.iloc[i]
            filename = row["filename"]
            dest_path = os.path.join(STATIC_DIR, filename)
            
            if not os.path.exists(dest_path):
                dest_dir = os.path.dirname(dest_path)
                if not os.path.exists(dest_dir):
                    os.makedirs(dest_dir)
                    
                image_dict = ast.literal_eval(row["image"])
                image_bytes = image_dict["bytes"]
                image = Image.open(io.BytesIO(image_bytes))
                image.save(dest_path)
                
        print(f"[SUCCESS] Pre-extraction complete! {min(50, len(df))} images saved to ./{STATIC_DIR}")
    except Exception as e:
        print(f"[ERROR] Failed to pre-extract images: {e}")

# API Endpoint for AI Search
@app.get("/api/search")
def search_images(query: str = Query(..., description="The query text for image search")):
    if not query.strip():
        return JSONResponse(status_code=400, content={"error": "Empty query"})
        
    try:
        # Convert text query into AI Vector
        inputs = processor(text=[query], return_tensors="pt", padding=True)
        if "attention_mask" in inputs:
            inputs["attention_mask"] = inputs["attention_mask"].to(torch.bool)

        with torch.no_grad():
            text_features = model.get_text_features(
                input_ids=inputs["input_ids"],
                attention_mask=inputs["attention_mask"]
            )

        if hasattr(text_features, "pooler_output"):
            query_vector = text_features.pooler_output.flatten().tolist()
        else:
            query_vector = text_features.flatten().tolist()

        # Search ChromaDB
        results = collection.query(
            query_embeddings=[query_vector],
            n_results=3
        )

        # Build output structure
        search_results = []
        for i in range(len(results["ids"][0])):
            filename = results["ids"][0][i]
            distance = results["distances"][0][i]
            
            # Match score conversion (lower distance means better match)
            match_score = max(40, min(99, int(200 - distance)))
            
            search_results.append({
                "filename": filename,
                "distance": distance,
                "match_score": match_score,
                "url": f"/images/{filename}"
            })
            
        return search_results

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# Beautiful Web User Interface
@app.get("/", response_class=HTMLResponse)
def index():
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ISRO AI Satellite Search</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Space+Grotesk:wght@400;600&display=swap" rel="stylesheet">
        <style>
            :root {
                --bg-color: #05050a;
                --surface-color: rgba(16, 16, 32, 0.65);
                --accent-color: #00f0ff;
                --accent-glow: rgba(0, 240, 255, 0.35);
                --text-color: #f3f4f6;
                --border-color: rgba(255, 255, 255, 0.08);
            }
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            body {
                font-family: 'Outfit', sans-serif;
                background-color: var(--bg-color);
                color: var(--text-color);
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                overflow-x: hidden;
                background-image: radial-gradient(circle at 50% 25%, rgba(20, 30, 60, 0.6) 0%, transparent 60%);
            }
            .container {
                width: 100%;
                max-width: 1100px;
                padding: 60px 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            header {
                text-align: center;
                margin-bottom: 45px;
            }
            h1 {
                font-family: 'Space Grotesk', sans-serif;
                font-size: 3.2rem;
                font-weight: 800;
                letter-spacing: -0.03em;
                background: linear-gradient(135deg, #ffffff 40%, #00f0ff 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 12px;
            }
            p.subtitle {
                color: #9ca3af;
                font-size: 1.15rem;
                font-weight: 300;
            }
            .search-container {
                width: 100%;
                max-width: 680px;
                background: var(--surface-color);
                border: 1px solid var(--border-color);
                border-radius: 20px;
                padding: 8px;
                display: flex;
                align-items: center;
                backdrop-filter: blur(20px);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
                margin-bottom: 60px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .search-container:focus-within {
                border-color: var(--accent-color);
                box-shadow: 0 0 25px var(--accent-glow);
            }
            .search-input {
                flex: 1;
                background: transparent;
                border: none;
                outline: none;
                color: white;
                font-size: 1.15rem;
                padding: 12px 20px;
                font-family: 'Outfit', sans-serif;
            }
            .search-input::placeholder {
                color: #4b5563;
            }
            .search-btn {
                background: var(--accent-color);
                color: #05050a;
                border: none;
                border-radius: 14px;
                padding: 14px 28px;
                font-size: 1.05rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                font-family: 'Space Grotesk', sans-serif;
            }
            .search-btn:hover {
                transform: scale(1.02);
                box-shadow: 0 0 20px rgba(0, 240, 255, 0.7);
            }
            .loader {
                display: none;
                width: 48px;
                height: 48px;
                border: 4px solid rgba(255, 255, 255, 0.1);
                border-bottom-color: var(--accent-color);
                border-radius: 50%;
                animation: rotation 0.8s linear infinite;
                margin-bottom: 40px;
            }
            @keyframes rotation {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .results-wrapper {
                width: 100%;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .results-wrapper.active {
                opacity: 1;
                transform: translateY(0);
            }
            .results-title {
                font-family: 'Space Grotesk', sans-serif;
                font-size: 1.6rem;
                font-weight: 600;
                margin-bottom: 25px;
                border-left: 4px solid var(--accent-color);
                padding-left: 15px;
                align-self: flex-start;
            }
            .results-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
                gap: 30px;
                width: 100%;
            }
            .card {
                background: var(--surface-color);
                border: 1px solid var(--border-color);
                border-radius: 24px;
                overflow: hidden;
                backdrop-filter: blur(12px);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
            }
            .card:hover {
                transform: translateY(-8px);
                border-color: rgba(0, 240, 255, 0.35);
                box-shadow: 0 15px 35px rgba(0, 240, 255, 0.12);
            }
            .img-container {
                width: 100%;
                height: 240px;
                overflow: hidden;
                position: relative;
                background: #0a0a15;
            }
            .card-img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.6s ease;
            }
            .card:hover .card-img {
                transform: scale(1.06);
            }
            .match-badge {
                position: absolute;
                top: 15px;
                right: 15px;
                background: rgba(5, 5, 10, 0.8);
                border: 1px solid var(--accent-color);
                color: var(--accent-color);
                padding: 6px 14px;
                border-radius: 30px;
                font-size: 0.85rem;
                font-weight: 600;
                font-family: 'Space Grotesk', sans-serif;
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }
            .card-info {
                padding: 22px;
            }
            .card-name {
                font-size: 1.15rem;
                font-weight: 600;
                color: #ffffff;
                margin-bottom: 8px;
            }
            .card-distance {
                font-size: 0.9rem;
                color: #9ca3af;
                font-family: monospace;
            }
            footer {
                margin-top: auto;
                padding: 40px;
                color: #4b5563;
                font-size: 0.9rem;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <header>
                <h1>ISRO AI Satellite Search</h1>
                <p class="subtitle">Search and retrieve satellite imagery using natural language queries</p>
            </header>
            
            <div class="search-container">
                <input type="text" id="query" class="search-input" placeholder="e.g. 'many planes parked', 'airport building', 'stadium'" onkeydown="if(event.key === 'Enter') performSearch()">
                <button class="search-btn" onclick="performSearch()">Search</button>
            </div>
            
            <div class="loader" id="loader"></div>
            
            <div class="results-wrapper" id="results-wrapper">
                <h2 class="results-title">Search Results</h2>
                <div class="results-grid" id="results-grid"></div>
            </div>
        </div>
        
        <footer>
            ISRO AI Satellite Image Retrieval Engine • OpenAI CLIP-ViT-B-32 • ChromaDB Vector Database
        </footer>

        <script>
            async function performSearch() {
                const queryInput = document.getElementById('query');
                const loader = document.getElementById('loader');
                const resultsWrapper = document.getElementById('results-wrapper');
                const resultsGrid = document.getElementById('results-grid');
                
                const query = queryInput.value.trim();
                if (!query) return;
                
                // Show loader and hide results
                loader.style.display = 'block';
                resultsWrapper.classList.remove('active');
                resultsGrid.innerHTML = '';
                
                try {
                    const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
                    if (!response.ok) {
                        throw new Error('Search failed');
                    }
                    const data = await response.json();
                    
                    if (data.length === 0) {
                        resultsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #9ca3af;">No matches found. Try indexing more images!</p>';
                    } else {
                        data.forEach(item => {
                            const card = document.createElement('div');
                            card.className = 'card';
                            card.innerHTML = `
                                <div class="img-container">
                                    <img src="${item.url}" class="card-img" alt="Satellite view">
                                    <div class="match-badge">${item.match_score}% Match</div>
                                </div>
                                <div class="card-info">
                                    <div class="card-name">${item.filename}</div>
                                    <div class="card-distance">Distance: ${item.distance.toFixed(4)}</div>
                                </div>
                            `;
                            resultsGrid.appendChild(card);
                        });
                    }
                    
                    resultsWrapper.classList.add('active');
                } catch (error) {
                    console.error(error);
                    resultsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #ef4444;">Error: ${error.message}</p>`;
                    resultsWrapper.classList.add('active');
                } finally {
                    loader.style.display = 'none';
                }
            }
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content, status_code=200)