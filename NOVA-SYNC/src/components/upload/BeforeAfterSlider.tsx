"use client";

import { useState, useRef, useEffect } from "react";
import { GripVertical } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

export default function BeforeAfterSlider({ beforeImage, afterImage }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    
    setSliderPosition(percent);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    
    if (isDragging) {
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchend", handleMouseUp);
    }
    
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="flex flex-col w-full">
      <div 
        ref={containerRef}
        className="relative w-full aspect-square md:aspect-video overflow-hidden rounded-xl bg-space-800 border border-glass-border select-none cursor-ew-resize"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseDown={(e) => {
          setIsDragging(true);
          handleMove(e.clientX);
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          handleMove(e.touches[0].clientX);
        }}
      >
        {/* After Image (Cloud Free) - Base Layer */}
        <div className="absolute inset-0">
          <img 
            src={afterImage} 
            alt="After (Cloud Free)" 
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
          />
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
            <span className="text-xs font-semibold text-white tracking-wider uppercase">Cloud-Free Output</span>
          </div>
        </div>

        {/* Before Image (Cloudy) - Clipped Layer */}
        <div 
          className="absolute inset-0 border-r border-electric-blue/50"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img 
            src={beforeImage} 
            alt="Before (Cloudy)" 
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
          />
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
            <span className="text-xs font-semibold text-white tracking-wider uppercase">Original Input</span>
          </div>
        </div>

        {/* Slider Handle */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-electric-blue flex items-center justify-center shadow-[0_0_10px_rgba(0,194,255,0.8)]"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="w-8 h-8 -ml-4 bg-space-900 border-2 border-electric-blue rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110">
            <GripVertical className="w-4 h-4 text-electric-blue" />
          </div>
        </div>
      </div>
      
      <p className="text-xs text-center text-white/40 mt-3">
        Drag slider left/right to compare
      </p>
    </div>
  );
}
