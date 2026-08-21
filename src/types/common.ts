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
