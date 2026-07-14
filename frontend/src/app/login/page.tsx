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
  Scan,
  Eye,
  ChevronRight,
  Radio,
  Zap,
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { cn } from "@/lib/utils";

// Floating particle component
function Particle({ delay, x, y }: { delay: number; x: number; y: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
      initial={{ opacity: 0, x: `${x}%`, y: `${y}%` }}
      animate={{
        opacity: [0, 0.6, 0],
        y: [`${y}%`, `${y - 20}%`],
        x: [`${x}%`, `${x + (Math.random() - 0.5) * 10}%`],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

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

  // Terminal animation on login
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
      setTimeout(() => {
        setTerminalLines((prev) => [...prev, line]);
      }, i * 350);
    });

    setTimeout(
      () => {
        login(loading);
        router.push("/dashboard");
      },
      lines.length * 350 + 300
    );
  }, [loading, login, router]);

  // Generate particles
  const particles = Array.from({ length: 30 }, (_, i) => ({
    delay: Math.random() * 5,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
      {/* Cinematic Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/login-bg.png" 
          alt="" 
          className="w-full h-full object-cover opacity-40"
        />
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
      </div>

      {/* Animated Grid Background */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating Particles */}
      {particles.map((p, i) => (
        <Particle key={i} {...p} />
      ))}

      {/* Orbital Ring SVGs */}
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] opacity-[0.04] animate-spin"
        style={{ animationDuration: "60s" }}
        viewBox="0 0 400 400"
      >
        <circle
          cx="200"
          cy="200"
          r="180"
          fill="none"
          stroke="cyan"
          strokeWidth="0.5"
          strokeDasharray="4 8"
        />
        <circle
          cx="200"
          cy="200"
          r="140"
          fill="none"
          stroke="cyan"
          strokeWidth="0.3"
          strokeDasharray="2 12"
        />
      </svg>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        {/* LEFT SIDE - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-center lg:text-left"
        >
          {/* Logo */}
          <div className="flex items-center gap-4 justify-center lg:justify-start mb-8">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.15)]">
                <Satellite size={26} className="text-cyan-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                NOVA-SYNC
              </h2>
              <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-400/60">
                Satellite Intelligence
              </p>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            <span className="text-white">Mission</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Control Center
            </span>
          </h1>

          <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto lg:mx-0 leading-relaxed mb-8">
            Secure gateway to India&apos;s next-generation satellite imagery
            analysis platform. Authenticate to access real-time geospatial
            intelligence, disaster monitoring, and emergency response systems.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            {[
              { icon: <Globe size={14} />, text: "SAR Processing" },
              { icon: <Radio size={14} />, text: "Live Monitoring" },
              { icon: <Lock size={14} />, text: "AES-256 Encrypted" },
              { icon: <Zap size={14} />, text: "AI-Powered" },
            ].map((pill) => (
              <div
                key={pill.text}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.02] text-slate-400 text-xs"
              >
                <span className="text-cyan-400/60">{pill.icon}</span>
                {pill.text}
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT SIDE - Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md flex-shrink-0"
        >
          <div className="relative rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-8 shadow-[0_0_80px_rgba(0,0,0,0.6)]">
            {/* Card header glow line */}
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-black/80 border border-white/10 flex items-center justify-center">
                  <Fingerprint size={30} className="text-cyan-400" />
                </div>
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-cyan-400/20"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
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
            <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/5 mb-6">
              {(["user", "admin"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2",
                    activeTab === tab
                      ? "bg-white/10 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  {tab === "user" ? (
                    <User size={15} />
                  ) : (
                    <Shield size={15} />
                  )}
                  {tab === "user" ? "User" : "Admin"}
                </button>
              ))}
            </div>

            {/* Login Form Area */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* Fake Input Fields for Premium Look */}
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">
                    {activeTab === "admin" ? "Admin ID" : "Email"}
                  </label>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 focus-within:border-cyan-400/30 transition-colors">
                    <User size={16} className="text-slate-500" />
                    <input
                      type="text"
                      placeholder={
                        activeTab === "admin"
                          ? "admin@nova-sync.isro"
                          : "user@nova-sync.isro"
                      }
                      className="bg-transparent text-sm text-white placeholder:text-slate-600 outline-none w-full"
                      defaultValue={
                        activeTab === "admin"
                          ? "admin@nova-sync.isro"
                          : "user@nova-sync.isro"
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">
                    Password
                  </label>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 focus-within:border-cyan-400/30 transition-colors">
                    <Lock size={16} className="text-slate-500" />
                    <input
                      type="password"
                      placeholder="••••••••••"
                      defaultValue="novasync2025"
                      className="bg-transparent text-sm text-white placeholder:text-slate-600 outline-none w-full"
                    />
                    <Eye
                      size={16}
                      className="text-slate-600 cursor-pointer hover:text-slate-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Role info badge */}
                <div
                  className={cn(
                    "rounded-xl p-3 border text-xs",
                    activeTab === "admin"
                      ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400/80"
                      : "bg-cyan-500/5 border-cyan-500/10 text-cyan-400/80"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Scan size={12} />
                    <span className="font-semibold uppercase tracking-wider text-[10px]">
                      {activeTab === "admin"
                        ? "Level-5 Clearance"
                        : "Level-2 Clearance"}
                    </span>
                  </div>
                  <span className="text-slate-500 text-[11px]">
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
                    "w-full group flex items-center justify-center gap-3 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300",
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
                      {activeTab === "admin"
                        ? "Access as Administrator"
                        : "Access as Standard User"}
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>
              </motion.div>
            </AnimatePresence>

            {/* Terminal Animation Overlay */}
            <AnimatePresence>
              {showTerminal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 rounded-3xl bg-black/95 backdrop-blur-lg z-20 flex flex-col p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="ml-3 text-xs text-slate-500 font-mono">
                      nova-sync-auth v2.1
                    </span>
                  </div>
                  <div className="flex-1 font-mono text-sm space-y-2 overflow-hidden">
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
            <div className="mt-6 pt-4 border-t border-white/5 text-center">
              <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em]">
                NOVA-SYNC Authentication Protocol · AES-256 · v2.1
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-slate-600 font-mono"
      >
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            SYSTEM ONLINE
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">ENCRYPTION: ACTIVE</span>
        </div>
        <span>© 2025 ISRO × NOVA-SYNC</span>
      </motion.div>
    </div>
  );
}
