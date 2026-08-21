export type PilotStatus = "Available" | "Busy" | "Offline" | "Online";
export type MissionResult = "Active" | "Completed" | "Pending" | "Cancelled";

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
