import type { Priority } from "./common";

export type ApiRequestStatus = "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface ApiFarmer {
  userId: number;
  fullName: string;
  email: string;
  mobile: string;
  nic: string;
  address: string;
  memberSince?: string;
}

export interface ApiField {
  id: number;
  fieldName: string;
  cropType: string;
  area: number;
  district: string;
  province: string;
  city: string;
  village: string;
  locationCoordinates?: [number, number][];
  createdAt?: string;
}

export interface ApiAssignedPilot {
  userId: number;
  fullName: string;
  mobile: string;
  licenceNumber: string;
  status: string;
}

export interface ApiMission {
  missionId: number;
  status: string;
  startedAt?: string | null;
  completedAt?: string | null;
}

export interface ApiServiceRequestItem {
  requestId: number;
  requestCode: string;
  serviceType: string;
  preferredDate: string;
  priority: "HIGH" | "MEDIUM" | "LOW" | string;
  status: ApiRequestStatus;
  estimatedCost: number;
  farmer: ApiFarmer;
  field: ApiField;
  assignedPilot?: ApiAssignedPilot | null;
  mission?: ApiMission | null;
  missions?: ApiMission[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequestsSummary {
  totalPending: number;
  totalAssigned: number;
  totalInProgress: number;
  totalCompleted: number;
  totalCancelled: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ServiceRequestsListResponse {
  status: "success";
  data: {
    requests: ApiServiceRequestItem[];
    summary: ServiceRequestsSummary;
    pagination: PaginationMeta;
  };
}

export interface ServiceRequestDetailsResponse {
  status: "success";
  data: {
    serviceRequest: ApiServiceRequestItem;
  };
}

export interface CandidatePilot {
  pilotId: number;
  fullName: string;
  email?: string;
  mobile?: string;
  licenceNumber?: string;
  rating: number;
  totalMissions: number;
  distanceKm: number;
  matchScore: number;
  status?: string;
  droneModel?: string;
  availabilityStatus?: string;
}

export interface CandidatePilotsResponse {
  status: "success" | string;
  data:
    | {
        candidates?: CandidatePilot[];
        candidatePilots?: CandidatePilot[];
        pilots?: CandidatePilot[];
        serviceRequest?: ApiServiceRequestItem;
      }
    | CandidatePilot[];
}

export interface AssignPilotResponse {
  status: "success" | string;
  message?: string;
  data?: {
    serviceRequest?: ApiServiceRequestItem;
    request?: ApiServiceRequestItem;
  };
}

export interface ServiceRequestQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

// Backward compatibility legacy interface for existing components if needed
export type RequestStatus = "Pending" | "Assigned" | "In Progress" | "Completed" | "Cancelled";

export interface ServiceRequest {
  id: string;
  farmer: string;
  field: string;
  crop: string;
  area: string;
  service: string;
  prefDate: string;
  weather: string;
  priority: Priority;
  status: RequestStatus;
  raw?: ApiServiceRequestItem;
}

export interface DetailedRequestInfo {
  farmerName: string;
  phone: string;
  email: string;
  district: string;
  memberSince: string;
  fieldName: string;
  crop: string;
  growthStage: string;
  service: string;
  prefDate: string;
  duration: string;
  drone: string;
  weather: string;
  risk: string;
  area: string;
  priority: string;
  status: string;
  svgPoints: string;
  locationCoordinates?: [number, number][];
  estimatedCost?: number;
  assignedPilot?: ApiAssignedPilot | null;
  mission?: ApiMission | null;
}
