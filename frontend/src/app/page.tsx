"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, 
  ChevronDown, 
  Layers, 
  Eye, 
  Leaf, 
  Radar, 
  Brain, 
  Sun, 
  BarChart3 
} from "lucide-react";
import { cn } from "@/lib/utils";

const RealisticSatellite = () => (
  <svg width="240" height="140" viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]">
    {}
    <rect x="0" y="50" width="90" height="40" fill="#0A192F" stroke="#64FFDA" strokeWidth="1.5" />
    <path d="M 22.5 50 V 90 M 45 50 V 90 M 67.5 50 V 90 M 0 70 H 90" stroke="#64FFDA" strokeWidth="0.75" opacity="0.6" />

    {}
    <rect x="150" y="50" width="90" height="40" fill="#0A192F" stroke="#64FFDA" strokeWidth="1.5" />
    <path d="M 172.5 50 V 90 M 195 50 V 90 M 217.5 50 V 90 M 150 70 H 240" stroke="#64FFDA" strokeWidth="0.75" opacity="0.6" />

    {}
    <rect x="90" y="65" width="10" height="10" fill="#475569" />
    <rect x="140" y="65" width="10" height="10" fill="#475569" />

    {}
    <rect x="100" y="20" width="40" height="100" fill="#D4AF37" rx="4" />
    <rect x="100" y="20" width="40" height="100" fill="url(#foil)" opacity="0.4" rx="4" />

    {}
    <rect x="105" y="30" width="30" height="20" fill="#1E293B" rx="2" />
    <rect x="105" y="90" width="30" height="20" fill="#1E293B" rx="2" />

    {}
    <circle cx="120" cy="70" r="16" fill="#0F172A" stroke="#334155" strokeWidth="4" />
    {}
    <circle cx="120" cy="70" r="6" fill="#00D4FF" className="animate-pulse" style={{ filter: "drop-shadow(0 0 8px #00D4FF)" }} />

    {}
    <path d="M 120 20 L 120 0 M 115 5 L 125 5 M 110 10 L 130 10" stroke="#94A3B8" strokeWidth="2" />

    <defs>
      <pattern id="foil" width="8" height="8" patternUnits="userSpaceOnUse">
        <path d="M0,0 L8,8 M8,0 L0,8" stroke="#B8860B" strokeWidth="0.5" />
      </pattern>
    </defs>
  </svg>
);

const pipelineStages = [
  { icon: <Layers size={24} />, name: "Spectral Adapter", desc: "3-band → 13-band mapping" },
  { icon: <Eye size={24} />, name: "Cloud Classifier", desc: "ResNet-18 cloud routing" },
  { icon: <Leaf size={24} />, name: "Phenology Prior", desc: "Kharif/Rabi/Zaid temporal encoding" },
  { icon: <Radar size={24} />, name: "SAR Fusion", desc: "Cross-attention diffusion with Sentinel-1" },
  { icon: <Brain size={24} />, name: "Uncertainty Map", desc: "MC Dropout confidence gating" },
  { icon: <Sun size={24} />, name: "Shadow Removal", desc: "Gamma spectral correction" },
  { icon: <BarChart3 size={24} />, name: "Physics Validator", desc: "NDVI/NDWI hard physics bounds check" },
];

