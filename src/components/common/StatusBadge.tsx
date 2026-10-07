import { memo } from "react";
import { useLanguage } from "@/context/LanguageContext";

export type BadgeVariant = "emerald" | "amber" | "rose" | "blue" | "slate" | "indigo";

export interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant | "auto";
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  amber: "bg-amber-50 text-amber-600 border-amber-100",
  rose: "bg-rose-50 text-rose-600 border-rose-100",
  blue: "bg-blue-50 text-blue-600 border-blue-100",
  slate: "bg-slate-50 text-slate-500 border-slate-200",
  indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
};

const dotStyles: Record<BadgeVariant, string> = {
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  blue: "bg-blue-500",
  slate: "bg-slate-400",
  indigo: "bg-indigo-500",
};

function inferVariant(status: string): BadgeVariant {
  const s = status.toLowerCase();
  if (
    s === "paid" ||
    s === "completed" ||
    s === "available" ||
    s === "low risk" ||
    s === "approved" ||
    s === "active" ||
    s === "ready" ||
    s === "done"
  ) {
    return "emerald";
  }
  if (
    s === "pending" ||
    s === "pending review" ||
    s === "busy" ||
    s === "medium" ||
    s === "medium risk" ||
    s === "in progress" ||
    s === "in_progress" ||
    s === "on_mission" ||
    s === "on mission"
  ) {
    return "amber";
  }
  if (
    s === "high" ||
    s === "high risk" ||
    s === "overdue" ||
    s === "cancelled" ||
    s === "rejected" ||
    s === "error" ||
    s === "suspended" ||
    s === "failed"
  ) {
    return "rose";
  }
  if (s === "assigned" || s === "online" || s === "scheduled") {
    return "blue";
  }
  if (s === "inactive" || s === "offline") {
    return "slate";
  }
  return "slate";
}

const sinhalaStatusMap: Record<string, string> = {
  ACTIVE: "ක්‍රියාත්මක",
  Active: "ක්‍රියාත්මක",
  INACTIVE: "අක්‍රිය",
  Inactive: "අක්‍රිය",
  ON_MISSION: "මෙහෙයුමක",
  "On Mission": "මෙහෙයුමක",
  SUSPENDED: "අත්හිටුවූ",
  Suspended: "අත්හිටුවූ",
  IN_PROGRESS: "ක්‍රියාත්මක වෙමින්",
  "In Progress": "ක්‍රියාත්මක වෙමින්",
  PENDING: "පොරොත්තු",
  Pending: "පොරොත්තු",
  ASSIGNED: "පවරා ඇත",
  Assigned: "පවරා ඇත",
  COMPLETED: "නිම කළ",
  Completed: "නිම කළ",
  CANCELLED: "අවලංගු කළ",
  Cancelled: "අවලංගු කළ",
  PAID: "ගෙවා ඇත",
  Paid: "ගෙවා ඇත",
  FAILED: "අසාර්ථක",
  Failed: "අසාර්ථක",
  HIGH: "ඉහළ",
  High: "ඉහළ",
  MEDIUM: "මධ්‍යම",
  Medium: "මධ්‍යම",
  LOW: "අඩු",
  Low: "අඩු",
  NORMAL: "සාමාන්‍ය",
  Normal: "සාමාන්‍ය",
  ONLINE: "සබැඳි",
  Online: "සබැඳි",
  OFFLINE: "විසන්ධි",
  Offline: "විසන්ධි",
  AVAILABLE: "ලබාගත හැක",
  Available: "ලබාගත හැක",
  BUSY: "කාර්යබහුල",
  Busy: "කාර්යබහුල",
};

function formatStatusText(status: string, isSinhala: boolean): string {
  if (isSinhala && sinhalaStatusMap[status]) {
    return sinhalaStatusMap[status];
  }
  if (status === "ACTIVE") return "Active";
  if (status === "INACTIVE") return "Inactive";
  if (status === "ON_MISSION") return "On Mission";
  if (status === "SUSPENDED") return "Suspended";
  if (status === "IN_PROGRESS") return "In Progress";
  return status;
}

export const StatusBadge = memo(function StatusBadge({
  status,
  variant = "auto",
  size = "sm",
  dot = false,
  className = "",
}: StatusBadgeProps) {
  const { isSinhala } = useLanguage();
  const resolvedVariant = variant === "auto" ? inferVariant(status) : variant;
  const style = variantStyles[resolvedVariant];
  const sizeStyle = size === "sm" ? "px-2.5 py-0.5 text-[10px]" : "px-3 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-normal border transition-colors ${style} ${sizeStyle} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[resolvedVariant]}`} />}
      <span>{formatStatusText(status, isSinhala)}</span>
    </span>
  );
});

export default StatusBadge;

