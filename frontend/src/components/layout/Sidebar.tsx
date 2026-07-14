"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useAppStore } from "@/store/appStore";
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
  LogOut,
  Siren,
} from "lucide-react";

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const baseNavLinks: SidebarLink[] = [
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
  const router = useRouter();
  const { userRole, logout } = useAppStore();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const navLinks = useMemo(() => {
    if (userRole === "admin") {
      return [
        ...baseNavLinks.slice(0, 5),
        {
          label: "SOS HQ (Admin)",
          href: "/admin",
          icon: <Siren size={20} />,
          badge: "LIVE",
        },
        ...baseNavLinks.slice(5),
      ];
    }
    return baseNavLinks;
  }, [userRole]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

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
        <div className="relative flex items-center justify-center w-9 h-9 rounded-[var(--radius-md)] bg-[#282a31] shrink-0 overflow-hidden border border-white/10 shadow-[0_0_15px_rgba(29,161,242,0.15)] group">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#1da1f2] group-hover:scale-110 transition-transform duration-300">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.8"/>
            <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="absolute inset-0 rounded-[var(--radius-md)] animate-pulse-glow pointer-events-none border border-[#1da1f2]/20" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in overflow-hidden">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] whitespace-nowrap">
              NOVA-SYNC
            </h1>
            <p className="text-base font-medium text-[var(--color-text-tertiary)] tracking-widest uppercase whitespace-nowrap">
              AI Engine
            </p>
          </div>
        )}
      </div>

      {}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {!collapsed && (
          <p className="px-3 mb-3 text-base font-bold tracking-widest uppercase text-[var(--color-text-muted)] mt-2">
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
                <span className="text-2xl font-medium whitespace-nowrap">
                  {link.label}
                </span>
              )}

              {}
              {!collapsed && link.badge && (
                <span className="ml-auto px-1.5 py-0.5 text-[11px] font-bold tracking-wider rounded-[var(--radius-sm)] bg-[var(--color-primary)] text-white uppercase">
                  {link.badge}
                </span>
              )}

              {}
              {collapsed && (isHovered) && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-[var(--radius-md)] bg-[var(--color-surface-elevated)] border border-[var(--color-border-hover)] text-base font-medium text-[var(--color-text-primary)] whitespace-nowrap shadow-[var(--shadow-lg)] z-50 animate-scale-in">
                  {link.label}
                  {link.badge && (
                    <span className="ml-2 px-1.5 py-0.5 text-[11px] font-bold rounded bg-[var(--color-primary)] text-white">
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
            <span className="text-2xl font-medium">Collapse</span>
          )}
        </button>

        {}
        {!collapsed && (
          <div className="mt-3 px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse-glow" />
              <span className="text-2xl font-medium text-[var(--color-text-secondary)]">
                Engine Online
              </span>
            </div>
          </div>
        )}
        {}
        <button
          onClick={handleLogout}
          className={cn(
            "mt-3 flex items-center gap-3 w-full rounded-[var(--radius-md)] py-2.5 transition-all duration-200",
            "text-red-400/70 hover:text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/20",
            collapsed ? "justify-center px-0" : "px-3"
          )}
          title="Logout"
        >
          <LogOut size={18} />
          {!collapsed && (
            <span className="text-2xl font-medium">Secure Logout</span>
          )}
        </button>
      </div>
    </aside>
    </>
  );
}
