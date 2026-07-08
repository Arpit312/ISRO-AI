"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getQualityLabel } from "@/lib/utils";
import { Shield } from "lucide-react";

// ============================================================================
// QualityScore — Animated radial gauge showing physics validation score
// ============================================================================

interface QualityScoreProps {
  score: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
  spectralReport?: Record<string, number | { violation_pct: number; mean_value: number }>;
  initialCloudPct?: number;
  finalCloudPct?: number;
}

const sizeConfig = {
  sm: { radius: 36, stroke: 5, fontSize: "text-lg", labelSize: "text-[9px]", container: "w-24 h-24" },
  md: { radius: 52, stroke: 6, fontSize: "text-2xl", labelSize: "text-[10px]", container: "w-36 h-36" },
  lg: { radius: 68, stroke: 7, fontSize: "text-3xl", labelSize: "text-[11px]", container: "w-44 h-44" },
};

export default function QualityScore({
  score,
  className,
  size = "md",
  showDetails = true,
  spectralReport,
  initialCloudPct,
  finalCloudPct,
}: QualityScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;
  const quality = getQualityLabel(score);

  // Animate the score from 0 to target
  useEffect(() => {
    const validScore = isNaN(score) || score === null || score === undefined ? 0 : score;
    const duration = 1200;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(validScore * eased * 10) / 10);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  const safeAnimatedScore = isNaN(animatedScore) ? 0 : animatedScore;
  const strokeDashoffset =
    circumference - (safeAnimatedScore / 100) * circumference;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <Shield size={16} style={{ color: quality.color }} />
        <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]">
          Physics Quality Score
        </h3>
      </div>

      <div className="flex items-center gap-6">
        {/* Radial Gauge */}
        <div className={cn("relative flex items-center justify-center shrink-0", config.container)}>
          <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${(config.radius + config.stroke) * 2} ${(config.radius + config.stroke) * 2}`}>
            {/* Background ring */}
            <circle
              cx={config.radius + config.stroke}
              cy={config.radius + config.stroke}
              r={config.radius}
              stroke="var(--color-surface-elevated)"
              strokeWidth={config.stroke}
              fill="none"
            />
            {/* Score ring */}
            <circle
              cx={config.radius + config.stroke}
              cy={config.radius + config.stroke}
              r={config.radius}
              stroke={quality.color}
              strokeWidth={config.stroke}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-100"
              style={{
                filter: `drop-shadow(0 0 6px ${quality.color}40)`,
              }}
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={cn("font-bold tracking-tight", config.fontSize)}
              style={{ color: quality.color }}
            >
              {animatedScore.toFixed(1)}
            </span>
            <span
              className={cn(
                "font-semibold uppercase tracking-wider mt-0.5",
                config.labelSize
              )}
              style={{ color: quality.color }}
            >
              {quality.label}
            </span>
          </div>
        </div>

        {/* Spectral Report */}
        {showDetails && spectralReport && (
          <div className="flex-1 space-y-2.5">
            <p className="text-[11px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">
              Spectral Indices
            </p>
            {Object.entries(spectralReport).map(([key, data]) => {
              const value = typeof data === 'number' ? data : (data as any)?.mean_value ?? 0;
              return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium text-[var(--color-text-secondary)]">
                    {key}
                  </span>
                  <span className="text-[12px] font-mono font-bold text-[var(--color-text-primary)]">
                    {Number(value).toFixed(3)}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--color-surface-elevated)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(Math.abs(Number(value)) * 100, 100)}%`,
                      backgroundColor:
                        Number(value) > 0.5 ? "var(--color-success)" : Number(value) > 0.2 ? "var(--color-primary)" : "var(--color-warning)",
                    }}
                  />
                </div>
              </div>
            )})}
          </div>
        )}
      </div>

      {/* Cloud Coverage Reduction */}
      {initialCloudPct !== undefined && finalCloudPct !== undefined && (
        <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold text-[var(--color-text-secondary)]">
              Cloud Coverage
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[15px] font-mono font-bold text-[var(--color-error)]">
                {initialCloudPct.toFixed(1)}%
              </span>
              <span className="text-[var(--color-text-tertiary)] text-[12px]">→</span>
              <span className="text-[15px] font-mono font-bold text-[var(--color-success)]">
                {finalCloudPct.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="h-10 w-10 rounded-full flex items-center justify-center bg-[var(--color-success-subtle)] text-[var(--color-success)] font-bold text-[11px]">
            -{Math.max(0, initialCloudPct - finalCloudPct).toFixed(0)}%
          </div>
        </div>
      )}
    </div>
  );
}
