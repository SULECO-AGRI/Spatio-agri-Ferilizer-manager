import { apiClient } from "@/lib/apiClient";
import type {
  Field,
  FieldsListResponse,
  FieldQueryParams,
  CreateFieldDTO,
  UpdateFieldDTO,
  FieldsPagination,
} from "@/types/field";

/**
 * Normalizes raw backend field payloads ensuring both snake_case and camelCase compatibility.
 */
export function normalizeField(raw: any): Field {
  if (!raw || typeof raw !== "object") return raw;

  const id = raw.id ?? raw.fieldId ?? raw.field_id ?? 0;
  const farmer_id = raw.farmer_id ?? raw.farmerId ?? raw.farmer?.id ?? raw.farmer?.userId ?? 0;
  const field_name = raw.field_name ?? raw.fieldName ?? raw.name ?? `Field #${id}`;
  const crop_type = raw.crop_type ?? raw.cropType ?? raw.crop ?? "General Crop";
  const area = Number(raw.area ?? raw.fieldSize ?? raw.size ?? 0) || 0;
  const province = raw.province ?? raw.state ?? "Southern";
  const district = raw.district ?? "Matara";
  const city = raw.city ?? raw.town ?? "Kamburupitiya";
  const village = raw.village ?? raw.gramaNiladhariDivision ?? "";
  const location_coordinates = raw.location_coordinates ?? raw.locationCoordinates ?? raw.coordinates ?? null;
  const created_at = raw.created_at ?? raw.createdAt ?? new Date().toISOString();
  const updated_at = raw.updated_at ?? raw.updatedAt ?? new Date().toISOString();

  let farmer = raw.farmer;
  if (!farmer && raw.farmerName) {
    farmer = {
      id: farmer_id,
      fullName: raw.farmerName,
      email: raw.farmerEmail || "",
      mobile: raw.farmerMobile || "",
    };
  } else if (farmer) {
    farmer = {
      id: farmer.id ?? farmer.userId ?? farmer_id,
      fullName: farmer.fullName ?? `${farmer.firstName || ""} ${farmer.lastName || ""}`.trim() ?? "Farmer",
      firstName: farmer.firstName,
      lastName: farmer.lastName,
      email: farmer.email || "",
      mobile: farmer.mobile || "",
    };
  }

  return {
    id: Number(id),
    farmer_id: Number(farmer_id),
    field_name,
    crop_type,
    area,
    province,
    district,
    city,
    village,
    location_coordinates,
    created_at,
    updated_at,
    farmer,
    // Camelcase aliases
    farmerId: Number(farmer_id),
    fieldName: field_name,
    cropType: crop_type,
    locationCoordinates: location_coordinates,
    createdAt: created_at,
    updatedAt: updated_at,
  };
}

