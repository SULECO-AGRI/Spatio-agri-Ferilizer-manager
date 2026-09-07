import { apiClient } from "@/lib/apiClient";
import type {
  ApiResponse,
  AnalyticsSummaryData,
  CompletedMissionsAnalytics,
  RevenueAnalytics,
  PilotPerformanceAnalytics,
  FarmerGrowthAnalytics,
  PilotPerformanceTableResponse,
} from "@/types/analytics";

export interface PilotPerformanceTableParams {
  page?: number;
  limit?: number;
  sortBy?: "completedMissions" | "averageRatings" | "flightHours" | "pilotName" | "totalEarnings" | "createdAt" | string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export const analyticsService = {
  /**
   * Fetches the 4 Main KPI Cards summary from GET /api/admin/analytics/summary
   */
  async getAnalyticsSummary(): Promise<AnalyticsSummaryData> {
    const response = await apiClient.get<ApiResponse<AnalyticsSummaryData>>(
      "/api/admin/analytics/summary",
    );
    return response.data;
  },

  /**
   * Fetches completed missions operational telemetry from GET /api/admin/analytics/completed-missions
   */
  async getCompletedMissionsAnalytics(): Promise<CompletedMissionsAnalytics> {
    const response = await apiClient.get<ApiResponse<CompletedMissionsAnalytics>>(
      "/api/admin/analytics/completed-missions",
    );
    return response.data;
  },

  /**
   * Fetches detailed revenue & financial analytics from GET /api/admin/analytics/revenue
   */
  async getRevenueAnalytics(): Promise<RevenueAnalytics> {
    const response = await apiClient.get<ApiResponse<RevenueAnalytics>>(
      "/api/admin/analytics/revenue",
    );
    return response.data;
  },

  /**
   * Fetches pilot fleet performance metrics from GET /api/admin/analytics/pilot-performance
   */
  async getPilotPerformanceAnalytics(): Promise<PilotPerformanceAnalytics> {
    const response = await apiClient.get<ApiResponse<PilotPerformanceAnalytics>>(
      "/api/admin/analytics/pilot-performance",
    );
    return response.data;
  },

  /**
   * Fetches farmer growth rate & land coverage analytics from GET /api/admin/analytics/farmer-growth
   */
  async getFarmerGrowthAnalytics(): Promise<FarmerGrowthAnalytics> {
    const response = await apiClient.get<ApiResponse<FarmerGrowthAnalytics>>(
      "/api/admin/analytics/farmer-growth",
    );
    return response.data;
  },

  /**
   * Fetches paginated pilot leaderboard & performance metrics from GET /api/admin/analytics/pilot-performance-table
   */
  async getPilotPerformanceTable(
    params: PilotPerformanceTableParams = {},
  ): Promise<PilotPerformanceTableResponse> {
    const queryParams: Record<string, string | number | boolean | undefined> = {};

    if (params.page !== undefined) queryParams.page = params.page;
    if (params.limit !== undefined) queryParams.limit = params.limit;
    if (params.sortBy) queryParams.sortBy = params.sortBy;
    if (params.sortOrder) queryParams.sortOrder = params.sortOrder;
    if (params.search && params.search.trim()) queryParams.search = params.search.trim();

    const response = await apiClient.get<ApiResponse<PilotPerformanceTableResponse>>(
      "/api/admin/analytics/pilot-performance-table",
      {
        params: queryParams,
      },
    );
    return response.data;
  },
};
