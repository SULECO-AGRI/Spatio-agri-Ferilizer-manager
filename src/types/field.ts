export interface FieldFarmer {
  id: number;
  userId?: number;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  nic?: string;
  address?: string;
}

export interface Field {
  id: number;
  farmer_id: number;
  field_name: string;
  crop_type: string;
  area: number;
  province: string;
  district: string;
  city: string;
  village: string;
  location_coordinates?: any;
  created_at?: string;
  updated_at?: string;
  farmer?: FieldFarmer;
  owner?: FieldFarmer;

  // Camelcase aliases for convenience
  farmerId?: number;
  fieldName?: string;
  cropType?: string;
  locationCoordinates?: any;
  createdAt?: string;
  updatedAt?: string;
  totalServiceRequests?: number;
  activeRequests?: number;
  completedRequests?: number;
}

export interface FieldsPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface FieldsListResponse {
  status: "success" | string;
  data: {
    fields: Field[];
    pagination?: FieldsPagination;
  };
}

export interface FieldQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  cropType?: string;
  district?: string;
  province?: string;
  farmerId?: number | string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateFieldDTO {
  farmer_id: number;
  field_name: string;
  crop_type: string;
  area: number;
  province: string;
  district: string;
  city: string;
  village: string;
  location_coordinates?: any;
  farmer?: FieldFarmer;
}

export interface UpdateFieldDTO {
  farmer_id?: number;
  field_name?: string;
  crop_type?: string;
  area?: number;
  province?: string;
  district?: string;
  city?: string;
  village?: string;
  location_coordinates?: any;
  farmer?: FieldFarmer;
}
