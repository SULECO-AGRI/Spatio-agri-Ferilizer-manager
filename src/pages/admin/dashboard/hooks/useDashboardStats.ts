import { useState, useEffect, useCallback } from "react";
import { serviceRequestsService } from "@/services/serviceRequestsService";
import { pilotService } from "@/services/pilotService";
import { analyticsService } from "@/services/analyticsService";
import type { ApiServiceRequestItem } from "@/types/request";
import type { ApiPilotItem } from "@/types/pilot";
import type { AnalyticsSummaryData } from "@/types/analytics";

export interface DashboardMetricsData {
  pendingRequests: number;
  activeMissions: number;
  availablePilots: number;
  totalPilots: number;
  onlinePilots: number;
  todayRevenue: number;
  todayRevenueFormatted: string;
  revenueTrend: { value: string; isPositive: boolean };
  successRate: number;
  recentRequests: ApiServiceRequestItem[];
  allPilots: ApiPilotItem[];
}

export function useDashboardStats() {
  const [metrics, setMetrics] = useState<DashboardMetricsData>({
    pendingRequests: 0,
    activeMissions: 0,
    availablePilots: 0,
    totalPilots: 0,
    onlinePilots: 0,
    todayRevenue: 0,
    todayRevenueFormatted: "LKR 0",
    revenueTrend: { value: "+12% vs yesterday", isPositive: true },
    successRate: 100,
    recentRequests: [],
    allPilots: [],
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      // Parallel fetch of service requests, pilots, and analytics summary
      const [requestsRes, pilotsRes, analyticsRes] = await Promise.allSettled([
        serviceRequestsService.getServiceRequests({ limit: 100 }),
        pilotService.getPilots({ limit: 100 }),
        analyticsService.getAnalyticsSummary(),
      ]);

      let requests: ApiServiceRequestItem[] = [];
      let totalPending = 0;
      let totalInProgress = 0;
      let totalCompleted = 0;
      let totalCancelled = 0;

      if (requestsRes.status === "fulfilled" && requestsRes.value) {
        requests = requestsRes.value.requests || [];
        const summary = requestsRes.value.summary;

        if (summary) {
          totalPending = summary.totalPending ?? 0;
          totalInProgress = summary.totalInProgress ?? 0;
          totalCompleted = summary.totalCompleted ?? 0;
          totalCancelled = summary.totalCancelled ?? 0;
        } else {
          totalPending = requests.filter((r) => r.status === "PENDING").length;
          totalInProgress = requests.filter((r) => r.status === "IN_PROGRESS").length;
          totalCompleted = requests.filter((r) => r.status === "COMPLETED").length;
          totalCancelled = requests.filter((r) => r.status === "CANCELLED").length;
        }
      }

      let pilots: ApiPilotItem[] = [];
      let totalPilotsCount = 0;

      if (pilotsRes.status === "fulfilled" && pilotsRes.value) {
        pilots = pilotsRes.value.pilots || [];
        totalPilotsCount = pilotsRes.value.pagination?.total || pilots.length;
      }

      // Count available pilots (ACTIVE, AVAILABLE, or READY)
      const availablePilotsCount = pilots.filter((p) => {
        const s = (p.status || "").toUpperCase();
        return s === "ACTIVE" || s === "AVAILABLE" || s === "READY" || s === "ONLINE";
      }).length;

      // Online pilots
      const onlinePilotsCount = pilots.filter((p) => {
        const s = (p.status || "").toUpperCase();
        return s !== "INACTIVE" && s !== "SUSPENDED";
      }).length;

      // Calculate revenue from active and completed requests with actual recorded estimatedCost
      const revenueTotal = requests.reduce((acc, req) => {
        if (
          req.status === "COMPLETED" ||
          req.status === "IN_PROGRESS" ||
          req.status === "ASSIGNED"
        ) {
          const cost = Number(req.estimatedCost);
          if (!isNaN(cost) && cost > 0) return acc + cost;
        }
        return acc;
      }, 0);

      let analyticsSummary: AnalyticsSummaryData | null = null;
      if (analyticsRes.status === "fulfilled" && analyticsRes.value) {
        analyticsSummary = analyticsRes.value;
      }

      const displayRevenue =
        analyticsSummary?.revenue?.value !== undefined && analyticsSummary.revenue.value > 0
          ? analyticsSummary.revenue.value
          : revenueTotal;

      const displayRevenueFormatted =
        analyticsSummary?.revenue?.formatted || `LKR ${displayRevenue.toLocaleString()}`;

      // Mission success rate
      const totalDecided = totalCompleted + totalCancelled;
      const calculatedSuccessRate =
        totalDecided > 0 ? Math.round((totalCompleted / totalDecided) * 100) : 100;

      const revenueGrowth = analyticsSummary?.revenue?.growthPercentage;
      const trendValue =
        revenueGrowth !== undefined && revenueGrowth !== null
          ? `${revenueGrowth >= 0 ? "+" : ""}${revenueGrowth}% vs last mo`
          : "Verified Ledger";

      setMetrics({
        pendingRequests: totalPending,
        activeMissions: totalInProgress,
        availablePilots: availablePilotsCount,
        totalPilots: analyticsSummary?.pilotPerformance?.totalPilots || totalPilotsCount,
        onlinePilots: onlinePilotsCount,
        todayRevenue: displayRevenue,
        todayRevenueFormatted: displayRevenueFormatted,
        revenueTrend: {
          value: trendValue,
          isPositive: (revenueGrowth ?? 0) >= 0,
        },
        successRate: calculatedSuccessRate,
        recentRequests: requests,
        allPilots: pilots,
      });
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    metrics,
    isLoading,
    isError,
    refetch: fetchStats,
  };
}
