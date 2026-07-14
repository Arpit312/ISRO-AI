"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { IS_MOCK_MODE, API_BASE_URL } from "@/lib/api";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  Settings as SettingsIcon,
  Server,
  Shield,
  Database,
  Zap,
  ExternalLink,
  LogOut,
  User,
  Sliders,
  Moon,
  Bell,
  HardDrive,
  Trash2,
} from "lucide-react";
import { useAppStore } from "@/store/appStore";

export default function SettingsPage() {
  const { user, loading, isConfigured, signIn, signOut } = useAuth();
  const history = useAppStore((state) => state.history);
  const clearHistory = useAppStore((state) => state.clearHistory);

  const configItems = [
    {
      icon: <Server size={18} />,
      label: "API Backend",
      value: API_BASE_URL,
      badge: IS_MOCK_MODE ? "Mock Mode" : "Live",
      badgeVariant: IS_MOCK_MODE ? ("warning" as const) : ("success" as const),
    },
    {
      icon: <Shield size={18} />,
      label: "Authentication",
      value: isConfigured ? "Firebase Auth" : "Mock Auth (Development)",
      badge: isConfigured ? "Configured" : "Mock",
      badgeVariant: isConfigured ? ("success" as const) : ("info" as const),
    },
    {
      icon: <Database size={18} />,
      label: "Data Persistence",
      value: "Browser LocalStorage",
      badge: "Active",
      badgeVariant: "success" as const,
    },
    {
      icon: <Zap size={18} />,
      label: "AI Engine",
      value: "NOVA-SYNC 7-Stage Pipeline",
      badge: "v1.0.0",
      badgeVariant: "primary" as const,
    },
  ];

  return (
    <div className="max-w-[900px] mx-auto">
      {}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-[var(--color-text-primary)] tracking-tight">
          Settings
        </h1>
        <p className="text-2xl text-[var(--color-text-secondary)] mt-1">
          System configuration and account management.
        </p>
      </div>

      <div className="space-y-6">
        {}
        <div className="rounded-[var(--radius-xl)] glass bg-[var(--color-surface)]/20 p-6 animate-fade-in">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <User size={16} />
            Account
          </h2>

          {loading ? (
            <div className="animate-shimmer h-16 rounded-[var(--radius-md)]" />
          ) : user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center text-2xl font-bold text-white ring-2 ring-[var(--color-border)]">
                  {user.displayName?.[0] || user.email?.[0] || "U"}
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[var(--color-text-primary)]">
                    {user.displayName || "NOVA-SYNC Operator"}
                  </p>
                  <p className="text-base text-[var(--color-text-tertiary)]">
                    {user.email}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                icon={<LogOut size={14} />}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-2xl text-[var(--color-text-secondary)]">
                Not signed in
              </p>
              <Button variant="primary" size="sm" onClick={signIn}>
                Sign In with Google
              </Button>
            </div>
          )}
        </div>

        {/* User Preferences */}
        <div className="rounded-[var(--radius-xl)] glass bg-[var(--color-surface)]/20 p-6 animate-fade-in-up stagger-1">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <Sliders size={16} />
            User Preferences
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-[var(--color-text-primary)]">Dark Mode Theme</p>
                <p className="text-2xl text-[var(--color-text-tertiary)]">Enforce dark theme for best contrast</p>
              </div>
              <Button variant="ghost" size="sm" icon={<Moon size={14} />} disabled>Enabled by Default</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-[var(--color-text-primary)]">Notifications</p>
                <p className="text-2xl text-[var(--color-text-tertiary)]">Show toast alerts on completion</p>
              </div>
              <Button variant="ghost" size="sm" icon={<Bell size={14} />} disabled>Enabled</Button>
            </div>
          </div>
        </div>

        {}
        <div className="rounded-[var(--radius-xl)] glass bg-[var(--color-surface)]/20 p-6 animate-fade-in-up stagger-2">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <SettingsIcon size={16} />
            System Configuration
          </h2>

          <div className="space-y-3">
            {configItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 p-3 rounded-[var(--radius-md)] bg-[var(--color-bg)] border border-[var(--color-border)]"
              >
                <span className="text-[var(--color-text-tertiary)]">
                  {item.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-[var(--color-text-tertiary)]">
                    {item.label}
                  </p>
                  <p className="text-2xl font-semibold text-[var(--color-text-primary)] font-mono truncate">
                    {item.value}
                  </p>
                </div>
                <Badge variant={item.badgeVariant} dot size="sm">
                  {item.badge}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Data Management */}
        <div className="rounded-[var(--radius-xl)] glass bg-[var(--color-surface)]/20 p-6 animate-fade-in-up stagger-3">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <HardDrive size={16} />
            Data Management
          </h2>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-[var(--radius-md)] bg-[var(--color-bg)] border border-[var(--color-border)]">
            <div className="space-y-1">
              <p className="text-2xl font-semibold text-[var(--color-text-primary)]">Local History Cache</p>
              <p className="text-2xl text-[var(--color-text-tertiary)]">
                {history.length} items currently stored in your browser cache.
              </p>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              icon={<Trash2 size={14} />} 
              onClick={() => {
                if (confirm("Are you sure you want to delete all local history data?")) {
                  clearHistory();
                }
              }}
              className="text-[var(--color-error)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-subtle)] w-full sm:w-auto shrink-0"
              disabled={history.length === 0}
            >
              Clear Cache
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
