"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  User,
  KeyRound,
  ArrowRight,
  Fingerprint,
  Eye,
  Command,
  Zap,
  Lock,
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { cn } from "@/lib/utils";

// Particle animation for the background
const Particles = () => {
  const particles = Array.from({ length: 40 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-500/20 rounded-full"
          initial={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            scale: Math.random() * 2,
          }}
          animate={{
            y: [`${Math.random() * 100}vh`, `${Math.random() * -20}vh`],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

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
            "INITIATING SECURE HANDSHAKE...",
            "VERIFYING BIOMETRIC SIGNATURE [LEVEL 5]...",
            "DECRYPTING AES-256 ACCESS TOKEN...",
            "CONNECTING TO SOS COMMAND CENTER...",
            "ACCESS GRANTED. WELCOME, COMMANDER.",
          ]
        : [
            "INITIATING SECURE HANDSHAKE...",
            "VERIFYING SESSION TOKEN [LEVEL 2]...",
            "LOADING SATELLITE MODULES...",
            "ESTABLISHING ENCRYPTED CHANNEL...",
            "ACCESS GRANTED. WELCOME.",
          ];

    setShowTerminal(true);
    setTerminalLines([]);
    lines.forEach((line, i) => {
      setTimeout(() => setTerminalLines((prev) => [...prev, line]), i * 400);
    });
    setTimeout(() => {
      login(loading);
      router.push("/dashboard");
    }, lines.length * 400 + 400);
  }, [loading, login, router]);

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans">
      
      {/* --- PREMIUM BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        {/* Animated gradient mesh */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-800/20 blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
        
        {/* Subtle grid */}
        <div 
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
          style={{
            backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        />
        
        <Particles />
      </div>

      {/* --- CENTRAL GLASS CARD --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-6xl h-[700px] rounded-[2rem] border border-white/[0.08] bg-white/[0.01] backdrop-blur-3xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col md:flex-row"
      >
        {/* Shine effect on card edge */}
        <div className="absolute inset-0 border border-white/[0.05] rounded-[2rem] pointer-events-none mix-blend-overlay" />

        {/* LEFT PANEL: Cinematic Image */}
        <div className="hidden md:block relative w-[45%] h-full bg-black">
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-transparent to-[#020617]" />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
          <img 
            src="/login-premium.png" 
            alt="Satellite Orbit"
            className="w-full h-full object-cover opacity-90 scale-105"
          />
          
          {/* Overlay details on image */}
          <div className="absolute bottom-12 left-12 z-20">
            <div className="flex items-center gap-3 mb-4">
              <Command className="text-cyan-400" size={24} />
              <h2 className="text-2xl font-bold tracking-widest text-white">NOVA-SYNC</h2>
            </div>
            <p className="text-slate-400 text-sm max-w-xs font-light leading-relaxed">
              Global Satellite Intelligence & Emergency Command Protocol. Authorized personnel only.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: Login Form */}
        <div className="w-full md:w-[55%] h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 relative bg-gradient-to-l from-white/[0.02] to-transparent">
          
          <div className="w-full max-w-sm mx-auto">
            {/* Header */}
            <div className="mb-10 text-center md:text-left">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center justify-center p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-6"
              >
                <Fingerprint size={28} className="text-cyan-400" />
              </motion.div>
              <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Welcome Back</h1>
              <p className="text-slate-400 text-sm">Please verify your credentials to access the terminal.</p>
            </div>

            {/* Tab Selector */}
            <div className="flex p-1 rounded-xl bg-white/[0.03] border border-white/[0.05] mb-8 relative">
              {/* Animated active background */}
              <div 
                className={cn(
                  "absolute inset-y-1 w-[calc(50%-4px)] bg-white/10 rounded-lg shadow-sm transition-all duration-300 ease-out",
                  activeTab === "admin" ? "translate-x-full left-0 ml-1" : "left-1"
                )}
              />
              
              {(["user", "admin"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "relative z-10 flex-1 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2",
                    activeTab === tab ? "text-white" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  {tab === "user" ? <User size={16} /> : <Shield size={16} />}
                  <span className="capitalize">{tab}</span>
                </button>
              ))}
            </div>

            {/* Form */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {/* Email Input */}
                <div className="group">
                  <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[#09090b] border border-white/10 group-focus-within:border-cyan-500/50 group-focus-within:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all">
                    <User size={18} className="text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="text"
                      placeholder={activeTab === "admin" ? "admin@nova-sync.gov" : "analyst@nova-sync.gov"}
                      defaultValue={activeTab === "admin" ? "admin@nova-sync.gov" : "analyst@nova-sync.gov"}
                      className="bg-transparent text-sm text-white placeholder:text-slate-600 outline-none w-full"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="group">
                  <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[#09090b] border border-white/10 group-focus-within:border-cyan-500/50 group-focus-within:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all">
                    <Lock size={18} className="text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="password"
                      defaultValue="••••••••••••"
                      className="bg-transparent text-sm text-white placeholder:text-slate-600 outline-none w-full"
                    />
                    <Eye size={18} className="text-slate-600 cursor-pointer hover:text-slate-300 transition-colors" />
                  </div>
                </div>

                {/* Login Button */}
                <button
                  onClick={() => handleLogin(activeTab)}
                  disabled={loading !== null}
                  className="relative w-full overflow-hidden rounded-xl group mt-4"
                >
                  <div className={cn(
                    "absolute inset-0 transition-transform duration-500",
                    activeTab === "admin" 
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-400 group-hover:scale-[1.02]"
                      : "bg-gradient-to-r from-blue-600 to-cyan-400 group-hover:scale-[1.02]"
                  )} />
                  <div className="relative px-4 py-4 flex items-center justify-center gap-2 text-white font-semibold text-sm shadow-xl">
                    {loading === activeTab ? (
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Authenticating...</span>
                      </div>
                    ) : (
                      <>
                        <KeyRound size={18} />
                        <span>Authenticate</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </motion.div>
            </AnimatePresence>

          </div>
        </div>

        {/* --- TERMINAL OVERLAY --- */}
        <AnimatePresence>
          {showTerminal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-[#020617]/95 backdrop-blur-2xl z-50 flex flex-col p-10 md:p-20"
            >
              <div className="max-w-2xl w-full mx-auto flex flex-col h-full justify-center">
                <div className="flex items-center gap-2 mb-10 opacity-50">
                  <Zap size={20} className="text-cyan-400" />
                  <span className="text-sm font-mono text-cyan-400 tracking-[0.2em]">NOVA-SYNC KERNEL</span>
                </div>
                
                <div className="space-y-4 font-mono text-sm md:text-base">
                  {terminalLines.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "text-slate-400 tracking-wider",
                        line.includes("GRANTED") && "text-emerald-400 font-bold"
                      )}
                    >
                      {line}
                      {i === terminalLines.length - 1 && (
                        <motion.span
                          className="inline-block w-2.5 h-5 bg-emerald-400 ml-2 align-middle"
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer text outside the card */}
      <div className="absolute bottom-6 w-full text-center text-slate-500 text-[10px] font-mono uppercase tracking-[0.3em] z-0">
        ISRO Secure Network • Restricted Access
      </div>

    </div>
  );
}
