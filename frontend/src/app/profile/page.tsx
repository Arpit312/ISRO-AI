"use client";

import { useAuth } from "@/hooks/useAuth";
import { useAppStore } from "@/store/appStore";
import { User, Mail, Shield, ShieldCheck, Clock } from "lucide-react";

export default function ProfilePage() {
  const { user, isConfigured } = useAuth();
  const { userRole } = useAppStore();

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[var(--color-text-primary)] tracking-tight">
          My Profile
        </h1>
        <p className="text-xl text-[var(--color-text-secondary)] mt-1">
          Manage your personal information and access levels.
        </p>
      </div>

      <div className="rounded-[var(--radius-xl)] glass bg-[var(--color-surface)]/20 p-8 animate-fade-in relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[var(--color-primary)]/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center text-4xl font-bold text-white ring-4 ring-[var(--color-border)] shadow-xl">
            {user?.displayName?.[0] || user?.email?.[0] || "U"}
          </div>
          
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">
              {user?.displayName || "NOVA-SYNC Operator"}
            </h2>
            <div className="flex items-center gap-2 text-[var(--color-text-secondary)] text-base mb-4">
              <Mail size={16} />
              {user?.email || "operator@novasync.isro.in"}
            </div>
            
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-full)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-sm font-semibold text-[var(--color-primary-light)]">
                <ShieldCheck size={14} />
                Verified Account
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-full)] bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-sm font-semibold text-[var(--color-text-secondary)]">
                <Shield size={14} />
                Role: {userRole === "admin" ? "Administrator" : "Standard Operator"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-[var(--radius-lg)] glass p-6 animate-fade-in stagger-1">
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <User size={18} />
            Personal Information
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-[var(--color-text-tertiary)] mb-1">Full Name</p>
              <p className="text-base text-[var(--color-text-primary)] font-medium bg-[var(--color-bg)]/50 px-4 py-2 rounded-md border border-[var(--color-border)]">
                {user?.displayName || "NOVA-SYNC Operator"}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-tertiary)] mb-1">Email Address</p>
              <p className="text-base text-[var(--color-text-primary)] font-medium bg-[var(--color-bg)]/50 px-4 py-2 rounded-md border border-[var(--color-border)]">
                {user?.email || "operator@novasync.isro.in"}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-tertiary)] mb-1">Unique Identifier</p>
              <p className="text-sm text-[var(--color-text-secondary)] font-mono bg-[var(--color-bg)]/50 px-4 py-2 rounded-md border border-[var(--color-border)]">
                {user?.uid || "mock-operator-001"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[var(--radius-lg)] glass p-6 animate-fade-in stagger-2">
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <Clock size={18} />
            Account Status
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-[var(--color-border-subtle)]">
              <span className="text-base text-[var(--color-text-secondary)]">Authentication</span>
              <span className="text-base font-medium text-[var(--color-text-primary)]">
                {isConfigured ? "Firebase OAuth" : "Local Mock Auth"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[var(--color-border-subtle)]">
              <span className="text-base text-[var(--color-text-secondary)]">Account Created</span>
              <span className="text-base font-medium text-[var(--color-text-primary)]">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[var(--color-border-subtle)]">
              <span className="text-base text-[var(--color-text-secondary)]">Last Login</span>
              <span className="text-base font-medium text-[var(--color-text-primary)]">
                Just now
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
