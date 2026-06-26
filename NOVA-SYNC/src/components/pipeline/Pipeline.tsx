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
      className="relative flex items-start gap-6 mb-10 last:mb-0 group"
    >
      {/* Timeline dot and connector */}
      <div className="flex flex-col items-center flex-shrink-0">
        <motion.div
          whileHover={{ scale: 1.2 }}
          className="relative z-10 w-16 h-16 flex-shrink-0 rounded-2xl flex items-center justify-center border border-glass-border bg-space-800/80 backdrop-blur-sm group-hover:border-electric-blue/40 transition-all duration-300"
          style={{ boxShadow: `0 0 20px ${stage.glowColor}` }}
        >
          <Icon className={`w-5 h-5 md:w-6 md:h-6 ${stage.color}`} />
          {/* Step number badge */}
          <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-space-700 border border-glass-border text-white/60">
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
        className="glass-card flex-1 p-6 rounded-xl group-hover:shadow-glow-sm transition-all duration-300"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-heading text-lg font-semibold text-white mb-1.5">
              {stage.title}
            </h3>
            <p className={`text-xs tracking-widest uppercase mb-2 opacity-60 ${stage.color}`}>
              {stage.description}
            </p>
            <p className="text-sm leading-relaxed opacity-60 text-white break-words">
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
          className="mb-16 text-center"
        >
          <h3 className="text-sm md:text-base font-bold tracking-widest text-accent-purple uppercase mb-3">
            Architecture
          </h3>
          <h2 className="section-heading mb-4">
            <span className="text-white">AI Processing </span>
            <span className="gradient-text-purple">Pipeline</span>
          </h2>
          <p className="section-subheading max-w-2xl mx-auto leading-relaxed text-center">
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
          className="max-w-3xl mx-auto"
        >
          {PIPELINE_STAGES.map((stage, index) => (
            <PipelineNode key={stage.id} stage={stage} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
