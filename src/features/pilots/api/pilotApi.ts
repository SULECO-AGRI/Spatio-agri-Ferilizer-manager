import { baseApi } from "@/store/api/baseApi";
import type {
  ApiPilotItem,
  PilotsListResponse,
  PilotQueryParams,
  PilotProfileDetailDTO,
  PilotDetailsResponse,
  PilotStatus,
} from "@/types/pilot";

export const pilotApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPilots: builder.query<PilotsListResponse["data"], PilotQueryParams | void>({
      query: (params) => {
        const queryParams: Record<string, string | number | boolean | undefined> = {};
        if (params) {
          if (params.page !== undefined) queryParams.page = params.page;
          if (params.limit !== undefined) queryParams.limit = params.limit;
          if (params.status && params.status !== "All" && params.status !== "ALL") {
            queryParams.status = params.status;
          }
          if (params.search && params.search.trim()) {
            queryParams.search = params.search.trim();
          }
          if (params.sortBy) queryParams.sortBy = params.sortBy;
          if (params.sortOrder) queryParams.sortOrder = params.sortOrder;
        }

        return {
          url: "/pilots",
          method: "GET",
          params: queryParams,
        };
      },
      transformResponse: (response: PilotsListResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.pilots.map(({ userId }) => ({ type: "Pilots" as const, id: userId })),
              { type: "Pilots" as const, id: "LIST" },
            ]
          : [{ type: "Pilots" as const, id: "LIST" }],
    }),

    getPilotById: builder.query<PilotProfileDetailDTO, number | string>({
      query: (id) => ({
        url: `/pilots/${id}`,
        method: "GET",
      }),
      transformResponse: (response: PilotDetailsResponse) => response.data.pilot,
      providesTags: (_result, _error, id) => [{ type: "Pilots" as const, id }],
    }),

    updatePilotStatus: builder.mutation<
      ApiPilotItem,
      { id: number | string; status: PilotStatus }
    >({
      query: ({ id, status }) => ({
        url: `/pilots/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: (response: { status: string; data: ApiPilotItem }) => response.data,
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled, getState }) {
        const patches: Array<{ undo: () => void }> = [];
        const state = getState() as any;
        const queries = state?.api?.queries || {};

        // Find all cached getPilots query args and update them optimistically
        Object.keys(queries).forEach((queryKey) => {
          if (queryKey.startsWith("getPilots(")) {
            const originalArgs = queries[queryKey]?.originalArgs;
            const patch = dispatch(
              pilotApi.util.updateQueryData("getPilots", originalArgs, (draft) => {
                const targetPilot = draft.pilots?.find(
                  (p) => p.userId === Number(id) || String(p.userId) === String(id),
                );
                if (targetPilot) {
                  targetPilot.status = status;
                }
              }),
            );
            patches.push(patch);
          }
        });

        // Also update getPilotById single query cache if present
        const detailPatch = dispatch(
          pilotApi.util.updateQueryData("getPilotById", id, (draft) => {
            if (draft) {
              draft.status = status;
            }
          }),
        );
        patches.push(detailPatch);

        try {
          await queryFulfilled;
        } catch {
          // Revert all optimistic modifications if the mutation fails
          patches.forEach((p) => p.undo());
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Pilots" as const, id },
        { type: "Pilots" as const, id: "LIST" },
      ],
    }),

    deletePilot: builder.mutation<{ success: boolean; message?: string }, number | string>({
      query: (id) => ({
        url: `/pilots/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Pilots" as const, id: "LIST" }],
    }),
  }),
});

export const {
  useGetPilotsQuery,
  useLazyGetPilotsQuery,
  useGetPilotByIdQuery,
  useLazyGetPilotByIdQuery,
  useUpdatePilotStatusMutation,
  useDeletePilotMutation,
} = pilotApi;
