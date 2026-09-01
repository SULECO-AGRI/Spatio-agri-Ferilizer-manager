export type PilotStatus = "ACTIVE" | "INACTIVE" | "ON_MISSION" | "SUSPENDED" | string;
export type MissionResult =
  "Active" | "Completed" | "Pending" | "Cancelled" | "Scheduled" | "Failed";

/**
 * Backend Live Pilot Item shape matching GET /pilots
 */
export interface ApiPilotItem {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  mobile: string;
  licenceNumber: string;
  status: PilotStatus;
  ratings: number | null;
  completedMissions: number;
  totalFlightHours: number;
  activeMissionsCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Alias Pilot to ApiPilotItem for consistent live data modeling
 */
export type Pilot = ApiPilotItem;

export interface PilotsPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PilotsListResponse {
  status: string;
  data: {
    pilots: ApiPilotItem[];
    pagination: PilotsPagination;
  };
}

export interface PilotQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: "createdAt" | "name" | "ratings" | "completedMissions" | "totalFlightHours" | string;
  sortOrder?: "asc" | "desc";
}

export interface PilotStatsDTO {
  ratings: number | null;
  completedMissions: number;
  totalFlightHours: number;
  scheduledMissions: number;
  inProgressMissions: number;
  failedMissions: number;
  totalEarnings: number;
  pendingPayouts: number;
  totalReviews: number;
}

export interface PilotProfileDetailDTO {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  mobile: string;
  licenceNumber: string;
  status: string;
  role: string;
  stats: PilotStatsDTO;
  createdAt: string;
  updatedAt: string;
}

export interface PilotDetailsResponse {
  status: string;
  data: {
    pilot: PilotProfileDetailDTO;
  };
}

export interface PilotPerformance {
  pilot: string;
  missions: number;
  rating: number;
  onTime: string;
  flightHours: string;
}

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
  pilotId: string | number;
  name: string;
  initials: string;
  status: string;
  license: string;
  experience: string;
  phone: string;
  email: string;
  rating: number;
  reviewsCount: number;
  missionsCount: number;
  flightHours: string;
  activeMissionsCount?: number;
  certificates: string[];
  droneDetails: PilotDroneDetails;
  performanceData: { label: string; value: number }[];
  missionHistory: PilotMission[];
  documents: PilotDocument[];
}
