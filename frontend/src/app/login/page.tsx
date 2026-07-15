"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/appStore";
import { Mail, KeyRound, ArrowRight, Shield, Satellite, Home, Compass } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAppStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [role, setRole] = useState<"user" | "admin">("user");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      login(role);
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#1e2028] flex items-center justify-center font-sans overflow-hidden">
      
      {/* --- MAIN CARD (FULL SCREEN) --- */}
      <div className="relative w-full min-h-screen bg-[#1e2028] flex flex-col">
        
        {/* --- SVG WAVE & RIGHT BACKGROUND IMAGE --- */}
        <div className="absolute inset-0 pointer-events-none">
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 1200 750" 
            preserveAspectRatio="none"
            className="absolute inset-0"
          >
            <defs>
              <clipPath id="wave-clip">
                <path d="M 550 0 C 700 200, 450 350, 550 500 C 650 650, 500 750, 500 750 L 1200 750 L 1200 0 Z" />
              </clipPath>
              {/* Pattern for the image */}
              <pattern id="bg-img" patternUnits="userSpaceOnUse" width="1200" height="750">
                <image href="/login-ref-bg.png" x="0" y="0" width="1200" height="750" preserveAspectRatio="xMidYMid slice" opacity="0.3" />
              </pattern>
            </defs>
            
            {/* Filled background area with the image */}
            <rect width="1200" height="750" fill="url(#bg-img)" clipPath="url(#wave-clip)" />
            
            {/* Dashed line along the curve */}
            <path 
              d="M 550 0 C 700 200, 450 350, 550 500 C 650 650, 500 750, 500 750" 
              fill="none" 
              stroke="rgba(255,255,255,0.15)" 
              strokeWidth="1.5" 
              strokeDasharray="6 6" 
            />
          </svg>
        </div>

        {/* --- TOP NAVIGATION BAR --- */}
        <div className="absolute top-0 left-0 w-full p-10 flex items-center z-20">
          <div className="flex items-center gap-3 mr-16">
            <div className="w-5 h-5 rounded-full bg-[#1da1f2]" />
            <span className="text-white font-bold tracking-wide">NOVA-SYNC.</span>
          </div>
          <div className="hidden sm:flex items-center gap-8 text-[#8a8d98] font-medium text-sm">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/explore" className="hover:text-white transition-colors">Explore</Link>
          </div>
        </div>

        {/* --- BOTTOM RIGHT LOGO --- */}
        <div className="absolute bottom-10 right-10 z-20 opacity-80">
          <div className="flex items-center gap-1 text-white">
             {/* Creating a stylized logo similar to the "AW" in the reference */}
             <div className="flex items-end h-8">
               <div className="w-2.5 h-2.5 bg-white rounded-full mr-1" />
               <div className="w-1.5 h-8 bg-white rotate-[20deg] rounded-sm" />
               <div className="w-1.5 h-8 bg-white -rotate-[20deg] rounded-sm -ml-2" />
               <div className="w-1.5 h-6 bg-white rotate-[20deg] rounded-sm ml-1" />
             </div>
          </div>
        </div>

        {/* --- LEFT CONTENT (FORM) --- */}
        <div className="relative z-20 flex-1 flex flex-col justify-center px-10 sm:px-16 md:px-32 lg:px-40 w-full md:w-[60%] lg:w-[55%] pt-16">
          
          <p className="text-[#8a8d98] text-sm font-bold tracking-[0.2em] uppercase mb-4">
            Secure Access
          </p>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
            Mission Control<span className="text-[#1da1f2]">.</span>
          </h1>
          
          <div className="flex items-center gap-3 mb-12 text-lg">
            <span className="text-[#8a8d98]">Authorized Personnel Only?</span>
            <button 
              type="button"
              onClick={() => setRole(role === "user" ? "admin" : "user")}
              className="text-[#1da1f2] font-semibold hover:underline"
            >
              Switch to {role === "user" ? "Admin" : "User"}
            </button>
          </div>

          <form onSubmit={handleLogin} className="w-full max-w-[500px] space-y-6">
            


            {/* Email Input */}
            <div className="w-full bg-[#282a31] rounded-2xl px-6 py-4 border border-transparent focus-within:border-[#1da1f2] transition-colors group relative">
              <label className="block text-xs text-[#8a8d98] font-medium mb-1 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                defaultValue={role === "admin" ? "admin.hq@nova-sync.isro" : "analyst.op@nova-sync.isro"}
                className="w-full bg-transparent text-white text-lg outline-none"
                required
              />
              <Mail size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-[#8a8d98]" />
            </div>

            {/* Password Input */}
            <div className="w-full bg-[#282a31] rounded-2xl px-6 py-4 border border-[#1da1f2] shadow-[0_0_0_1px_rgba(29,161,242,0.3)] transition-colors group relative mt-4">
              <label className="block text-xs text-[#1da1f2] font-medium mb-1 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                defaultValue="••••••••••••"
                className="w-full bg-transparent text-white text-lg outline-none tracking-widest"
                required
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-[#8a8d98] flex items-center justify-center">
                <div className="w-2 h-2 bg-[#8a8d98] rounded-full" />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-5 pt-8">

              <button
                type="submit"
                disabled={loading}
                className="px-10 py-4 rounded-full bg-[#1da1f2] text-white text-base font-semibold hover:bg-[#1a91db] transition-colors shadow-[0_4px_14px_rgba(29,161,242,0.3)] flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Authenticating..." : "Authenticate"}
              </button>
            </div>
            
          </form>
        </div>

      </div>
    </div>
  );
}
