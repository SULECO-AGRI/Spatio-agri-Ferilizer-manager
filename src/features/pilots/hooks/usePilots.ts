import { useState, useEffect, useCallback, useTransition } from "react";
import { pilotService } from "@/services/pilotService";
import { formatDate } from "@/lib/utils";
import type {
  ApiPilotItem,
  PilotsPagination,
  DetailedPilotInfo,
  PilotProfileDetailDTO,
  PilotMission,
  MissionResult,
} from "@/types/pilot";

export const pilotFilterTabs = ["All", "Active", "On Mission", "Inactive", "Suspended"] as const;

export type PilotFilterTab = (typeof pilotFilterTabs)[number];

const TAB_STATUS_MAP: Record<PilotFilterTab, string | undefined> = {
  All: undefined,
  Active: "ACTIVE",
  "On Mission": "ON_MISSION",
  Inactive: "INACTIVE",
  Suspended: "SUSPENDED",
};

interface UsePilotsOptions {
  initialPilotId?: string | number | null;
  initialFilter?: PilotFilterTab;
  initialPage?: number;
  initialLimit?: number;
}

export function usePilots(options: UsePilotsOptions = {}) {
  const [selectedPilotId, setSelectedPilotId] = useState<string | number | null>(
    options.initialPilotId ?? null,
  );
  const [selectedPilotDetails, setSelectedPilotDetails] = useState<DetailedPilotInfo | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState<boolean>(false);

  const [activeFilter, setActiveFilter] = useState<PilotFilterTab>(options.initialFilter ?? "All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(options.initialPage ?? 1);
  const [limit, setLimit] = useState(options.initialLimit ?? 9);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [pilots, setPilots] = useState<ApiPilotItem[]>([]);
  const [pagination, setPagination] = useState<PilotsPagination>({
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingPilotIds, setUpdatingPilotIds] = useState<Set<number | string>>(new Set());
  const [, startTransition] = useTransition();

  // Search input debounce (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1); // Reset to page 1 on new search term
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch paginated list of pilots from live backend
  const fetchPilots = useCallback(
    async (options: { silent?: boolean } = {}) => {
      if (!options.silent) {
        setIsLoading(true);
        setIsError(false);
        setError(null);
      }

      try {
        const apiStatus = TAB_STATUS_MAP[activeFilter];
        const data = await pilotService.getPilots({
          page,
          limit,
          status: apiStatus,
          search: debouncedSearch || undefined,
          sortBy,
          sortOrder,
        });

        startTransition(() => {
          setPilots(data.pilots || []);
          if (data.pagination) {
            setPagination(data.pagination);
          }
        });
      } catch (err: unknown) {
        if (!options.silent) {
          setIsError(true);
          setError(err instanceof Error ? err.message : "Failed to load pilots from server.");
        }
      } finally {
        if (!options.silent) {
          setIsLoading(false);
        }
      }
    },
    [activeFilter, page, limit, sortBy, sortOrder, debouncedSearch],
  );

  // Trigger fetch on parameter change
  useEffect(() => {
    fetchPilots();
  }, [fetchPilots]);

  // Helper to build DetailedPilotInfo from raw API detail DTO
  const transformToDetailedInfo = (
    detail: PilotProfileDetailDTO,
    basicItem?: ApiPilotItem,
  ): DetailedPilotInfo => {
    const initials =
      `${detail.firstName?.[0] || ""}${detail.lastName?.[0] || ""}`.toUpperCase() || "PL";
    const rawRating =
      detail.stats?.ratings ??
      detail.stats?.rating ??
      detail.stats?.averageRatings ??
      basicItem?.ratings ??
      basicItem?.rating ??
      basicItem?.averageRatings ??
      (detail as any)?.rating ??
      (detail as any)?.ratings;

    const ratingVal =
      rawRating !== null && rawRating !== undefined && !isNaN(Number(rawRating)) && Number(rawRating) > 0
        ? Number(rawRating)
        : 0;

    const completedMissions = detail.stats?.completedMissions ?? basicItem?.completedMissions ?? 0;
    const totalFlightHours = detail.stats?.totalFlightHours ?? basicItem?.totalFlightHours ?? 0;

    const rawMissions =
      (detail as any)?.missions ||
      (detail as any)?.serviceRequests ||
      (detail as any)?.recentMissions ||
      [];

    const missionHistory: PilotMission[] = Array.isArray(rawMissions)
      ? rawMissions.map((m: any) => ({
          id: m.missionCode || m.requestCode || `MSN-${m.id || m.missionId || m.serviceRequestId || detail.userId}`,
          field: m.fieldName || m.fieldLocation || m.farmName || m.cropType || "Agri Field",
          date: formatDate(m.completedAt || m.scheduledDate || m.createdAt || m.date),
          result: (m.status === "COMPLETED" || m.status === "Completed"
            ? "Completed"
            : m.status === "IN_PROGRESS" || m.status === "On Mission"
            ? "Active"
            : m.status === "FAILED" || m.status === "Failed"
            ? "Failed"
            : m.status === "CANCELLED" || m.status === "Cancelled"
            ? "Cancelled"
            : "Completed") as MissionResult,
        }))
      : [];

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const performanceData = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const monthName = months[d.getMonth()];
      const count = missionHistory.filter((m) => {
        if (!m.date) return false;
        const md = new Date(m.date);
        return (
          !isNaN(md.getTime()) &&
          md.getMonth() === d.getMonth() &&
          md.getFullYear() === d.getFullYear() &&
          m.result === "Completed"
        );
      }).length;
      return { label: monthName, value: count };
    });

    return {
      pilotId: detail.userId,
      name: detail.fullName || `${detail.firstName} ${detail.lastName}`.trim(),
      initials,
      status: detail.status,
      license: detail.licenceNumber || "N/A",
      experience: totalFlightHours > 0 ? `${Math.max(1, Math.round(totalFlightHours / 50))} yrs experience` : "Certified Operator",
      phone: detail.mobile || "N/A",
      email: detail.email || "N/A",
      rating: ratingVal,
      reviewsCount: detail.stats?.totalReviews ?? completedMissions,
      missionsCount: completedMissions,
      flightHours: `${totalFlightHours} hrs`,
      activeMissionsCount: basicItem?.activeMissionsCount ?? detail.stats?.inProgressMissions ?? 0,
      performanceData,
      missionHistory,
    };
  };

  // Fetch single pilot details when selected
  useEffect(() => {
    if (selectedPilotId === null || selectedPilotId === undefined) {
      setSelectedPilotDetails(null);
      return;
    }

    let isMounted = true;
    setIsDetailsLoading(true);

    async function loadPilotDetails(id: string | number) {
      try {
        const detail = await pilotService.getPilotById(id);
        if (isMounted) {
          const basic = pilots.find((p) => p.userId === Number(id));
          setSelectedPilotDetails(transformToDetailedInfo(detail, basic));
        }
      } catch (err: unknown) {
        console.error("Failed to load pilot details:", err);
        // Fallback to basic pilot item if detail endpoint fails
        if (isMounted) {
          const basic = pilots.find((p) => p.userId === Number(id));
          if (basic) {
            setSelectedPilotDetails({
              pilotId: basic.userId,
              name: basic.fullName,
              initials: `${basic.firstName?.[0] || ""}${basic.lastName?.[0] || ""}`.toUpperCase(),
              status: basic.status,
              license: basic.licenceNumber,
              experience: "Active Pilot",
              phone: basic.mobile,
              email: basic.email,
              rating:
                basic.ratings ??
                basic.rating ??
                basic.averageRatings ??
                (basic as any)?.profile?.rating ??
                0,
              reviewsCount: basic.completedMissions,
              missionsCount: basic.completedMissions,
              flightHours: `${basic.totalFlightHours} hrs`,
              activeMissionsCount: basic.activeMissionsCount,
              performanceData: [],
              missionHistory: [],
            });
          }
        }
      } finally {
        if (isMounted) {
          setIsDetailsLoading(false);
        }
      }
    }

    loadPilotDetails(selectedPilotId);

    return () => {
      isMounted = false;
    };
  }, [selectedPilotId, pilots]);

  const selectPilot = useCallback((id: string | number | null) => {
    setSelectedPilotId(id);
  }, []);

  const clearSelectedPilot = useCallback(() => {
    setSelectedPilotId(null);
    setSelectedPilotDetails(null);
  }, []);

  const handleFilterChange = useCallback((tab: PilotFilterTab) => {
    setActiveFilter(tab);
    setPage(1);
  }, []);

  const updateStatus = useCallback(
    async (pilotId: number | string, newStatus: string) => {
      const numericId = Number(pilotId);

      // Track previous status for rollback if request fails
      let previousStatus: string | undefined;
      setPilots((prev) => {
        const target = prev.find(
          (p) => p.userId === numericId || String(p.userId) === String(pilotId),
        );
        if (target) {
          previousStatus = target.status;
        }
        return prev.map((p) =>
          p.userId === numericId || String(p.userId) === String(pilotId)
            ? { ...p, status: newStatus }
            : p,
        );
      });

      // Also optimistically update selectedPilotDetails if open
      setSelectedPilotDetails((prev) => {
        if (prev && (prev.pilotId === numericId || String(prev.pilotId) === String(pilotId))) {
          return { ...prev, status: newStatus };
        }
        return prev;
      });

      // Mark this pilot as actively updating
      setUpdatingPilotIds((prev) => new Set(prev).add(pilotId));

      try {
        const updatedPilot = await pilotService.updatePilotStatus(pilotId, newStatus);
        // Silently reconcile the updated pilot object from server if available
        if (updatedPilot) {
          setPilots((prev) =>
            prev.map((p) =>
              p.userId === numericId || String(p.userId) === String(pilotId)
                ? { ...p, ...updatedPilot, status: updatedPilot.status || newStatus }
                : p,
            ),
          );
        }
      } catch (err: unknown) {
        console.error("Failed to update status, rolling back:", err);
        // Rollback optimistic update
        if (previousStatus !== undefined) {
          setPilots((prev) =>
            prev.map((p) =>
              p.userId === numericId || String(p.userId) === String(pilotId)
                ? { ...p, status: previousStatus! }
                : p,
            ),
          );
          setSelectedPilotDetails((prev) => {
            if (prev && (prev.pilotId === numericId || String(prev.pilotId) === String(pilotId))) {
              return { ...prev, status: previousStatus! };
            }
            return prev;
          });
        }
        throw err;
      } finally {
        setUpdatingPilotIds((prev) => {
          const next = new Set(prev);
          next.delete(pilotId);
          return next;
        });
      }
    },
    [],
  );

  const isPilotUpdating = useCallback(
    (pilotId: number | string) =>
      updatingPilotIds.has(pilotId) ||
      updatingPilotIds.has(Number(pilotId)) ||
      updatingPilotIds.has(String(pilotId)),
    [updatingPilotIds],
  );

  return {
    pilots,
    pagination,
    totalCount: pagination.total,
    isLoading,
    isError,
    error,
    refetch: fetchPilots,
    activeFilter,
    setActiveFilter: handleFilterChange,
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
    selectedPilotId,
    selectedPilotDetails,
    isDetailsLoading,
    selectPilot,
    clearSelectedPilot,
    updateStatus,
    updatingPilotIds,
    isPilotUpdating,
  };
}
