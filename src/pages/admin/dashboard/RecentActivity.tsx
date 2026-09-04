import { useMemo } from "react";
import { mockActivities } from "@/data/mockData";
import type { ApiServiceRequestItem } from "@/types/request";

interface RecentActivityProps {
  recentRequests?: ApiServiceRequestItem[];
}

export function RecentActivity({ recentRequests }: RecentActivityProps) {
  const activities = useMemo(() => {
    if (recentRequests && recentRequests.length > 0) {
      return recentRequests.slice(0, 5).map((req, idx) => {
        const timeStr = req.createdAt
          ? new Date(req.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : `${10 * (idx + 1)}m ago`;

        let title = `Mission ${req.requestCode || `REQ-${req.requestId}`}: ${req.status.replace("_", " ")}`;
        let desc = `${req.serviceType || "Fertilizing"} on ${req.field?.fieldName || "Field Block"} (${req.farmer?.fullName || "Farmer"})`;

        if (req.status === "COMPLETED") {
          title = `Mission Completed: ${req.requestCode || `REQ-${req.requestId}`}`;
          desc = `${req.field?.cropType || "Crop"} application finished successfully`;
        } else if (req.status === "IN_PROGRESS") {
          title = `In Flight: ${req.requestCode || `REQ-${req.requestId}`}`;
          desc = `Telemetry streaming from ${req.field?.district || "Field"}`;
        } else if (req.status === "ASSIGNED") {
          title = `Pilot Assigned: ${req.assignedPilot?.fullName || "Pilot"}`;
          desc = `Scheduled for ${req.field?.fieldName || "Field Block"}`;
        }

        return {
          id: String(req.requestId),
          title,
          desc,
          time: timeStr,
        };
      });
    }
    return mockActivities;
  }, [recentRequests]);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 flex-1 font-sans shadow-xs">
      <h3 className="text-xl font-medium text-slate-900 mb-6 font-display">Recent Activity</h3>

      <div className="space-y-6">
        {activities.map(({ id, title, desc, time }) => (
          <div key={id} className="flex items-start gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 mt-1.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-normal text-slate-800">{title}</p>
              <p className="text-xs text-slate-400 mt-0.5 font-normal">
                {desc} — {time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
