import pandas as pd
import ast
import io
from PIL import Image

print("Data load ho raha hai...")
df = pd.read_csv("archive/train.csv")

# Pehli row (0th index) ka data nikal rahe hain
first_row = df.iloc[0]

filename = first_row['filename']
captions = first_row['captions']
image_data_str = first_row['image']

print(f"\nImage Name: {filename}")
print(f"Captions: {captions}")

# String form mein jo dictionary hai, usko actual Python dict mein badal rahe hain
try:
    image_dict = ast.literal_eval(image_data_str)
    image_bytes = image_dict['bytes']
    
    # Bytes ko Image mein convert kar rahe hain
    image = Image.open(io.BytesIO(image_bytes))
    
    # Image ko save kar rahe hain test karne ke liye
    save_name = "sample_test.jpg"
    image.save(save_name)
    
    print(f"\nSuccess! Image ko extract karke '{save_name}' ke naam se save kar diya gaya hai.")
    
except Exception as e:
    print(f"\nError aaya: {e}")