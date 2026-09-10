import { useState, useEffect, useCallback, useTransition } from "react";
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

export function useReportsAnalytics(options: UseReportsAnalyticsOptions = {}) {
  // Aggregate KPI state
  const [summary, setSummary] = useState<AnalyticsSummaryData | null>(null);
  const [completedMissions, setCompletedMissions] = useState<CompletedMissionsAnalytics | null>(
    null,
  );
  const [revenue, setRevenue] = useState<RevenueAnalytics | null>(null);
  const [pilotPerformance, setPilotPerformance] = useState<PilotPerformanceAnalytics | null>(null);
  const [farmerGrowth, setFarmerGrowth] = useState<FarmerGrowthAnalytics | null>(null);

  // Pilot Table state
  const [pilots, setPilots] = useState<PilotPerformanceTableRow[]>([]);
  const [pagination, setPagination] = useState<AnalyticsPagination>({
    total: 0,
    page: options.initialPage ?? 1,
    limit: options.initialLimit ?? 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [page, setPage] = useState<number>(options.initialPage ?? 1);
  const [limit, setLimit] = useState<number>(options.initialLimit ?? 10);
  const [sortBy, setSortBy] = useState<string>(options.initialSortBy ?? "completedMissions");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(options.initialSortOrder ?? "desc");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTableLoading, setIsTableLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const [, startTransition] = useTransition();

  // Fetch overview analytics
  const fetchOverviewAnalytics = useCallback(async () => {
    try {
      const [summaryRes, missionsRes, revenueRes, pilotRes, farmerRes] = await Promise.allSettled([
        analyticsService.getAnalyticsSummary(),
        analyticsService.getCompletedMissionsAnalytics(),
        analyticsService.getRevenueAnalytics(),
        analyticsService.getPilotPerformanceAnalytics(),
        analyticsService.getFarmerGrowthAnalytics(),
      ]);

      if (summaryRes.status === "fulfilled") setSummary(summaryRes.value);
      if (missionsRes.status === "fulfilled") setCompletedMissions(missionsRes.value);
      if (revenueRes.status === "fulfilled") setRevenue(revenueRes.value);
      if (pilotRes.status === "fulfilled") setPilotPerformance(pilotRes.value);
      if (farmerRes.status === "fulfilled") setFarmerGrowth(farmerRes.value);

      setLastUpdated(new Date());
    } catch (err: unknown) {
      console.error("Failed to fetch overview analytics:", err);
      setIsError(true);
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    }
  }, []);

  // Fetch paginated pilot performance table
  const fetchPilotTable = useCallback(async () => {
    setIsTableLoading(true);
    try {
      const data = await analyticsService.getPilotPerformanceTable({
        page,
        limit,
        sortBy,
        sortOrder,
        search: searchQuery || undefined,
      });

      startTransition(() => {
        setPilots(data.pilots || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      });
    } catch (err: unknown) {
      console.error("Failed to fetch pilot performance table:", err);
    } finally {
      setIsTableLoading(false);
    }
  }, [page, limit, sortBy, sortOrder, searchQuery]);

  // Initial load
  const loadAll = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      await Promise.all([fetchOverviewAnalytics(), fetchPilotTable()]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchOverviewAnalytics, fetchPilotTable]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Handle table param changes
  useEffect(() => {
    fetchPilotTable();
  }, [fetchPilotTable]);

  // Sorting handler
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
    setPage(1);
  };

  // Export helper (CSV)
  const exportToCSV = () => {
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
  };

  return {
    summary,
    completedMissions,
    revenue,
    pilotPerformance,
    farmerGrowth,
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
    isLoading,
    isTableLoading,
    isError,
    error,
    lastUpdated,
    refetch: loadAll,
    exportToCSV,
  };
}
