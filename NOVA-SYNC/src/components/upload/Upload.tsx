"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload as UploadIcon,
  FileImage,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Zap,
} from "lucide-react";
import { fadeInUp, scaleIn } from "@/animations/variants";
import { uploadAndProcess, type ProcessingResult } from "@/lib/api";
import BeforeAfterSlider from "./BeforeAfterSlider";

type UploadState = "idle" | "preview" | "processing" | "success" | "error";

const ACCEPTED_TYPES = ["image/tiff", "image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export default function Upload() {
  const [state, setState] = useState<UploadState>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"reconstruction" | "heatmap">("reconstruction");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((selectedFile: File) => {
    // Validate type
    if (!ACCEPTED_TYPES.includes(selectedFile.type) && !selectedFile.name.endsWith(".tif")) {
      setError("Invalid file type. Please upload a TIFF, JPEG, PNG, or WebP image.");
      setState("error");
      return;
    }

    // Validate size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File too large. Maximum size is 50MB.");
      setState("error");
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Generate preview for non-TIFF files
    if (selectedFile.type !== "image/tiff" && !selectedFile.name.endsWith(".tif")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }

    setState("preview");
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFile(droppedFile);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) handleFile(selected);
    },
    [handleFile]
  );

  const handleProcess = async () => {
    if (!file) return;

    setState("processing");
    setProgress(0);
    setError(null);

    // Simulate progress since the current API is fast
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const response = await uploadAndProcess(file, 7);
      clearInterval(progressInterval);
      setProgress(100);
      setResult(response);
      setState("success");
    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : "Processing failed. Is the backend running?");
      setState("error");
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setProgress(0);
    setResult(null);
    setError(null);
    setState("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <section id="upload" className="relative overflow-hidden py-20">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-glow-purple opacity-20 pointer-events-none" />

      <div className="section-container">
        {/* Section Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-10"
        >
          <h3 className="text-sm md:text-base font-bold tracking-widest text-electric-blue uppercase mb-3 text-center">
            Process
          </h3>
          <h2 className="section-heading mb-4 text-center">
            <span className="text-white">Upload & </span>
            <span className="gradient-text">Analyze</span>
          </h2>
          <p className="section-subheading text-lg leading-relaxed max-w-xl mx-auto mb-10 text-center">
            Drop your satellite image and let the AI pipeline process it
            through all 7 modules in real-time.
          </p>
        </motion.div>

        <div className="flex justify-center w-full">
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="w-full max-w-[640px] mx-auto"
          >
          {/* Upload Zone / Preview */}
          <AnimatePresence mode="wait">
            {(state === "idle" || state === "error") && (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`max-w-2xl mx-auto p-12 rounded-2xl border-2 border-dashed text-center transition-all duration-300 relative cursor-pointer ${
                    isDragOver
                      ? "border-electric-blue bg-electric-blue/5 shadow-glow-md"
                      : "border-white/20 hover:border-electric-blue/40 hover:bg-glass-card"
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload satellite image"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".tif,.tiff,.jpg,.jpeg,.png,.webp"
                    onChange={handleInputChange}
                    className="hidden"
                    aria-hidden="true"
                  />
                  <div className="flex flex-col items-center">
                    <div
                      className={`p-4 rounded-2xl transition-colors mx-auto block mb-4 ${
                        isDragOver
                          ? "bg-electric-blue/20"
                          : "bg-electric-blue/10"
                      }`}
                    >
                      <UploadIcon
                        className={`mx-auto w-10 h-10 transition-colors ${
                          isDragOver ? "text-electric-blue" : "text-electric-blue/60"
                        }`}
                      />
                    </div>
                    <div className="w-full">
                      <p className="text-base font-medium mb-2 text-white/80">
                        {isDragOver
                          ? "Drop your image here"
                          : "Drag & drop satellite image"}
                      </p>
                      <p className="text-sm opacity-50 leading-relaxed text-white">
                        or click to browse • TIFF, JPEG, PNG, WebP • Max 50MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Error message */}
                {state === "error" && error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-error/10 border border-error/20"
                  >
                    <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
                    <p className="text-sm text-error/90">{error}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReset();
                      }}
                      className="ml-auto text-xs text-error hover:text-error/80 font-medium"
                    >
                      Dismiss
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {state === "preview" && file && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-5 md:p-6"
              >
                <div className="flex items-start gap-4 mb-6">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Upload preview"
                      className="w-20 h-20 rounded-xl object-cover border border-glass-border"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-space-700 border border-glass-border flex items-center justify-center">
                      <FileImage className="w-8 h-8 text-white/30" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-white/40 mt-1">
                      {formatFileSize(file.size)} •{" "}
                      {file.type || "image/tiff"}
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4 text-white/40" />
                  </button>
                </div>

                <button
                  onClick={handleProcess}
                  className="btn-primary w-full justify-center text-base !py-3.5"
                >
                  <Zap className="w-5 h-5" />
                  Process Through AI Pipeline
                </button>
              </motion.div>
            )}

            {state === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card p-6 md:p-8 text-center"
              >
                <Loader2 className="w-10 h-10 text-electric-blue animate-spin mx-auto mb-4" />
                <p className="text-base font-medium text-white mb-2">
                  Processing through pipeline...
                </p>
                <p className="text-sm text-white/40 mb-6">
                  Running 7 AI modules on your image
                </p>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-space-700 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-electric-blue to-satellite-cyan"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                    style={{
                      boxShadow: "0 0 10px rgba(0,194,255,0.5)",
                    }}
                  />
                </div>
                <p className="text-xs text-white/30 mt-2">
                  {Math.round(progress)}% complete
                </p>
              </motion.div>
            )}

            {state === "success" && result && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass-card p-5 md:p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-white">
                      Processing Complete
                    </p>
                    <p className="text-xs text-white/40 break-words leading-relaxed">Image successfully processed through the 7-stage NOVA-SYNC AI pipeline.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <ResultCard
                    label="Cloud Type"
                    value={result.cloud_type_detected}
                    color="text-electric-blue"
                  />
                  <ResultCard
                    label="Season"
                    value={result.season_prior_injected}
                    color="text-accent-purple"
                  />
                  <ResultCard
                    label="Quality Score"
                    value={`${result.physics_quality_score}%`}
                    color="text-success"
                  />
                  <ResultCard
                    label="NDVI Mean"
                    value={result.spectral_report?.NDVI?.mean_value?.toFixed(4) || "0.0000"}
                    color="text-satellite-cyan"
                  />
                </div>

                {preview && result.output_image && (
                  <div className="mb-8">
                    {/* Cinematic Toggle */}
                    <div className="flex justify-center mb-6">
                      <div className="bg-space-800/80 backdrop-blur-md p-1 rounded-xl border border-white/10 flex gap-1">
                        <button
                          onClick={() => setActiveView("reconstruction")}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                            activeView === "reconstruction"
                              ? "bg-electric-blue text-space-900 shadow-[0_0_15px_rgba(0,194,255,0.4)]"
                              : "text-white/60 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          Reconstruction View
                        </button>
                        <button
                          onClick={() => setActiveView("heatmap")}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                            activeView === "heatmap"
                              ? "bg-error text-white shadow-[0_0_15px_rgba(255,68,68,0.4)]"
                              : "text-white/60 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          Confidence Matrix Heatmap
                        </button>
                      </div>
                    </div>
                    
                    <motion.div
                      key={activeView}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      {activeView === "reconstruction" ? (
                        <BeforeAfterSlider 
                          beforeImage={preview} 
                          afterImage={result.output_image} 
                        />
                      ) : (
                        <div className="rounded-xl overflow-hidden border border-glass-border shadow-glow-sm relative">
                          <img 
                            src={result.uncertainty_heatmap || result.output_image} 
                            alt="Confidence Heatmap" 
                            className="w-full h-auto object-cover"
                          />
                          <div className="absolute top-4 left-4 bg-space-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                            <span className="text-xs font-medium text-white/90">Real-time Matrix</span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>
                )}

                <button
                  onClick={handleReset}
                  className="btn-secondary w-full justify-center"
                >
                  Process Another Image
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ResultCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-space-800/50 border border-glass-border rounded-xl p-3">
      <p className="text-xs text-white/40 mb-1">{label}</p>
      <p className={`text-sm font-semibold ${color}`}>{value}</p>
    </div>
  );
}
