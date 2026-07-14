"use client";

import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizeConfig = {
  sm: { container: "w-8 h-8", orbit: "w-6 h-6", dot: "w-1.5 h-1.5", center: "w-2 h-2" },
  md: { container: "w-14 h-14", orbit: "w-12 h-12", dot: "w-2 h-2", center: "w-3 h-3" },
  lg: { container: "w-20 h-20", orbit: "w-16 h-16", dot: "w-2.5 h-2.5", center: "w-4 h-4" },
};

export default function Spinner({
  size = "md",
  className,
  label,
}: SpinnerProps) {
  const config = sizeConfig[size];

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className={cn("relative flex items-center justify-center", config.container)}>
        {}
        <div
          className={cn(
            config.center,
            "rounded-full bg-[var(--color-primary)] shadow-[0_0_8px_rgba(0,102,255,0.5)]"
          )}
        />

        {}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            config.orbit,
            "m-auto rounded-full border border-[var(--color-primary)]/20"
          )}
        >
          {}
          <div
            className="absolute animate-orbit"
            style={{ top: "50%", left: "50%", marginTop: "-3px", marginLeft: "-3px" }}
          >
            <div
              className={cn(
                config.dot,
                "rounded-full bg-[var(--color-primary-light)] shadow-[0_0_6px_rgba(51,136,255,0.6)]"
              )}
            />
          </div>
        </div>

        {}
        <div
          className={cn(
            "absolute inset-0 rounded-full border border-[var(--color-primary)]/10",
            "animate-pulse-glow"
          )}
        />
      </div>

      {label && (
        <p className="text-[12px] font-medium text-[var(--color-text-tertiary)] animate-pulse">
          {label}
        </p>
      )}
    </div>
  );
}
