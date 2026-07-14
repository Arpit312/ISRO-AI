"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import ToastContainer from "@/components/ui/Toast";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const pathname = usePathname();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, 
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
