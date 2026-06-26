"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navbarVariant, mobileMenuVariant } from "@/animations/variants";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Pipeline", href: "/pipeline" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Upload", href: "/upload" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.nav
        variants={navbarVariant}
        initial="hidden"
        animate="visible"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "glass-navbar shadow-lg"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 group"
              aria-label="NOVA-SYNC Home"
            >
              <div className="relative w-8 h-8 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="NOVA-SYNC Logo"
                  className="w-8 h-8 object-contain rounded-full transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-electric-blue/10 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="font-heading text-lg font-bold tracking-tight">
                <span className="gradient-text">NOVA</span>
                <span className="text-white/90 ml-1">SYNC</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-1 py-2 text-sm tracking-[0.01em] font-medium transition-colors rounded-lg hover:bg-white/5 ${
                    pathname === link.href ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/upload"
                className="ml-6 btn-primary text-sm !py-2 !px-5"
              >
                Launch Engine
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              variants={mobileMenuVariant}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 bottom-0 w-72 bg-space-800/95 backdrop-blur-xl border-l border-glass-border z-50 md:hidden"
            >
              <div className="flex flex-col pt-20 px-6 gap-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`w-full text-left px-4 py-3 text-base font-medium rounded-lg transition-colors hover:bg-white/5 ${
                      pathname === link.href ? "text-white bg-white/5" : "text-white/70 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/upload"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-4 btn-primary w-full justify-center text-center flex items-center"
                >
                  Launch Engine
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
