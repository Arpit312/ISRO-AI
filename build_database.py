import pandas as pd
import ast
import io
import torch
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
import chromadb

print("AI Model aur Database initialize ho raha hai...")

# 1. AI Model Load
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# 2. ChromaDB Setup
chroma_client = chromadb.PersistentClient(path="./vector_db")

if "satellite_images" in [c.name for c in chroma_client.list_collections()]:
    chroma_client.delete_collection("satellite_images")
    
collection = chroma_client.create_collection(name="satellite_images")

# 3. CSV File Load aur Top 50 images process karna
df = pd.read_csv("archive/train.csv")
num_images_to_process = 50

print(f"\nProcessing first {num_images_to_process} images. This might take a few minutes...\n")

for index in range(num_images_to_process):
    row = df.iloc[index]
    
    # Image read karna
    image_dict = ast.literal_eval(row['image'])
    image = Image.open(io.BytesIO(image_dict['bytes']))
    filename = row['filename']
    
    # AI se Vector banwana
    inputs = processor(images=image, return_tensors="pt")
    if "pixel_values" in inputs:
        inputs["pixel_values"] = inputs["pixel_values"].to(torch.float32)
        
    with torch.no_grad():
        outputs = model.get_image_features(pixel_values=inputs["pixel_values"])
    
    # ---> FIX: Tensor ko completely flatten karke pure list mein badalna <---
    vector_list = outputs.pooler_output.flatten().tolist()
    
    try:
        # Database mein save karna
        collection.add(
            ids=[filename],               
            embeddings=[vector_list],     
            metadatas=[{"source": "RSICD dataset"}] 
        )
    except Exception as e:
        print(f"\nError at index {index} ({filename}): {e}")
        break # Agar error aaye toh aage mat badho
    
    if (index + 1) % 10 == 0:
        print(f"[{index + 1}/{num_images_to_process}] images saved to database...")

print("\n[SUCCESS] Database Successfully Built! Tumhari memory bank ready hai.")