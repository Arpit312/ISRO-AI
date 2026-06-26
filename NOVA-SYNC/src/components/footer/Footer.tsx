"use client";

import Link from "next/link";
import { Globe, ExternalLink, Mail } from "lucide-react";

const FOOTER_LINKS = [
  {
    title: "Platform",
    links: [
      { label: "Pipeline", href: "/pipeline" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Upload", href: "/upload" },
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
    <footer id="about" className="relative pt-16 pb-10 border-t border-white/10">
      {/* Gradient border effect */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-electric-blue/30 to-transparent" />

      <div className="section-container">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12 px-12">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2.5 mb-[16px] group"
              aria-label="Go to home"
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
            </Link>
            <p className="text-sm leading-relaxed opacity-60 mt-3 mb-5 max-w-xs text-white">
              Next-generation AI cloud removal engine for ISRO LISS-IV
              satellite imagery. Powered by diffusion models, cross-attention
              SAR fusion, and physics-based spectral validation.
            </p>
            <div className="flex items-center gap-3">
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
              <h4 className="text-xs tracking-widest uppercase opacity-40 mb-4 text-white font-semibold">
                {section.title}
              </h4>
              <ul className="flex flex-col">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="block text-sm opacity-60 mb-2.5 hover:opacity-100 transition-opacity text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10 px-12">
          <p className="text-xs opacity-40 text-white">
            © {new Date().getFullYear()} NOVA-SYNC. Powered by{" "}
            <span className="text-electric-blue/60">ISRO LISS-IV AI Engine</span>
          </p>
          <p className="text-xs opacity-40 text-white">
            Built with Next.js • React Three Fiber • FastAPI
          </p>
        </div>
      </div>
    </footer>
  );
}
