"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/store/appStore";
import { cn, formatDate, getQualityLabel } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import QualityScore from "@/components/features/QualityScore";
import ResultsPanel from "@/components/features/ResultsPanel";
import HeatmapViewer from "@/components/features/HeatmapViewer";
import {
  History as HistoryIcon,
  Trash2,
  Eye,
  X,
  Search,
  SlidersHorizontal,
  ChevronDown,
  FileImage,
  Calendar,
  CloudOff,
  Shield,
} from "lucide-react";
import type { ProcessingResult } from "@/types";

export default function HistoryPage() {
  const history = useAppStore((state) => state.history);
  const removeFromHistory = useAppStore((state) => state.removeFromHistory);
  const clearHistory = useAppStore((state) => state.clearHistory);
  const clearRecentHistory = useAppStore((state) => state.clearRecentHistory);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResult, setSelectedResult] = useState<ProcessingResult | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "quality">("newest");
  const [showClearMenu, setShowClearMenu] = useState(false);

  const filteredHistory = useMemo(() => {
    let results = [...history];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (r) =>
          r.fileName.toLowerCase().includes(q) ||
          r.cloudType.toLowerCase().includes(q) ||
          r.season.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "newest":
        results.sort((a, b) => b.timestamp - a.timestamp);
        break;
      case "oldest":
        results.sort((a, b) => a.timestamp - b.timestamp);
        break;
      case "quality":
        results.sort((a, b) => b.qualityScore - a.qualityScore);
        break;
    }

    return results;
  }, [history, searchQuery, sortBy]);

  const cloudTypeBadge = (type: string): "success" | "warning" | "error" | "info" | "primary" => {
    if (type === "Clear Sky") return "success";
    if (type === "Thin Cirrus") return "info";
    if (type === "Deep Convective") return "error";
    if (type === "Cloud Shadow") return "warning";
    return "primary";
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      {}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
            Processing History
          </h1>
          <p className="text-[14px] text-[var(--color-text-secondary)] mt-1">
            {history.length} result{history.length !== 1 ? "s" : ""} stored
          </p>
        </div>
        {history.length > 0 && (
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowClearMenu(!showClearMenu)}
              icon={<Trash2 size={14} />}
              className="text-[var(--color-error)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-subtle)]"
            >
              Clear History <ChevronDown size={14} className={cn("transition-transform", showClearMenu && "rotate-180")} />
            </Button>
            
            {showClearMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowClearMenu(false)} />
                <div className="absolute right-0 mt-2 w-48 rounded-[var(--radius-md)] glass-elevated border border-[var(--color-border)] shadow-[var(--shadow-lg)] z-50 animate-scale-in overflow-hidden">
                  <button
                    className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] transition-colors border-b border-[var(--color-border)]"
                    onClick={() => { clearRecentHistory(24); setShowClearMenu(false); }}
                  >
                    Clear Last 24 Hours
                  </button>
                  <button
                    className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] transition-colors border-b border-[var(--color-border)]"
                    onClick={() => { clearRecentHistory(168); setShowClearMenu(false); }}
                  >
                    Clear Last 7 Days
                  </button>
                  <button
                    className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-[var(--color-error)] hover:bg-[var(--color-error-subtle)] transition-colors"
                    onClick={() => { clearHistory(); setShowClearMenu(false); }}
                  >
                    Clear All Data
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {}
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-[var(--radius-xl)] border-2 border-dashed border-[var(--color-border-hover)] glass bg-[var(--color-surface)]/10 animate-fade-in">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-info-subtle)] mb-4 animate-float">
            <HistoryIcon size={28} className="text-[var(--color-info)]" />
          </div>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            No processing history yet
          </h2>
          <p className="text-[13px] text-[var(--color-text-tertiary)] mt-2 max-w-md text-center">
            Process your first satellite image to see results here. All results are stored locally in your browser.
          </p>
          <Button
            variant="primary"
            size="md"
            className="mt-6"
            onClick={() => (window.location.href = "/process")}
          >
            Process First Image
          </Button>
        </div>
      ) : (
        <>
          {}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
            {}
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />
              <input
                type="text"
                placeholder="Search by filename, cloud type, or season..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full pl-9 pr-4 py-2.5 rounded-[var(--radius-md)]",
                  "glass bg-[var(--color-surface)]/30",
                  "text-[13px] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]",
                  "hover:border-[var(--color-border-hover)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]",
                  "transition-all duration-200 outline-none"
                )}
              />
            </div>

            {}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className={cn(
                  "appearance-none pl-3 pr-8 py-2.5 rounded-[var(--radius-md)]",
                  "glass bg-[var(--color-surface)]/30",
                  "text-[13px] font-medium text-[var(--color-text-primary)]",
                  "hover:border-[var(--color-border-hover)] focus:border-[var(--color-primary)]",
                  "transition-all duration-200 outline-none cursor-pointer"
                )}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="quality">Highest quality</option>
              </select>
              <SlidersHorizontal
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
              />
            </div>
          </div>

          {}
          <div className="space-y-3">
            {filteredHistory.map((result, idx) => {
              const quality = getQualityLabel(result.qualityScore);

              return (
                <div
                  key={result.id}
                  className={cn(
                    "group rounded-[var(--radius-lg)] glass bg-[var(--color-surface)]/20",
                    "hover:border-[var(--color-border-focus)] glass-hover",
                    "transition-all duration-200",
                    "animate-fade-in",
                    `stagger-${Math.min(idx + 1, 8)}`
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
                    {}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-16 h-16 rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-border)] shrink-0 bg-[var(--color-surface-elevated)]">
                        {result.inputPreview ? (
                          <img
                            src={result.inputPreview}
                            alt={result.fileName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileImage size={20} className="text-[var(--color-text-muted)]" />
                          </div>
                        )}
                      </div>

                      {}
                      <div className="flex-1 min-w-0 sm:hidden">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-[13px] font-semibold text-[var(--color-text-primary)] truncate">
                            {result.fileName}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                          <Badge variant={cloudTypeBadge(result.cloudType)} size="sm">
                            {result.cloudType}
                          </Badge>
                          <span
                            className="flex items-center gap-1 font-semibold"
                            style={{ color: quality.color }}
                          >
                            <Shield size={11} />
                            {result.qualityScore.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {}
                    <div className="hidden sm:block flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[13px] font-semibold text-[var(--color-text-primary)] truncate">
                          {result.fileName}
                        </p>
                        <Badge variant={cloudTypeBadge(result.cloudType)} size="sm">
                          {result.cloudType}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-[var(--color-text-tertiary)]">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {formatDate(result.timestamp)}
                        </span>
                        <span className="flex items-center gap-1">
                          <CloudOff size={11} />
                          {result.season}
                        </span>
                        <span
                          className="flex items-center gap-1 font-semibold"
                          style={{ color: quality.color }}
                        >
                          <Shield size={11} />
                          {result.qualityScore.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {}
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--color-border)]">
                      <div className="sm:hidden flex items-center gap-4 text-[11px] text-[var(--color-text-tertiary)]">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {formatDate(result.timestamp).split(',')[0]}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setSelectedResult(result)}
                          className="p-2 rounded-[var(--radius-md)] text-[var(--color-text-tertiary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-subtle)] transition-colors"
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => removeFromHistory(result.id)}
                          className="p-2 rounded-[var(--radius-md)] text-[var(--color-text-tertiary)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-subtle)] transition-colors"
                          title="Remove"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {}
          {filteredHistory.length === 0 && searchQuery.trim() && (
            <div className="text-center py-12 text-[var(--color-text-tertiary)]">
              <Search size={32} className="mx-auto mb-3 opacity-40" />
              <p className="text-[14px] font-medium">
                No results match &quot;{searchQuery}&quot;
              </p>
            </div>
          )}
        </>
      )}

      {}
      {selectedResult && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedResult(null)}
        >
          {}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

          {}
          <div
            className="relative z-10 w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-[var(--radius-xl)] glass-elevated shadow-[var(--shadow-lg)] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {}
            <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-[var(--color-border)] glass">
              <div>
                <h2 className="text-[16px] font-bold text-[var(--color-text-primary)]">
                  {selectedResult.fileName}
                </h2>
                <p className="text-[12px] text-[var(--color-text-tertiary)] mt-0.5">
                  Processed {formatDate(selectedResult.timestamp)}
                </p>
              </div>
              <button
                onClick={() => setSelectedResult(null)}
                className="p-2 rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {}
            <div className="p-5 space-y-6">
              {}
              <div className="flex flex-wrap gap-2">
                <Badge variant={cloudTypeBadge(selectedResult.cloudType)} dot size="md">
                  {selectedResult.cloudType}
                </Badge>
                <Badge variant="primary" dot size="md">
                  {selectedResult.season} Season
                </Badge>
              </div>

              {}
              <ResultsPanel
                inputImage={selectedResult.inputPreview}
                outputImage={selectedResult.outputImage}
              />

              {}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-[var(--radius-lg)] glass bg-[var(--color-surface)]/20 p-5">
                  <QualityScore
                    score={selectedResult.qualityScore}
                    spectralReport={selectedResult.spectralReport}
                    size="sm"
                  />
                </div>
                <div className="rounded-[var(--radius-lg)] glass bg-[var(--color-surface)]/20 p-5">
                  <HeatmapViewer
                    baseImage={selectedResult.outputImage}
                    heatmap={selectedResult.uncertaintyHeatmap}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
