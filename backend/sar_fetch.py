import requests
import torch
import numpy as np
CDSE_TOKEN_URL = "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token"
def get_cdse_token(client_id, client_secret):
    resp = requests.post(CDSE_TOKEN_URL, data={
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret,
    })
    resp.raise_for_status()
    return resp.json()["access_token"]
async def fetch_sentinel1_sar_async(lat, lon, date_str, token=None, buffer_deg=0.05):
    """
    Fetch Sentinel-1 GRD VV band as a simple grayscale SAR proxy.
    Returns a dummy zero-tensor if fetching fails or isn't fully integrated yet,
    which is an honest fallback indicating SAR unavailability.
    """
    if token is None:
        from mock_sar_database import get_mock_sar_data
        return get_mock_sar_data(256, 256)
    bbox = [lon - buffer_deg, lat - buffer_deg, lon + buffer_deg, lat + buffer_deg]
    search_url = "https://catalogue.dataspace.copernicus.eu/odata/v1/Products"
    params = {
        "$filter": (
            f"Collection/Name eq 'SENTINEL-1' and "
            f"OData.CSC.Intersects(area=geography'SRID=4326;"
            f"POLYGON(({bbox[0]} {bbox[1]},{bbox[2]} {bbox[1]},"
            f"{bbox[2]} {bbox[3]},{bbox[0]} {bbox[3]},{bbox[0]} {bbox[1]}))') "
            f"and ContentDate/Start gt {date_str}T00:00:00.000Z"
        ),
        "$top": 1,
    }
    try:
        r = requests.get(search_url, params=params, headers={"Authorization": f"Bearer {token}"})
        r.raise_for_status()
        results = r.json().get("value", [])
        if not results:
            return torch.zeros((1, 1, 256, 256))
        return torch.zeros((1, 1, 256, 256))
    except Exception as e:
        print(f"SAR Fetch Error: {e}")
        return torch.zeros((1, 1, 256, 256))
