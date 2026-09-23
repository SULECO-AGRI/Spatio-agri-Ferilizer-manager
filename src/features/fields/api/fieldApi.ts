import { baseApi } from "@/store/api/baseApi";
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
          return response.data;
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
      transformResponse: (response: { status: string; data: { field: Field } } | { field: Field } | Field) => {
        if ("data" in response && response.data && "field" in response.data) {
          return response.data.field;
        }
        if ("field" in response) {
          return response.field;
        }
        return response as Field;
      },
      providesTags: (_result, _error, id) => [{ type: "Fields" as const, id }],
    }),

    createField: builder.mutation<Field, CreateFieldDTO>({
      query: (body) => ({
        url: "/fields",
        method: "POST",
        body,
      }),
      transformResponse: (response: { status: string; data: { field: Field } } | { field: Field } | Field) => {
        if ("data" in response && response.data && "field" in response.data) {
          return response.data.field;
        }
        if ("field" in response) {
          return response.field;
        }
        return response as Field;
      },
      invalidatesTags: [
        { type: "Fields" as const, id: "LIST" },
        { type: "Analytics" as const },
        { type: "Farmers" as const },
      ],
    }),

    updateField: builder.mutation<Field, { id: number | string; data: UpdateFieldDTO }>({
      query: ({ id, data }) => ({
        url: `/fields/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: { status: string; data: { field: Field } } | { field: Field } | Field) => {
        if ("data" in response && response.data && "field" in response.data) {
          return response.data.field;
        }
        if ("field" in response) {
          return response.field;
        }
        return response as Field;
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Fields" as const, id },
        { type: "Fields" as const, id: "LIST" },
        { type: "Analytics" as const },
      ],
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
