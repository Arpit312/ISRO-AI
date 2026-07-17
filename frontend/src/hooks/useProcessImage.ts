"use client";

import { useMutation } from "@tanstack/react-query";
import { processImage } from "@/lib/api";
import { useAppStore } from "@/store/appStore";
import { generateId } from "@/lib/utils";
import type { ProcessingResponse, ProcessingResult } from "@/types";

interface UseProcessImageOptions {
    onSuccess?: (data: ProcessingResponse) => void;
    onError?: (error: Error) => void;
}

interface ProcessImageInput {
  file: File;
  month: number;
    inputPreview: string;
}

export function useProcessImage(options?: UseProcessImageOptions) {
  const addToHistory = useAppStore((state) => state.addToHistory);
  const setCurrentResult = useAppStore((state) => state.setCurrentResult);

  const mutation = useMutation<ProcessingResponse, Error, ProcessImageInput>({
    mutationFn: async ({ file, month }: ProcessImageInput) => {
      const data = await processImage(file, month);
      
      // Catch backend errors that return 200 OK with {"status": "error"}
      if (data.status === "error") {
        throw new Error((data as any).message || "Backend processing failed");
      }
      
      return data;
    },

    onSuccess: (data, variables) => {

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

      addToHistory(result);
      setCurrentResult(result);

      options?.onSuccess?.(data);
    },

    onError: (error) => {
      console.error("[NOVA-SYNC] Processing failed:", error.message);
      options?.onError?.(error);
    },
  });

  return {
        processImage: mutation.mutate,
        processImageAsync: mutation.mutateAsync,
        isProcessing: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
        data: mutation.data,
        reset: mutation.reset,
  };
}
