"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, 
  Layers, 
  Eye, 
  Leaf, 
  Radar, 
  Brain, 
  Sun, 
  BarChart3,
  Rocket
} from "lucide-react";
import { cn } from "@/lib/utils";

const pipelineStages = [
  { icon: <Layers size={20} />, name: "Spectral Adapter", desc: "3-band → 13-band mapping", colSpan: "col-span-12 md:col-span-8", color: "from-blue-500/20 to-purple-500/20" },
  { icon: <Eye size={20} />, name: "Cloud Classifier", desc: "ResNet-18 cloud routing", colSpan: "col-span-12 md:col-span-4", color: "from-cyan-500/20 to-blue-500/20" },
  { icon: <Leaf size={20} />, name: "Phenology Prior", desc: "Temporal encoding", colSpan: "col-span-12 md:col-span-4", color: "from-emerald-500/20 to-teal-500/20" },
  { icon: <Radar size={20} />, name: "SAR Fusion", desc: "Cross-attention diffusion", colSpan: "col-span-12 md:col-span-8", color: "from-purple-500/20 to-pink-500/20" },
  { icon: <Brain size={20} />, name: "Uncertainty Map", desc: "MC Dropout gating", colSpan: "col-span-12 md:col-span-6", color: "from-orange-500/20 to-red-500/20" },
  { icon: <Sun size={20} />, name: "Shadow Removal", desc: "Gamma spectral correction", colSpan: "col-span-12 md:col-span-6", color: "from-yellow-500/20 to-orange-500/20" },
  { icon: <BarChart3 size={20} />, name: "Physics Validator", desc: "NDVI/NDWI bounds check", colSpan: "col-span-12", color: "from-slate-500/20 to-slate-400/20" },
];

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);

  return (
    <div className="bg-black text-white min-h-[250vh]" ref={containerRef}>
      
      {/* --- HERO SECTION --- */}
      <section className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* Cinematic Video Background */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-60 scale-105"
          >
            <source src="/cinematic-bg.mp4" type="video/mp4" />
          </video>
          {/* Gradients to blend video into black background */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
        </div>

        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="relative z-10 flex flex-col items-center text-center px-4 max-w-6xl w-full"
        >
          {/* Premium Tagline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-[11px] font-medium tracking-widest uppercase text-slate-300">Space-Tech Intelligence</span>
          </motion.div>

          {/* Huge Typography */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, type: "spring" }}
            className="text-6xl md:text-8xl lg:text-[140px] font-black tracking-tighter leading-[0.9] mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 drop-shadow-2xl"
          >
            NOVA-SYNC
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg md:text-2xl text-slate-400 max-w-3xl mb-12 font-light leading-relaxed"
          >
            Redefining earth observation through physics-constrained AI and multi-spectral SAR fusion. No clouds. No blindspots.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link 
              href="/dashboard"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-widest rounded-full overflow-hidden transition-transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 group-hover:text-white transition-colors">Launch Platform</span>
              <ArrowRight size={18} className="relative z-10 group-hover:text-white transition-colors group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* --- FEATURES GRID (BENTO BOX) --- */}
      <section className="relative z-20 bg-black pt-32 pb-48 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-20">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">7-Stage</span> Pipeline
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl">
              A deeply integrated neural architecture designed to reconstruct ground truth with zero hallucinations.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-4 md:gap-6">
            {pipelineStages.map((stage, idx) => (
              <motion.div
                key={stage.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: idx * 0.1, type: "spring", bounce: 0.2 }}
                className={cn(
                  "relative group overflow-hidden rounded-3xl p-8 border border-white/5 bg-[#050505] hover:bg-[#0A0A0A] transition-colors duration-500",
                  stage.colSpan
                )}
              >
                {/* Background Gradient Hover Effect */}
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br pointer-events-none",
                  stage.color
                )} />
                
                <div className="relative z-10 flex flex-col h-full justify-between min-h-[160px]">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-500">
                    {stage.icon}
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{stage.name}</h3>
                    <p className="text-slate-400 font-medium">{stage.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="relative z-20 bg-black pb-32 px-4 border-t border-white/5 pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-elevated p-12 md:p-20 rounded-[3rem] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />
            
            <Rocket size={48} className="mx-auto text-cyan-400 mb-8" />
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Ready for deployment.</h2>
            <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
              Experience the highest fidelity earth observation AI right in your browser.
            </p>
            
            <Link 
              href="/dashboard"
              className="inline-flex items-center justify-center px-10 py-5 bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-sm uppercase tracking-widest rounded-full transition-colors shadow-[0_0_40px_rgba(34,211,238,0.3)]"
            >
              Access Dashboard
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
