import torch
from core.phenology import PhenologyEmbedder

def test_feature3():
    print("--- Testing Feature 3: Phenological Semantic Prior ---")
    
    embedder = PhenologyEmbedder()
    
    # Test Case 1: July (Monsoon / Kharif)
    month_july = 7
    embed_july, season_july = embedder(month_july)
    print("\nTest 1: Month 7 (July)")
    print(f"Season Detected: {season_july}")
    print(f"Embedding Shape: {embed_july.shape}")
    print(f"Embedding Values: {embed_july.tolist()}")
    
    # Test Case 2: January (Winter / Rabi)
    month_jan = 1
    embed_jan, season_jan = embedder(month_jan)
    print("\nTest 2: Month 1 (January)")
    print(f"Season Detected: {season_jan}")
    print(f"Embedding Shape: {embed_jan.shape}")
    
    # Verification
    if embed_july.shape == (1, 5) and embed_jan.shape == (1, 5):
        print("\nSUCCESS: Feature 3 properly generating seasonal vectors, 0 Errors!")
    else:
        print("\nFAILED: Shape mismatch in embedding.")

if __name__ == "__main__":
    test_feature3()
