import { useState, useEffect, useCallback, useMemo } from "react";
import {
  useGetFarmersQuery,
  useDeleteFarmerMutation,
} from "../api/farmerApi";
import type { ApiFarmerItem, FarmersPagination } from "@/types/farmer";

interface UseFarmersOptions {
  initialFarmerId?: string | number | null;
  initialPage?: number;
  initialLimit?: number;
}

const defaultPagination: FarmersPagination = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

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

  // Search input debounce (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1); // Reset to page 1 on new search term
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      search: debouncedSearch || undefined,
      sortBy,
      sortOrder,
    }),
    [page, limit, debouncedSearch, sortBy, sortOrder],
  );

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error: queryError,
    refetch,
  } = useGetFarmersQuery(queryParams);

  const farmers = useMemo(() => data?.farmers || [], [data?.farmers]);
  const pagination = useMemo(() => data?.pagination || defaultPagination, [data?.pagination]);

  // Selected farmer resolution
  const selectedFarmer: ApiFarmerItem | null = useMemo(() => {
    if (selectedFarmerDetails) return selectedFarmerDetails;
    if (selectedFarmerId === null) return null;
    return farmers.find((f) => String(f.userId) === String(selectedFarmerId)) ?? null;
  }, [selectedFarmerDetails, selectedFarmerId, farmers]);

  const selectFarmer = useCallback((id: string | number | null) => {
    setSelectedFarmerId(id);
  }, []);

  const clearSelectedFarmer = useCallback(() => {
    setSelectedFarmerId(null);
    setSelectedFarmerDetails(null);
  }, []);

  const [triggerDeleteFarmer, { isLoading: isDeleting, originalArgs: deletingFarmerId }] =
    useDeleteFarmerMutation();

  const deleteFarmer = useCallback(
    async (id: number | string): Promise<void> => {
      await triggerDeleteFarmer(id).unwrap();
      if (
        selectedFarmerId !== null &&
        (String(selectedFarmerId) === String(id) || Number(selectedFarmerId) === Number(id))
      ) {
        clearSelectedFarmer();
      }
    },
    [triggerDeleteFarmer, selectedFarmerId, clearSelectedFarmer],
  );

  return {
    farmers,
    pagination,
    totalCount: pagination.total,
    isLoading: isLoading && !data,
    isFetching,
    isError,
    error:
      queryError && "data" in queryError
        ? ((queryError.data as any)?.message ?? "Failed to load farmers")
        : isError
          ? "Failed to load farmers"
          : null,
    refetch,
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
    deleteFarmer,
    deletingFarmerId: isDeleting ? (deletingFarmerId as string | number) : null,
  };
}
