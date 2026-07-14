"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  User,
  KeyRound,
  ArrowRight,
  Satellite,
  Globe,
  Lock,
  Fingerprint,
  Eye,
  Radio,
  Zap,
  Scan,
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAppStore();
  const [loading, setLoading] = useState<"user" | "admin" | null>(null);
  const [activeTab, setActiveTab] = useState<"user" | "admin">("user");
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);

  const handleLogin = (role: "user" | "admin") => {
    if (loading) return;
    setLoading(role);
  };

  useEffect(() => {
    if (!loading) return;
    const lines =
      loading === "admin"
        ? [
            "> Authenticating admin credentials...",
            "> Verifying biometric signature...",
            "> Decrypting AES-256 access token...",
            "> Granting ADMIN clearance...",
            "> Connecting to SOS HQ live feed...",
            "> Access GRANTED. Welcome, Commander.",
          ]
        : [
            "> Authenticating user credentials...",
            "> Verifying session token...",
            "> Loading satellite data modules...",
            "> Establishing encrypted channel...",
            "> Access GRANTED. Welcome aboard.",
          ];
    setShowTerminal(true);
    setTerminalLines([]);
    lines.forEach((line, i) => {
      setTimeout(() => setTerminalLines((prev) => [...prev, line]), i * 350);
    });
    setTimeout(() => {
      login(loading);
      router.push("/dashboard");
    }, lines.length * 350 + 300);
  }, [loading, login, router]);

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col lg:flex-row overflow-hidden">

      {/* ==================== LEFT SIDE — Branding ==================== */}
      <div className="relative flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-12 lg:py-0 overflow-hidden">

        {/* Background Image (only on left) */}
        <div className="absolute inset-0 z-0">
          <img
            src="/login-bg.png"
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 z-[1] opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-lg">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-10"
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.15)]">
                <Satellite size={26} className="text-cyan-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">NOVA-SYNC</h2>
              <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-400/60">
                Satellite Intelligence
              </p>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Mission{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Control
              </span>
              <br />
              <span className="text-white">Center</span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-slate-400 text-base leading-relaxed mb-10 max-w-md"
          >
            Secure gateway to India&apos;s next-generation satellite imagery
            analysis platform. Access real-time geospatial intelligence,
            disaster monitoring, and emergency response systems.
          </motion.p>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-wrap gap-3"
          >
            {[
              { icon: <Globe size={14} />, text: "SAR Processing" },
              { icon: <Radio size={14} />, text: "Live Monitoring" },
              { icon: <Lock size={14} />, text: "AES-256 Encrypted" },
              { icon: <Zap size={14} />, text: "AI-Powered" },
            ].map((pill) => (
              <div
                key={pill.text}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-slate-300 text-xs backdrop-blur-sm"
              >
                <span className="text-cyan-400">{pill.icon}</span>
                {pill.text}
              </div>
            ))}
          </motion.div>

          {/* Bottom Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16 flex items-center gap-4 text-[11px] text-slate-600 font-mono"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM ONLINE
            </span>
            <span>•</span>
            <span>ENCRYPTION: ACTIVE</span>
          </motion.div>
        </div>
      </div>

      {/* ==================== RIGHT SIDE — Login Panel ==================== */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full lg:w-[520px] xl:w-[560px] flex-shrink-0 relative"
      >
        {/* Glass panel that fills the full height */}
        <div className="h-full bg-white/[0.03] backdrop-blur-2xl border-l border-white/[0.08] flex flex-col justify-center px-8 md:px-14 py-12 relative overflow-hidden">

          {/* Top glow line */}
          <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

          {/* Subtle vertical glow on left edge */}
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent" />

          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center">
                <Fingerprint size={30} className="text-cyan-400" />
              </div>
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-cyan-400/20"
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-1">
              Secure Access
            </h2>
            <p className="text-slate-500 text-sm">
              Select your clearance level to proceed
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06] mb-6">
            {(["user", "admin"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2",
                  activeTab === tab
                    ? "bg-white/10 text-white shadow-sm border border-white/10"
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                {tab === "user" ? <User size={15} /> : <Shield size={15} />}
                {tab === "user" ? "User" : "Admin"}
              </button>
            ))}
          </div>

          {/* Login Form */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Email */}
              <div>
                <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-2 block font-medium">
                  {activeTab === "admin" ? "Admin ID" : "Email"}
                </label>
                <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] focus-within:border-cyan-400/30 transition-colors">
                  <User size={16} className="text-slate-500 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder={activeTab === "admin" ? "admin@nova-sync.isro" : "user@nova-sync.isro"}
                    defaultValue={activeTab === "admin" ? "admin@nova-sync.isro" : "user@nova-sync.isro"}
                    className="bg-transparent text-sm text-white placeholder:text-slate-600 outline-none w-full"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-2 block font-medium">
                  Password
                </label>
                <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] focus-within:border-cyan-400/30 transition-colors">
                  <Lock size={16} className="text-slate-500 flex-shrink-0" />
                  <input
                    type="password"
                    defaultValue="novasync2025"
                    className="bg-transparent text-sm text-white placeholder:text-slate-600 outline-none w-full"
                  />
                  <Eye size={16} className="text-slate-600 cursor-pointer hover:text-slate-400 transition-colors flex-shrink-0" />
                </div>
              </div>

              {/* Role Info */}
              <div
                className={cn(
                  "rounded-xl p-4 border text-xs",
                  activeTab === "admin"
                    ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400/80"
                    : "bg-cyan-500/5 border-cyan-500/10 text-cyan-400/80"
                )}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Scan size={12} />
                  <span className="font-semibold uppercase tracking-wider text-[10px]">
                    {activeTab === "admin" ? "Level-5 Clearance" : "Level-2 Clearance"}
                  </span>
                </div>
                <span className="text-slate-500 text-[11px] leading-relaxed">
                  {activeTab === "admin"
                    ? "Full access to SOS HQ, live monitoring feed, and all satellite processing modules."
                    : "Access to satellite imagery processing, analysis history, and safe-route navigation."}
                </span>
              </div>

              {/* Login Button */}
              <button
                onClick={() => handleLogin(activeTab)}
                disabled={loading !== null}
                className={cn(
                  "w-full group flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-sm transition-all duration-300",
                  activeTab === "admin"
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black shadow-[0_0_30px_rgba(52,211,153,0.15)]"
                    : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-[0_0_30px_rgba(34,211,238,0.15)]",
                  loading && "opacity-70 cursor-not-allowed"
                )}
              >
                {loading === activeTab ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <KeyRound size={16} />
                    {activeTab === "admin" ? "Access as Administrator" : "Access as Standard User"}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.div>
          </AnimatePresence>

          {/* Terminal Overlay */}
          <AnimatePresence>
            {showTerminal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/95 backdrop-blur-lg z-20 flex flex-col p-8"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-3 text-xs text-slate-500 font-mono">
                    nova-sync-auth v2.1
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-center font-mono text-sm space-y-3">
                  {terminalLines.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "text-emerald-400/80",
                        i === terminalLines.length - 1 &&
                          line.includes("GRANTED") &&
                          "text-cyan-400 font-bold"
                      )}
                    >
                      {line}
                      {i === terminalLines.length - 1 && (
                        <motion.span
                          className="inline-block w-2 h-4 bg-cyan-400 ml-1 align-middle"
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/[0.04] text-center">
            <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em]">
              NOVA-SYNC Authentication Protocol · AES-256 · v2.1
            </p>
            <p className="text-[10px] text-slate-700 mt-1">
              © 2025 ISRO × NOVA-SYNC
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
