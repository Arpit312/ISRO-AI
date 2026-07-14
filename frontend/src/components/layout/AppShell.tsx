"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  const isLandingPage = pathname === "/";

  if (isLandingPage) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-black text-white">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black text-white">
      {/* Cinematic Monitor Background */}
      <div className="fixed inset-0 z-[-2] pointer-events-none">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-30 mix-blend-lighten"
        >
          <source src="/cinematic-bg.mp4" type="video/mp4" />
        </video>
      </div>

      {/* CRT Scanline Overlay */}
      <div className="fixed inset-0 z-[-1] pointer-events-none opacity-20" style={{
        backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
        backgroundSize: '100% 2px, 3px 100%'
      }} />

      <div className="fixed inset-0 z-[-1] pointer-events-none bg-black/40">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[var(--color-primary)]/10 blur-[120px] mix-blend-screen animate-float opacity-30" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[150px] mix-blend-screen animate-float opacity-20" style={{ animationDelay: '2s' }} />
      </div>

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div
        className={cn(
          "flex flex-col flex-1 transition-all duration-300 ease-[var(--ease-smooth)] will-change-transform",
          "ml-0", 
          sidebarCollapsed
            ? "md:ml-[var(--sidebar-collapsed-width)]"
            : "md:ml-[var(--sidebar-width)]"
        )}
      >
        <Navbar 
          sidebarCollapsed={sidebarCollapsed} 
          onMobileMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
        />

        <main className="flex-1 mt-[var(--navbar-height)] p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
