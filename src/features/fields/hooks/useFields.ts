import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fieldService } from "@/services/fieldService";
import type {
  Field,
  FieldsPagination,
  FieldQueryParams,
  CreateFieldDTO,
  UpdateFieldDTO,
} from "@/types/field";

export const cropFilterOptions = [
  "All",
  "Paddy",
  "Tea",
  "Coconut",
  "Rubber",
  "Vegetables",
  "Maize",
  "Fruits",
] as const;

export type CropFilterType = (typeof cropFilterOptions)[number];

interface UseFieldsOptions {
  initialPage?: number;
  initialLimit?: number;
}

const defaultPagination: FieldsPagination = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

export function useFields(options: UseFieldsOptions = {}) {
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [cropFilter, setCropFilter] = useState<string>("All");
  const [districtFilter, setDistrictFilter] = useState<string>("All");
  const [page, setPage] = useState<number>(options.initialPage ?? 1);
  const [limit, setLimit] = useState<number>(options.initialLimit ?? 10);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [selectedField, setSelectedField] = useState<Field | null>(null);

  // Search debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const queryParams: FieldQueryParams = useMemo(
    () => ({
      page,
      limit,
      search: debouncedSearch || undefined,
      cropType: cropFilter === "All" ? undefined : cropFilter,
      district: districtFilter === "All" ? undefined : districtFilter,
      sortBy,
      sortOrder,
    }),
    [page, limit, debouncedSearch, cropFilter, districtFilter, sortBy, sortOrder],
  );

  const queryKey = useMemo(() => ["fields", queryParams], [queryParams]);

  const {
    data,
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => fieldService.getFields(queryParams),
    staleTime: 30_000,
  });

  const fields = useMemo(() => data?.fields || [], [data?.fields]);
  const pagination = useMemo(() => data?.pagination || defaultPagination, [data?.pagination]);

  // Create Field Mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateFieldDTO) => fieldService.createField(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fields"] });
    },
  });

  const createField = useCallback(
    async (dto: CreateFieldDTO): Promise<Field> => {
      return await createMutation.mutateAsync(dto);
    },
    [createMutation],
  );

  // Update Field Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdateFieldDTO }) =>
      fieldService.updateField(id, data),
    onSuccess: (updatedField, { id }) => {
      queryClient.setQueryData<{ fields?: Field[]; pagination?: FieldsPagination }>(
        queryKey,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            fields: (old.fields || []).map((f) =>
              f.id === Number(id) || String(f.id) === String(id) ? { ...f, ...updatedField } : f,
            ),
          };
        },
      );
      if (
        selectedField &&
        (selectedField.id === Number(id) || String(selectedField.id) === String(id))
      ) {
        setSelectedField((prev) => (prev ? { ...prev, ...updatedField } : null));
      }
      queryClient.invalidateQueries({ queryKey: ["fields"] });
    },
  });

  const updateField = useCallback(
    async (id: number | string, data: UpdateFieldDTO): Promise<Field> => {
      return await updateMutation.mutateAsync({ id, data });
    },
    [updateMutation],
  );

  // Delete Field Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => fieldService.deleteField(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<{ fields?: Field[]; pagination?: FieldsPagination }>(
        queryKey,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            fields: (old.fields || []).filter(
              (f) => f.id !== Number(id) && String(f.id) !== String(id),
            ),
            pagination: old.pagination
              ? { ...old.pagination, total: Math.max(0, old.pagination.total - 1) }
              : old.pagination,
          };
        },
      );
      if (
        selectedField &&
        (selectedField.id === Number(id) || String(selectedField.id) === String(id))
      ) {
        setSelectedField(null);
      }
      queryClient.invalidateQueries({ queryKey: ["fields"] });
    },
  });

  const deleteField = useCallback(
    async (id: number | string): Promise<void> => {
      await deleteMutation.mutateAsync(id);
    },
    [deleteMutation],
  );

  // Computed summary metrics
  const metrics = useMemo(() => {
    const totalCount = pagination.total || fields.length;
    const totalArea = fields.reduce((acc, f) => acc + (Number(f.area) || 0), 0);
    const uniqueFarmers = new Set(fields.map((f) => f.farmer_id || f.farmer?.id)).size;

    const cropCounts: Record<string, number> = {};
    fields.forEach((f) => {
      const c = f.crop_type || "General";
      cropCounts[c] = (cropCounts[c] || 0) + 1;
    });

    let dominantCrop = "Paddy (Rice)";
    let maxCount = 0;
    Object.entries(cropCounts).forEach(([crop, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantCrop = crop;
      }
    });

    return {
      totalFields: totalCount,
      totalAreaManaged: Number(totalArea.toFixed(1)),
      uniqueFarmers: uniqueFarmers || 0,
      dominantCrop,
    };
  }, [fields, pagination.total]);

  const handleCropFilterChange = useCallback((crop: string) => {
    setCropFilter(crop);
    setPage(1);
  }, []);

  return {
    fields,
    pagination,
    totalCount: pagination.total,
    isLoading,
    isError,
    error:
      queryError instanceof Error ? queryError.message : isError ? "Failed to load fields" : null,
    metrics,
    refetch,
    searchQuery,
    setSearchQuery,
    cropFilter,
    setCropFilter: handleCropFilterChange,
    districtFilter,
    setDistrictFilter,
    page,
    setPage,
    limit,
    setLimit,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    selectedField,
    selectField: setSelectedField,
    createField,
    updateField,
    deleteField,
    deletingFieldId: deleteMutation.isPending
      ? (deleteMutation.variables as string | number)
      : null,
    isSubmitting: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
}
