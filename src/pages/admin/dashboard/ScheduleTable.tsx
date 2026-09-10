import { useMemo } from "react";
import type { ApiServiceRequestItem } from "@/types/request";

interface ScheduleTableProps {
  recentRequests?: ApiServiceRequestItem[];
}

export function ScheduleTable({ recentRequests = [] }: ScheduleTableProps) {
  const schedules = useMemo(() => {
    if (recentRequests && recentRequests.length > 0) {
      return recentRequests.slice(0, 6).map((req) => {
        let timeDisplay = "Flexible Schedule";
        if (req.preferredDate) {
          const d = new Date(req.preferredDate);
          if (!isNaN(d.getTime())) {
            const formattedDate = d.toLocaleDateString([], { month: "short", day: "numeric" });
            const formattedTime = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            timeDisplay =
              formattedTime === "12:00 AM" ? formattedDate : `${formattedDate}, ${formattedTime}`;
          }
        }

        return {
          id: String(req.requestId),
          time: timeDisplay,
          field: req.field?.fieldName || `${req.field?.cropType || "Paddy"} Field`,
          service: req.serviceType || "Fertilizing",
          pilot:
            req.assignedPilot?.fullName || (req.status === "PENDING" ? "Unassigned" : "Assigned"),
        };
      });
    }
    return [];
  }, [recentRequests]);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 flex flex-col h-full font-sans shadow-xs">
      <h3 className="text-xl font-medium text-slate-900 mb-6 font-display">Today's Schedule</h3>

      <div className="overflow-x-auto flex-1 flex flex-col">
        <table className="w-full text-left border-collapse flex-1">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-xs font-normal">
              <th className="pb-3">Time</th>
              <th className="pb-3">Field</th>
              <th className="pb-3">Service</th>
              <th className="pb-3">Pilot</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/50 text-sm">
            {schedules.map(({ id, time, field, service, pilot }) => (
              <tr key={id}>
                <td className="py-4 font-normal text-slate-800">{time}</td>
                <td className="py-4 text-slate-600 font-normal">{field}</td>
                <td className="py-4 text-slate-600 font-normal">{service}</td>
                <td className="py-4">
                  {pilot === "Unassigned" ? (
                    <span className="text-slate-400 font-normal">Unassigned</span>
                  ) : (
                    <span className="text-slate-800 font-normal">{pilot}</span>
                  )}
                </td>
              </tr>
            ))}
            {schedules.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400 font-normal">
                  No mission schedules found for today.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ScheduleTable;
