"use client";

import Link from "next/link";
import {
  Satellite,
  CloudOff,
  Activity,
  Shield,
  Zap,
  ArrowRight,
  Layers,
  Brain,
  Eye,
  Radar,
  Leaf,
  Sun,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats: Array<{
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}> = [
  {
    label: "Images Processed",
    value: "1,284",
    change: "+12.5%",
    trend: "up" as const,
    icon: <Satellite size={20} />,
    color: "var(--color-primary)",
    bgColor: "var(--color-primary-subtle)",
  },
  {
    label: "Avg Quality Score",
    value: "94.2",
    change: "+3.1%",
    trend: "up" as const,
    icon: <Shield size={20} />,
    color: "var(--color-success)",
    bgColor: "var(--color-success-subtle)",
  },
  {
    label: "Clouds Removed",
    value: "847",
    change: "+8.7%",
    trend: "up" as const,
    icon: <CloudOff size={20} />,
    color: "var(--color-info)",
    bgColor: "var(--color-info-subtle)",
  },
  {
    label: "Engine Uptime",
    value: "99.9%",
    change: "Stable",
    trend: "neutral" as const,
    icon: <Activity size={20} />,
    color: "var(--color-warning)",
    bgColor: "var(--color-warning-subtle)",
  },
];

const pipelineStages = [
  {
    icon: <Layers size={18} />,
    name: "Spectral Adapter",
    desc: "3-band → 13-band mapping",
    color: "#8B5CF6",
  },
  {
    icon: <Eye size={18} />,
    name: "Cloud Classifier",
    desc: "ResNet-18 cloud routing",
    color: "#EC4899",
  },
  {
    icon: <Leaf size={18} />,
    name: "Phenology Prior",
    desc: "Kharif/Rabi/Zaid encoding",
    color: "#10B981",
  },
  {
    icon: <Radar size={18} />,
    name: "SAR Fusion",
    desc: "Cross-attention diffusion",
    color: "#0066FF",
  },
  {
    icon: <Brain size={18} />,
    name: "Uncertainty Map",
    desc: "MC Dropout confidence",
    color: "#F59E0B",
  },
  {
    icon: <Sun size={18} />,
    name: "Shadow Removal",
    desc: "Gamma spectral correction",
    color: "#EF4444",
  },
  {
    icon: <BarChart3 size={18} />,
    name: "Physics Validator",
    desc: "NDVI/NDWI bounds check",
    color: "#06B6D4",
  },
];

export default function DashboardPage() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      <section className="relative overflow-hidden rounded-[var(--radius-xl)] glass-panel-heavy p-8 md:p-10 animate-fade-in">
        {/* Glow Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 via-transparent to-[var(--color-primary)]/5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

        {/* Noise and dots */}
        <div className="absolute inset-0 noise-overlay" />
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-full)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[11px] font-semibold text-[var(--color-primary-light)] tracking-wide uppercase">
                <Zap size={12} />
                AI Engine Active
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight glow-text">
              Welcome to{" "}
              <span className="gradient-text">NOVA-SYNC</span>
            </h1>
            <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed">
              7-stage multi-modal AI pipeline for reconstructing cloud-occluded
              ISRO LISS-IV satellite imagery. Upload, process, and validate —
              all in one place.
            </p>
          </div>

          <Link
            href="/process"
            className={cn(
              "group flex items-center gap-3 px-6 py-3.5 rounded-[var(--radius-lg)] btn-premium text-white font-semibold text-[14px]",
              "shrink-0"
            )}
          >
            <Satellite size={18} className="relative z-10" />
            <span className="relative z-10">Process New Image</span>
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-200 relative z-10"
            />
          </Link>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={stat.label}
            className={cn(
              "group relative rounded-[var(--radius-lg)] glass-panel premium-card-hover p-6",
              "cursor-default animate-fade-in-up",
              `stagger-${idx + 1}`
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)]"
                style={{ backgroundColor: stat.bgColor, color: stat.color }}
              >
                {stat.icon}
              </div>
              <span
                className={cn(
                  "text-[12px] font-semibold px-2 py-0.5 rounded-[var(--radius-full)]",
                  stat.trend === "up" &&
                    "text-[var(--color-success)] bg-[var(--color-success-subtle)]",
                  stat.trend === "down" &&
                    "text-[var(--color-error)] bg-[var(--color-error-subtle)]",
                  stat.trend === "neutral" &&
                    "text-[var(--color-text-secondary)] bg-[var(--color-surface-elevated)]"
                )}
              >
                {stat.change}
              </span>
            </div>
            <p className="text-3xl font-mono font-medium text-[var(--color-text-primary)] tracking-tight">
              {stat.value}
            </p>
            <p className="text-[12px] text-[var(--color-text-tertiary)] font-medium mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </section>

      {}
      <section className="animate-fade-in-up stagger-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
              7-Stage AI Pipeline
            </h2>
            <p className="text-[13px] text-[var(--color-text-tertiary)] mt-0.5">
              Multi-modal reconstruction architecture
            </p>
          </div>
          <Link
            href="/process"
            className="text-[13px] font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-light)] flex items-center gap-1 transition-colors"
          >
            Start Processing
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {pipelineStages.map((stage, idx) => (
            <div
              key={stage.name}
              className={cn(
                "group relative flex items-start gap-3 p-4 rounded-[var(--radius-lg)]",
                "glass bg-[var(--color-surface)]/20",
                "hover:border-[var(--color-border-focus)] glass-hover",
                "transition-all duration-200 cursor-default",
                "animate-fade-in",
                `stagger-${idx + 1}`
              )}
            >
              {}
              <div className="absolute top-2 right-3 text-[10px] font-bold text-[var(--color-text-muted)]">
                {String(idx + 1).padStart(2, "0")}
              </div>

              {}
              <div
                className="flex items-center justify-center w-9 h-9 rounded-[var(--radius-md)] shrink-0 transition-transform duration-200 group-hover:scale-110"
                style={{
                  backgroundColor: `${stage.color}15`,
                  color: stage.color,
                }}
              >
                {stage.icon}
              </div>

              {}
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-[var(--color-text-primary)] truncate">
                  {stage.name}
                </p>
                <p className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5 truncate">
                  {stage.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up stagger-6">
        {}
        <Link
          href="/process"
          className={cn(
            "group relative overflow-hidden rounded-[var(--radius-xl)] glass p-8",
            "hover:border-[var(--color-primary)]/50 glass-hover",
            "transition-all duration-300"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="relative z-10">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-[var(--radius-lg)] mb-4"
              style={{
                backgroundColor: "var(--color-primary-subtle)",
                color: "var(--color-primary)",
              }}
            >
              <CloudOff size={22} />
            </div>
            <h3 className="text-[15px] font-bold text-[var(--color-text-primary)]">
              Cloud Removal
            </h3>
            <p className="text-[13px] text-[var(--color-text-secondary)] mt-1.5 leading-relaxed">
              Upload LISS-IV imagery and let the 7-stage pipeline reconstruct
              cloud-free ground truth with physics validation.
            </p>
            <span className="inline-flex items-center gap-1 mt-4 text-[13px] font-semibold text-[var(--color-primary)] group-hover:gap-2 transition-all duration-200">
              Start Processing <ArrowRight size={14} />
            </span>
          </div>
        </Link>

        {}
        <Link
          href="/history"
          className={cn(
            "group relative overflow-hidden rounded-[var(--radius-xl)] glass p-8",
            "hover:border-[var(--color-success)]/50 glass-hover",
            "transition-all duration-300"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-success)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="relative z-10">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-[var(--radius-lg)] mb-4"
              style={{
                backgroundColor: "var(--color-success-subtle)",
                color: "var(--color-success)",
              }}
            >
              <BarChart3 size={22} />
            </div>
            <h3 className="text-[15px] font-bold text-[var(--color-text-primary)]">
              Processing History
            </h3>
            <p className="text-[13px] text-[var(--color-text-secondary)] mt-1.5 leading-relaxed">
              Review past processing results, compare quality scores, and export
              spectral analysis reports.
            </p>
            <span className="inline-flex items-center gap-1 mt-4 text-[13px] font-semibold text-[var(--color-success)] group-hover:gap-2 transition-all duration-200">
              View History <ArrowRight size={14} />
            </span>
          </div>
        </Link>
      </section>
    </div>
  );
}
