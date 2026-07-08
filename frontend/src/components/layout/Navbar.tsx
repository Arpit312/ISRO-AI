"use client";

import { usePathname } from "next/navigation";
import {
  Bell,
  Search,
  ChevronRight,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  sidebarCollapsed: boolean;
  onMobileMenuToggle?: () => void;
}

const routeLabels: Record<string, string> = {
  "/": "Dashboard",
  "/process": "Process Image",
  "/history": "History",
  "/settings": "Settings",
};

export default function Navbar({ sidebarCollapsed, onMobileMenuToggle }: NavbarProps) {
  const pathname = usePathname();
  const currentLabel = routeLabels[pathname] || "Page";

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-[var(--navbar-height)] flex items-center justify-between px-4 md:px-6",
        "bg-[var(--color-bg)]/60 backdrop-blur-2xl border-b border-[var(--color-border)] shadow-sm",
        "transition-all duration-300 ease-[var(--ease-smooth)]",
        "left-0", // full width on mobile
        sidebarCollapsed
          ? "md:left-[var(--sidebar-collapsed-width)]"
          : "md:left-[var(--sidebar-width)]"
      )}
    >
      {/* Left: Breadcrumbs & Mobile Menu */}
      <div className="flex items-center gap-2 md:gap-3 text-[13px]">
        {/* Mobile Menu Button */}
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-1.5 -ml-1.5 mr-1 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]"
        >
          <Menu size={18} />
        </button>

        <span className="hidden sm:inline text-[var(--color-text-tertiary)] font-medium">
          NOVA-SYNC
        </span>
        <ChevronRight size={14} className="hidden sm:block text-[var(--color-text-muted)]" />
        <span className="text-[var(--color-text-primary)] font-semibold">
          {currentLabel}
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search Button */}
        <button
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-md)]",
            "bg-[var(--color-surface)] border border-[var(--color-border)]",
            "text-[var(--color-text-tertiary)] text-[12px] font-medium",
            "hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-secondary)]",
            "transition-all duration-200"
          )}
        >
          <Search size={14} />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono rounded bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
            ⌘K
          </kbd>
        </button>

        {/* Notification Bell */}
        <button
          className={cn(
            "relative flex items-center justify-center w-9 h-9 rounded-[var(--radius-md)]",
            "text-[var(--color-text-secondary)]",
            "hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]",
            "transition-all duration-200"
          )}
          aria-label="Notifications"
        >
          <Bell size={18} />
          {/* Notification dot */}
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--color-primary)] ring-2 ring-[var(--color-bg)]" />
        </button>

        {/* User Avatar */}
        <button
          className={cn(
            "flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-[var(--radius-md)]",
            "hover:bg-[var(--color-surface-hover)]",
            "transition-all duration-200"
          )}
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center text-[11px] font-bold text-white ring-2 ring-[var(--color-border)]">
            NS
          </div>
          <span className="hidden sm:inline text-[13px] font-medium text-[var(--color-text-secondary)]">
            Operator
          </span>
        </button>
      </div>
    </header>
  );
}
