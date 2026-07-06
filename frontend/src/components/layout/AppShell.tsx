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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex flex-col flex-1 transition-all duration-300 ease-[var(--ease-smooth)]",
          sidebarCollapsed
            ? "ml-[var(--sidebar-collapsed-width)]"
            : "ml-[var(--sidebar-width)]"
        )}
      >
        {/* Navbar */}
        <Navbar sidebarCollapsed={sidebarCollapsed} />

        {/* Page Content */}
        <main className="flex-1 mt-[var(--navbar-height)] p-6">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
