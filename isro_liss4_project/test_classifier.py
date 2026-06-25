import torch
from core.cloud_classifier import CloudTypeClassifier, AdaptiveCloudRouter

def test_feature2():
    print("--- Testing Feature 2: Cloud Type Classifier & Router ---")
    
    # 1. Dummy LISS-IV Image (Batch=1, Channels=3, Height=256, Width=256)
    dummy_image = torch.randn(1, 3, 256, 256)
    print("1. Input Image ready.")
    
    # 2. Model aur Router initialize karna
    classifier = CloudTypeClassifier(num_classes=5)
    router = AdaptiveCloudRouter(classifier)
    print("2. Classifier aur Router load ho gaye.")
    
    # 3. Routing test karna
    class_index, class_name = router.route(dummy_image)
    
    print("\n--- Output ---")
    print(f"Predicted Class Index: {class_index}")
    print(f"Detected Cloud Type: {class_name}")
    print("SUCCESS: Feature 2 properly load aur execute ho raha hai, 0 Errors!")

if __name__ == "__main__":
    test_feature2()
