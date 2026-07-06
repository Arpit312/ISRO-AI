"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Button Atom — Premium multi-variant button with loading state
// ============================================================================

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-[var(--color-primary)] text-white",
    "hover:bg-[var(--color-primary-light)] hover:shadow-[var(--shadow-glow)]",
    "active:bg-[var(--color-primary-dark)]",
    "disabled:bg-[var(--color-primary)]/50",
  ].join(" "),
  secondary: [
    "bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)]",
    "hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border-hover)]",
    "active:bg-[var(--color-surface-elevated)]",
    "disabled:opacity-50",
  ].join(" "),
  ghost: [
    "bg-transparent text-[var(--color-text-secondary)]",
    "hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]",
    "active:bg-[var(--color-surface)]",
    "disabled:opacity-50",
  ].join(" "),
  danger: [
    "bg-[var(--color-error)] text-white",
    "hover:bg-[#DC2626] hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]",
    "active:bg-[#B91C1C]",
    "disabled:bg-[var(--color-error)]/50",
  ].join(" "),
  success: [
    "bg-[var(--color-success)] text-white",
    "hover:bg-[#059669] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]",
    "active:bg-[#047857]",
    "disabled:bg-[var(--color-success)]/50",
  ].join(" "),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-[12px] rounded-[var(--radius-md)] gap-1.5",
  md: "px-4 py-2.5 text-[13px] rounded-[var(--radius-md)] gap-2",
  lg: "px-6 py-3 text-[14px] rounded-[var(--radius-lg)] gap-2.5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-semibold",
          "transition-all duration-200 ease-[var(--ease-smooth)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
          "disabled:cursor-not-allowed",
          "select-none",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin shrink-0"
            width={size === "sm" ? 14 : 16}
            height={size === "sm" ? 14 : 16}
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="opacity-25"
            />
            <path
              d="M12 2a10 10 0 0 1 10 10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="opacity-75"
            />
          </svg>
        ) : (
          icon && <span className="shrink-0">{icon}</span>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
