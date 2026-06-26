"use client";

import { Globe, ExternalLink, Mail } from "lucide-react";

const FOOTER_LINKS = [
  {
    title: "Platform",
    links: [
      { label: "Pipeline", href: "#pipeline" },
      { label: "Dashboard", href: "#dashboard" },
      { label: "Upload", href: "#upload" },
    ],
  },
  {
    title: "Technology",
    links: [
      { label: "LISS-IV Data", href: "#" },
      { label: "Diffusion Models", href: "#" },
      { label: "SAR Fusion", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Research Paper", href: "#" },
    ],
  },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="about" className="relative border-t border-white/10">
      {/* Gradient border effect */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-electric-blue/30 to-transparent" />

      <div className="section-container py-[64px] px-[48px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-[48px]">
          {/* Brand */}
          <div>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2.5 mb-[16px] group"
              aria-label="Scroll to top"
            >
              <img
                src="/logo.png"
                alt="NOVA-SYNC Logo"
                className="w-7 h-7 object-contain rounded-full"
              />
              <span className="font-heading text-lg font-bold">
                <span className="gradient-text">NOVA</span>
                <span className="text-white/90 ml-1">SYNC</span>
              </span>
            </button>
            <p className="text-[14px] text-white/[0.6] leading-[1.65] max-w-xs mb-[20px]">
              Next-generation AI cloud removal engine for ISRO LISS-IV
              satellite imagery. Powered by diffusion models, cross-attention
              SAR fusion, and physics-based spectral validation.
            </p>
            <div className="flex items-center gap-[12px]">
              {[Globe, ExternalLink, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-lg bg-glass-card border border-glass-border hover:border-electric-blue/30 hover:bg-electric-blue/5 transition-all"
                  aria-label={Icon === Globe ? "Website" : Icon === ExternalLink ? "Links" : "Email"}
                >
                  <Icon className="w-[20px] h-[20px] text-white/50 hover:text-white/80" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h4 className="text-[11px] font-semibold tracking-[0.1em] uppercase text-white/60 mb-[16px]">
                {section.title}
              </h4>
              <ul className="flex flex-col">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="block mb-[10px] last:mb-0 text-[14px] text-white/[0.6] hover:text-white/70 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-[48px] pt-[24px] border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-white/[0.4]">
            © {new Date().getFullYear()} NOVA-SYNC. Powered by{" "}
            <span className="text-electric-blue/60">ISRO LISS-IV AI Engine</span>
          </p>
          <p className="text-[13px] text-white/[0.4]">
            Built with Next.js • React Three Fiber • FastAPI
          </p>
        </div>
      </div>
    </footer>
  );
}
