# ISRO AI - Remote Sensing Image Search Engine

An AI-powered image search engine for remote sensing (satellite) imagery using CLIP embeddings and ChromaDB vector database.

## Features
- **Semantic Image Search** — Search satellite images using natural language queries
- **CLIP Embeddings** — Uses OpenAI CLIP model for image-text understanding
- **Vector Database** — ChromaDB for fast similarity search
- **Web Interface** — Flask-based UI for easy interaction
- **RSICD Dataset** — Built on the Remote Sensing Image Captioning Dataset

## Project Structure
```
├── app.py                  # Flask web application
├── ai_brain.py             # CLIP model & embedding logic
├── search_engine.py        # Vector search engine
├── build_database.py       # Build ChromaDB vector database
├── explore_data.py         # Data exploration utilities
├── extract_sample.py       # Sample image extraction
├── test_clip.py            # CLIP model tests
├── archive/                # Dataset CSV files (train/valid/test)
├── extracted_images/       # Sample satellite images
└── vector_db/              # ChromaDB vector database
```

## Setup & Usage

### Install Dependencies
```bash
pip install flask chromadb torch torchvision transformers pillow pandas
```

### Build the Database
```bash
python build_database.py
```

### Run the App
```bash
python app.py
```
Then open `http://localhost:5000` in your browser.

## Dataset
Uses the [RSICD (Remote Sensing Image Captioning Dataset)](https://github.com/201528014227051/RSICD_optimal) with satellite images across categories like airports, beaches, forests, and more.

## Tech Stack
- **Python** — Core language
- **CLIP (OpenAI)** — Vision-language model
- **ChromaDB** — Vector similarity database
- **Flask** — Web framework
- **PyTorch** — Deep learning backend
