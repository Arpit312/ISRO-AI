"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, Play, Zap, Target, Cpu, type LucideIcon } from "lucide-react";
import Particles from "./Particles";
import MagneticButton from "@/components/effects/MagneticButton";
import { fadeInUp, fadeIn, staggerContainer } from "@/animations/variants";
import { useAnimatedCounter } from "@/hooks/useAnimations";

// Dynamic import for 3D Globe to avoid SSR issues with Three.js
const EarthGlobe = dynamic(() => import("./EarthGlobe"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 border-2 border-electric-blue/30 border-t-electric-blue rounded-full animate-spin" />
    </div>
  ),
});

// Animated stat component
function StatItem({
  value,
  suffix,
  label,
  icon: Icon,
}: {
  value: number;
  suffix: string;
  label: string;
  icon: LucideIcon;
}) {
  const { count, ref } = useAnimatedCounter({ end: value, duration: 2500 });
  return (
    <div ref={ref} className="flex items-center gap-[10px] group">
      <div className="p-2.5 rounded-xl bg-electric-blue/10 border border-electric-blue/20 group-hover:bg-electric-blue/15 transition-colors">
        <Icon className="w-5 h-5 text-electric-blue" />
      </div>
      <div>
        <p className="text-[28px] font-heading font-bold text-white leading-none">
          {count}
          <span className="text-electric-blue">{suffix}</span>
        </p>
        <p className="text-[13px] mt-[2px] text-white/[0.6] font-medium">{label}</p>
      </div>
    </div>
  );
}

export default function Hero() {
  const scrollToUpload = () => {
    document.querySelector("#upload")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToPipeline = () => {
    document.querySelector("#pipeline")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <Particles />

      {/* 3D Globe — positioned to the right on desktop */}
      <div className="absolute right-0 top-0 w-full h-full md:w-[55%] md:right-[-5%] lg:right-[-2%] opacity-40 md:opacity-70">
        <Suspense fallback={null}>
          <EarthGlobe />
        </Suspense>
      </div>

      {/* Content */}
      <div className="relative z-10 section-container w-full pt-24 pb-16 md:pt-32 md:pb-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-2xl"
        >
          {/* Badge */}
          <motion.div variants={fadeIn} className="mb-[20px]">
            <span className="inline-flex items-center gap-2 py-[6px] px-[14px] rounded-[20px] bg-electric-blue/10 border border-electric-blue/20 text-electric-blue text-xs font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-electric-blue animate-pulse" />
              ISRO LISS-IV Engine v1.0
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="section-heading !text-[clamp(2.5rem,6vw,4.5rem)] mb-[24px] leading-[1.1]"
          >
            <span className="text-white">AI-Powered</span>
            <br />
            <span className="gradient-text text-glow">Cloud Removal</span>
            <br />
            <span className="text-white/90">for Earth Observation</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="section-subheading mt-0 mb-[36px] leading-[1.65] max-w-[520px] text-[17px] text-white/50"
          >
            Enterprise-grade satellite imagery reconstruction using diffusion
            models, SAR fusion, and physics-based validation — built for
            ISRO LISS-IV multispectral data.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center gap-[16px] mb-[40px]"
          >
            <MagneticButton>
              <button onClick={scrollToUpload} className="btn-primary text-base h-[48px] !py-[14px] !px-[28px]">
                Launch Engine
                <ArrowRight className="w-5 h-5" />
              </button>
            </MagneticButton>
            <MagneticButton>
              <button onClick={scrollToPipeline} className="btn-secondary text-base h-[48px] !py-[14px] !px-[24px]">
                <Play className="w-4 h-4" />
                View Pipeline
              </button>
            </MagneticButton>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center gap-[40px] pt-10 border-t border-white/[0.06]"
          >
            <StatItem value={7} suffix="" label="AI Modules" icon={Cpu} />
            <div className="w-[1px] h-10 bg-white opacity-20" />
            <StatItem value={98} suffix="%" label="Quality Score" icon={Target} />
            <div className="w-[1px] h-10 bg-white opacity-20" />
            <StatItem value={5} suffix="ms" label="Avg. Inference" icon={Zap} />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-space-900 to-transparent pointer-events-none" />
    </section>
  );
}
