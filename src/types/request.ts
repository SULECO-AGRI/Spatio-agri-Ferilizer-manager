import type { Priority } from "./common";

export type RequestStatus = "Pending" | "Assigned" | "Completed" | "Cancelled";

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
}
