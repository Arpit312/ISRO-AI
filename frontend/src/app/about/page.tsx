"use client";

import { 
  Rocket, 
  Layers, 
  Cpu, 
  Network, 
  Satellite, 
  Search, 
  CheckCircle2, 
  User, 
  Mail, 
  Code 
} from "lucide-react";

export default function AboutPage() {
  const pipelineStages = [
    {
      icon: <Satellite size={20} />,
      title: "Stage 1: Multi-Sensor Data Ingestion",
      desc: "Simultaneous processing of optical LISS-IV imagery and Sentinel-1 SAR (Synthetic Aperture Radar) data."
    },
    {
      icon: <Search size={20} />,
      title: "Stage 2: Advanced Cloud Detection",
      desc: "Pixel-level segmentation utilizing deep learning to identify thin cirrus, thick clouds, and cloud shadows."
    },
    {
      icon: <Network size={20} />,
      title: "Stage 3: Spectral Adaptation",
      desc: "Harmonizing spectral profiles across different sensor outputs to create a uniform baseline."
    },
    {
      icon: <Layers size={20} />,
      title: "Stage 4: Phenological Prior Extraction",
      desc: "Retrieving seasonal context (vegetation indices) from historical archives to ensure agricultural and geographical accuracy."
    },
    {
      icon: <Rocket size={20} />,
      title: "Stage 5: SAR-Optical Fusion",
      desc: "Merging radar data (which penetrates clouds) with optical features to reconstruct occluded geometries."
    },
    {
      icon: <Cpu size={20} />,
      title: "Stage 6: Latent Diffusion Generation",
      desc: "Generative AI model (Diffusion) synthesizes missing pixels, ensuring structural and textural fidelity."
    },
    {
      icon: <CheckCircle2 size={20} />,
      title: "Stage 7: Quality Assurance & Uncertainty",
      desc: "Final validation phase that computes structural similarity (SSIM) and provides a pixel-wise uncertainty heatmap."
    }
  ];

  return (
    <div className="max-w-[1000px] mx-auto pb-12">
      {/* Hero Section */}
      <div className="mb-12 animate-fade-in text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 justify-center sm:justify-start">
          <div className="w-12 h-12 rounded-full bg-[var(--color-primary-subtle)] flex items-center justify-center text-[var(--color-primary)] shrink-0">
            <InfoIcon size={24} />
          </div>
          <h1 className="text-5xl sm:text-4xl font-bold text-[var(--color-text-primary)] tracking-tight">
            About NOVA-SYNC
          </h1>
        </div>
        <p className="text-2xl sm:text-[16px] text-[var(--color-text-secondary)] mt-4 leading-relaxed max-w-3xl">
          NOVA-SYNC is a state-of-the-art AI platform designed specifically to resolve the challenge of cloud occlusion in satellite imagery. Built with a focus on ISRO's LISS-IV sensor, this platform leverages the power of generative artificial intelligence and multi-modal sensor fusion to provide continuous, high-fidelity Earth observation data regardless of atmospheric conditions.
        </p>
      </div>

      <div className="space-y-8">
        {/* Project Vision */}
        <div className="rounded-[var(--radius-xl)] glass bg-[var(--color-surface)]/20 p-6 sm:p-8 animate-fade-in-up stagger-1">
          <h2 className="text-[18px] font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <Rocket className="text-[var(--color-primary)]" size={20} />
            Project Vision & AI Methodology
          </h2>
          <div className="prose prose-sm dark:prose-invert max-w-none text-[var(--color-text-secondary)]">
            <p className="mb-4">
              Optical satellites like ISRO's Resourcesat (LISS-IV) are crucial for agriculture, urban planning, and disaster management. However, over 60% of optical satellite imagery is contaminated by clouds, rendering the data useless for urgent applications.
            </p>
            <p className="mb-4">
              <strong>Our Solution:</strong> We have developed a complex AI architecture that operates unlike simple image inpainting tools. When a cloud-covered image is uploaded, the AI does not just "guess" what is underneath. Instead, it pulls in auxiliary data—specifically <em>Synthetic Aperture Radar (SAR)</em> which can see through clouds—and combines it with historical seasonal data (phenology).
            </p>
            <p>
              By utilizing a <strong>Latent Diffusion Model</strong> architecture, the AI learns the complex mapping between radar backscatter, seasonal vegetation states, and optical reflectance. The result is a scientifically accurate reconstruction of the ground truth, empowering continuous monitoring.
            </p>
          </div>
        </div>

        {/* 7-Stage Pipeline */}
        <div className="rounded-[var(--radius-xl)] glass bg-[var(--color-surface)]/20 p-6 sm:p-8 animate-fade-in-up stagger-2">
          <h2 className="text-[18px] font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
            <Layers className="text-[var(--color-primary)]" size={20} />
            The 7-Stage AI Pipeline
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pipelineStages.map((stage, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-[var(--radius-lg)] bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors ${index === 6 ? 'md:col-span-2' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-[var(--color-text-tertiary)] bg-[var(--color-surface-elevated)] p-2 rounded-full">
                    {stage.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">
                      {stage.title}
                    </h3>
                    <p className="text-base text-[var(--color-text-tertiary)] leading-relaxed">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Developed By Section */}
        <div className="rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--color-surface)]/40 to-[var(--color-bg)] border border-[var(--color-border)] p-6 sm:p-8 animate-fade-in-up stagger-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
          
          <h2 className="text-[18px] font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
            <Code className="text-[var(--color-primary)]" size={20} />
            Developed By
          </h2>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-blue-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg ring-4 ring-[var(--color-bg)] shrink-0">
              AKP
            </div>
            <div className="flex-1 text-center sm:text-left space-y-2 pt-2">
              <h3 className="text-5xl font-bold text-[var(--color-text-primary)]">
                Arpit Kishor Pathak
              </h3>
              <p className="text-2xl text-[var(--color-primary)] font-medium">
                Lead AI Researcher & Full-Stack Developer
              </p>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mt-4 text-2xl text-[var(--color-text-secondary)]">
                <div className="flex items-center gap-2 bg-[var(--color-surface-elevated)] px-3 py-1.5 rounded-md border border-[var(--color-border)]">
                  <Mail size={14} className="text-[var(--color-text-tertiary)]" />
                  <a href="mailto:2005arpitpathak@gmai.com" className="hover:text-[var(--color-primary)] transition-colors">
                    2005arpitpathak@gmai.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function InfoIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  );
}
