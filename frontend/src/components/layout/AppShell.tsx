"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Premium Ambient Background */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[var(--color-primary)]/10 blur-[120px] mix-blend-screen animate-float opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[150px] mix-blend-screen animate-float opacity-40" style={{ animationDelay: '2s' }} />
      </div>

        {}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {}
      <div
        className={cn(
          "flex flex-col flex-1 transition-all duration-300 ease-[var(--ease-smooth)] will-change-transform",
          "ml-0", 
          sidebarCollapsed
            ? "md:ml-[var(--sidebar-collapsed-width)]"
            : "md:ml-[var(--sidebar-width)]"
        )}
      >
        {}
        <Navbar 
          sidebarCollapsed={sidebarCollapsed} 
          onMobileMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
        />

        {}
        <main className="flex-1 mt-[var(--navbar-height)] p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>

        {}
        <Footer />
      </div>
    </div>
  );
}
