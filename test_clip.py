import pandas as pd
import ast
import io
import torch
from PIL import Image
from transformers import CLIPProcessor, CLIPModel

print("Loading Data and AI Model...")

# 1. AI Model Load Kar Rahe Hain
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# 2. Image aur Text Extract Kar Rahe Hain
df = pd.read_csv("archive/train.csv")
first_row = df.iloc[0]

image_dict = ast.literal_eval(first_row['image'])
image = Image.open(io.BytesIO(image_dict['bytes']))

raw_captions = first_row['captions']
clean_captions = raw_captions.replace('\n', '').replace('[', '').replace(']', '').split("'")
text_query = clean_captions[1] 

print(f"\nModel ko yeh text diya ja raha hai: '{text_query}'")

# 3. Magic Step: Text aur Image ko AI ke andar daalna
inputs = processor(text=[text_query], images=image, return_tensors="pt", padding=True)

# ---> FIX: Attention mask aur pixel values ka type correct karna <---
if "pixel_values" in inputs:
    inputs["pixel_values"] = inputs["pixel_values"].to(torch.float32)
if "attention_mask" in inputs:
    inputs["attention_mask"] = inputs["attention_mask"].to(torch.bool)

# 4. AI inko Numbers (Embeddings) mein convert kar raha hai
with torch.no_grad():
    # Ek sath model ko call kar rahe hain taaki features aur unki embeddings mil sakein
    outputs = model(**inputs)
    
    # Ye vectors hain (Embeddings)
    image_features = outputs.image_embeds
    text_features = outputs.text_embeds

print("\n--- AI PROCESSING SUCCESSFUL ---")
print(f"Image Vector ka size: {image_features.shape}")
print(f"Text Vector ka size: {text_features.shape}")
print("\nHackathon winning core feature is working! Dono data types ab vectors ban chuke hain.")