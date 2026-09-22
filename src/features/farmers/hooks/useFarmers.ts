import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { farmerService } from "@/services/farmerService";
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
  const queryClient = useQueryClient();

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

  // TanStack Query for farmers list
  const queryKey = useMemo(
    () => ["farmers", { page, limit, search: debouncedSearch, sortBy, sortOrder }],
    [page, limit, debouncedSearch, sortBy, sortOrder],
  );

  const {
    data,
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () =>
      farmerService.getFarmers({
        page,
        limit,
        search: debouncedSearch || undefined,
        sortBy,
        sortOrder,
      }),
    staleTime: 30_000,
  });

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

  // Delete mutation with optimistic updates and invalidation
  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => farmerService.deleteFarmer(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<{ farmers?: ApiFarmerItem[]; pagination?: FarmersPagination }>(
        queryKey,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            farmers: (old.farmers || []).filter(
              (f) => f.userId !== Number(id) && String(f.userId) !== String(id),
            ),
            pagination: old.pagination
              ? { ...old.pagination, total: Math.max(0, old.pagination.total - 1) }
              : old.pagination,
          };
        },
      );
      if (
        selectedFarmerId !== null &&
        (String(selectedFarmerId) === String(id) || Number(selectedFarmerId) === Number(id))
      ) {
        clearSelectedFarmer();
      }
      queryClient.invalidateQueries({ queryKey: ["farmers"] });
    },
  });

  const deleteFarmer = useCallback(
    async (id: number | string): Promise<void> => {
      await deleteMutation.mutateAsync(id);
    },
    [deleteMutation],
  );

  return {
    farmers,
    pagination,
    totalCount: pagination.total,
    isLoading,
    isError,
    error:
      queryError instanceof Error ? queryError.message : isError ? "Failed to load farmers" : null,
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
    deletingFarmerId: deleteMutation.isPending
      ? (deleteMutation.variables as string | number)
      : null,
  };
}
