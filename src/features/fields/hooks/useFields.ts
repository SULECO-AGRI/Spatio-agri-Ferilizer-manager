import { useState, useEffect, useCallback, useMemo } from "react";
import {
  useGetFieldsQuery,
  useCreateFieldMutation,
  useUpdateFieldMutation,
  useDeleteFieldMutation,
} from "../api/fieldApi";
import { useAppDispatch } from "@/store/hooks";
import { setSelectedEntity } from "@/store/slices/uiSlice";
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
  const dispatch = useAppDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [cropFilter, setCropFilter] = useState<string>("All");
  const [districtFilter, setDistrictFilter] = useState<string>("All");
  const [page, setPage] = useState<number>(options.initialPage ?? 1);
  const [limit, setLimit] = useState<number>(options.initialLimit ?? 10);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [selectedField, setSelectedFieldState] = useState<Field | null>(null);

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

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error: queryError,
    refetch,
  } = useGetFieldsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  const fields = useMemo(() => data?.fields || [], [data?.fields]);
  const pagination = useMemo(() => data?.pagination || defaultPagination, [data?.pagination]);

  // RTK Query Mutations
  const [triggerCreateField, { isLoading: isCreating }] = useCreateFieldMutation();
  const [triggerUpdateField, { isLoading: isUpdating }] = useUpdateFieldMutation();
  const [triggerDeleteField, { isLoading: isDeleting, originalArgs: deletingFieldId }] =
    useDeleteFieldMutation();

  const setSelectedField = useCallback(
    (field: Field | null | ((prev: Field | null) => Field | null)) => {
      setSelectedFieldState((prev) => {
        const next = typeof field === "function" ? field(prev) : field;
        if (next) {
          dispatch(setSelectedEntity({ type: "FIELD", id: next.id }));
        } else {
          dispatch(setSelectedEntity(null));
        }
        return next;
      });
    },
    [dispatch],
  );

  const createField = useCallback(
    async (dto: CreateFieldDTO): Promise<Field> => {
      const result = await triggerCreateField(dto).unwrap();
      setPage(1);
      return result;
    },
    [triggerCreateField],
  );

  const updateField = useCallback(
    async (id: number | string, updateDto: UpdateFieldDTO): Promise<Field> => {
      const result = await triggerUpdateField({ id, data: updateDto }).unwrap();
      setSelectedFieldState((prev) =>
        prev && (prev.id === Number(id) || String(prev.id) === String(id))
          ? { ...prev, ...result }
          : prev,
      );
      return result;
    },
    [triggerUpdateField],
  );

  const deleteField = useCallback(
    async (id: number | string): Promise<void> => {
      setSelectedFieldState((prev) =>
        prev && (prev.id === Number(id) || String(prev.id) === String(id)) ? null : prev,
      );
      if (fields.length === 1 && page > 1) {
        setPage((prev) => Math.max(1, prev - 1));
      }
      await triggerDeleteField(id).unwrap();
    },
    [triggerDeleteField, fields.length, page],
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
    isLoading: isLoading && !data,
    isFetching,
    isError,
    error:
      queryError && "data" in queryError
        ? ((queryError.data as any)?.message ?? "Failed to load fields")
        : isError
          ? "Failed to load fields"
          : null,
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
    deletingFieldId: isDeleting ? (deletingFieldId as string | number) : null,
    isSubmitting: isCreating || isUpdating || isDeleting,
  };
}
