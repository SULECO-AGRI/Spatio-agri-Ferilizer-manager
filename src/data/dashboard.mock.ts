import type { MetricItem, ActivityItem, ScheduleItem } from "@/types";

export const mockReportsMetrics: MetricItem[] = [
  { title: "Completed Missions", value: "312" },
  { title: "Revenue", value: "LKR 2.4M" },
  { title: "Pilot Performance", value: "4.7 avg" },
  { title: "Farmer Growth", value: "+18%" },
  { title: "Drone Utilization", value: "72%" },
];

export const mockBarChartData = [
  { label: "Jan", value: 160 },
  { label: "Feb", value: 210 },
  { label: "Mar", value: 170 },
  { label: "Apr", value: 260 },
  { label: "May", value: 290 },
  { label: "Jun", value: 230 },
  { label: "Jul", value: 312 },
];

export const mockLineChartPoints = [
  { label: "Jan", x: 35, y: 115 },
  { label: "Feb", x: 110, y: 85 },
  { label: "Mar", x: 185, y: 100 },
  { label: "Apr", x: 260, y: 70 },
  { label: "May", x: 335, y: 80 },
  { label: "Jun", x: 410, y: 50 },
  { label: "Jul", x: 475, y: 65 },
];

export const mockActivities: ActivityItem[] = [
  {
    id: "1",
    title: "Request REQ-1042 submitted",
    desc: "Kamal Silva — North Paddy Field",
    time: "2 min ago",
  },
  { id: "2", title: "Pilot assigned to REQ-1038", desc: "Nimal Perera", time: "18 min ago" },
  { id: "3", title: "Mission MSN-0229 completed", desc: "South Maize Plot", time: "1 hr ago" },
  { id: "4", title: "Report published for MSN-0227", desc: "Approved by admin", time: "2 hr ago" },
  { id: "5", title: "Payment received", desc: "LKR 8,500 from W. Bandara", time: "3 hr ago" },
];

export const mockSchedules: ScheduleItem[] = [
  { id: "1", time: "08:30", field: "North Paddy Field", service: "Spraying", pilot: "N. Perera" },
  { id: "2", time: "10:00", field: "South Maize Plot", service: "Mapping", pilot: "S. Fernando" },
  { id: "3", time: "13:30", field: "East Tea Estate", service: "Fertilizing", pilot: "Unassigned" },
];
