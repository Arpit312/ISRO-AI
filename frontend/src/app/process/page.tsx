"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useProcessImage } from "@/hooks/useProcessImage";
import { useToast } from "@/components/ui/Toast";
import ImageUploader from "@/components/features/ImageUploader";
import ResultsPanel from "@/components/features/ResultsPanel";
import HeatmapViewer from "@/components/features/HeatmapViewer";
import QualityScore from "@/components/features/QualityScore";
import PipelineStatus from "@/components/features/PipelineStatus";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  CloudOff,
  Leaf,
  RotateCcw,
  FileCheck,
  ArrowRight,
} from "lucide-react";
import type { ProcessingResult } from "@/types";

// ============================================================================
// Process Page — Full processing workflow
// Upload → Pipeline Animation → Results Display
// ============================================================================

type ProcessingPhase = "upload" | "processing" | "results";

export default function ProcessPage() {
  const [phase, setPhase] = useState<ProcessingPhase>("upload");
  const [currentResult, setCurrentResult] = useState<ProcessingResult | null>(null);
  const [inputPreview, setInputPreview] = useState<string>("");
  const toast = useToast();

  const { processImage, isProcessing, reset } = useProcessImage({
    onSuccess: (data) => {
      toast.success("Processing Complete", `Cloud type: ${data.cloud_type_detected} — Quality: ${data.physics_quality_score}%`);
      setPhase("results");
    },
    onError: (error) => {
      toast.error("Processing Failed", error.message);
      setPhase("upload");
    },
  });

  const handleSubmit = useCallback(
    (file: File, month: number, preview: string) => {
      setInputPreview(preview);
      setPhase("processing");
      processImage(
        { file, month, inputPreview: preview },
        {
          onSuccess: (data) => {
              setCurrentResult({
                id: `${Date.now()}`,
                timestamp: Date.now(),
                fileName: file.name,
                month,
                cloudType: data.cloud_type_detected,
                season: data.season_prior_injected,
                qualityScore: data.physics_quality_score,
                spectralReport: data.spectral_report,
                outputImage: data.output_image,
                uncertaintyHeatmap: data.uncertainty_heatmap,
                inputPreview: preview,
                initialCloudPct: data.initial_cloud_pct,
                finalCloudPct: data.final_cloud_pct,
              });
          },
        }
      );
    },
    [processImage]
  );

  const handleReset = useCallback(() => {
    setPhase("upload");
    setCurrentResult(null);
    setInputPreview("");
    reset();
  }, [reset]);

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
            Process Satellite Image
          </h1>
          <p className="text-[14px] text-[var(--color-text-secondary)] mt-1">
            Upload LISS-IV imagery and run the 7-stage AI cloud removal pipeline.
          </p>
        </div>
        {phase === "results" && (
          <Button
            variant="secondary"
            size="md"
            onClick={handleReset}
            icon={<RotateCcw size={15} />}
            className="animate-fade-in"
          >
            New Image
          </Button>
        )}
      </div>

      {/* ================================================================
          Phase: Upload
          ================================================================ */}
      {phase === "upload" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {/* Upload Area */}
          <div className="lg:col-span-2">
            <div className="rounded-[var(--radius-xl)] glass bg-[var(--color-surface)]/20 p-6">
              <ImageUploader
                onSubmit={handleSubmit}
                isProcessing={isProcessing}
              />
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-4">
            <div className="rounded-[var(--radius-xl)] glass bg-[var(--color-surface)]/20 p-5 space-y-4">
              <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]">
                How it works
              </h3>
              <div className="space-y-3">
                {[
                  { step: "1", label: "Upload LISS-IV image", desc: "JPEG, PNG, TIFF formats" },
                  { step: "2", label: "Select acquisition month", desc: "For phenological context" },
                  { step: "3", label: "AI processes 7 stages", desc: "SAR fusion + diffusion" },
                  { step: "4", label: "Get cloud-free result", desc: "With quality validation" },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-primary-subtle)] text-[var(--color-primary)] text-[11px] font-bold shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[var(--color-text-primary)]">
                        {item.label}
                      </p>
                      <p className="text-[11px] text-[var(--color-text-tertiary)]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Supported Sensors Card */}
            <div className="rounded-[var(--radius-xl)] glass bg-[var(--color-surface)]/20 p-5">
              <h3 className="text-[13px] font-semibold text-[var(--color-text-primary)] mb-3">
                Supported Sensors
              </h3>
              <div className="flex flex-wrap gap-2">
                {["LISS-IV", "LISS-III", "AWiFS", "Cartosat"].map((sensor) => (
                  <Badge key={sensor} variant="primary" size="md">
                    {sensor}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          Phase: Processing
          ================================================================ */}
      {phase === "processing" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
          {/* Preview + Pipeline */}
          <div className="space-y-5">
            {/* Input preview */}
            <div className="rounded-[var(--radius-xl)] glass bg-[var(--color-surface)]/20 overflow-hidden">
              {inputPreview && (
                <div className="relative">
                  <img
                    src={inputPreview}
                    alt="Processing input"
                    className="w-full h-64 object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
                      <p className="text-[13px] font-semibold text-white/90">
                        Running AI Pipeline...
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge variant="warning" dot size="md">
                      Processing
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pipeline Status */}
          <div className="rounded-[var(--radius-xl)] glass bg-[var(--color-surface)]/20 p-6">
            <PipelineStatus
              isProcessing={isProcessing}
              isComplete={false}
            />
          </div>
        </div>
      )}

      {/* ================================================================
          Phase: Results
          ================================================================ */}
      {phase === "results" && currentResult && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Result Metadata Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="success" dot size="md">
              <FileCheck size={12} className="mr-1" />
              {currentResult.fileName}
            </Badge>
            <Badge variant="info" dot size="md">
              <CloudOff size={12} className="mr-1" />
              {currentResult.cloudType}
            </Badge>
            <Badge variant="primary" dot size="md">
              <Leaf size={12} className="mr-1" />
              {currentResult.season} Season
            </Badge>
          </div>

          {/* Main Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Before/After — Spans 2 columns */}
            <div className="lg:col-span-2 rounded-[var(--radius-xl)] glass bg-[var(--color-surface)]/20 p-6">
              <ResultsPanel
                inputImage={currentResult.inputPreview}
                outputImage={currentResult.outputImage}
              />
            </div>

            {/* Quality Score */}
            <div className="rounded-[var(--radius-xl)] glass bg-[var(--color-surface)]/20 p-6">
              <QualityScore
                score={currentResult.qualityScore}
                spectralReport={currentResult.spectralReport}
                initialCloudPct={currentResult.initialCloudPct}
                finalCloudPct={currentResult.finalCloudPct}
                size="md"
              />
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Heatmap */}
            <div className="rounded-[var(--radius-xl)] glass bg-[var(--color-surface)]/20 p-6">
              <HeatmapViewer
                baseImage={currentResult.outputImage}
                heatmap={currentResult.uncertaintyHeatmap}
              />
            </div>

            {/* Pipeline Complete + Actions */}
            <div className="rounded-[var(--radius-xl)] glass bg-[var(--color-surface)]/20 p-6 space-y-5">
              <PipelineStatus
                isProcessing={false}
                isComplete={true}
              />

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleReset}
                  icon={<RotateCcw size={15} />}
                  fullWidth
                >
                  Process Another
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  icon={<ArrowRight size={15} />}
                  fullWidth
                  onClick={() => window.location.href = "/history"}
                >
                  View History
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
