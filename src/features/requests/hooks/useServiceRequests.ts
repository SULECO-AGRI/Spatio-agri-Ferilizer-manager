import { useState, useEffect, useCallback, useMemo } from "react";
import {
  useGetServiceRequestsQuery,
  useGetServiceRequestByIdQuery,
  useDeleteServiceRequestMutation,
} from "../api/requestApi";
import type { ServiceRequestsSummary, PaginationMeta } from "@/types/request";

export const requestFilterTabs = [
  "All",
  "Pending",
  "Assigned",
  "In Progress",
  "Completed",
  "Cancelled",
] as const;

export type RequestFilterTab = (typeof requestFilterTabs)[number];

const TAB_STATUS_MAP: Record<RequestFilterTab, string | undefined> = {
  All: undefined,
  Pending: "PENDING",
  Assigned: "ASSIGNED",
  "In Progress": "IN_PROGRESS",
  Completed: "COMPLETED",
  Cancelled: "CANCELLED",
};

interface UseServiceRequestsOptions {
  initialRequestId?: string | number | null;
  initialFilter?: RequestFilterTab;
  initialPage?: number;
  initialLimit?: number;
}

const defaultSummary: ServiceRequestsSummary = {
  totalPending: 0,
  totalAssigned: 0,
  totalInProgress: 0,
  totalCompleted: 0,
  totalCancelled: 0,
};

const defaultPagination: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

export function useServiceRequests(options: UseServiceRequestsOptions = {}) {
  const [selectedRequestId, setSelectedRequestId] = useState<string | number | null>(
    options.initialRequestId ?? null,
  );

  const [activeFilter, setActiveFilter] = useState<RequestFilterTab>(
    options.initialFilter ?? "All",
  );
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(options.initialPage ?? 1);
  const [limit, setLimit] = useState(options.initialLimit ?? 10);
  const [sortBy, setSortBy] = useState<string>("preferredDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Search input debounce (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const apiStatus = TAB_STATUS_MAP[activeFilter];

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      status: apiStatus,
      priority: priorityFilter !== "ALL" ? priorityFilter : undefined,
      sortBy,
      sortOrder,
      search: debouncedSearch || undefined,
    }),
    [page, limit, apiStatus, priorityFilter, sortBy, sortOrder, debouncedSearch],
  );

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error: queryError,
    refetch,
  } = useGetServiceRequestsQuery(queryParams);

  const requests = useMemo(() => data?.requests || [], [data?.requests]);
  const summary = useMemo(() => data?.summary || defaultSummary, [data?.summary]);
  const pagination = useMemo(() => data?.pagination || defaultPagination, [data?.pagination]);

  // Query for single request details
  const parsedRequestId = useMemo(() => {
    if (selectedRequestId === null || selectedRequestId === undefined) return null;
    return typeof selectedRequestId === "string"
      ? parseInt(selectedRequestId.replace("REQ-", ""), 10) || selectedRequestId
      : selectedRequestId;
  }, [selectedRequestId]);

  const {
    data: selectedRequestDetails,
    isLoading: isDetailsLoading,
  } = useGetServiceRequestByIdQuery(parsedRequestId!, {
    skip: parsedRequestId === null,
  });

  // Delete mutation
  const [triggerDeleteRequest, { isLoading: isDeleting, originalArgs: deletingRequestId }] =
    useDeleteServiceRequestMutation();

  const toggleSort = useCallback(() => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  const selectRequest = useCallback((id: string | number | null) => {
    setSelectedRequestId(id);
  }, []);

  const clearSelectedRequest = useCallback(() => {
    setSelectedRequestId(null);
  }, []);

  const handleFilterChange = useCallback((tab: RequestFilterTab) => {
    setActiveFilter(tab);
    setPage(1); // reset to page 1 on filter switch
  }, []);

  const deleteRequest = useCallback(
    async (id: number | string): Promise<void> => {
      const idNumber: string | number =
        typeof id === "string" ? parseInt(id.replace("REQ-", ""), 10) || id : id;
      await triggerDeleteRequest(idNumber).unwrap();
      if (
        selectedRequestId !== null &&
        (String(selectedRequestId) === String(id) || Number(selectedRequestId) === Number(id))
      ) {
        clearSelectedRequest();
      }
    },
    [triggerDeleteRequest, selectedRequestId, clearSelectedRequest],
  );

  return {
    requests,
    summary,
    pagination,
    isLoading: isLoading && !data,
    isFetching,
    isDetailsLoading,
    isError,
    error:
      queryError && "data" in queryError
        ? ((queryError.data as any)?.message ?? "Failed to load requests")
        : isError
          ? "Failed to load requests"
          : null,
    refetch,
    activeFilter,
    setActiveFilter: handleFilterChange,
    priorityFilter,
    setPriorityFilter,
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
    toggleSort,
    selectedRequestId,
    selectedRequestDetails: selectedRequestDetails ?? null,
    selectRequest,
    clearSelectedRequest,
    deleteRequest,
    deletingRequestId: isDeleting ? (deletingRequestId as string | number) : null,
    isDeleting,
  };
}

