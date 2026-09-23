import { baseApi } from "@/store/api/baseApi";
import type {
  ApiServiceRequestItem,
  ServiceRequestsListResponse,
  ServiceRequestDetailsResponse,
  ServiceRequestQueryParams,
  CandidatePilot,
  CandidatePilotsResponse,
  AssignPilotResponse,
} from "@/types/request";

export const requestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServiceRequests: builder.query<
      ServiceRequestsListResponse["data"],
      ServiceRequestQueryParams | void
    >({
      query: (params) => {
        const queryParams: Record<string, string | number | boolean | undefined> = {};
        if (params) {
          if (params.page !== undefined) queryParams.page = params.page;
          if (params.limit !== undefined) queryParams.limit = params.limit;
          if (params.status && params.status !== "ALL") queryParams.status = params.status;
          if (params.priority && params.priority !== "ALL") queryParams.priority = params.priority;
          if (params.sortBy) queryParams.sortBy = params.sortBy;
          if (params.sortOrder) queryParams.sortOrder = params.sortOrder;
          if (params.search && params.search.trim()) queryParams.search = params.search.trim();
        }

        return {
          url: "/service-requests",
          method: "GET",
          params: queryParams,
        };
      },
      transformResponse: (response: ServiceRequestsListResponse) => response.data,
      providesTags: (result) =>
        result?.requests
          ? [
              ...result.requests.map(({ requestId }) => ({
                type: "Requests" as const,
                id: requestId,
              })),
              { type: "Requests" as const, id: "LIST" },
            ]
          : [{ type: "Requests" as const, id: "LIST" }],
    }),

    getServiceRequestById: builder.query<ApiServiceRequestItem, number | string>({
      query: (id) => ({
        url: `/service-requests/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ServiceRequestDetailsResponse) => response.data.serviceRequest,
      providesTags: (_result, _error, id) => [{ type: "Requests" as const, id }],
    }),

    getCandidatePilots: builder.query<CandidatePilot[], number | string>({
      query: (requestId) => ({
        url: `/admin/service-requests/${requestId}/candidate-pilots`,
        method: "GET",
      }),
      transformResponse: (response: CandidatePilotsResponse | any) => {
        let list: unknown[] = [];
        const rawData = response?.data !== undefined ? response.data : response;

        if (Array.isArray(rawData)) {
          list = rawData;
        } else if (rawData && typeof rawData === "object") {
          const obj = rawData as Record<string, unknown>;
          if (Array.isArray(obj.candidates)) {
            list = obj.candidates;
          } else if (Array.isArray(obj.candidatePilots)) {
            list = obj.candidatePilots;
          } else if (Array.isArray(obj.pilots)) {
            list = obj.pilots;
          }
        }

        const normalized: CandidatePilot[] = list.map((item: unknown, index: number) => {
          const c = (item || {}) as Record<string, unknown>;
          const user = (c.user || {}) as Record<string, unknown>;
          const profile = (c.profile || user.profile || {}) as Record<string, unknown>;

          const pilotId = Number(c.pilotId || c.userId || user.userId || c.id || index + 1);
          const fullName = String(
            c.fullName ||
              user.fullName ||
              (c.firstName ? `${c.firstName} ${c.lastName || ""}` : "") ||
              (user.firstName ? `${user.firstName} ${user.lastName || ""}` : "") ||
              c.name ||
              `Pilot #${pilotId}`,
          ).trim();

          const email = String(c.email || user.email || "");
          const mobile = String(c.mobile || user.mobile || c.phone || "");
          const licenceNumber = String(
            c.licenceNumber || c.licenseNumber || profile.licenceNumber || c.license || "N/A",
          );

          const rawDistance = Number(c.distanceKm ?? c.distance_km ?? c.distance ?? 0);
          const distanceKm =
            !isNaN(rawDistance) && rawDistance > 0 ? Number(rawDistance.toFixed(1)) : 0;

          const rawRating = Number(c.rating ?? c.starRating ?? profile.rating ?? c.ratings ?? 0);
          const rating = !isNaN(rawRating) && rawRating > 0 ? Number(rawRating.toFixed(1)) : 0;

          const rawMissions = Number(
            c.totalMissions ??
              c.completedMissions ??
              profile.totalMissions ??
              profile.completedMissions ??
              0,
          );
          const totalMissions = !isNaN(rawMissions) ? rawMissions : 0;

          let matchScore = Number(c.matchScore ?? c.matchPercentage ?? c.match ?? 0);
          if (matchScore > 0 && matchScore <= 1) {
            matchScore = Math.round(matchScore * 100);
          }
          if (isNaN(matchScore) || matchScore < 0) {
            matchScore = 0;
          }

          return {
            pilotId,
            fullName,
            email,
            mobile,
            licenceNumber,
            distanceKm,
            rating,
            totalMissions,
            matchScore: Math.round(matchScore),
            status: String(c.status || "AVAILABLE"),
            availabilityStatus: String(c.availabilityStatus || "READY"),
          };
        });

        normalized.sort((a, b) => b.matchScore - a.matchScore);
        return normalized;
      },
      providesTags: (_result, _error, requestId) => [
        { type: "Requests" as const, id: `CANDIDATES_${requestId}` },
      ],
    }),

    assignPilot: builder.mutation<
      ApiServiceRequestItem,
      { requestId: number | string; pilotId: number | string }
    >({
      query: ({ requestId, pilotId }) => ({
        url: `/admin/service-requests/${requestId}/assign`,
        method: "POST",
        body: { pilotId: Number(pilotId) },
      }),
      transformResponse: (response: AssignPilotResponse | any) => {
        return response?.data?.serviceRequest || response?.data?.request || response?.data || response;
      },
      invalidatesTags: (_result, _error, { requestId }) => [
        { type: "Requests" as const, id: requestId },
        { type: "Requests" as const, id: "LIST" },
        { type: "Pilots" as const, id: "LIST" },
        { type: "Analytics" as const },
      ],
    }),

    deleteServiceRequest: builder.mutation<
      { success: boolean; message?: string },
      number | string
    >({
      query: (id) => ({
        url: `/service-requests/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Requests" as const, id: "LIST" },
        { type: "Analytics" as const },
      ],
    }),
  }),
});

export const {
  useGetServiceRequestsQuery,
  useLazyGetServiceRequestsQuery,
  useGetServiceRequestByIdQuery,
  useGetCandidatePilotsQuery,
  useAssignPilotMutation,
  useDeleteServiceRequestMutation,
} = requestApi;
