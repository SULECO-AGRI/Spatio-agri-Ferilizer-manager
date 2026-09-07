import { useState, useMemo, useCallback } from "react";

export interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  totalItems?: number;
}

export interface UsePaginationReturn {
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (pageNumber: number) => void;
  startIndex: number;
  endIndex: number;
}

export function usePagination({
  initialPage = 1,
  initialLimit = 10,
  totalItems = 0,
}: UsePaginationOptions = {}): UsePaginationReturn {
  const [page, setPageState] = useState<number>(initialPage);
  const [limit, setLimitState] = useState<number>(initialLimit);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / limit));
  }, [totalItems, limit]);

  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const goToPage = useCallback(
    (pageNumber: number) => {
      const target = Math.max(1, Math.min(pageNumber, totalPages));
      setPageState(target);
    },
    [totalPages],
  );

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setPageState((p) => p + 1);
    }
  }, [hasNextPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      setPageState((p) => Math.max(1, p - 1));
    }
  }, [hasPrevPage]);

  const setLimit = useCallback((newLimit: number) => {
    setLimitState(newLimit);
    setPageState(1);
  }, []);

  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalItems);

  return {
    page,
    setPage: setPageState,
    limit,
    setLimit,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    goToPage,
    startIndex,
    endIndex,
  };
}
