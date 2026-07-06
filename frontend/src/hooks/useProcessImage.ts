"use client";

import { useMutation } from "@tanstack/react-query";
import { processImage } from "@/lib/api";
import { useAppStore } from "@/store/appStore";
import { generateId } from "@/lib/utils";
import type { ProcessingResponse, ProcessingResult } from "@/types";

// ============================================================================
// useProcessImage Hook
// React Query mutation wrapping the NOVA-SYNC processing API.
// Automatically saves results to the Zustand history store.
// ============================================================================

interface UseProcessImageOptions {
  /** Called on successful processing */
  onSuccess?: (data: ProcessingResponse) => void;
  /** Called on processing error */
  onError?: (error: Error) => void;
}

interface ProcessImageInput {
  file: File;
  month: number;
  /** Base64 preview of the input image for history */
  inputPreview: string;
}

export function useProcessImage(options?: UseProcessImageOptions) {
  const addToHistory = useAppStore((state) => state.addToHistory);
  const setCurrentResult = useAppStore((state) => state.setCurrentResult);

  const mutation = useMutation<ProcessingResponse, Error, ProcessImageInput>({
    mutationFn: async ({ file, month }: ProcessImageInput) => {
      return processImage(file, month);
    },

    onSuccess: (data, variables) => {
      // Build a ProcessingResult and save to history
      const result: ProcessingResult = {
        id: generateId(),
        timestamp: Date.now(),
        fileName: variables.file.name,
        month: variables.month,
        cloudType: data.cloud_type_detected,
        season: data.season_prior_injected,
        qualityScore: data.physics_quality_score,
        spectralReport: data.spectral_report,
        outputImage: data.output_image,
        uncertaintyHeatmap: data.uncertainty_heatmap,
        inputPreview: variables.inputPreview,
      };

      // Persist to Zustand store
      addToHistory(result);
      setCurrentResult(result);

      // Call user-provided callback
      options?.onSuccess?.(data);
    },

    onError: (error) => {
      console.error("[NOVA-SYNC] Processing failed:", error.message);
      options?.onError?.(error);
    },
  });

  return {
    /** Trigger the processing mutation */
    processImage: mutation.mutate,
    /** Async version that returns a promise */
    processImageAsync: mutation.mutateAsync,
    /** Whether processing is in progress */
    isProcessing: mutation.isPending,
    /** Whether processing completed successfully */
    isSuccess: mutation.isSuccess,
    /** Whether processing encountered an error */
    isError: mutation.isError,
    /** The error object if processing failed */
    error: mutation.error,
    /** The raw API response data */
    data: mutation.data,
    /** Reset the mutation state */
    reset: mutation.reset,
  };
}
