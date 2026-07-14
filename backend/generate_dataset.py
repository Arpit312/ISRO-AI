import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from synthetic_cloud_gen import build_training_set
def generate():
    build_training_set(
        clear_dir="d:/ISRO_AI_Project/extracted_images/rsicd_images_augmented",
        out_dir="d:/ISRO_AI_Project/synthetic_data",
        n_variants_per_image=4                                              
    )
    print("Done! Check d:/ISRO_AI_Project/synthetic_data")
if __name__ == "__main__":
    generate()
