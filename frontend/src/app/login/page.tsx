"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, User, KeyRound, ArrowRight } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAppStore();
  const [loading, setLoading] = useState<"user" | "admin" | null>(null);

  const handleLogin = (role: "user" | "admin") => {
    setLoading(role);
    setTimeout(() => {
      login(role);
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="glass-elevated p-8 rounded-3xl relative overflow-hidden border border-cyan-400/20 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />

          <div className="relative z-10">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                <KeyRound size={28} className="text-cyan-400 animate-pulse" />
              </div>
            </div>

            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Secure Access</h1>
              <p className="text-slate-400 text-sm">Select your authorization level to proceed</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleLogin("user")}
                disabled={loading !== null}
                className={cn(
                  "w-full group flex items-center justify-between p-4 rounded-xl border transition-all duration-300",
                  "bg-black/50 border-white/10 hover:border-cyan-400/50 hover:bg-cyan-400/5"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <User size={20} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white">Standard User</div>
                    <div className="text-xs text-slate-400">Access analysis & processing</div>
                  </div>
                </div>
                {loading === "user" ? (
                  <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowRight size={18} className="text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                )}
              </button>

              <button
                onClick={() => handleLogin("admin")}
                disabled={loading !== null}
                className={cn(
                  "w-full group flex items-center justify-between p-4 rounded-xl border transition-all duration-300",
                  "bg-black/50 border-white/10 hover:border-emerald-400/50 hover:bg-emerald-400/5"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Shield size={20} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white">Administrator</div>
                    <div className="text-xs text-slate-400">Access SOS HQ & Live Data</div>
                  </div>
                </div>
                {loading === "admin" ? (
                  <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowRight size={18} className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                )}
              </button>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-[11px] text-slate-500 uppercase tracking-widest">NOVA-SYNC Authentication Protocol</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
