import { useState, useEffect, useCallback, useTransition } from "react";
import { serviceRequestsService } from "@/services/serviceRequestsService";
import type {
  ApiServiceRequestItem,
  ServiceRequestsSummary,
  PaginationMeta,
} from "@/types/request";

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

export function useServiceRequests(options: UseServiceRequestsOptions = {}) {
  const [selectedRequestId, setSelectedRequestId] = useState<string | number | null>(
    options.initialRequestId ?? null,
  );
  const [selectedRequestDetails, setSelectedRequestDetails] =
    useState<ApiServiceRequestItem | null>(null);

  const [activeFilter, setActiveFilter] = useState<RequestFilterTab>(
    options.initialFilter ?? "All",
  );
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(options.initialPage ?? 1);
  const [limit, setLimit] = useState(options.initialLimit ?? 10);
  const [sortBy, setSortBy] = useState<string>("preferredDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [requests, setRequests] = useState<ApiServiceRequestItem[]>([]);
  const [summary, setSummary] = useState<ServiceRequestsSummary>({
    totalPending: 0,
    totalAssigned: 0,
    totalInProgress: 0,
    totalCompleted: 0,
    totalCancelled: 0,
  });
  const [pagination, setPagination] = useState<PaginationMeta>({
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

  // Fetch list of requests from backend API
  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const apiStatus = TAB_STATUS_MAP[activeFilter];
      const data = await serviceRequestsService.getServiceRequests({
        page,
        limit,
        status: apiStatus,
        priority: priorityFilter !== "ALL" ? priorityFilter : undefined,
        sortBy,
        sortOrder,
        search: searchQuery.trim() || undefined,
      });

      startTransition(() => {
        setRequests(data.requests || []);
        if (data.summary) setSummary(data.summary);
        if (data.pagination) setPagination(data.pagination);
      });
    } catch (err: unknown) {
      setIsError(true);
      setError(err instanceof Error ? err.message : "Failed to load service requests from server.");
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter, priorityFilter, page, limit, sortBy, sortOrder, searchQuery]);

  // Trigger fetch on query changes
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Fetch single request details when selected
  useEffect(() => {
    const idToLoad = selectedRequestId;
    if (idToLoad === null || idToLoad === undefined) {
      setSelectedRequestDetails(null);
      return;
    }

    let isMounted = true;

    async function loadSingleDetails(targetId: string | number) {
      try {
        const idNumber: string | number =
          typeof targetId === "string"
            ? parseInt(targetId.replace("REQ-", ""), 10) || targetId
            : targetId;

        const details = await serviceRequestsService.getServiceRequestById(idNumber);
        if (isMounted) {
          setSelectedRequestDetails(details);
        }
      } catch (err: unknown) {
        console.error("Failed to load request details:", err);
      }
    }

    loadSingleDetails(idToLoad);

    return () => {
      isMounted = false;
    };
  }, [selectedRequestId]);

  const toggleSort = useCallback(() => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  const selectRequest = useCallback((id: string | number | null) => {
    setSelectedRequestId(id);
  }, []);

  const clearSelectedRequest = useCallback(() => {
    setSelectedRequestId(null);
    setSelectedRequestDetails(null);
  }, []);

  const handleFilterChange = useCallback((tab: RequestFilterTab) => {
    setActiveFilter(tab);
    setPage(1); // reset to page 1 on filter switch
  }, []);

  return {
    requests,
    summary,
    pagination,
    isLoading,
    isError,
    error,
    refetch: fetchRequests,
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
    selectedRequestDetails,
    selectRequest,
    clearSelectedRequest,
  };
}
