"use client";

import { cn } from "@/lib/utils";

// ============================================================================
// Skeleton Atom — Shimmer loading placeholder
// ============================================================================

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export default function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  const baseClasses = "animate-shimmer rounded-[var(--radius-md)]";

  if (lines > 1) {
    return (
      <div className={cn("space-y-2.5", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(baseClasses, "h-4")}
            style={{
              width: i === lines - 1 ? "75%" : "100%",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        variant === "circular" && "rounded-full",
        variant === "text" && "h-4",
        className
      )}
      style={{
        width: width ?? (variant === "circular" ? 40 : "100%"),
        height:
          height ??
          (variant === "circular" ? 40 : variant === "text" ? 16 : 100),
      }}
    />
  );
}

/** Pre-built skeleton for a stats card */
export function StatCardSkeleton() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-4">
      <div className="flex items-start justify-between">
        <Skeleton variant="rectangular" width={40} height={40} />
        <Skeleton variant="rectangular" width={50} height={20} />
      </div>
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="40%" />
    </div>
  );
}

/** Pre-built skeleton for an image result */
export function ImageResultSkeleton() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
      <Skeleton variant="rectangular" height={200} />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" width="80%" />
        <Skeleton lines={2} />
      </div>
    </div>
  );
}
