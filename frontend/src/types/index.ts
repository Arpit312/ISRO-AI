

export interface ProcessingResponse {
  status: "success" | "error";
  cloud_type_detected: string;
  season_prior_injected: string;
  physics_quality_score: number;
  spectral_report: Record<string, number | string>;
  output_image: string;
  uncertainty_heatmap: string;
  initial_cloud_pct?: number;
  final_cloud_pct?: number;
  message?: string;
}

export interface ProcessingResult {
  id: string;
  timestamp: number;
  fileName: string;
  month: number;
  cloudType: string;
  season: string;
  qualityScore: number;
  spectralReport: Record<string, number | string>;
  outputImage: string;
  uncertaintyHeatmap: string;
  inputPreview: string;
  initialCloudPct?: number;
  finalCloudPct?: number;
}

export interface ProcessingRequest {
  file: File;
  month: number;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  duration?: number;
}

export interface PipelineStage {
  id: number;
  name: string;
  description: string;
  status: "pending" | "active" | "completed" | "error";
}

export interface StatCard {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: string;
}

export interface MonthOption {
  value: number;
  label: string;
  season: string;
}

export const MONTHS: MonthOption[] = [
  { value: 1, label: "January", season: "Rabi" },
  { value: 2, label: "February", season: "Rabi" },
  { value: 3, label: "March", season: "Rabi" },
  { value: 4, label: "April", season: "Zaid" },
  { value: 5, label: "May", season: "Zaid" },
  { value: 6, label: "June", season: "Kharif" },
  { value: 7, label: "July", season: "Kharif" },
  { value: 8, label: "August", season: "Kharif" },
  { value: 9, label: "September", season: "Kharif" },
  { value: 10, label: "October", season: "Rabi" },
  { value: 11, label: "November", season: "Rabi" },
  { value: 12, label: "December", season: "Rabi" },
];
