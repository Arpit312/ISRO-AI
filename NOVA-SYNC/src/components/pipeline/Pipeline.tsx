"use client";

import { motion } from "framer-motion";
import {
  ScanSearch,
  Layers,
  CalendarDays,
  Radio,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import {
  fadeInUp,
  staggerContainerSlow,
  pipelineNodeVariant,
  pipelineLineGrow,
} from "@/animations/variants";

interface PipelineStage {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
  detail: string;
  color: string;
  glowColor: string;
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 1,
    icon: ScanSearch,
    title: "Cloud Detection",
    description: "NER Cloud Type Classifier",
    detail:
      "ResNet18-based 5-class classifier: Thin Cirrus, Cumulus/Stratus, Deep Convective, Cloud Shadow, Clear Sky",
    color: "text-electric-blue",
    glowColor: "rgba(0, 194, 255, 0.15)",
  },
  {
    id: 2,
    icon: Layers,
    title: "Spectral Adaptation",
    description: "Domain Transfer Module",
    detail:
      "1×1 convolution adapter maps LISS-IV 3-band (G, R, NIR) to 13-band Sentinel-2 latent space",
    color: "text-satellite-cyan",
    glowColor: "rgba(0, 229, 255, 0.15)",
  },
  {
    id: 3,
    icon: CalendarDays,
    title: "Season Analysis",
    description: "Phenology Embedder",
    detail:
      "Cyclical month encoding + India crop calendar (Kharif/Rabi/Zaid) → 5D seasonal prior vector",
    color: "text-accent-purple",
    glowColor: "rgba(122, 95, 255, 0.15)",
  },
  {
    id: 4,
    icon: Radio,
    title: "SAR Fusion",
    description: "Cross-Attention Block",
    detail:
      "Multi-head cross-attention fuses optical (LISS-IV) and SAR (radar) features with learned gating",
    color: "text-electric-blue",
    glowColor: "rgba(0, 194, 255, 0.15)",
  },
  {
    id: 5,
    icon: Sparkles,
    title: "Diffusion Reconstruction",
    description: "Cloud-Free Generation",
    detail:
      "Conditioned diffusion model generates cloud-free reconstruction with uncertainty-aware sampling",
    color: "text-satellite-cyan",
    glowColor: "rgba(0, 229, 255, 0.15)",
  },
  {
    id: 6,
    icon: ShieldAlert,
    title: "Uncertainty Mapping",
    description: "Confidence Estimation",
    detail:
      "Dual-head architecture: mean reconstruction + log-variance → pixel-wise uncertainty map",
    color: "text-accent-purple",
    glowColor: "rgba(122, 95, 255, 0.15)",
  },
  {
    id: 7,
    icon: CheckCircle2,
    title: "Physics Validation",
    description: "Spectral Index QA",
    detail:
      "Validates NDVI & NDWI spectral indices against physical bounds. Outputs quality score (0-100)",
    color: "text-success",
    glowColor: "rgba(52, 211, 153, 0.15)",
  },
];

function PipelineNode({ stage, index }: { stage: PipelineStage; index: number }) {
  const Icon = stage.icon;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      variants={pipelineNodeVariant}
      className="relative flex items-start gap-[24px] mb-[40px] last:mb-0 group"
    >
      {/* Timeline dot and connector */}
      <div className="flex flex-col items-center flex-shrink-0">
        <motion.div
          whileHover={{ scale: 1.2 }}
          className="relative z-10 flex items-center justify-center w-[64px] h-[64px] flex-shrink-0 rounded-2xl border border-glass-border bg-space-800/80 backdrop-blur-sm group-hover:border-electric-blue/40 transition-all duration-300"
          style={{ boxShadow: `0 0 20px ${stage.glowColor}` }}
        >
          <Icon className={`w-5 h-5 md:w-6 md:h-6 ${stage.color}`} />
          {/* Step number badge */}
          <span className="absolute top-[-8px] right-[-8px] w-5 h-5 flex items-center justify-center text-[10px] font-bold bg-space-700 border border-glass-border rounded-full text-white/60">
            {stage.id}
          </span>
        </motion.div>

        {/* Connector line */}
        {index < PIPELINE_STAGES.length - 1 && (
          <motion.div
            variants={pipelineLineGrow}
            className="absolute left-[31px] top-[64px] bottom-[-40px] w-[2px] pipeline-line"
          />
        )}
      </div>

      {/* Content card */}
      <motion.div
        whileHover={{ x: 8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="glass-card py-[20px] px-[24px] flex-1 group-hover:shadow-glow-sm transition-all duration-300"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-heading text-[18px] font-[600] text-white mb-[6px]">
              {stage.title}
            </h3>
            <p className={`text-[11px] font-semibold tracking-[0.1em] uppercase mb-[8px] ${stage.color} opacity-70`}>
              {stage.description}
            </p>
            <p className="text-[14px] text-white/[0.7] leading-[1.6] break-words">
              {stage.detail}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Pipeline() {
  return (
    <section id="pipeline" className="relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-glow-purple opacity-30 pointer-events-none" />

      <div className="section-container">
        {/* Section Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-[64px]"
        >
          <h3 className="text-sm md:text-base font-bold tracking-[0.15em] text-accent-purple uppercase mb-[12px]">
            Architecture
          </h3>
          <h2 className="section-heading mb-[16px]">
            <span className="text-white">AI Processing </span>
            <span className="gradient-text-purple">Pipeline</span>
          </h2>
          <p className="section-subheading max-w-[600px] mx-auto text-center">
            Seven specialized neural modules work in sequence to transform
            cloudy satellite imagery into pristine, physics-validated output.
          </p>
        </motion.div>

        {/* Pipeline Timeline */}
        <motion.div
          variants={staggerContainerSlow}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-[800px] mx-auto pl-[80px]"
        >
          {PIPELINE_STAGES.map((stage, index) => (
            <PipelineNode key={stage.id} stage={stage} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
