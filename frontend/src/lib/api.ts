import axios, { AxiosError, type AxiosInstance } from "axios";
import type { ProcessingResponse } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const IS_MOCK_MODE = process.env.NEXT_PUBLIC_API_MOCK === "true";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120_000, 
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {

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

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; detail?: string }>) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.message ||
      "An unexpected error occurred";

    const status = error.response?.status;

    if (status === 401) {

      if (typeof window !== "undefined") {
        localStorage.removeItem("nova_sync_token");
      }
    }

    return Promise.reject(new Error(`[${status || "NETWORK"}] ${message}`));
  }
);

async function generateMockResponse(
  fileName: string,
  month: number
): Promise<ProcessingResponse> {

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

  const qualityScore = 75 + Math.random() * 25; 

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
