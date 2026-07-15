"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Layers,
  Eye,
  Leaf,
  Radar,
  Brain,
  Sun,
  BarChart3,
  Check,
  Loader2,
} from "lucide-react";

interface PipelineStageConfig {
  id: number;
  name: string;
  shortName: string;
  icon: React.ReactNode;
  color: string;
  duration: number; 
}

const PIPELINE_STAGES: PipelineStageConfig[] = [
  { id: 1, name: "Spectral Domain Adapter", shortName: "SDA", icon: <Layers size={16} />, color: "#8B5CF6", duration: 400 },
  { id: 2, name: "Cloud Type Classifier", shortName: "NER", icon: <Eye size={16} />, color: "#EC4899", duration: 500 },
  { id: 3, name: "Phenology Prior Module", shortName: "PPM", icon: <Leaf size={16} />, color: "#10B981", duration: 300 },
  { id: 4, name: "SAR-Guided Diffusion", shortName: "SGD", icon: <Radar size={16} />, color: "#0066FF", duration: 800 },
  { id: 5, name: "Uncertainty Quantification", shortName: "UQ", icon: <Brain size={16} />, color: "#F59E0B", duration: 400 },
  { id: 6, name: "Shadow Removal", shortName: "SR", icon: <Sun size={16} />, color: "#EF4444", duration: 300 },
  { id: 7, name: "Physics Validator", shortName: "PV", icon: <BarChart3 size={16} />, color: "#06B6D4", duration: 350 },
];

type StageStatus = "pending" | "active" | "completed";

interface PipelineStatusProps {
  isProcessing: boolean;
  isComplete: boolean;
  className?: string;
}

export default function PipelineStatus({
  isProcessing,
  isComplete,
  className,
}: PipelineStatusProps) {
  const [stageStatuses, setStageStatuses] = useState<StageStatus[]>(
    PIPELINE_STAGES.map(() => "pending")
  );

  useEffect(() => {
    if (!isProcessing) {
      if (isComplete) {
        setTimeout(() => {
          setStageStatuses(PIPELINE_STAGES.map(() => "completed"));
        }, 0);
      }
      return;
    }

    setStageStatuses(PIPELINE_STAGES.map(() => "pending"));

    let currentStage = 0;
    const timers: NodeJS.Timeout[] = [];

    const advanceStage = () => {
      if (currentStage >= PIPELINE_STAGES.length) return;

      setStageStatuses((prev) =>
        prev.map((s, i) => (i === currentStage ? "active" : s))
      );

      const stageIdx = currentStage;
      const timer = setTimeout(() => {

        setStageStatuses((prev) =>
          prev.map((s, i) => (i === stageIdx ? "completed" : s))
        );
        currentStage++;
        advanceStage();
      }, PIPELINE_STAGES[currentStage].duration);

      timers.push(timer);
    };

    advanceStage();

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [isProcessing, isComplete]);

  return (
    <div className={cn("space-y-3", className)}>
      {}
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]">
          Pipeline Progress
        </h3>
        {isProcessing && (
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-primary)] animate-pulse">
            <Loader2 size={12} className="animate-spin" />
            Processing
          </span>
        )}
        {isComplete && (
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-success)]">
            <Check size={12} />
            Complete
          </span>
        )}
      </div>

      {}
      <div className="space-y-1.5">
        {PIPELINE_STAGES.map((stage, idx) => {
          const status = stageStatuses[idx];

          return (
            <div
              key={stage.id}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] transition-all duration-300",
                status === "active" && "bg-[var(--color-surface-hover)]",
                status === "completed" && "bg-[var(--color-surface)]"
              )}
            >
              {}
              <div
                className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-full shrink-0 transition-all duration-300",
                  status === "pending" && "bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]",
                  status === "active" && "animate-pulse-glow",
                  status === "completed" && "text-white"
                )}
                style={{
                  backgroundColor:
                    status === "active"
                      ? `${stage.color}20`
                      : status === "completed"
                      ? stage.color
                      : undefined,
                  color: status === "active" ? stage.color : undefined,
                }}
              >
                {status === "completed" ? (
                  <Check size={14} />
                ) : status === "active" ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <span className="text-[10px] font-bold">{stage.id}</span>
                )}
              </div>

              {}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-[12px] font-semibold truncate transition-colors duration-200",
                    status === "pending" && "text-[var(--color-text-muted)]",
                    status === "active" && "text-[var(--color-text-primary)]",
                    status === "completed" && "text-[var(--color-text-secondary)]"
                  )}
                >
                  {stage.name}
                </p>
              </div>

              {}
              <span
                className={cn(
                  "text-[10px] font-mono font-bold shrink-0 transition-colors duration-200",
                  status === "pending" && "text-[var(--color-text-muted)]",
                  status === "active" && "text-[var(--color-text-primary)]",
                  status === "completed" && "text-[var(--color-text-tertiary)]"
                )}
              >
                {stage.shortName}
              </span>
            </div>
          );
        })}
      </div>

      {}
      <div className="h-1.5 rounded-full bg-[var(--color-surface-elevated)] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] transition-all duration-500"
          style={{
            width: `${
              (stageStatuses.filter((s) => s === "completed").length /
                PIPELINE_STAGES.length) *
              100
            }%`,
          }}
        />
      </div>
    </div>
  );
}
