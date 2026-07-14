"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  LayoutDashboard,
  Satellite,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Map,
  Shield,
  Info,
} from "lucide-react";

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const navLinks: SidebarLink[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: "Process Image",
    href: "/process",
    icon: <Satellite size={20} />,
    badge: "AI",
  },
  {
    label: "Map Explorer",
    href: "/explore",
    icon: <Map size={20} />,
  },
  {
    label: "History",
    href: "/history",
    icon: <History size={20} />,
  },
  {
    label: "Safe-Route",
    href: "/safe-route",
    icon: <Shield size={20} />,
    badge: "Rescue",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <Settings size={20} />,
  },
  {
    label: "About",
    href: "/about",
    icon: <Info size={20} />,
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  return (
    <>
      {}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen flex flex-col",
          "glass border-r border-[var(--color-border)] shadow-[var(--shadow-lg)]",
          "transition-transform duration-300 ease-[var(--ease-smooth)] will-change-transform",

          "w-[var(--sidebar-width)] md:transition-all",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",

          collapsed ? "md:w-[var(--sidebar-collapsed-width)]" : "md:w-[var(--sidebar-width)]"
        )}
      >
      {/* Branding */}
      <div className="flex items-center gap-3 px-5 h-[var(--navbar-height)] border-b border-[var(--color-border)] shrink-0">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-[var(--radius-md)] bg-[var(--color-bg-elevated)] shrink-0 overflow-hidden border border-[var(--color-border)] shadow-md">
          <Image src="/logo.png" alt="Logo" fill className="object-cover" />
          <div className="absolute inset-0 rounded-[var(--radius-md)] animate-pulse-glow pointer-events-none border border-[var(--color-primary-subtle)]" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in overflow-hidden">
            <h1 className="text-[15px] font-bold tracking-tight text-[var(--color-text-primary)] whitespace-nowrap">
              NOVA-SYNC
            </h1>
            <p className="text-[10px] font-medium text-[var(--color-text-tertiary)] tracking-widest uppercase whitespace-nowrap">
              AI Engine
            </p>
          </div>
        )}
      </div>

      {}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {!collapsed && (
          <p className="px-3 mb-3 text-[10px] font-bold tracking-widest uppercase text-[var(--color-text-muted)] mt-2">
            Navigation
          </p>
        )}
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const isHovered = hoveredLink === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              onMouseEnter={() => setHoveredLink(link.href)}
              onMouseLeave={() => setHoveredLink(null)}
              className={cn(
                "group relative flex items-center gap-3 rounded-[var(--radius-md)] transition-all duration-300",
                collapsed ? "justify-center px-0 py-3" : "px-3 py-2.5",
                isActive
                  ? "bg-gradient-to-r from-[var(--color-primary)]/20 via-blue-500/10 to-transparent text-[var(--color-primary-light)] shadow-[inset_2px_0_0_0_var(--color-primary)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5"
              )}
            >
              {}

              {}
              <span
                className={cn(
                  "shrink-0 transition-colors duration-200",
                  isActive ? "text-[var(--color-primary-light)]" : ""
                )}
              >
                {link.icon}
              </span>

              {/* Label */}
              {!collapsed && (
                <span className="text-[13px] font-medium whitespace-nowrap">
                  {link.label}
                </span>
              )}

              {}
              {!collapsed && link.badge && (
                <span className="ml-auto px-1.5 py-0.5 text-[9px] font-bold tracking-wider rounded-[var(--radius-sm)] bg-[var(--color-primary)] text-white uppercase">
                  {link.badge}
                </span>
              )}

              {}
              {collapsed && (isHovered) && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-[var(--radius-md)] bg-[var(--color-surface-elevated)] border border-[var(--color-border-hover)] text-[12px] font-medium text-[var(--color-text-primary)] whitespace-nowrap shadow-[var(--shadow-lg)] z-50 animate-scale-in">
                  {link.label}
                  {link.badge && (
                    <span className="ml-2 px-1.5 py-0.5 text-[9px] font-bold rounded bg-[var(--color-primary)] text-white">
                      {link.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {}
      <div className="px-3 pb-4 border-t border-[var(--color-border)] pt-3 shrink-0">
        {}
        <button
          onClick={onToggle}
          className={cn(
            "flex items-center gap-3 w-full rounded-[var(--radius-md)] py-2.5 transition-all duration-200",
            "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]",
            collapsed ? "justify-center px-0" : "px-3"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && (
            <span className="text-[13px] font-medium">Collapse</span>
          )}
        </button>

        {}
        {!collapsed && (
          <div className="mt-3 px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse-glow" />
              <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">
                Engine Online
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
    </>
  );
}
