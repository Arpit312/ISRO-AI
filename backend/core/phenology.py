import torch
import torch.nn as nn
import numpy as np

class PhenologyEmbedder(nn.Module):
    """
    India Crop Calendar Embedding:
    Month (1-12) lega aur ek 5-dimensional vector return karega:
    [Month_Sin, Month_Cos, Kharif_Bit, Rabi_Bit, Zaid_Bit]
    """
    def __init__(self):
        super(PhenologyEmbedder, self).__init__()
        # India's major crop seasons mapping
        self.calendar = {
            'kharif': {'months': [6, 7, 8, 9, 10], 'vec': [1.0, 0.0, 0.0]},
            'rabi':   {'months': [11, 12, 1, 2, 3], 'vec': [0.0, 1.0, 0.0]},
            'zaid':   {'months': [4, 5],            'vec': [0.0, 0.0, 1.0]}
        }

    def get_season(self, month):
        for season, data in self.calendar.items():
            if month in data['months']:
                return season, data['vec']
        return 'kharif', [1.0, 0.0, 0.0] # Fallback

    def forward(self, month):
        # Cyclical encoding for month
        # Isse AI samajhta hai ki Month 12 aur Month 1 kareeb hain
        month_sin = float(np.sin(2 * np.pi * month / 12.0))
        month_cos = float(np.cos(2 * np.pi * month / 12.0))
        
        season_name, season_vec = self.get_season(month)
        
        # Combine [sin, cos, kharif, rabi, zaid] -> 5D Vector
        embedding_list = [month_sin, month_cos] + season_vec
        
        # Convert to PyTorch Tensor (Shape: [1, 5] -> Batch size 1, Vector size 5)
        embedding_tensor = torch.tensor([embedding_list], dtype=torch.float32)
        
        return embedding_tensor, season_name
