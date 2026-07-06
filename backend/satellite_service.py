"""
satellite_service.py
---------------------
Talks to the Copernicus Data Space Ecosystem (CDSE) Sentinel Hub Process API.
"""

import os
import time
import requests

TOKEN_URL = "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token"
PROCESS_URL = "https://sh.dataspace.copernicus.eu/api/v1/process"

# Simple in-memory cache so we don't request a new token on every API call.
_token_cache = {"token": None, "expires_at": 0}


def get_token() -> str:
    """Return a valid OAuth access token, fetching a new one if needed."""
    now = time.time()
    if _token_cache["token"] and now < _token_cache["expires_at"] - 30:
        return _token_cache["token"]

    client_id = os.getenv("CDSE_CLIENT_ID")
    client_secret = os.getenv("CDSE_CLIENT_SECRET")
    if not client_id or not client_secret:
        raise RuntimeError(
            "CDSE_CLIENT_ID / CDSE_CLIENT_SECRET not set. "
            "Please configure credentials in the backend environment."
        )

    resp = requests.post(
        TOKEN_URL,
        data={
            "grant_type": "client_credentials",
            "client_id": client_id,
            "client_secret": client_secret,
        },
        timeout=15,
    )
    resp.raise_for_status()
    data = resp.json()

    _token_cache["token"] = data["access_token"]
    _token_cache["expires_at"] = now + data.get("expires_in", 3600)
    return _token_cache["token"]


EVALSCRIPT_S2 = """
//VERSION=3
function setup() {
  return {
    input: ["B02", "B03", "B04", "B08", "SCL"],
    output: { bands: 5, sampleType: "FLOAT32" }
  };
}
function evaluatePixel(s) {
  return [s.B04, s.B03, s.B02, s.B08, s.SCL];
}
"""


def fetch_sentinel2(bbox, date_from: str, date_to: str, size: int = 512) -> bytes:
    """
    Fetch one Sentinel-2 L2A image (least-cloudy scene in the given date range).
    Returns raw TIFF bytes with 5 float32 bands: R, G, B, NIR, SCL.
    """
    token = get_token()
    body = {
        "input": {
            "bounds": {"bbox": bbox},
            "data": [
                {
                    "type": "sentinel-2-l2a",
                    "dataFilter": {
                        "timeRange": {
                            "from": f"{date_from}T00:00:00Z",
                            "to": f"{date_to}T23:59:59Z",
                        },
                        "mosaickingOrder": "leastCC",
                    },
                }
            ],
        },
        "output": {
            "width": size,
            "height": size,
            "responses": [{"identifier": "default", "format": {"type": "image/tiff"}}],
        },
        "evalscript": EVALSCRIPT_S2,
    }
    resp = requests.post(
        PROCESS_URL,
        json=body,
        headers={"Authorization": f"Bearer {token}"},
        timeout=30,
    )
    resp.raise_for_status()
    return resp.content


EVALSCRIPT_S1 = """
//VERSION=3
function setup() {
  return { input: ["VV", "VH"], output: { bands: 2, sampleType: "FLOAT32" } };
}
function evaluatePixel(s) {
  return [s.VV, s.VH];
}
"""


def fetch_sentinel1(bbox, date_from: str, date_to: str, size: int = 512) -> bytes:
    """
    Fetch one Sentinel-1 GRD image for the bbox.
    Returns raw TIFF bytes with 2 float32 bands: VV, VH.
    """
    token = get_token()
    body = {
        "input": {
            "bounds": {"bbox": bbox},
            "data": [
                {
                    "type": "sentinel-1-grd",
                    "dataFilter": {
                        "timeRange": {
                            "from": f"{date_from}T00:00:00Z",
                            "to": f"{date_to}T23:59:59Z",
                        },
                        "acquisitionMode": "IW",
                        "polarization": "DV",
                    },
                    "processing": {"orthorectify": True, "demInstance": "COPERNICUS"},
                }
            ],
        },
        "output": {
            "width": size,
            "height": size,
            "responses": [{"identifier": "default", "format": {"type": "image/tiff"}}],
        },
        "evalscript": EVALSCRIPT_S1,
    }
    resp = requests.post(
        PROCESS_URL,
        json=body,
        headers={"Authorization": f"Bearer {token}"},
        timeout=30,
    )
    resp.raise_for_status()
    return resp.content
