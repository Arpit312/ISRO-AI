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
} from "lucide-react";

// ============================================================================
// Settings Page — Configuration overview & auth management
// ============================================================================

export default function SettingsPage() {
  const { user, loading, isConfigured, signIn, signOut } = useAuth();

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
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
          Settings
        </h1>
        <p className="text-[14px] text-[var(--color-text-secondary)] mt-1">
          System configuration and account management.
        </p>
      </div>

      <div className="space-y-6">
        {/* User Profile Card */}
        <div className="rounded-[var(--radius-xl)] glass bg-[var(--color-surface)]/20 p-6 animate-fade-in">
          <h2 className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <User size={16} />
            Account
          </h2>

          {loading ? (
            <div className="animate-shimmer h-16 rounded-[var(--radius-md)]" />
          ) : user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center text-[13px] font-bold text-white ring-2 ring-[var(--color-border)]">
                  {user.displayName?.[0] || user.email?.[0] || "U"}
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[var(--color-text-primary)]">
                    {user.displayName || "NOVA-SYNC Operator"}
                  </p>
                  <p className="text-[12px] text-[var(--color-text-tertiary)]">
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
              <p className="text-[13px] text-[var(--color-text-secondary)]">
                Not signed in
              </p>
              <Button variant="primary" size="sm" onClick={signIn}>
                Sign In with Google
              </Button>
            </div>
          )}
        </div>

        {/* System Configuration */}
        <div className="rounded-[var(--radius-xl)] glass bg-[var(--color-surface)]/20 p-6 animate-fade-in-up stagger-2">
          <h2 className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
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
                  <p className="text-[12px] font-medium text-[var(--color-text-tertiary)]">
                    {item.label}
                  </p>
                  <p className="text-[13px] font-semibold text-[var(--color-text-primary)] font-mono truncate">
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

        {/* About */}
        <div className="rounded-[var(--radius-xl)] glass bg-[var(--color-surface)]/20 p-6 animate-fade-in-up stagger-3">
          <h2 className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-3">
            About NOVA-SYNC
          </h2>
          <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed mb-4">
            NOVA-SYNC is a 7-stage multi-modal AI pipeline for reconstructing
            cloud-occluded ISRO LISS-IV satellite imagery using SAR fusion,
            phenological priors, and latent diffusion models. Designed for
            operational continuity in Earth observation.
          </p>
          <div className="flex flex-wrap gap-2 text-[11px]">
            {["PyTorch", "FastAPI", "Next.js", "CLIP", "Diffusion Models", "ChromaDB"].map(
              (tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 rounded-[var(--radius-full)] bg-[var(--color-surface-elevated)] text-[var(--color-text-tertiary)] border border-[var(--color-border)] font-medium"
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
