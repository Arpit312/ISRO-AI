"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import ToastContainer from "@/components/ui/Toast";

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Client-side providers wrapper.
 * Wraps the app with React Query and the AppShell layout (except on root landing page).
 */
export default function Providers({ children }: ProvidersProps) {
  const pathname = usePathname();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 2,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {pathname === "/" ? (
        children
      ) : (
        <AppShell>{children}</AppShell>
      )}
      <ToastContainer />
    </QueryClientProvider>
  );
}
