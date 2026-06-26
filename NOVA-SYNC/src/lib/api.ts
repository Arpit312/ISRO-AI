// Typed API client for the FastAPI backend

export interface ProcessingResult {
  status: string;
  cloud_type_detected: string;
  season_prior_injected: string;
  physics_quality_score: number;
  spectral_report: {
    NDVI: { violation_pct: number; mean_value: number };
    NDWI: { violation_pct: number; mean_value: number };
  };
  output_image: string;
  uncertainty_heatmap?: string;
}

export interface ApiError {
  detail: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Process a satellite image through the AI pipeline
 */
export async function processImage(
  month: number = 7
): Promise<ProcessingResult> {
  const response = await fetch(`${API_BASE_URL}/api/v1/process?month=${month}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      detail: `HTTP ${response.status}: ${response.statusText}`,
    }));
    throw new Error(error.detail);
  }

  return response.json();
}

/**
 * Upload file and process — future endpoint when backend supports real uploads
 */
export async function uploadAndProcess(
  file: File,
  month: number = 7
): Promise<ProcessingResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("month", month.toString());

  const response = await fetch(`${API_BASE_URL}/api/v1/process`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      detail: `HTTP ${response.status}: ${response.statusText}`,
    }));
    throw new Error(error.detail);
  }

  const data = await response.json();
  if (data.status === "error") {
    throw new Error(data.message || "Unknown backend error");
  }
  return data;
}

/**
 * Health check for the backend
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/docs`, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}
