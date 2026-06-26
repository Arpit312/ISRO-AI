import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep Space Backgrounds
        "space-900": "#04070C",
        "space-800": "#07111F",
        "space-700": "#0A1428",
        "space-600": "#0F172A",
        "space-500": "#1E293B",

        // Primary
        "electric-blue": "#00C2FF",
        "satellite-cyan": "#00E5FF",

        // Accent
        "accent-purple": "#7A5FFF",
        "accent-violet": "#A78BFA",

        // Semantic
        success: "#34D399",
        error: "#FF4D6D",
        warning: "#FBBF24",

        // Glass UI Tokens
        glass: {
          card: "rgba(255,255,255,0.05)",
          border: "rgba(255,255,255,0.08)",
          hover: "rgba(255,255,255,0.10)",
        },
      },

      fontFamily: {
        heading: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "glow-blue": "radial-gradient(circle, rgba(0,194,255,0.15) 0%, transparent 70%)",
        "glow-purple": "radial-gradient(circle, rgba(122,95,255,0.15) 0%, transparent 70%)",
        "hero-gradient": "linear-gradient(180deg, #04070C 0%, #07111F 40%, #0A1428 100%)",
      },

      boxShadow: {
        "glow-sm": "0 0 15px rgba(0,194,255,0.15)",
        "glow-md": "0 0 30px rgba(0,194,255,0.2)",
        "glow-lg": "0 0 60px rgba(0,194,255,0.25)",
        "glow-purple-sm": "0 0 15px rgba(122,95,255,0.15)",
        "glow-purple-md": "0 0 30px rgba(122,95,255,0.2)",
        glass: "0 8px 32px rgba(0,0,0,0.4)",
        "glass-lg": "0 16px 48px rgba(0,0,0,0.5)",
      },

      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-slower": "float 10s ease-in-out infinite",
        orbit: "orbit 20s linear infinite",
        "orbit-reverse": "orbit 25s linear infinite reverse",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "slide-up": "slideUp 0.6s ease-out",
        "fade-in": "fadeIn 0.8s ease-out",
        "spin-slow": "spin 30s linear infinite",
        shimmer: "shimmer 2s linear infinite",
        "border-glow": "borderGlow 3s ease-in-out infinite",
      },

      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        borderGlow: {
          "0%, 100%": { borderColor: "rgba(0,194,255,0.2)" },
          "50%": { borderColor: "rgba(0,194,255,0.6)" },
        },
      },

      backdropBlur: {
        xs: "2px",
      },

      screens: {
        xs: "475px",
      },
    },
  },
  plugins: [],
};

export default config;
