export type TabId =
  "dashboard" | "requests" | "pilots" | "farmers" | "reports" | "payments" | "settings" | "profile";

export type Priority = "High" | "Medium" | "Low";

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

export interface ActiveMission {
  id: string;
  missionCode: string;
  field: string;
  region: string;
  pilotName: string;
  droneModel: string;
  status: "Fertilizing" | "Spraying" | "Surveying" | "Returning";
  progress: number; // percentage 0 - 100
  battery: number; // percentage 0 - 100
  payloadLiters: number;
  maxPayloadLiters: number;
  altitudeMeters: number;
  speedKmh: number;
  sprayFlowRate: string;
  coordinates: { x: number; y: number; lat: number; lng: number };
  flightPath: Array<{ x: number; y: number }>;
  polygonPoints: string;
  targetFertilizer: string;
  estimatedCompletion: string;
}
