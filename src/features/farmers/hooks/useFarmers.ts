import { useState, useEffect, useCallback, useTransition } from "react";
import { farmerService } from "@/services/farmerService";
import type { ApiFarmerItem, FarmersPagination } from "@/types/farmer";

interface UseFarmersOptions {
  initialFarmerId?: string | number | null;
  initialPage?: number;
  initialLimit?: number;
}

export function useFarmers(options: UseFarmersOptions = {}) {
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | number | null>(
    options.initialFarmerId ?? null,
  );
  const [selectedFarmerDetails, setSelectedFarmerDetails] = useState<ApiFarmerItem | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(options.initialPage ?? 1);
  const [limit, setLimit] = useState(options.initialLimit ?? 10);
  const [sortBy, setSortBy] = useState<"createdAt" | "name" | "email" | "memberSince">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [farmers, setFarmers] = useState<ApiFarmerItem[]>([]);
  const [pagination, setPagination] = useState<FarmersPagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Search input debounce (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1); // Reset to page 1 on new search term
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch farmers list from backend
  const fetchFarmers = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const data = await farmerService.getFarmers({
        page,
        limit,
        search: debouncedSearch || undefined,
        sortBy,
        sortOrder,
      });

      startTransition(() => {
        setFarmers(data.farmers || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      });
    } catch (err: unknown) {
      setIsError(true);
      setError(err instanceof Error ? err.message : "Failed to load farmers from server.");
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch, sortBy, sortOrder]);

  // Trigger fetch on parameter changes
  useEffect(() => {
    fetchFarmers();
  }, [fetchFarmers]);

  // Selected farmer resolution
  const selectedFarmer: ApiFarmerItem | null =
    selectedFarmerDetails ||
    (selectedFarmerId !== null
      ? (farmers.find((f) => String(f.userId) === String(selectedFarmerId)) ?? null)
      : null);

  const selectFarmer = useCallback((id: string | number | null) => {
    setSelectedFarmerId(id);
  }, []);

  const clearSelectedFarmer = useCallback(() => {
    setSelectedFarmerId(null);
    setSelectedFarmerDetails(null);
  }, []);

  return {
    farmers,
    pagination,
    totalCount: pagination.total,
    isLoading,
    isError,
    error,
    refetch: fetchFarmers,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    limit,
    setLimit,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    selectedFarmerId,
    selectedFarmer,
    selectFarmer,
    clearSelectedFarmer,
  };
}
