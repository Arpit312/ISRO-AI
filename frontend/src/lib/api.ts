import axios, { AxiosError, type AxiosInstance } from "axios";
import type { ProcessingResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

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

export async function processImage(
  file: File,
  month: number
): Promise<ProcessingResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("month", String(month));

  const response = await apiClient.post<ProcessingResponse>(
    "/api/process",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await apiClient.get("/api/health", { timeout: 5000 });
    return res.status === 200;
  } catch {
    return false;
  }
}

export const IS_MOCK_MODE = false;

export { apiClient, API_BASE_URL };
