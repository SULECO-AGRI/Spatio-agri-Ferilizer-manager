export interface ApiFarmerItem {
  userId: number;
  email: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  mobile: string;
  nic: string;
  address: string;
  memberSince?: string;
  totalFields?: number;
  totalArea?: number;
  totalServiceRequests?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type Farmer = ApiFarmerItem;

export interface FarmersPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface FarmersListResponse {
  status: "success" | string;
  data: {
    farmers: ApiFarmerItem[];
    pagination: FarmersPagination;
  };
}

export interface FarmerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "createdAt" | "name" | "email" | "memberSince" | string;
  sortOrder?: "asc" | "desc";
}

export interface FarmerField {
  id: string | number;
  name: string;
  size: string;
  notes?: string;
}

export interface FarmerServiceHistory {
  date: string;
  field: string;
  service: string;
  amount: string;
}
