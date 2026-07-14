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
        self.calendar = {
            'kharif': {'months': [6, 7, 8, 9, 10], 'vec': [1.0, 0.0, 0.0]},
            'rabi':   {'months': [11, 12, 1, 2, 3], 'vec': [0.0, 1.0, 0.0]},
            'zaid':   {'months': [4, 5],            'vec': [0.0, 0.0, 1.0]}
        }
    def get_season(self, month):
        for season, data in self.calendar.items():
            if month in data['months']:
                return season, data['vec']
        return 'kharif', [1.0, 0.0, 0.0]           
    def forward(self, month):
        month_sin = float(np.sin(2 * np.pi * month / 12.0))
        month_cos = float(np.cos(2 * np.pi * month / 12.0))
        season_name, season_vec = self.get_season(month)
        embedding_list = [month_sin, month_cos, season_vec[0], season_vec[1], 0.0, 0.0, 0.0, 0.0]
        embedding_tensor = torch.tensor([embedding_list], dtype=torch.float32)
        return embedding_tensor, season_name
