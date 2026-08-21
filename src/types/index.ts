export type TabId =
  | "dashboard"
  | "requests"
  | "pilots"
  | "farmers"
  | "reports"
  | "payments"
  | "settings"
  | "profile";

export interface Farmer {
  id: string;
  name: string;
  location: string;
  fields: number;
  activeRequests: number;
  totalSpend: string;
  memberSince: number;
  nic: string;
}

export interface FarmerField {
  id: string;
  name: string;
  size: string;
  notes: string;
}

export interface FarmerServiceHistory {
  date: string;
  field: string;
  service: string;
  amount: string;
}

export type PilotStatus = "Available" | "Busy" | "Offline" | "Online";

export interface Pilot {
  id: string;
  name: string;
  initials: string;
  status: PilotStatus;
  license: string;
  drone: string;
  experience: string;
  rating: number;
  missions: number;
  flightHours: string;
  batteryLevel: number;
}

export interface PilotPerformance {
  pilot: string;
  missions: number;
  rating: number;
  onTime: string;
  flightHours: string;
}

export type MissionResult = "Active" | "Completed" | "Pending" | "Cancelled";

export interface PilotMission {
  id: string;
  field: string;
  date: string;
  result: MissionResult;
}

export interface PilotDroneDetails {
  model: string;
  tankCapacity: string;
  maxSpeed: string;
  lastServiced: string;
  batteryHealth?: string;
}

export interface PilotDocument {
  id: string;
  title: string;
  issueDate?: string;
  expiryDate?: string;
  docNumber?: string;
  fileSize?: string;
}

export interface DetailedPilotInfo {
  pilotId: string;
  name: string;
  initials: string;
  status: PilotStatus;
  license: string;
  experience: string;
  phone: string;
  email: string;
  rating: number;
  reviewsCount: number;
  missionsCount: number;
  flightHours: string;
  certificates: string[];
  droneDetails: PilotDroneDetails;
  performanceData: { label: string; value: number }[];
  missionHistory: PilotMission[];
  documents: PilotDocument[];
}

export type RequestStatus = "Pending" | "Assigned" | "Completed" | "Cancelled";
export type Priority = "High" | "Medium" | "Low";

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

export type TxnType = "Invoice" | "Pilot Payout";
export type TxnStatus = "Paid" | "Pending" | "Overdue";

export interface Transaction {
  id: string;
  type: TxnType;
  party: string;
  amount: string;
  status: TxnStatus;
  date: string;
}

export interface MetricItem {
  title: string;
  value: string | number;
  footer?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
}

export interface ActivityItem {
  id: string;
  title: string;
  desc: string;
  time: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  field: string;
  service: string;
  pilot: string;
}
