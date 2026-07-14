"use client";

import { useState, useCallback, useRef } from "react";
import { cn, formatFileSize } from "@/lib/utils";
import { Upload, X, Image as ImageIcon, Calendar } from "lucide-react";
import Button from "@/components/ui/Button";
import { MONTHS } from "@/types";

interface ImageUploaderProps {
  onSubmit: (file: File, month: number, preview: string) => void;
  isProcessing: boolean;
  className?: string;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/tiff", "image/webp"];
const MAX_FILE_SIZE = 50 * 1024 * 1024; 

export default function ImageUploader({
  onSubmit,
  isProcessing,
  className,
}: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((f: File): string | null => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      return `Invalid file type. Accepted: JPEG, PNG, TIFF, WebP`;
    }
    if (f.size > MAX_FILE_SIZE) {
      return `File too large. Maximum size: ${formatFileSize(MAX_FILE_SIZE)}`;
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (f: File) => {
      const validationError = validateFile(f);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);
      setFile(f);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(f);
    },
    [validateFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

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

  const clearFile = useCallback(() => {
    setFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  // ── Submit Handler ────────────────────────────────────────────────────
  const handleSubmit = useCallback(() => {
    if (file && preview) {
      onSubmit(file, month, preview);
    }
  }, [file, month, preview, onSubmit]);

  const currentSeason = MONTHS.find((m) => m.value === month)?.season || "Kharif";

  return (
    <div className={cn("space-y-5", className)}>
      {}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !file && fileInputRef.current?.click()}
        className={cn(
          "relative rounded-[var(--radius-xl)] border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden",
          isDragging
            ? "border-[var(--color-primary)] bg-[var(--color-primary-subtle)] scale-[1.01]"
            : file
            ? "border-[var(--color-border)] bg-[var(--color-surface)]"
            : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)]",
          error && "border-[var(--color-error)]/50"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleInputChange}
          className="hidden"
        />

        {preview && file ? (
                    <div className="relative group">
            <img
              src={preview}
              alt={file.name}
              className="w-full h-64 object-cover"
            />
            {}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="p-2 rounded-full bg-[var(--color-error)] text-white hover:bg-[#DC2626] transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            {}
            <div className="absolute bottom-0 left-0 right-0 px-4 py-2.5 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon size={14} className="text-white/80" />
                  <span className="text-base font-medium text-white/90 truncate max-w-xs">
                    {file.name}
                  </span>
                </div>
                <span className="text-2xl text-white/60">
                  {formatFileSize(file.size)}
                </span>
              </div>
            </div>
          </div>
        ) : (
                    <div className="flex flex-col items-center justify-center py-16 px-6">
            <div
              className={cn(
                "flex items-center justify-center w-14 h-14 rounded-full mb-4 transition-colors duration-200",
                isDragging
                  ? "bg-[var(--color-primary)]/15 text-[var(--color-primary)]"
                  : "bg-[var(--color-surface-elevated)] text-[var(--color-text-tertiary)]"
              )}
            >
              <Upload size={24} />
            </div>
            <p className="text-2xl font-semibold text-[var(--color-text-primary)] mb-1">
              {isDragging ? "Drop your image here" : "Upload Satellite Image"}
            </p>
            <p className="text-base text-[var(--color-text-tertiary)] text-center">
              Drag & drop LISS-IV imagery, or{" "}
              <span className="text-[var(--color-primary)] font-medium">
                browse files
              </span>
            </p>
            <p className="text-2xl text-[var(--color-text-muted)] mt-2">
              JPEG, PNG, TIFF, WebP • Max 50MB
            </p>
          </div>
        )}
      </div>

      {}
      {error && (
        <p className="text-base text-[var(--color-error)] font-medium px-1 animate-fade-in">
          {error}
        </p>
      )}

      {}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
        {}
        <div className="flex-1 space-y-2">
          <label className="flex items-center gap-1.5 text-base font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            <Calendar size={13} />
            Acquisition Month
          </label>
          <div className="relative">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className={cn(
                "w-full appearance-none px-4 py-2.5 rounded-[var(--radius-md)]",
                "bg-[var(--color-surface)] border border-[var(--color-border)]",
                "text-2xl font-medium text-[var(--color-text-primary)]",
                "hover:border-[var(--color-border-hover)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]",
                "transition-all duration-200 outline-none cursor-pointer"
              )}
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label} — {m.season} Season
                </option>
              ))}
            </select>
            {}
            <span className="absolute right-10 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-[var(--radius-full)] bg-[var(--color-success-subtle)] text-[var(--color-success)] text-base font-bold uppercase pointer-events-none">
              {currentSeason}
            </span>
          </div>
        </div>

        {}
        <Button
          variant="primary"
          size="lg"
          loading={isProcessing}
          disabled={!file || isProcessing}
          onClick={handleSubmit}
          className="sm:w-auto w-full"
          icon={<Upload size={16} />}
        >
          {isProcessing ? "Processing..." : "Process Image"}
        </Button>
      </div>
    </div>
  );
}
