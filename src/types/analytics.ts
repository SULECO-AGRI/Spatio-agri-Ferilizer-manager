export interface KPISummaryItem<T = number> {
  value: T;
  formatted: string;
  growthPercentage?: number;
  completedToday?: number;
  completedThisMonth?: number;
  revenueThisMonth?: number;
  currency?: string;
  totalPilots?: number;
  activePilots?: number;
  totalFarmers?: number;
  newFarmersThisMonth?: number;
}

export interface AnalyticsSummaryData {
  completedMissions: {
    value: number;
    formatted: string;
    completedToday: number;
    completedThisMonth: number;
    growthPercentage: number;
  };
  revenue: {
    value: number;
    formatted: string;
    revenueThisMonth: number;
    growthPercentage: number;
    currency: string;
  };
  pilotPerformance: {
    value: number;
    formatted: string;
    totalPilots: number;
    activePilots: number;
  };
  farmerGrowth: {
    value: number;
    formatted: string;
    totalFarmers: number;
    newFarmersThisMonth: number;
  };
}

export interface CompletedMissionsAnalytics {
  totalCompletedMissions: number;
  completedToday: number;
  completedThisMonth: number;
  completedLastMonth: number;
  monthOverMonthGrowthPercentage: number;
  completionRatePercentage: number;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  companyCommission: number;
  pilotEarnings: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  monthOverMonthGrowthPercentage: number;
  averageRevenuePerMission: number;
  currency: string;
}

export interface TopPerformingPilot {
  userId: number;
  fullName: string;
  ratings: number;
  completedMissions: number;
}

export interface PilotPerformanceAnalytics {
  fleetAverageRating: number;
  totalFleetFlightHours: number;
  totalCompletedMissions: number;
  totalPilots: number;
  activePilots: number;
  onMissionPilots: number;
  inactivePilots: number;
  topPerformingPilot?: TopPerformingPilot;
}

export interface FarmerGrowthAnalytics {
  totalFarmers: number;
  newFarmersThisMonth: number;
  newFarmersLastMonth: number;
  growthPercentage: number;
  activeFarmersWithFields: number;
  totalFieldsRegistered: number;
}

export interface PilotTableRowMissionStats {
  completedMissions: number;
  activeMissions: number;
  scheduledMissions: number;
  totalAssigned: number;
}

export interface PilotPerformanceTableRow {
  pilotId: number;
  pilotName: string;
  email: string;
  mobile: string;
  licenceNumber: string;
  status: string;
  missions: PilotTableRowMissionStats;
  averageRatings: number;
  flightHours: number;
  totalEarnings: number;
  createdAt: string;
}

export interface AnalyticsPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PilotPerformanceTableResponse {
  pilots: PilotPerformanceTableRow[];
  pagination: AnalyticsPagination;
}

export interface ApiResponse<T> {
  status: "success" | "fail" | "error";
  message?: string;
  data: T;
}
