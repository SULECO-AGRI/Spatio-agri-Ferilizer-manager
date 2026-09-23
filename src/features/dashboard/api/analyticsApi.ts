import { baseApi } from "@/store/api/baseApi";
import type {
  ApiResponse,
  AnalyticsSummaryData,
  CompletedMissionsAnalytics,
  RevenueAnalytics,
  PilotPerformanceAnalytics,
  FarmerGrowthAnalytics,
  PilotPerformanceTableResponse,
} from "@/types/analytics";
import type { PilotPerformanceTableParams } from "@/services/analyticsService";

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnalyticsSummary: builder.query<AnalyticsSummaryData, void>({
      query: () => ({
        url: "/api/admin/analytics/summary",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<AnalyticsSummaryData>) => response.data,
      providesTags: ["Analytics"],
    }),

    getCompletedMissionsAnalytics: builder.query<CompletedMissionsAnalytics, void>({
      query: () => ({
        url: "/api/admin/analytics/completed-missions",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<CompletedMissionsAnalytics>) => response.data,
      providesTags: ["Analytics"],
    }),

    getRevenueAnalytics: builder.query<RevenueAnalytics, void>({
      query: () => ({
        url: "/api/admin/analytics/revenue",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<RevenueAnalytics>) => response.data,
      providesTags: ["Analytics", "Payments"],
    }),

    getPilotPerformanceAnalytics: builder.query<PilotPerformanceAnalytics, void>({
      query: () => ({
        url: "/api/admin/analytics/pilot-performance",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<PilotPerformanceAnalytics>) => response.data,
      providesTags: ["Analytics", "Pilots"],
    }),

    getFarmerGrowthAnalytics: builder.query<FarmerGrowthAnalytics, void>({
      query: () => ({
        url: "/api/admin/analytics/farmer-growth",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<FarmerGrowthAnalytics>) => response.data,
      providesTags: ["Analytics", "Farmers"],
    }),

    getPilotPerformanceTable: builder.query<
      PilotPerformanceTableResponse,
      PilotPerformanceTableParams | void
    >({
      query: (params) => {
        const queryParams: Record<string, string | number | boolean | undefined> = {};
        if (params) {
          if (params.page !== undefined) queryParams.page = params.page;
          if (params.limit !== undefined) queryParams.limit = params.limit;
          if (params.sortBy) queryParams.sortBy = params.sortBy;
          if (params.sortOrder) queryParams.sortOrder = params.sortOrder;
          if (params.search && params.search.trim()) queryParams.search = params.search.trim();
        }

        return {
          url: "/api/admin/analytics/pilot-performance-table",
          method: "GET",
          params: queryParams,
        };
      },
      transformResponse: (response: ApiResponse<PilotPerformanceTableResponse>) => response.data,
      providesTags: ["Analytics", "Pilots"],
    }),
  }),
});

export const {
  useGetAnalyticsSummaryQuery,
  useGetCompletedMissionsAnalyticsQuery,
  useGetRevenueAnalyticsQuery,
  useGetPilotPerformanceAnalyticsQuery,
  useGetFarmerGrowthAnalyticsQuery,
  useGetPilotPerformanceTableQuery,
} = analyticsApi;
