"use client";

import { cn } from "@/lib/utils";

// ============================================================================
// Card Atom — Glassmorphism card with optional glow border
// ============================================================================

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function Card({
  children,
  className,
  glow = false,
  hoverable = false,
  padding = "md",
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]",
        "transition-all duration-300",
        hoverable && [
          "hover:border-[var(--color-border-hover)]",
          "hover:shadow-[var(--shadow-md)]",
          "hover:bg-[var(--color-surface-hover)]",
        ],
        glow && "glow-border",
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, action }: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between pb-4 border-b border-[var(--color-border)]",
        className
      )}
    >
      <div>{children}</div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function CardBody({ children, className }: CardBodyProps) {
  return <div className={cn("py-4", className)}>{children}</div>;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between pt-4 border-t border-[var(--color-border)]",
        className
      )}
    >
      {children}
    </div>
  );
}
