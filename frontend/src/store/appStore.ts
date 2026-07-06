import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProcessingResult, ToastMessage } from "@/types";

// ============================================================================
// NOVA-SYNC Global State Store (Zustand)
// Manages sidebar state, processing history, current result, and toasts.
// History is persisted to localStorage.
// ============================================================================

interface AppState {
  // ── Sidebar ─────────────────────────────────────────────────────────────
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // ── Processing History ──────────────────────────────────────────────────
  history: ProcessingResult[];
  addToHistory: (result: ProcessingResult) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;

  // ── Current Result ──────────────────────────────────────────────────────
  currentResult: ProcessingResult | null;
  setCurrentResult: (result: ProcessingResult | null) => void;

  // ── Toast Notifications ─────────────────────────────────────────────────
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // ── Sidebar ───────────────────────────────────────────────────────
      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) =>
        set({ sidebarCollapsed: collapsed }),

      // ── Processing History ────────────────────────────────────────────
      history: [],
      addToHistory: (result) =>
        set((state) => ({
          history: [result, ...state.history].slice(0, 50), // Keep last 50
        })),
      removeFromHistory: (id) =>
        set((state) => ({
          history: state.history.filter((r) => r.id !== id),
        })),
      clearHistory: () => set({ history: [] }),

      // ── Current Result ────────────────────────────────────────────────
      currentResult: null,
      setCurrentResult: (result) => set({ currentResult: result }),

      // ── Toast Notifications ───────────────────────────────────────────
      toasts: [],
      addToast: (toast) =>
        set((state) => ({
          toasts: [
            ...state.toasts,
            {
              ...toast,
              id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            },
          ],
        })),
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
      clearToasts: () => set({ toasts: [] }),
    }),
    {
      name: "nova-sync-store",
      // Only persist specific keys to localStorage (Base64 images in history exceed quota)
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
