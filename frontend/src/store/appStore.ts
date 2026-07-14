import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProcessingResult, ToastMessage } from "@/types";

interface AppState {

  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  history: ProcessingResult[];
  addToHistory: (result: ProcessingResult) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  clearRecentHistory: (hours: number) => void;

  currentResult: ProcessingResult | null;
  setCurrentResult: (result: ProcessingResult | null) => void;

  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({

      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) =>
        set({ sidebarCollapsed: collapsed }),

      history: [],
      addToHistory: (result) =>
        set((state) => ({
          history: [result, ...state.history].slice(0, 50), 
        })),
      removeFromHistory: (id) =>
        set((state) => ({
          history: state.history.filter((r) => r.id !== id),
        })),
      clearHistory: () => set({ history: [] }),
      clearRecentHistory: (hours) =>
        set((state) => {
          const cutoff = Date.now() - hours * 60 * 60 * 1000;
          return {
            history: state.history.filter((r) => r.timestamp < cutoff),
          };
        }),

      currentResult: null,
      setCurrentResult: (result) => set({ currentResult: result }),

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

      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
