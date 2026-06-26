"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  Activity,
  TrendingUp,
  Shield,
  Timer,
  Leaf,
  Droplets,
  type LucideIcon,
} from "lucide-react";
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  scaleIn,
} from "@/animations/variants";
import { useAnimatedCounter } from "@/hooks/useAnimations";

// ============================================
// Types
// ============================================
interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix: string;
  trend?: string;
  trendUp?: boolean;
  color: string;
}

// ============================================
// Mock Data — represents real pipeline output metrics
// ============================================
const SPECTRAL_DATA = [
  { month: "Jan", ndvi: 0.72, ndwi: 0.35, quality: 96 },
  { month: "Feb", ndvi: 0.68, ndwi: 0.38, quality: 94 },
  { month: "Mar", ndvi: 0.65, ndwi: 0.42, quality: 92 },
  { month: "Apr", ndvi: 0.58, ndwi: 0.48, quality: 89 },
  { month: "May", ndvi: 0.52, ndwi: 0.52, quality: 91 },
  { month: "Jun", ndvi: 0.45, ndwi: 0.58, quality: 87 },
  { month: "Jul", ndvi: 0.62, ndwi: 0.55, quality: 93 },
  { month: "Aug", ndvi: 0.78, ndwi: 0.48, quality: 95 },
  { month: "Sep", ndvi: 0.82, ndwi: 0.42, quality: 97 },
  { month: "Oct", ndvi: 0.76, ndwi: 0.38, quality: 96 },
  { month: "Nov", ndvi: 0.70, ndwi: 0.35, quality: 95 },
  { month: "Dec", ndvi: 0.74, ndwi: 0.33, quality: 97 },
];

const CLOUD_TYPE_DATA = [
  { name: "Cirrus", value: 32, color: "#00C2FF" },
  { name: "Cumulus", value: 25, color: "#7A5FFF" },
  { name: "Deep Conv.", value: 18, color: "#00E5FF" },
  { name: "Shadow", value: 12, color: "#A78BFA" },
  { name: "Clear", value: 13, color: "#34D399" },
];

