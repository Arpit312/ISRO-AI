"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ArrowLeftRight, ZoomIn, Download } from "lucide-react";

interface ResultsPanelProps {
  inputImage: string;
  outputImage: string;
  className?: string;
}

export default function ResultsPanel({
  inputImage,
  outputImage,
  className,
}: ResultsPanelProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current || !isDragging) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    [isDragging]
  );

  const handleMouseDown = useCallback(() => setIsDragging(true), []);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleMove]);

  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = outputImage;
    link.download = `novasync-output-${Date.now()}.png`;
    link.click();
  }, [outputImage]);

  return (
    <div className={cn("space-y-3", className)}>
      {}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          Before / After Comparison
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-1.5 rounded-[var(--radius-md)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors"
            title={isZoomed ? "Zoom out" : "Zoom in"}
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-[var(--radius-md)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors"
            title="Download output"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      {}
      <div
        ref={containerRef}
        className={cn(
          "relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] cursor-col-resize select-none",
          isZoomed ? "h-[500px]" : "h-[320px]",
          "transition-all duration-300"
        )}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {}
        <img
          src={outputImage}
          alt="Processed output"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={inputImage}
            alt="Original input"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ width: `${containerRef.current?.offsetWidth || 600}px` }}
            draggable={false}
          />
        </div>

        {}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.3)] z-10"
          style={{ left: `${sliderPosition}%` }}
        >
          {}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-[var(--shadow-lg)] flex items-center justify-center">
            <ArrowLeftRight size={16} className="text-[var(--color-bg)]" />
          </div>
        </div>

        {}
        <div className="absolute top-3 left-3 px-2 py-1 rounded-[var(--radius-md)] bg-black/50 backdrop-blur-sm text-base font-bold text-white/90 uppercase tracking-wider z-20">
          Original
        </div>
        <div className="absolute top-3 right-3 px-2 py-1 rounded-[var(--radius-md)] bg-black/50 backdrop-blur-sm text-base font-bold text-white/90 uppercase tracking-wider z-20">
          Processed
        </div>
      </div>
    </div>
  );
}
