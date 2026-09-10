import { useState, useEffect, useCallback, useMemo, useTransition } from "react";
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

export function useFields(options: UseFieldsOptions = {}) {
  const [fields, setFields] = useState<Field[]>([]);
  const [pagination, setPagination] = useState<FieldsPagination>({
    total: 0,
    page: options.initialPage ?? 1,
    limit: options.initialLimit ?? 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [cropFilter, setCropFilter] = useState<string>("All");
  const [districtFilter, setDistrictFilter] = useState<string>("All");
  const [page, setPage] = useState<number>(options.initialPage ?? 1);
  const [limit, setLimit] = useState<number>(options.initialLimit ?? 10);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [deletingFieldId, setDeletingFieldId] = useState<number | string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [, startTransition] = useTransition();

  // Search debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch fields
  const fetchFields = useCallback(
    async (opts: { silent?: boolean } = {}) => {
      if (!opts.silent) {
        setIsLoading(true);
        setIsError(false);
        setError(null);
      }

      try {
        const queryParams: FieldQueryParams = {
          page,
          limit,
          search: debouncedSearch || undefined,
          cropType: cropFilter === "All" ? undefined : cropFilter,
          district: districtFilter === "All" ? undefined : districtFilter,
          sortBy,
          sortOrder,
        };

        const result = await fieldService.getFields(queryParams);

        startTransition(() => {
          setFields(result.fields || []);
          if (result.pagination) {
            setPagination(result.pagination);
          }
        });
      } catch (err: unknown) {
        if (!opts.silent) {
          setIsError(true);
          setError(err instanceof Error ? err.message : "Failed to load fields from server.");
        }
      } finally {
        if (!opts.silent) {
          setIsLoading(false);
        }
      }
    },
    [page, limit, debouncedSearch, cropFilter, districtFilter, sortBy, sortOrder],
  );

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  // Create Field Action
  const createField = useCallback(
    async (data: CreateFieldDTO): Promise<Field> => {
      setIsSubmitting(true);
      try {
        const newField = await fieldService.createField(data);
        await fetchFields({ silent: true });
        return newField;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to create field.";
        throw new Error(msg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchFields],
  );

  // Update Field Action
  const updateField = useCallback(
    async (id: number | string, data: UpdateFieldDTO): Promise<Field> => {
      setIsSubmitting(true);
      try {
        const updated = await fieldService.updateField(id, data);
        // Optimistically update locally
        setFields((prev) =>
          prev.map((f) =>
            f.id === Number(id) || String(f.id) === String(id) ? { ...f, ...updated } : f,
          ),
        );
        if (
          selectedField &&
          (selectedField.id === Number(id) || String(selectedField.id) === String(id))
        ) {
          setSelectedField({ ...selectedField, ...updated });
        }
        await fetchFields({ silent: true });
        return updated;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to update field.";
        throw new Error(msg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchFields, selectedField],
  );

  // Delete Field Action
  const deleteField = useCallback(
    async (id: number | string): Promise<void> => {
      setDeletingFieldId(id);
      try {
        await fieldService.deleteField(id);
        // Optimistically remove from state
        setFields((prev) => prev.filter((f) => f.id !== Number(id) && String(f.id) !== String(id)));
        setPagination((prev) => ({
          ...prev,
          total: Math.max(0, prev.total - 1),
        }));
        if (
          selectedField &&
          (selectedField.id === Number(id) || String(selectedField.id) === String(id))
        ) {
          setSelectedField(null);
        }
        await fetchFields({ silent: true });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to delete field.";
        throw new Error(msg);
      } finally {
        setDeletingFieldId(null);
      }
    },
    [fetchFields, selectedField],
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
    error,
    metrics,
    refetch: fetchFields,
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
    deletingFieldId,
    isSubmitting,
  };
}