export default function LandingPage() {
  const [introStage, setIntroStage] = useState<0 | 1 | 2 | 3>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {

    const t1 = setTimeout(() => setIntroStage(1), 1200);
    const t2 = setTimeout(() => setIntroStage(2), 2400);
    const t3 = setTimeout(() => setIntroStage(3), 4000); 

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="bg-[#000000] text-white min-h-[350vh]" ref={containerRef}>

      {}
      <AnimatePresence>
        {introStage < 3 && (
          <motion.div
            key="cinematic-intro"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden pointer-events-none"
          >
            {}
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/5/13/23')",
                filter: "brightness(0.6) contrast(1.2)"
              }}
            />

            {}
            <motion.div
              initial={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
              animate={
                introStage >= 2
                  ? { filter: "blur(40px)", opacity: 0, scale: 2 }
                  : { filter: "blur(0px)", opacity: 1, scale: 1 }
              }
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 z-10 pointer-events-none"
            >
              {}
              <div 
                className="absolute inset-0 opacity-90"
                style={{
                  backgroundImage: "url('https://www.transparenttextures.com/patterns/clouds.png'), radial-gradient(circle at center, #ffffff 0%, #a0aec0 40%, transparent 80%)",
                  backgroundSize: "cover, 150% 150%",
                  backgroundPosition: "center",
                  mixBlendMode: "screen",
                  filter: "contrast(1.5) blur(2px)"
                }}
              />
              <div 
                className="absolute inset-0 opacity-70"
                style={{
                  backgroundImage: "url('https://www.transparenttextures.com/patterns/clouds.png')",
                  backgroundSize: "200%",
                  animation: "float 20s linear infinite",
                  mixBlendMode: "screen",
                }}
              />
            </motion.div>

            {}
            <div className="relative w-full h-full flex flex-col items-center z-20">

              {}
              <motion.div
                initial={{ y: -200, opacity: 0, scale: 0.8 }}
                animate={{ y: 150, opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, type: "spring", bounce: 0.2 }}
                className="relative flex flex-col items-center"
              >
                <RealisticSatellite />

                {}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={
                    introStage === 1
                      ? { height: "100vh", opacity: 1 }
                      : introStage >= 2
                      ? { height: "100vh", opacity: 0 }
                      : { height: 0, opacity: 0 }
                  }
                  transition={{ duration: 0.3 }}
                  className="absolute top-[100px] w-6 bg-[#00D4FF] rounded-b-full mix-blend-screen"
                  style={{
                    boxShadow: "0 0 80px 30px rgba(0, 212, 255, 0.9), 0 0 20px 5px #ffffff",
                  }}
                />
              </motion.div>
            </div>

            {}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={introStage >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8 }}
              className="absolute z-30 text-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white drop-shadow-[0_0_40px_rgba(0,0,0,0.8)]">
                NOVA-SYNC
              </h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <div className={cn("relative z-10 transition-opacity duration-1000 w-full", introStage === 3 ? "opacity-100" : "opacity-0")}>

        {}
        <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
          {}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20 [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]"
            style={{
              backgroundImage: "url('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/5/13/23')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#000000] z-0" />

          <div className="relative z-10 text-center max-w-5xl mx-auto space-y-8 mt-20">
            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Atmospheric Intelligence <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00D4FF] to-[#0066FF]">
                Redefined.
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-[var(--color-text-secondary)] max-w-3xl mx-auto leading-relaxed">
              Optical satellites are blinded by clouds during critical disasters. NOVA-SYNC uses physics-constrained AI and SAR fusion to reconstruct the ground truth with zero hallucinations.
            </p>

            <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                href="/dashboard"
                className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#00D4FF] text-black font-bold text-lg rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_0_30px_rgba(0,212,255,0.4)]"
              >
                <span className="relative z-10">Initialize Engine</span>
                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center text-[var(--color-text-tertiary)] z-10">
            <span className="text-[10px] tracking-widest uppercase mb-2">Discover Pipeline</span>
            <ChevronDown size={24} />
          </div>
        </section>

        {}
        <section className="relative px-6 py-24 max-w-6xl mx-auto border-t border-[#112240]">

          {}
          <div className="text-center max-w-3xl mx-auto mb-32">
            <h3 className="text-[12px] text-[#00D4FF] tracking-[0.3em] font-bold uppercase mb-4">About The Mission</h3>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why NOVA-SYNC?</h2>
            <p className="text-lg text-[#A1A1AA] leading-relaxed">
              During the devastating Assam floods, rescue operations were severely delayed because optical satellites (like ISRO's LISS-IV) couldn't see through the dense monsoon cloud cover. Lives were lost waiting for clear skies. NOVA-SYNC solves this "blindspot" by fusing multi-spectral optical data with cloud-penetrating SAR (radar) data, creating a real-time, cloud-free view of the Earth when it matters most.
            </p>
          </div>

          {}
          <div className="relative">
            <div className="text-center mb-16">
              <h3 className="text-[12px] text-[#00D4FF] tracking-[0.3em] font-bold uppercase mb-4">The Architecture</h3>
              <h2 className="text-3xl md:text-5xl font-bold">7-Stage AI Pipeline</h2>
            </div>

            {}
            <div className="absolute left-[24px] md:left-1/2 top-[150px] bottom-0 w-[2px] bg-[#112240] -translate-x-1/2 z-0" />

            {}
            <motion.div 
              className="absolute left-[24px] md:left-1/2 top-[150px] w-[2px] bg-gradient-to-b from-[#00D4FF] to-transparent -translate-x-1/2 z-10 shadow-[0_0_15px_#00D4FF]" 
              style={{ height: useTransform(scrollYProgress, [0.3, 0.9], ["0%", "100%"]) }}
            />

            <div className="space-y-24 relative z-20">
              {pipelineStages.map((stage, idx) => {

                const start = 0.3 + (idx * 0.08);
                const end = start + 0.1;

                const nodeOpacity = useTransform(scrollYProgress, [start, end], [0.3, 1]);

                const nodeScale = useTransform(scrollYProgress, [start, end], [0.8, 1]);

                const glowOpacity = useTransform(scrollYProgress, [start, end], [0, 1]);

                const isEven = idx % 2 === 0;

                return (
                  <motion.div 
                    key={stage.name}
                    style={{ opacity: nodeOpacity, scale: nodeScale }}
                    className={cn(
                      "flex items-center gap-8 md:gap-16 relative",
                      "flex-row", 
                      isEven ? "md:flex-row" : "md:flex-row-reverse" 
                    )}
                  >
                    {}
                    <div className="absolute left-[24px] md:left-1/2 -translate-x-1/2 w-12 h-12 bg-[#040914] border-2 border-[#1E3A8A] rounded-full flex items-center justify-center shrink-0 z-20 transition-colors">
                      <motion.div style={{ opacity: glowOpacity }} className="absolute inset-0 rounded-full shadow-[0_0_20px_#00D4FF] bg-[#00D4FF]/20" />
                      <div className="text-[#00D4FF] z-10">
                        {stage.icon}
                      </div>
                    </div>

                    {}
                    <div className={cn(
                      "w-full md:w-1/2 pt-2 pb-2 pl-20 md:pl-0",
                      isEven ? "md:pr-16 md:text-right" : "md:pl-16 md:text-left"
                    )}>
                      <div className="bg-[#040914] border border-[#112240] p-6 rounded-2xl shadow-xl hover:border-[#1E3A8A] transition-colors relative overflow-hidden group">
                        <motion.div style={{ opacity: glowOpacity }} className="absolute inset-0 bg-gradient-to-r from-[#00D4FF]/5 to-transparent pointer-events-none" />
                        <span className="text-[10px] font-bold text-[#00D4FF] tracking-widest uppercase mb-2 block">
                          Stage 0{idx + 1}
                        </span>
                        <h4 className="text-2xl font-bold text-white mb-2">{stage.name}</h4>
                        <p className="text-[#A1A1AA]">{stage.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {}
        <section className="py-32 text-center border-t border-[#112240]">
           <h2 className="text-4xl md:text-5xl font-bold mb-8">Experience the Future of Earth Observation</h2>
           <Link 
              href="/dashboard"
              className="inline-flex items-center justify-center gap-3 px-12 py-6 border-2 border-[#00D4FF] text-[#00D4FF] hover:bg-[#00D4FF] hover:text-black font-bold text-xl rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(0,212,255,0.2)] hover:shadow-[0_0_60px_rgba(0,212,255,0.5)]"
            >
              Access Dashboard
            </Link>
        </section>

      </div>
    </div>
  );
}
