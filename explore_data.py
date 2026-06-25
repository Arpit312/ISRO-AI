import pandas as pd

print("Data load ho raha hai, please wait...")

# CSV file ko read kar rahe hain
df = pd.read_csv("archive/train.csv")

# Data ke columns aur shuru ki 3 lines print kar rahe hain
print("\n--- Columns in the CSV ---")
print(df.columns)

print("\n--- Pehli 3 Rows ka Data ---")
print(df.head(3))