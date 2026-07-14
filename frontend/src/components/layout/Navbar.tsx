"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Bell,
  Search,
  ChevronRight,
  Menu,
  Settings,
  LogOut,
  User,
  X
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
  "/about": "About",
};

export default function Navbar({ sidebarCollapsed, onMobileMenuToggle }: NavbarProps) {
  const pathname = usePathname();
  const currentLabel = routeLabels[pathname] || "Page";

  // Dropdown states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Command+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 right-0 z-30 h-[var(--navbar-height)] flex items-center justify-between px-4 md:px-6",
          "bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--color-border)] shadow-sm",
          "transition-all duration-300 ease-[var(--ease-smooth)]",
          "left-0", 
          sidebarCollapsed
            ? "md:left-[var(--sidebar-collapsed-width)]"
            : "md:left-[var(--sidebar-width)]"
        )}
      >
        <div className="flex items-center gap-2 md:gap-3 text-[13px]">
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-1.5 -ml-1.5 mr-1 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10"
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

        <div className="flex items-center gap-2 relative">
          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
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

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsProfileOpen(false);
              }}
              className={cn(
                "relative flex items-center justify-center w-9 h-9 rounded-[var(--radius-md)]",
                isNotifOpen ? "bg-[var(--color-surface-hover)] text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]",
                "hover:bg-white/10 hover:text-[var(--color-text-primary)]",
                "transition-all duration-200"
              )}
              aria-label="Notifications"
            >
              <Bell size={18} />
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--color-primary)] ring-2 ring-[var(--color-bg)]" />
            </button>
            
            {/* Notification Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-[var(--radius-lg)] glass-elevated border border-[var(--color-border)] shadow-xl overflow-hidden animate-fade-in origin-top-right">
                <div className="px-4 py-3 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-surface)]/50">
                  <h3 className="text-[13px] font-bold text-[var(--color-text-primary)]">Notifications</h3>
                  <span className="text-[10px] bg-[var(--color-primary-subtle)] text-[var(--color-primary)] px-2 py-0.5 rounded-full">2 New</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  <div className="p-3 border-b border-[var(--color-border-subtle)] hover:bg-white/10 transition-colors cursor-pointer">
                    <p className="text-[12px] text-[var(--color-text-primary)] font-medium">LISS-IV Image Processed</p>
                    <p className="text-[11px] text-[var(--color-text-tertiary)] mt-1">Region: Bangalore_01 completed successfully.</p>
                    <p className="text-[10px] text-[var(--color-primary)] mt-2">Just now</p>
                  </div>
                  <div className="p-3 hover:bg-white/10 transition-colors cursor-pointer">
                    <p className="text-[12px] text-[var(--color-text-primary)] font-medium">Model Weights Updated</p>
                    <p className="text-[11px] text-[var(--color-text-tertiary)] mt-1">Diffusion model V2 loaded in pipeline.</p>
                    <p className="text-[10px] text-[var(--color-text-muted)] mt-2">2 hours ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Operator Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotifOpen(false);
              }}
              className={cn(
                "flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-[var(--radius-md)]",
                isProfileOpen ? "bg-[var(--color-surface-hover)]" : "hover:bg-white/10",
                "transition-all duration-200"
              )}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-blue-600 flex items-center justify-center text-[11px] font-bold text-white ring-2 ring-[var(--color-border)]">
                AK
              </div>
              <span className="hidden sm:inline text-[13px] font-medium text-[var(--color-text-secondary)]">
                Arpit
              </span>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-[var(--radius-lg)] glass-elevated border border-[var(--color-border)] shadow-xl overflow-hidden animate-fade-in origin-top-right">
                <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface)]/50">
                  <p className="text-[13px] font-bold text-[var(--color-text-primary)]">Arpit Kishor Pathak</p>
                  <p className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5 truncate">2005arpitpathak@gmai.com</p>
                </div>
                <div className="p-1">
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10 rounded-md transition-colors text-left">
                    <User size={14} /> My Profile
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10 rounded-md transition-colors text-left">
                    <Settings size={14} /> Preferences
                  </button>
                  <div className="h-px bg-[var(--color-border-subtle)] my-1" />
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors text-left">
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Search Command Palette Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsSearchOpen(false)}
          />
          <div className="relative w-full max-w-xl rounded-xl glass-elevated border border-[var(--color-border)] shadow-2xl animate-fade-in-up overflow-hidden">
            <div className="flex items-center px-4 py-3 border-b border-[var(--color-border)]">
              <Search size={18} className="text-[var(--color-text-tertiary)] mr-3" />
              <input 
                autoFocus
                type="text" 
                placeholder="Search models, histories, or settings..." 
                className="flex-1 bg-transparent border-none outline-none text-[14px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]"
              />
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="p-1 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors rounded-md hover:bg-[var(--color-surface-hover)]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-2">
              <p className="px-3 py-2 text-[10px] font-bold tracking-widest uppercase text-[var(--color-text-muted)]">Quick Actions</p>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-md hover:bg-[var(--color-surface-hover)] transition-colors group">
                <div className="w-6 h-6 rounded bg-[var(--color-primary-subtle)] flex items-center justify-center text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-black transition-colors">
                  <Search size={12} />
                </div>
                <span className="text-[13px] text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]">Process new LISS-IV image</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-md hover:bg-[var(--color-surface-hover)] transition-colors group">
                <div className="w-6 h-6 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                  <Settings size={12} />
                </div>
                <span className="text-[13px] text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]">Open settings dashboard</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
