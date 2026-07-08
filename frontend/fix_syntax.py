import os

files = [
    r"d:\ISRO_AI_Project\frontend\public\safe-route\js\riskEngine.js",
    r"d:\ISRO_AI_Project\frontend\public\safe-route\js\map.js",
    r"d:\ISRO_AI_Project\frontend\public\safe-route\js\app.js"
]

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    
    # The previous agent likely escaped ` and $ when writing string templates
    content = content.replace("\\`", "`").replace("\\${", "${")
    
    with open(file, "w", encoding="utf-8") as f:
        f.write(content)

print("Files fixed successfully.")
