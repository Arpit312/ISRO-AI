import torch
class SpectralIndicesValidator:
    def __init__(self):
        self.bounds = {
            'NDVI': {'min': -1.0, 'max': 1.0},
            'NDWI': {'min': -1.0, 'max': 1.0}
        }
    def compute_indices(self, image):
        G = image[:, 0, :, :]
        R = image[:, 1, :, :]
        NIR = image[:, 2, :, :]
        eps = 1e-8 
        ndvi = (NIR - R) / (NIR + R + eps)
        ndwi = (G - NIR) / (G + NIR + eps)
        return {'NDVI': ndvi, 'NDWI': ndwi}
    def validate(self, image):
        indices = self.compute_indices(image)
        report = {}
        total_violations = 0.0
        for name, values in indices.items():
            bounds = self.bounds[name]
            hard_violation = (values < bounds['min']) | (values > bounds['max'])
            violation_pct = hard_violation.float().mean().item() * 100
            total_violations += violation_pct
            report[name] = {
                'violation_pct': round(violation_pct, 2),
                'mean_value': round(values.mean().item(), 4)
            }
        quality_score = max(0.0, 100.0 - (total_violations / len(indices)))
        return round(quality_score, 2), report
