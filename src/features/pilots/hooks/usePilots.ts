import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

const defaultPagination: PilotsPagination = {
  total: 0,
  page: 1,
  limit: 9,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

// Helper to build DetailedPilotInfo from raw API detail DTO
export const transformToDetailedInfo = (
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
    rawRating !== null &&
    rawRating !== undefined &&
    !isNaN(Number(rawRating)) &&
    Number(rawRating) > 0
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
        id:
          m.missionCode ||
          m.requestCode ||
          `MSN-${m.id || m.missionId || m.serviceRequestId || detail.userId}`,
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

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
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
    experience:
      totalFlightHours > 0
        ? `${Math.max(1, Math.round(totalFlightHours / 50))} yrs experience`
        : "Certified Operator",
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

export function usePilots(options: UsePilotsOptions = {}) {
  const queryClient = useQueryClient();

  const [selectedPilotId, setSelectedPilotId] = useState<string | number | null>(
    options.initialPilotId ?? null,
  );

  const [activeFilter, setActiveFilter] = useState<PilotFilterTab>(options.initialFilter ?? "All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(options.initialPage ?? 1);
  const [limit, setLimit] = useState(options.initialLimit ?? 9);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Search input debounce (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1); // Reset to page 1 on new search term
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const apiStatus = TAB_STATUS_MAP[activeFilter];

  const queryKey = useMemo(
    () => [
      "pilots",
      { page, limit, status: apiStatus, search: debouncedSearch, sortBy, sortOrder },
    ],
    [page, limit, apiStatus, debouncedSearch, sortBy, sortOrder],
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
      pilotService.getPilots({
        page,
        limit,
        status: apiStatus,
        search: debouncedSearch || undefined,
        sortBy,
        sortOrder,
      }),
    staleTime: 30_000,
  });

  const pilots = useMemo(() => data?.pilots || [], [data?.pilots]);
  const pagination = useMemo(() => data?.pagination || defaultPagination, [data?.pagination]);

  // Query for single pilot details when selected
  const detailQuery = useQuery({
    queryKey: ["pilotDetail", selectedPilotId],
    queryFn: async () => {
      if (selectedPilotId === null || selectedPilotId === undefined) return null;
      try {
        const detail = await pilotService.getPilotById(selectedPilotId);
        const basic = pilots.find((p) => p.userId === Number(selectedPilotId));
        return transformToDetailedInfo(detail, basic);
      } catch (err) {
        console.error("Failed to load pilot details:", err);
        const basic = pilots.find((p) => p.userId === Number(selectedPilotId));
        if (basic) {
          return {
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
          } as DetailedPilotInfo;
        }
        throw err;
      }
    },
    enabled: selectedPilotId !== null && selectedPilotId !== undefined,
    staleTime: 60_000,
  });

  const selectPilot = useCallback((id: string | number | null) => {
    setSelectedPilotId(id);
  }, []);

  const clearSelectedPilot = useCallback(() => {
    setSelectedPilotId(null);
  }, []);

  const handleFilterChange = useCallback((tab: PilotFilterTab) => {
    setActiveFilter(tab);
    setPage(1);
  }, []);

  // Update Status Mutation
  const [updatingPilotIds, setUpdatingPilotIds] = useState<Set<number | string>>(new Set());

  const statusMutation = useMutation({
    mutationFn: ({ pilotId, newStatus }: { pilotId: number | string; newStatus: string }) =>
      pilotService.updatePilotStatus(pilotId, newStatus),
    onMutate: async ({ pilotId, newStatus }) => {
      setUpdatingPilotIds((prev) => new Set(prev).add(pilotId));
    },
    onSuccess: (updatedPilot, { pilotId, newStatus }) => {
      queryClient.setQueryData<{ pilots?: ApiPilotItem[]; pagination?: PilotsPagination }>(
        queryKey,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pilots: (old.pilots || []).map((p) =>
              p.userId === Number(pilotId) || String(p.userId) === String(pilotId)
                ? { ...p, ...(updatedPilot || {}), status: updatedPilot?.status || newStatus }
                : p,
            ),
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: ["pilotDetail", pilotId] });
      queryClient.invalidateQueries({ queryKey: ["pilots"] });
    },
    onSettled: (_, __, { pilotId }) => {
      setUpdatingPilotIds((prev) => {
        const next = new Set(prev);
        next.delete(pilotId);
        return next;
      });
    },
  });

  const updateStatus = useCallback(
    async (pilotId: number | string, newStatus: string) => {
      await statusMutation.mutateAsync({ pilotId, newStatus });
    },
    [statusMutation],
  );

  const isPilotUpdating = useCallback(
    (pilotId: number | string) =>
      updatingPilotIds.has(pilotId) ||
      updatingPilotIds.has(Number(pilotId)) ||
      updatingPilotIds.has(String(pilotId)),
    [updatingPilotIds],
  );

  // Delete Pilot Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => pilotService.deletePilot(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<{ pilots?: ApiPilotItem[]; pagination?: PilotsPagination }>(
        queryKey,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pilots: (old.pilots || []).filter(
              (p) => p.userId !== Number(id) && String(p.userId) !== String(id),
            ),
            pagination: old.pagination
              ? { ...old.pagination, total: Math.max(0, old.pagination.total - 1) }
              : old.pagination,
          };
        },
      );
      if (
        selectedPilotId !== null &&
        (String(selectedPilotId) === String(id) || Number(selectedPilotId) === Number(id))
      ) {
        clearSelectedPilot();
      }
      queryClient.invalidateQueries({ queryKey: ["pilots"] });
    },
  });

  const deletePilot = useCallback(
    async (id: number | string): Promise<void> => {
      await deleteMutation.mutateAsync(id);
    },
    [deleteMutation],
  );

  return {
    pilots,
    pagination,
    totalCount: pagination.total,
    isLoading,
    isError,
    error:
      queryError instanceof Error ? queryError.message : isError ? "Failed to load pilots" : null,
    refetch,
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
    selectedPilotDetails: detailQuery.data ?? null,
    isDetailsLoading: detailQuery.isLoading,
    selectPilot,
    clearSelectedPilot,
    updateStatus,
    updatingPilotIds,
    isPilotUpdating,
    deletePilot,
    deletingPilotId: deleteMutation.isPending
      ? (deleteMutation.variables as string | number)
      : null,
  };
}