// ============================================
// Custom Tooltip
// ============================================
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card-static !rounded-xl px-4 py-3 text-xs">
      <p className="text-white/60 font-medium mb-2">{label}</p>
      {payload.map((entry: { name: string; value: number; color: string }, i: number) => (
        <p key={i} className="flex items-center gap-2 text-white/80">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: entry.color }}
          />
          {entry.name}: <span className="font-semibold text-white">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

// ============================================
// Stat Card
// ============================================
function StatsCard({ icon: Icon, label, value, suffix, trend, trendUp, color }: StatCardProps) {
  const { count, ref } = useAnimatedCounter({
    end: value,
    duration: 2000,
    decimals: suffix === "%" ? 1 : 0,
  });

  return (
    <motion.div
      variants={scaleIn}
      ref={ref}
      className="glass-card border border-glass-border p-5 rounded-xl relative group cursor-default"
    >
      <div className="flex items-start justify-between">
        <div
          className="p-2.5 rounded-xl transition-colors duration-300"
          style={{ background: `${color}15`, border: `1px solid ${color}25` }}
        >
          <Icon className="w-5 h-5 mb-3" style={{ color }} />
        </div>
        {trend && (
          <span
            className={`absolute top-4 right-4 text-xs font-semibold px-2 py-0.5 rounded-full ${
              trendUp
                ? "bg-success/10 text-success"
                : "bg-error/10 text-error"
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      <p className="text-4xl font-bold leading-none text-white font-heading">
        {count}
        <span className="text-lg" style={{ color }}>
          {suffix}
        </span>
      </p>
      <p className="text-sm mt-1.5 opacity-60 text-white">{label}</p>
    </motion.div>
  );
}

// ============================================
// Comparison Slider
// ============================================
function ComparisonSlider() {
  return (
    <motion.div
      variants={fadeInRight}
      className="glass-card overflow-hidden mt-4 p-5 rounded-xl"
    >
      <div className="p-4 md:p-5 border-b border-glass-border">
        <h3 className="font-heading text-sm font-semibold text-white/80">
          Cloud Removal Result
        </h3>
        <p className="text-xs text-white/40 mt-1">Before → After comparison</p>
      </div>

      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-[8px]">
        {/* "Before" side — Cloudy simulation */}
        <div className="absolute inset-0 bg-gradient-to-br from-space-700 via-space-600 to-space-800">
          {/* Simulate cloudy satellite image */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Terrain base */}
            <div className="absolute inset-0">
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-green-900/40 via-green-800/20 to-transparent" />
              <div className="absolute bottom-0 left-1/4 w-32 h-20 bg-blue-900/30 rounded-full blur-md" />
              <div className="absolute bottom-4 right-1/4 w-24 h-16 bg-green-900/40 rounded-lg blur-sm" />
            </div>
            {/* Cloud layer */}
            <div className="absolute inset-0">
              <div className="absolute top-[10%] left-[5%] w-[60%] h-[35%] bg-white/30 rounded-full blur-2xl" />
              <div className="absolute top-[20%] right-[10%] w-[45%] h-[25%] bg-white/25 rounded-full blur-xl" />
              <div className="absolute bottom-[30%] left-[15%] w-[40%] h-[20%] bg-white/20 rounded-full blur-xl" />
            </div>
          </div>
          <div className="absolute bottom-3 left-3 py-[4px] px-[8px] rounded-md bg-black/50 text-[12px] text-white/70 font-medium">
            Cloudy Input
          </div>
        </div>

        {/* Slider divider */}
        <div className="absolute inset-y-0 left-1/2 w-[2px] bg-electric-blue/80 z-20 shadow-[0_0_10px_rgba(0,194,255,0.5)]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-space-800 border-2 border-electric-blue flex items-center justify-center shadow-glow-sm">
            <span className="text-electric-blue text-xs font-bold">⟷</span>
          </div>
        </div>

        {/* "After" side — Clear result */}
        <div className="absolute inset-0 left-1/2 overflow-hidden bg-gradient-to-br from-space-700 via-space-600 to-space-800">
          <div className="absolute inset-0 -left-1/2 w-[200%]">
            <div className="absolute inset-0">
              {/* Clear terrain */}
              <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-green-800/50 via-green-700/30 to-transparent" />
              <div className="absolute bottom-[5%] left-[20%] w-40 h-24 bg-blue-700/40 rounded-full blur-sm" />
              <div className="absolute bottom-[10%] right-[20%] w-32 h-20 bg-green-700/50 rounded-lg blur-[2px]" />
              <div className="absolute bottom-[15%] left-[40%] w-24 h-16 bg-green-600/30 rounded-md blur-[1px]" />
              {/* Enhanced detail - no clouds */}
              <div className="absolute top-[20%] left-[30%] w-48 h-32 bg-gradient-to-br from-green-800/20 to-emerald-700/20 rounded-2xl" />
            </div>
          </div>
          <div className="absolute bottom-3 right-3 py-[4px] px-[8px] rounded-md bg-electric-blue/20 border border-electric-blue/30 text-[12px] text-electric-blue font-medium">
            AI Reconstructed
          </div>
        </div>
      </div>

      {/* Quality badge */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-success" />
          <span className="text-xs font-medium text-success">Physics Validated</span>
        </div>
        <span className="text-xs text-white/40">NDVI: 0.76 | NDWI: 0.38</span>
      </div>
    </motion.div>
  );
}

// ============================================
// Dashboard Section
// ============================================
export default function Dashboard() {
  return (
    <section id="dashboard" className="relative overflow-hidden pb-[80px]">
      {/* Background glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-glow-blue opacity-20 pointer-events-none" />

      <div className="section-container">
        {/* Section Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-14"
        >
          <h3 className="text-sm md:text-base font-bold tracking-[0.15em] text-electric-blue uppercase mb-[12px]">
            Analytics
          </h3>
          <h2 className="section-heading mb-[16px]">
            <span className="text-white">Mission Control </span>
            <span className="gradient-text">Dashboard</span>
          </h2>
          <p className="section-subheading max-w-[600px] mx-auto text-center">
            Real-time spectral quality metrics, cloud type distribution, and
            reconstruction performance analytics.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-4 gap-4"
        >
          <StatsCard
            icon={Shield}
            label="Quality Score"
            value={97.2}
            suffix="%"
            trend="↑ 2.3%"
            trendUp={true}
            color="#34D399"
          />
          <StatsCard
            icon={Leaf}
            label="NDVI Mean"
            value={0.76}
            suffix=""
            trend="↑ 0.04"
            trendUp={true}
            color="#00C2FF"
          />
          <StatsCard
            icon={Timer}
            label="Processing Time"
            value={4.8}
            suffix="ms"
            trend="↓ 12%"
            trendUp={true}
            color="#7A5FFF"
          />
          <StatsCard
            icon={Droplets}
            label="Cloud Coverage"
            value={34}
            suffix="%"
            trend="Detected"
            trendUp={false}
            color="#00E5FF"
          />
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-[1fr_380px] gap-5 mt-5">
          {/* Main Area Chart */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="glass-card p-5 rounded-xl"
          >
            <div className="flex items-center justify-between mb-[16px]">
              <div>
                <h3 className="font-heading text-base font-medium text-white mb-1">
                  Spectral Quality Trends
                </h3>
                <p className="text-xs opacity-50 mb-4 text-white">
                  NDVI & NDWI indices over 12 months
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-electric-blue" />
                  NDVI
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent-purple" />
                  NDWI
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={SPECTRAL_DATA}>
                <defs>
                  <linearGradient id="ndviGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00C2FF" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#00C2FF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ndwiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7A5FFF" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#7A5FFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="rgba(255,255,255,0.04)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 1]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="ndvi"
                  name="NDVI"
                  stroke="#00C2FF"
                  fill="url(#ndviGrad)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#00C2FF", stroke: "#04070C", strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="ndwi"
                  name="NDWI"
                  stroke="#7A5FFF"
                  fill="url(#ndwiGrad)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#7A5FFF", stroke: "#04070C", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Side Panel: Cloud Distribution + Comparison */}
          <div className="flex flex-col gap-[16px]">
            {/* Cloud Type Distribution */}
            <motion.div
              variants={fadeInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="glass-card p-5 rounded-xl"
            >
              <h3 className="font-heading text-base font-medium text-white mb-1">
                Cloud Type Distribution
              </h3>
              <p className="text-xs opacity-50 mb-4 text-white">
                Classified by NER Classifier
              </p>
              <div className="flex flex-col">
                {CLOUD_TYPE_DATA.map((entry, index) => (
                  <div key={index} className="flex items-center gap-3 mb-2.5">
                    <span className="text-sm w-20 flex-shrink-0 text-right text-white/50">{entry.name}</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden bg-white/5">
                      <div
                        className="h-full rounded-[4px]"
                        style={{ width: `${entry.value}%`, backgroundColor: entry.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Comparison Slider */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <ComparisonSlider />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
