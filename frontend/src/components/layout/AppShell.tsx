"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * AppShell wraps all pages with the Sidebar, Navbar, and Footer.
 * Handles sidebar collapse state and responsive layout.
 */
export default function AppShell({ children }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
        {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex flex-col flex-1 transition-all duration-300 ease-[var(--ease-smooth)]",
          "ml-0", // 0 margin on mobile
          sidebarCollapsed
            ? "md:ml-[var(--sidebar-collapsed-width)]"
            : "md:ml-[var(--sidebar-width)]"
        )}
      >
        {/* Navbar */}
        <Navbar 
          sidebarCollapsed={sidebarCollapsed} 
          onMobileMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
        />

        {/* Page Content */}
        <main className="flex-1 mt-[var(--navbar-height)] p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
