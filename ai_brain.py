# 1. Libraries Import karo
from transformers import CLIPProcessor, CLIPModel
from PIL import Image

print("AI Model load ho raha hai, please wait...")

# 2. Hugging Face se Model aur Processor load karo
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

print("Brain is Ready! Model successfully loaded.")

# (Optional Testing) Ek dummy image aur text ko process karke dekho
# image = Image.open("tumhari_image.jpg")
# inputs = processor(text=["a dense forest", "a desert"], images=image, return_tensors="pt", padding=True)
# outputs = model(**inputs)