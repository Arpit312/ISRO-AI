"use client";

import { useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/appStore";
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from "lucide-react";
import type { ToastMessage } from "@/types";

// ============================================================================
// Toast Notification System
// Renders toasts from Zustand store with auto-dismiss and slide animations.
// ============================================================================

const iconMap: Record<ToastMessage["type"], React.ReactNode> = {
  success: <CheckCircle2 size={18} className="text-[var(--color-success)]" />,
  error: <AlertCircle size={18} className="text-[var(--color-error)]" />,
  warning: <AlertTriangle size={18} className="text-[var(--color-warning)]" />,
  info: <Info size={18} className="text-[var(--color-info)]" />,
};

const borderColorMap: Record<ToastMessage["type"], string> = {
  success: "border-l-[var(--color-success)]",
  error: "border-l-[var(--color-error)]",
  warning: "border-l-[var(--color-warning)]",
  info: "border-l-[var(--color-info)]",
};

function ToastItem({ toast }: { toast: ToastMessage }) {
  const removeToast = useAppStore((state) => state.removeToast);

  const dismiss = useCallback(() => {
    removeToast(toast.id);
  }, [toast.id, removeToast]);

  // Auto-dismiss after duration (default 5s)
  useEffect(() => {
    const timeout = setTimeout(dismiss, toast.duration || 5000);
    return () => clearTimeout(timeout);
  }, [dismiss, toast.duration]);

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 rounded-[var(--radius-lg)]",
        "bg-[var(--color-surface-elevated)] border border-[var(--color-border)]",
        "border-l-[3px] shadow-[var(--shadow-lg)]",
        "animate-scale-in",
        "max-w-sm w-full",
        borderColorMap[toast.type]
      )}
      role="alert"
    >
      <span className="shrink-0 mt-0.5">{iconMap[toast.type]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[var(--color-text-primary)]">
          {toast.title}
        </p>
        {toast.description && (
          <p className="text-[12px] text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={dismiss}
        className="shrink-0 p-0.5 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}

/** Toast container — render this once in the layout */
export default function ToastContainer() {
  const toasts = useAppStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

/** Helper hook to easily push toasts from any component */
export function useToast() {
  const addToast = useAppStore((state) => state.addToast);

  return {
    success: (title: string, description?: string) =>
      addToast({ type: "success", title, description }),
    error: (title: string, description?: string) =>
      addToast({ type: "error", title, description }),
    warning: (title: string, description?: string) =>
      addToast({ type: "warning", title, description }),
    info: (title: string, description?: string) =>
      addToast({ type: "info", title, description }),
  };
}
