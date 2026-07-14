"use client";

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "primary";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
  size?: "sm" | "md";
  title?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] border-[var(--color-border)]",
  success:
    "bg-[var(--color-success-subtle)] text-[var(--color-success)] border-[var(--color-success)]/20",
  warning:
    "bg-[var(--color-warning-subtle)] text-[var(--color-warning)] border-[var(--color-warning)]/20",
  error:
    "bg-[var(--color-error-subtle)] text-[var(--color-error)] border-[var(--color-error)]/20",
  info:
    "bg-[var(--color-info-subtle)] text-[var(--color-info)] border-[var(--color-info)]/20",
  primary:
    "bg-[var(--color-primary-subtle)] text-[var(--color-primary-light)] border-[var(--color-primary)]/20",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-text-secondary)]",
  success: "bg-[var(--color-success)]",
  warning: "bg-[var(--color-warning)]",
  error: "bg-[var(--color-error)]",
  info: "bg-[var(--color-info)]",
  primary: "bg-[var(--color-primary)]",
};

export default function Badge({
  children,
  variant = "default",
  className,
  dot = false,
  size = "sm",
  title,
}: BadgeProps) {
  return (
    <span
      title={title}
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold border rounded-[var(--radius-full)]",
        "transition-colors duration-200",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            dotColors[variant]
          )}
        />
      )}
      {children}
    </span>
  );
}
