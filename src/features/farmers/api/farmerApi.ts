import { baseApi } from "@/store/api/baseApi";
import type {
  FarmersListResponse,
  FarmerQueryParams,
} from "@/types/farmer";

export const farmerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFarmers: builder.query<FarmersListResponse["data"], FarmerQueryParams | void>({
      query: (params) => {
        const queryParams: Record<string, string | number | boolean | undefined> = {};
        if (params) {
          if (params.page !== undefined) queryParams.page = params.page;
          if (params.limit !== undefined) queryParams.limit = params.limit;
          if (params.search && params.search.trim()) queryParams.search = params.search.trim();
          if (params.sortBy) queryParams.sortBy = params.sortBy;
          if (params.sortOrder) queryParams.sortOrder = params.sortOrder;
        }

        return {
          url: "/farmers",
          method: "GET",
          params: queryParams,
        };
      },
      transformResponse: (response: FarmersListResponse | { data: FarmersListResponse["data"] }) => {
        if ("data" in response && response.data) {
          return response.data;
        }
        return response as unknown as FarmersListResponse["data"];
      },
      providesTags: (result) =>
        result?.farmers
          ? [
              ...result.farmers.map(({ userId }) => ({ type: "Farmers" as const, id: userId })),
              { type: "Farmers" as const, id: "LIST" },
            ]
          : [{ type: "Farmers" as const, id: "LIST" }],
    }),

    getFarmerFields: builder.query<any[], number | string>({
      query: (farmerId) => ({
        url: `/farmers/${farmerId}/fields`,
        method: "GET",
      }),
      transformResponse: (response: { status: string; data: { fields: any[] } } | any) => {
        if (response?.data?.fields) {
          return response.data.fields;
        }
        if (Array.isArray(response)) {
          return response;
        }
        return [];
      },
      providesTags: (_result, _error, farmerId) => [
        { type: "Farmers" as const, id: `FIELDS_${farmerId}` },
      ],
    }),

    deleteFarmer: builder.mutation<{ success: boolean; message?: string }, number | string>({
      query: (farmerId) => ({
        url: `/farmers/${farmerId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Farmers" as const, id: "LIST" },
        { type: "Fields" as const, id: "LIST" },
        { type: "Analytics" as const },
      ],
      async onQueryStarted(farmerId, { dispatch, queryFulfilled, getState }) {
        const patches: Array<{ undo: () => void }> = [];
        const state = getState() as any;
        const queries = state?.api?.queries || state?.[baseApi.reducerPath]?.queries || {};

        Object.keys(queries).forEach((queryKey) => {
          if (queryKey.startsWith("getFarmers(")) {
            const originalArgs = queries[queryKey]?.originalArgs;
            const patch = dispatch(
              farmerApi.util.updateQueryData(
                "getFarmers" as any,
                originalArgs,
                (draft: any) => {
                  if (draft && Array.isArray(draft.farmers)) {
                    draft.farmers = draft.farmers.filter(
                      (f: any) =>
                        f.userId !== Number(farmerId) &&
                        String(f.userId) !== String(farmerId) &&
                        f.id !== Number(farmerId) &&
                        String(f.id) !== String(farmerId),
                    );
                    if (draft.pagination && draft.pagination.total > 0) {
                      draft.pagination.total = draft.pagination.total - 1;
                    }
                  }
                },
              ),
            );
            patches.push(patch);
          }
        });

        try {
          await queryFulfilled;
        } catch {
          patches.forEach((p) => p.undo());
        }
      },
    }),
  }),
});

export const {
  useGetFarmersQuery,
  useLazyGetFarmersQuery,
  useGetFarmerFieldsQuery,
  useDeleteFarmerMutation,
} = farmerApi;
