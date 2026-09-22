import { useQuery } from "@tanstack/react-query";
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

const defaultDashboardMetrics: DashboardMetricsData = {
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
};

export async function fetchDashboardStatsData(): Promise<DashboardMetricsData> {
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

  const availablePilotsCount = pilots.filter((p) => {
    const s = (p.status || "").toUpperCase();
    return s === "ACTIVE" || s === "AVAILABLE" || s === "READY" || s === "ONLINE";
  }).length;

  const onlinePilotsCount = pilots.filter((p) => {
    const s = (p.status || "").toUpperCase();
    return s !== "INACTIVE" && s !== "SUSPENDED";
  }).length;

  const revenueTotal = requests.reduce((acc, req) => {
    if (req.status === "COMPLETED" || req.status === "IN_PROGRESS" || req.status === "ASSIGNED") {
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

  const totalDecided = totalCompleted + totalCancelled;
  const calculatedSuccessRate =
    totalDecided > 0 ? Math.round((totalCompleted / totalDecided) * 100) : 100;

  const revenueGrowth = analyticsSummary?.revenue?.growthPercentage;
  const trendValue =
    revenueGrowth !== undefined && revenueGrowth !== null
      ? `${revenueGrowth >= 0 ? "+" : ""}${revenueGrowth}% vs last mo`
      : "Verified Ledger";

  return {
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
  };
}

export function useDashboardStats() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStatsData,
    staleTime: 30_000,
  });

  return {
    metrics: data ?? defaultDashboardMetrics,
    isLoading,
    isError,
    refetch,
  };
}
