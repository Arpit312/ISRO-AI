import axios, { AxiosError, type AxiosInstance } from "axios";
import type { ProcessingResponse } from "@/types";

// ============================================================================
// NOVA-SYNC Centralized API Service
// Supports both real backend and mock mode via NEXT_PUBLIC_API_MOCK env var.
// ============================================================================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const IS_MOCK_MODE = process.env.NEXT_PUBLIC_API_MOCK === "true";

/**
 * Configured Axios instance with interceptors for auth and error handling.
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120_000, // 2 minutes — satellite processing can be slow
  headers: {
    Accept: "application/json",
  },
});

// ── Request Interceptor: Attach auth token ──────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // If Firebase auth is configured, attach the ID token
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("nova_sync_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: Normalize errors ──────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; detail?: string }>) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.message ||
      "An unexpected error occurred";

    const status = error.response?.status;

    // Handle specific status codes
    if (status === 401) {
      // Token expired or invalid — clear auth state
      if (typeof window !== "undefined") {
        localStorage.removeItem("nova_sync_token");
      }
    }

    return Promise.reject(new Error(`[${status || "NETWORK"}] ${message}`));
  }
);

// ============================================================================
// Mock Data Generator
// ============================================================================

/** Generates a realistic mock response with a simulated delay */
async function generateMockResponse(
  fileName: string,
  month: number
): Promise<ProcessingResponse> {
  // Simulate processing delay (1.5–3s)
  await new Promise((resolve) =>
    setTimeout(resolve, 1500 + Math.random() * 1500)
  );

  const seasons: Record<number, string> = {
    1: "Rabi", 2: "Rabi", 3: "Rabi",
    4: "Zaid", 5: "Zaid",
    6: "Kharif", 7: "Kharif", 8: "Kharif", 9: "Kharif",
    10: "Rabi", 11: "Rabi", 12: "Rabi",
  };

  const cloudTypes = [
    "Thin Cirrus",
    "Cumulus/Stratus",
    "Deep Convective",
    "Cloud Shadow",
    "Clear Sky",
  ];

  const qualityScore = 75 + Math.random() * 25; // 75–100

  // Generate a 1x1 blue pixel as a minimal valid base64 PNG for mock
  const mockImageBase64 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

  return {
    status: "success",
    cloud_type_detected: cloudTypes[Math.floor(Math.random() * cloudTypes.length)],
    season_prior_injected: seasons[month] || "Kharif",
    physics_quality_score: Math.round(qualityScore * 10) / 10,
    spectral_report: {
      NDVI: Math.round((0.3 + Math.random() * 0.5) * 1000) / 1000,
      NDWI: Math.round((-0.2 + Math.random() * 0.4) * 1000) / 1000,
      SAVI: Math.round((0.2 + Math.random() * 0.6) * 1000) / 1000,
    },
    output_image: mockImageBase64,
    uncertainty_heatmap: mockImageBase64,
  };
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Process a satellite image through the NOVA-SYNC pipeline.
 * In mock mode, returns simulated data. In production, calls POST /api/v1/process.
 */
export async function processImage(
  file: File,
  month: number
): Promise<ProcessingResponse> {
  if (IS_MOCK_MODE) {
    console.log("[MOCK] Processing image:", file.name, "month:", month);
    return generateMockResponse(file.name, month);
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("month", String(month));

  const response = await apiClient.post<ProcessingResponse>(
    "/api/v1/process",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
}

/**
 * Health check — ping the backend to verify it's online.
 */
export async function checkHealth(): Promise<boolean> {
  if (IS_MOCK_MODE) {
    return true;
  }

  try {
    await apiClient.get("/docs", { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

export { apiClient, IS_MOCK_MODE, API_BASE_URL };
