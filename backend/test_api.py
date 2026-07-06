import requests
import io
import base64
from PIL import Image

def test_api():
    try:
        # Load a dummy image to send
        img_path = "d:\\ISRO_AI_Project\\extracted_images\\rsicd_images\\846b376c-1467-419f-8837-aa6b813b5063.png"
        
        with open(img_path, 'rb') as f:
            files = {'file': ('test.png', f, 'image/png')}
            data = {'month': 7}
            response = requests.post("http://localhost:8000/api/v1/process", files=files, data=data)
            
            res_json = response.json()
            out_b64 = res_json['output_image']
            
            # save to disk
            if out_b64.startswith("data:image/png;base64,"):
                out_b64 = out_b64.split(",")[1]
                
            img_data = base64.b64decode(out_b64)
            with open("d:\\ISRO_AI_Project\\backend\\api_test_out.png", "wb") as out_f:
                out_f.write(img_data)
                
            print("API response saved to api_test_out.png")
            
            # Check what color it is
            img = Image.open(io.BytesIO(img_data))
            import torchvision.transforms as T
            arr = T.ToTensor()(img)
            print('R mean:', arr[0].mean().item(), 'G mean:', arr[1].mean().item(), 'B mean:', arr[2].mean().item())
            
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    test_api()
