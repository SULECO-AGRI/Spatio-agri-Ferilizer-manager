import { baseApi } from "@/store/api/baseApi";
import { normalizeField } from "@/services/fieldService";
import type {
  Field,
  FieldsListResponse,
  FieldQueryParams,
  CreateFieldDTO,
  UpdateFieldDTO,
} from "@/types/field";

export const fieldApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFields: builder.query<FieldsListResponse["data"], FieldQueryParams | void>({
      query: (params) => {
        const queryParams: Record<string, string | number | boolean | undefined> = {};
        if (params) {
          if (params.page !== undefined) queryParams.page = params.page;
          if (params.limit !== undefined) queryParams.limit = params.limit;
          if (params.search && params.search.trim()) queryParams.search = params.search.trim();
          if (params.cropType && params.cropType !== "All") queryParams.cropType = params.cropType;
          if (params.district && params.district !== "All") queryParams.district = params.district;
          if (params.province) queryParams.province = params.province;
          if (params.farmerId !== undefined) queryParams.farmerId = params.farmerId;
          if (params.sortBy) queryParams.sortBy = params.sortBy;
          if (params.sortOrder) queryParams.sortOrder = params.sortOrder;
        }

        return {
          url: "/fields",
          method: "GET",
          params: queryParams,
        };
      },
      transformResponse: (response: FieldsListResponse | { data: FieldsListResponse["data"] }) => {
        if ("data" in response && response.data) {
          const rawFields = Array.isArray(response.data.fields) ? response.data.fields : [];
          return {
            ...response.data,
            fields: rawFields.map(normalizeField),
          };
        }
        if ("fields" in response && Array.isArray(response.fields)) {
          return {
            ...response,
            fields: response.fields.map(normalizeField),
          } as unknown as FieldsListResponse["data"];
        }
        return response as unknown as FieldsListResponse["data"];
      },
      providesTags: (result) =>
        result?.fields
          ? [
              ...result.fields.map(({ id }) => ({ type: "Fields" as const, id })),
              { type: "Fields" as const, id: "LIST" },
            ]
          : [{ type: "Fields" as const, id: "LIST" }],
    }),

    getFieldById: builder.query<Field, number | string>({
      query: (id) => ({
        url: `/fields/${id}`,
        method: "GET",
      }),
      transformResponse: (
        response: { status: string; data: { field: Field } } | { field: Field } | Field,
      ) => {
        if ("data" in response && response.data && "field" in response.data) {
          return normalizeField(response.data.field);
        }
        if ("field" in response) {
          return normalizeField(response.field);
        }
        return normalizeField(response);
      },
      providesTags: (_result, _error, id) => [{ type: "Fields" as const, id }],
    }),

    createField: builder.mutation<Field, CreateFieldDTO>({
      query: (body) => ({
        url: "/fields",
        method: "POST",
        body,
      }),
      transformResponse: (
        response: { status: string; data: { field: Field } } | { field: Field } | Field,
      ) => {
        if ("data" in response && response.data && "field" in response.data) {
          return normalizeField(response.data.field);
        }
        if ("field" in response) {
          return normalizeField(response.field);
        }
        return normalizeField(response);
      },
      invalidatesTags: [
        { type: "Fields" as const, id: "LIST" },
        { type: "Analytics" as const },
        { type: "Farmers" as const },
      ],
      async onQueryStarted(_arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data: createdRaw } = await queryFulfilled;
          const normalized = normalizeField(createdRaw);

          // Eagerly update all cached getFields entries in the RTK Query cache
          const state = getState() as any;
          const apiState = state.api || state[baseApi.reducerPath];
          if (apiState?.queries) {
            Object.keys(apiState.queries).forEach((key) => {
              if (key.startsWith("getFields(")) {
                const originalArgs = apiState.queries[key]?.originalArgs;
                dispatch(
                  fieldApi.util.updateQueryData(
                    "getFields" as any,
                    originalArgs,
                    (draft: any) => {
                      if (draft && Array.isArray(draft.fields)) {
                        const exists = draft.fields.some(
                          (f: any) => f.id === normalized.id || (normalized.id && String(f.id) === String(normalized.id)),
                        );
                        if (!exists) {
                          draft.fields.unshift(normalized);
                          if (draft.pagination) {
                            draft.pagination.total = (draft.pagination.total || 0) + 1;
                          }
                        }
                      }
                    },
                  ),
                );
              }
            });
          }
        } catch {
          // Ignore failed mutation cache updates
        }
      },
    }),

    updateField: builder.mutation<Field, { id: number | string; data: UpdateFieldDTO }>({
      query: ({ id, data }) => ({
        url: `/fields/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (
        response: { status: string; data: { field: Field } } | { field: Field } | Field,
      ) => {
        if ("data" in response && response.data && "field" in response.data) {
          return normalizeField(response.data.field);
        }
        if ("field" in response) {
          return normalizeField(response.field);
        }
        return normalizeField(response);
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Fields" as const, id },
        { type: "Fields" as const, id: "LIST" },
        { type: "Analytics" as const },
      ],
      async onQueryStarted({ id }, { dispatch, queryFulfilled, getState }) {
        try {
          const { data: updatedRaw } = await queryFulfilled;
          const normalized = normalizeField(updatedRaw);

          const state = getState() as any;
          const apiState = state.api || state[baseApi.reducerPath];
          if (apiState?.queries) {
            Object.keys(apiState.queries).forEach((key) => {
              if (key.startsWith("getFields(")) {
                const originalArgs = apiState.queries[key]?.originalArgs;
                dispatch(
                  fieldApi.util.updateQueryData(
                    "getFields" as any,
                    originalArgs,
                    (draft: any) => {
                      if (draft && Array.isArray(draft.fields)) {
                        const idx = draft.fields.findIndex(
                          (f: any) => f.id === Number(id) || String(f.id) === String(id),
                        );
                        if (idx !== -1) {
                          draft.fields[idx] = { ...draft.fields[idx], ...normalized };
                        }
                      }
                    },
                  ),
                );
              }
            });
          }
        } catch {
          // Ignore
        }
      },
    }),

    deleteField: builder.mutation<{ success: boolean; message?: string }, number | string>({
      query: (id) => ({
        url: `/fields/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Fields" as const, id: "LIST" },
        { type: "Analytics" as const },
        { type: "Farmers" as const },
      ],
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        const patches: Array<{ undo: () => void }> = [];
        const state = getState() as any;
        const queries = state?.api?.queries || state?.[baseApi.reducerPath]?.queries || {};

        // Optimistically remove the deleted field from all cached getFields queries immediately
        Object.keys(queries).forEach((queryKey) => {
          if (queryKey.startsWith("getFields(")) {
            const originalArgs = queries[queryKey]?.originalArgs;
            const patch = dispatch(
              fieldApi.util.updateQueryData(
                "getFields" as any,
                originalArgs,
                (draft: any) => {
                  if (draft && Array.isArray(draft.fields)) {
                    draft.fields = draft.fields.filter(
                      (f: any) =>
                        f.id !== Number(id) &&
                        String(f.id) !== String(id) &&
                        f.field_id !== Number(id) &&
                        String(f.field_id) !== String(id),
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
          // Revert optimistic updates if server deletion fails
          patches.forEach((patch) => patch.undo());
        }
      },
    }),
  }),
});

export const {
  useGetFieldsQuery,
  useLazyGetFieldsQuery,
  useGetFieldByIdQuery,
  useCreateFieldMutation,
  useUpdateFieldMutation,
  useDeleteFieldMutation,
} = fieldApi;

