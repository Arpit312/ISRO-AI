from PIL import Image
from pathlib import Path
import os
def augment():
    src = Path("d:/ISRO_AI_Project/extracted_images/rsicd_images")
    out = Path("d:/ISRO_AI_Project/extracted_images/rsicd_images_augmented")
    out.mkdir(exist_ok=True, parents=True)
    count = 0
    for f in src.glob("*.png"):
        try:
            img = Image.open(f).convert("RGB")
            img.save(out / f"{f.stem}_orig.png")
            img.rotate(90, expand=True).save(out / f"{f.stem}_r90.png")
            img.rotate(180).save(out / f"{f.stem}_r180.png")
            img.transpose(Image.FLIP_LEFT_RIGHT).save(out / f"{f.stem}_flip.png")
            w, h = img.size
            img.crop((w//4, h//4, 3*w//4, 3*h//4)).resize((w, h)).save(out / f"{f.stem}_crop.png")
            count += 5
        except Exception as e:
            print(f"Error processing {f.name}: {e}")
    print(f"Done: {count} augmented images generated in {out}")
if __name__ == "__main__":
    augment()