export const fieldService = {
  /**
   * Fetches paginated, searchable, and filterable fields list from GET /fields
   */
  async getFields(params: FieldQueryParams = {}): Promise<{ fields: Field[]; pagination: FieldsPagination }> {
    const queryParams: Record<string, string | number | boolean | undefined> = {};

    if (params.page !== undefined) queryParams.page = params.page;
    if (params.limit !== undefined) queryParams.limit = params.limit;
    if (params.search && params.search.trim()) queryParams.search = params.search.trim();
    if (params.cropType && params.cropType !== "All") queryParams.cropType = params.cropType;
    if (params.district && params.district !== "All") queryParams.district = params.district;
    if (params.province && params.province !== "All") queryParams.province = params.province;
    if (params.farmerId !== undefined) queryParams.farmerId = params.farmerId;
    if (params.sortBy) queryParams.sortBy = params.sortBy;
    if (params.sortOrder) queryParams.sortOrder = params.sortOrder;

    let responseData: any;
    try {
      const res = await apiClient.get<FieldsListResponse>("/fields", { params: queryParams });
      responseData = res.data;
    } catch {
      // Fallback endpoint if /api/fields prefix is mapped
      const altRes = await apiClient.get<FieldsListResponse>("/api/fields", { params: queryParams });
      responseData = altRes.data;
    }

    let rawList: any[] = [];
    let pagination: FieldsPagination = {
      total: 0,
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    };

    if (responseData) {
      if (Array.isArray(responseData.fields)) {
        rawList = responseData.fields;
        if (responseData.pagination) {
          pagination = responseData.pagination;
        }
      } else if (Array.isArray(responseData.data?.fields)) {
        rawList = responseData.data.fields;
        if (responseData.data.pagination) {
          pagination = responseData.data.pagination;
        }
      } else if (Array.isArray(responseData.data)) {
        rawList = responseData.data;
      } else if (Array.isArray(responseData)) {
        rawList = responseData;
      }
    }

    if (pagination.total === 0 && rawList.length > 0) {
      pagination.total = rawList.length;
      pagination.totalPages = Math.ceil(rawList.length / (params.limit || 10));
    }

    const fields = rawList.map(normalizeField);
    return {
      fields,
      pagination,
    };
  },

  /**
   * Fetches single field details by ID from GET /fields/:id
   */
  async getFieldById(id: number | string): Promise<Field> {
    try {
      const response = await apiClient.get<any>(`/fields/${id}`);
      const raw = response.data?.data?.field ?? response.data?.field ?? response.data;
      return normalizeField(raw);
    } catch {
      const alt = await apiClient.get<any>(`/api/fields/${id}`);
      const raw = alt.data?.data?.field ?? alt.data?.field ?? alt.data;
      return normalizeField(raw);
    }
  },

  /**
   * Creates a new agricultural field via POST /fields
   */
  async createField(data: CreateFieldDTO): Promise<Field> {
    const payload = {
      farmer_id: Number(data.farmer_id),
      field_name: data.field_name.trim(),
      crop_type: data.crop_type.trim(),
      area: Number(data.area),
      province: data.province.trim(),
      district: data.district.trim(),
      city: data.city.trim(),
      village: data.village ? data.village.trim() : "",
      location_coordinates: data.location_coordinates || null,
    };

    let responseData: any;
    try {
      const response = await apiClient.post<any>("/fields", payload);
      responseData = response.data?.data?.field ?? response.data?.field ?? response.data;
    } catch {
      const alt = await apiClient.post<any>("/api/fields", payload);
      responseData = alt.data?.data?.field ?? alt.data?.field ?? alt.data;
    }

    return normalizeField(responseData);
  },

  /**
   * Updates an existing field via PATCH /fields/:id
   */
  async updateField(id: number | string, data: UpdateFieldDTO): Promise<Field> {
    const payload: Record<string, any> = {};
    if (data.farmer_id !== undefined) payload.farmer_id = Number(data.farmer_id);
    if (data.field_name !== undefined) payload.field_name = data.field_name.trim();
    if (data.crop_type !== undefined) payload.crop_type = data.crop_type.trim();
    if (data.area !== undefined) payload.area = Number(data.area);
    if (data.province !== undefined) payload.province = data.province.trim();
    if (data.district !== undefined) payload.district = data.district.trim();
    if (data.city !== undefined) payload.city = data.city.trim();
    if (data.village !== undefined) payload.village = data.village.trim();
    if (data.location_coordinates !== undefined) payload.location_coordinates = data.location_coordinates;

    let responseData: any;
    try {
      const response = await apiClient.patch<any>(`/fields/${id}`, payload);
      responseData = response.data?.data?.field ?? response.data?.field ?? response.data;
    } catch {
      try {
        const putRes = await apiClient.put<any>(`/fields/${id}`, payload);
        responseData = putRes.data?.data?.field ?? putRes.data?.field ?? putRes.data;
      } catch {
        const alt = await apiClient.patch<any>(`/api/fields/${id}`, payload);
        responseData = alt.data?.data?.field ?? alt.data?.field ?? alt.data;
      }
    }

    return normalizeField(responseData);
  },

  /**
   * Deletes a field by ID via DELETE /fields/:id
   */
  async deleteField(id: number | string): Promise<{ success: boolean; message?: string }> {
    try {
      await apiClient.delete(`/fields/${id}`);
      return { success: true };
    } catch (err: any) {
      try {
        await apiClient.delete(`/api/fields/${id}`);
        return { success: true };
      } catch (altErr: any) {
        const errMsg =
          altErr?.response?.data?.message ||
          err?.response?.data?.message ||
          "Failed to delete field. It may have active service requests or telemetry missions attached.";
        throw new Error(errMsg);
      }
    }
  },
};
