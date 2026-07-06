import { clsx, type ClassValue } from "clsx";

/**
 * Merge class names conditionally using clsx.
 * Equivalent to shadcn's `cn()` utility but without tailwind-merge
 * since Tailwind v4 handles specificity natively.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Format a timestamp into a human-readable date string.
 */
export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

/**
 * Format a quality score into a descriptive label.
 */
export function getQualityLabel(score: number): {
  label: string;
  color: string;
} {
  if (score >= 90) return { label: "Excellent", color: "var(--color-success)" };
  if (score >= 70) return { label: "Good", color: "var(--color-primary)" };
  if (score >= 50) return { label: "Moderate", color: "var(--color-warning)" };
  return { label: "Poor", color: "var(--color-error)" };
}

/**
 * Generate a unique ID for client-side entities.
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Format file size in human-readable format.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Truncate a string to a given length with ellipsis.
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.substring(0, length)}...`;
}
