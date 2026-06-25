import chromadb
import torch
from transformers import CLIPProcessor, CLIPModel

print("Initializing AI Search Engine...")

try:
    # 1. AI Model Load Kar Rahe Hain
    model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
    processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

    # 2. ChromaDB (Memory) Connect Kar Rahe Hain
    chroma_client = chromadb.PersistentClient(path="./vector_db")
    collection = chroma_client.get_collection(name="satellite_images")
    
    print("✅ AI Search Engine Ready!")

    while True:
        # 3. User Input (Text Query)
        print("\n" + "="*50)
        query_text = input("🔍 Enter your search query (or type 'exit' to quit): ")
        print("="*50 + "\n")
        
        # Check for exit command
        if query_text.strip().lower() in ["exit", "quit"]:
            print("👋 Exiting AI Search Engine. Bye!")
            break
            
        if not query_text.strip():
            print("⚠️ Empty query! Please type something (e.g., 'many planes parked', 'airport building').")
            continue

        # 4. Text ko AI Vector mein badalna
        inputs = processor(text=[query_text], return_tensors="pt", padding=True)

        # Wahi same fix taaki type error na aaye
        if "attention_mask" in inputs:
            inputs["attention_mask"] = inputs["attention_mask"].to(torch.bool)

        with torch.no_grad():
            text_features = model.get_text_features(
                input_ids=inputs["input_ids"], 
                attention_mask=inputs["attention_mask"]
            )

        # Naye transformers library ke liye safe vector extraction
        if hasattr(text_features, "pooler_output"):
            query_vector = text_features.pooler_output.flatten().tolist()
        else:
            # Agar direct tensor hai toh
            query_vector = text_features.flatten().tolist()

        # 5. Database mein Search Karna
        print("⏳ Scanning database for the best match...")
        results = collection.query(
            query_embeddings=[query_vector],
            n_results=3  # Humein Top 3 results chahiye
        )

        # 6. Results Display
        print("\n--- 🎯 TOP 3 SATELLITE IMAGES FOUND ---")
        for i in range(len(results['ids'][0])):
            image_name = results['ids'][0][i]
            distance = results['distances'][0][i]
            
            # Distance jitni kam hogi, match utna hi perfect hoga
            print(f"{i+1}. Image File: {image_name}  |  Match Distance: {distance:.4f}")

        print("\n✅ DONE! Tum in files ka naam apne 'train.csv' mein search karke dekh sakte ho ki AI ne kya dhundha hai.")

except KeyboardInterrupt:
    print("\n\n👋 Exiting AI Search Engine. Bye!")
except Exception as e:
    print(f"\n❌ An error occurred: {e}")

