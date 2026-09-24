import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analyticsService";
import type {
  AnalyticsSummaryData,
  CompletedMissionsAnalytics,
  RevenueAnalytics,
  PilotPerformanceAnalytics,
  FarmerGrowthAnalytics,
  PilotPerformanceTableRow,
  AnalyticsPagination,
} from "@/types/analytics";

export interface UseReportsAnalyticsOptions {
  initialPage?: number;
  initialLimit?: number;
  initialSortBy?: string;
  initialSortOrder?: "asc" | "desc";
}

interface OverviewData {
  summary: AnalyticsSummaryData | null;
  completedMissions: CompletedMissionsAnalytics | null;
  revenue: RevenueAnalytics | null;
  pilotPerformance: PilotPerformanceAnalytics | null;
  farmerGrowth: FarmerGrowthAnalytics | null;
  lastUpdated: Date;
}

const defaultPagination: AnalyticsPagination = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

async function fetchOverviewAnalyticsData(): Promise<OverviewData> {
  const [summaryRes, missionsRes, revenueRes, pilotRes, farmerRes] = await Promise.allSettled([
    analyticsService.getAnalyticsSummary(),
    analyticsService.getCompletedMissionsAnalytics(),
    analyticsService.getRevenueAnalytics(),
    analyticsService.getPilotPerformanceAnalytics(),
    analyticsService.getFarmerGrowthAnalytics(),
  ]);

  return {
    summary: summaryRes.status === "fulfilled" ? summaryRes.value : null,
    completedMissions: missionsRes.status === "fulfilled" ? missionsRes.value : null,
    revenue: revenueRes.status === "fulfilled" ? revenueRes.value : null,
    pilotPerformance: pilotRes.status === "fulfilled" ? pilotRes.value : null,
    farmerGrowth: farmerRes.status === "fulfilled" ? farmerRes.value : null,
    lastUpdated: new Date(),
  };
}

export function useReportsAnalytics(options: UseReportsAnalyticsOptions = {}) {
  const [page, setPage] = useState<number>(options.initialPage ?? 1);
  const [limit, setLimit] = useState<number>(options.initialLimit ?? 10);
  const [sortBy, setSortBy] = useState<string>(options.initialSortBy ?? "completedMissions");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(options.initialSortOrder ?? "desc");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Query overview stats
  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    isFetching: isOverviewFetching,
    isError: isOverviewError,
    error: overviewError,
    refetch: refetchOverview,
  } = useQuery({
    queryKey: ["reportsOverviewAnalytics"],
    queryFn: fetchOverviewAnalyticsData,
    staleTime: 60_000,
  });

  // Query pilot performance table
  const tableQueryKey = useMemo(
    () => ["pilotPerformanceTable", { page, limit, sortBy, sortOrder, search: searchQuery }],
    [page, limit, sortBy, sortOrder, searchQuery],
  );

  const {
    data: tableData,
    isLoading: isTableLoading,
    isFetching: isTableFetching,
    refetch: refetchTable,
  } = useQuery({
    queryKey: tableQueryKey,
    queryFn: () =>
      analyticsService.getPilotPerformanceTable({
        page,
        limit,
        sortBy,
        sortOrder,
        search: searchQuery || undefined,
      }),
    staleTime: 30_000,
  });

  const pilots: PilotPerformanceTableRow[] = useMemo(
    () => tableData?.pilots || [],
    [tableData?.pilots],
  );
  const pagination: AnalyticsPagination = useMemo(
    () => tableData?.pagination || { ...defaultPagination, page, limit },
    [tableData?.pagination, page, limit],
  );

  const handleSort = useCallback(
    (column: string) => {
      if (sortBy === column) {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortBy(column);
        setSortOrder("desc");
      }
      setPage(1);
    },
    [sortBy],
  );

  const loadAll = useCallback(async () => {
    await Promise.all([refetchOverview(), refetchTable()]);
  }, [refetchOverview, refetchTable]);

  const exportToCSV = useCallback(() => {
    if (!pilots.length) return;

    const headers = [
      "Pilot Name",
      "Email",
      "Mobile",
      "License",
      "Status",
      "Completed Missions",
      "Rating",
      "Flight Hours",
      "Earnings (LKR)",
    ];
    const rows = pilots.map((p) => [
      `"${p.pilotName}"`,
      `"${p.email}"`,
      `"${p.mobile}"`,
      `"${p.licenceNumber}"`,
      `"${p.status}"`,
      p.missions?.completedMissions ?? 0,
      p.averageRatings,
      p.flightHours,
      p.totalEarnings,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Spatio_Agri_Pilot_Performance_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [pilots]);

  return {
    summary: overviewData?.summary ?? null,
    completedMissions: overviewData?.completedMissions ?? null,
    revenue: overviewData?.revenue ?? null,
    pilotPerformance: overviewData?.pilotPerformance ?? null,
    farmerGrowth: overviewData?.farmerGrowth ?? null,
    pilots,
    pagination,
    page,
    setPage,
    limit,
    setLimit,
    sortBy,
    sortOrder,
    handleSort,
    searchQuery,
    setSearchQuery,
    isLoading: isOverviewLoading,
    isTableLoading,
    isFetching: isOverviewFetching || isTableFetching,
    isError: isOverviewError,
    error:
      overviewError instanceof Error
        ? overviewError.message
        : isOverviewError
          ? "Failed to load analytics"
          : null,
    lastUpdated: overviewData?.lastUpdated ?? new Date(),
    refetch: loadAll,
    exportToCSV,
  };
}
