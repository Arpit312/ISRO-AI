"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Leaflet requires window, so we must dynamically import the component with ssr: false
const MapExplorer = dynamic(
  () => import("@/components/features/MapExplorer"),
  { 
    ssr: false,
    loading: () => (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[500px] rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)]">
        <Loader2 size={32} className="text-[var(--color-primary)] animate-spin mb-4" />
        <p className="text-[14px] font-semibold text-[var(--color-text-primary)]">Loading Map Engine...</p>
      </div>
    )
  }
);

// ============================================================================
// Explore Page — Interactive Global Map with Temporal Compositing
// ============================================================================

export default function ExplorePage() {
  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-6 shrink-0">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
          Explore Imagery
        </h1>
        <p className="text-[14px] text-[var(--color-text-secondary)] mt-1 max-w-2xl">
          Search globally to fetch and reconstruct cloud-free imagery using the NOVA-SYNC fast-path temporal compositing algorithm via Copernicus Sentinel-2.
        </p>
      </div>
      
      {/* Map takes up the remaining height */}
      <div className="flex-1 min-h-0">
        <MapExplorer />
      </div>
    </div>
  );
}
