import torch
import torch.nn as nn
import torchvision.models as models

class CloudTypeClassifier(nn.Module):
    """
    NER Cloud Type Classifier:
    LISS-IV 3-band image lega aur 5 classes mein se ek predict karega:
    0 = Thin Cirrus
    1 = Cumulus/Stratus (Medium)
    2 = Deep Convective (Thick)
    3 = Cloud Shadow
    4 = Clear Sky
    """
    def __init__(self, num_classes=5):
        super(CloudTypeClassifier, self).__init__()
        
        # ResNet18 backbone use kar rahe hain kyunki yeh fast aur efficient hai
        # weights='DEFAULT' pretrained ImageNet weights load karta hai
        self.backbone = models.resnet18(weights='DEFAULT')
        
        # ResNet18 ka default input 3 channels ka hota hai (LISS-IV mein bhi 3 hain: G, R, NIR)
        # Humein sirf aakhri layer (Fully Connected) ko 1000 classes se 5 classes mein badalna hai
        num_ftrs = self.backbone.fc.in_features
        self.backbone.fc = nn.Linear(num_ftrs, num_classes)
        
    def forward(self, x):
        return self.backbone(x)


class AdaptiveCloudRouter:
    """
    Yeh router classifier ka output lega aur image ko sahi module par route karega.
    """
    def __init__(self, classifier):
        self.classifier = classifier
        self.class_names = [
            "Thin Cirrus", 
            "Cumulus/Stratus", 
            "Deep Convective", 
            "Cloud Shadow", 
            "Clear Sky"
        ]
        
    def route(self, cloudy_image):
        # Neural Network se prediction nikalna
        # `model.eval()` practice production ke time use hoti hai, abhi inference kar rahe hain
        self.classifier.eval() 
        with torch.no_grad():
            logits = self.classifier(cloudy_image)
            predicted_index = logits.argmax(dim=1).item()
            
        return predicted_index, self.class_names[predicted_index]
