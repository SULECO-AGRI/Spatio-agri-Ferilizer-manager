import { useState, useEffect, useMemo } from "react";
import { useEstimateCostQuery } from "../api/requestApi";
import type { CostEstimationParams, CostEstimationBreakdown } from "@/types/request";

interface UseCostEstimationOptions {
  debounceMs?: number;
  skip?: boolean;
}

export function useCostEstimation(
  params: CostEstimationParams,
  options: UseCostEstimationOptions = {},
) {
  const { debounceMs = 300, skip = false } = options;

  const [debouncedParams, setDebouncedParams] = useState<CostEstimationParams>(params);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedParams(params);
    }, debounceMs);
    return () => clearTimeout(handler);
  }, [
    params.fieldId,
    params.area,
    params.cropType,
    params.serviceType,
    params.priority,
    debounceMs,
  ]);

  // Determine if query should be performed
  const shouldSkip = useMemo(() => {
    if (skip) return true;
    const hasField = debouncedParams.fieldId && debouncedParams.fieldId > 0;
    const hasArea = debouncedParams.area && debouncedParams.area > 0;
    // Skip only if neither fieldId nor area is provided
    return !hasField && !hasArea;
  }, [skip, debouncedParams.fieldId, debouncedParams.area]);

  const {
    data: estimation,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useEstimateCostQuery(debouncedParams, {
    skip: shouldSkip,
    refetchOnMountOrArgChange: true,
  });

  return {
    estimation: estimation || null,
    isLoading: isLoading || (isFetching && !estimation),
    isFetching,
    isError,
    error,
    refetch,
    isReady: !shouldSkip && Boolean(estimation),
  };
}

export default useCostEstimation;
