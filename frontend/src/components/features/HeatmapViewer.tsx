"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Layers } from "lucide-react";

// ============================================================================
// HeatmapViewer — Uncertainty heatmap overlay with opacity toggle
// ============================================================================

interface HeatmapViewerProps {
  baseImage: string;
  heatmap: string;
  className?: string;
}

export default function HeatmapViewer({
  baseImage,
  heatmap,
  className,
}: HeatmapViewerProps) {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [opacity, setOpacity] = useState(60);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-[var(--color-warning)]" />
          <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]">
            Uncertainty Heatmap
          </h3>
        </div>
        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-md)] text-[12px] font-medium transition-all duration-200",
            showHeatmap
              ? "bg-[var(--color-warning-subtle)] text-[var(--color-warning)] border border-[var(--color-warning)]/20"
              : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)]"
          )}
        >
          {showHeatmap ? <Eye size={13} /> : <EyeOff size={13} />}
          {showHeatmap ? "Visible" : "Hidden"}
        </button>
      </div>

      {/* Heatmap Container */}
      <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] h-[280px]">
        {/* Base processed image */}
        <img
          src={baseImage}
          alt="Processed satellite image"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Heatmap overlay */}
        {showHeatmap && (
          <img
            src={heatmap}
            alt="Uncertainty heatmap overlay"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
            style={{ opacity: opacity / 100 }}
          />
        )}

        {/* Legend */}
        <div className="absolute bottom-3 right-3 px-3 py-2 rounded-[var(--radius-md)] bg-black/60 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3 text-[10px] font-semibold text-white/90">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-green-500" />
              High Confidence
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-yellow-500" />
              Medium
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-red-500" />
              Low Confidence
            </span>
          </div>
        </div>
      </div>

      {/* Opacity Slider */}
      {showHeatmap && (
        <div className="flex items-center gap-3 px-1 animate-fade-in">
          <label className="text-[11px] font-medium text-[var(--color-text-tertiary)] whitespace-nowrap">
            Overlay Opacity
          </label>
          <input
            type="range"
            min={10}
            max={100}
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="flex-1 h-1.5 rounded-full appearance-none bg-[var(--color-surface-elevated)] cursor-pointer accent-[var(--color-warning)]"
          />
          <span className="text-[11px] font-mono font-bold text-[var(--color-text-secondary)] min-w-[35px] text-right">
            {opacity}%
          </span>
        </div>
      )}
    </div>
  );
}
