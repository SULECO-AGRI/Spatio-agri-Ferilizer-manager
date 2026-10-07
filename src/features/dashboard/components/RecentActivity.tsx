import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { ApiServiceRequestItem } from "@/types/request";

interface RecentActivityProps {
  recentRequests?: ApiServiceRequestItem[];
}

export function RecentActivity({ recentRequests = [] }: RecentActivityProps) {
  const { dict, isSinhala } = useLanguage();

  const activities = useMemo(() => {
    if (recentRequests && recentRequests.length > 0) {
      return recentRequests.slice(0, 5).map((req) => {
        let timeStr = isSinhala ? "මෑතකදී" : "Recent";
        if (req.createdAt) {
          const d = new Date(req.createdAt);
          if (!isNaN(d.getTime())) {
            timeStr = `${d.toLocaleDateString(isSinhala ? "si-LK" : "en-US", { month: "short", day: "numeric" })}, ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
          }
        }

        // Names (pilot, farmer) and places (field, district) remain UNTRANSLATED
        let title = isSinhala
          ? `මෙහෙයුම ${req.requestCode || `REQ-${req.requestId}`}`
          : `Mission ${req.requestCode || `REQ-${req.requestId}`}: ${req.status.replace("_", " ")}`;
        let desc = `${req.serviceType || (isSinhala ? "පොහොර ඉසීම" : "Fertilizing")} on ${req.field?.fieldName || "Field Block"} (${req.farmer?.fullName || "Farmer"})`;

        if (req.status === "COMPLETED") {
          title = isSinhala
            ? `මෙහෙයුම නිම විය: ${req.requestCode || `REQ-${req.requestId}`}`
            : `Mission Completed: ${req.requestCode || `REQ-${req.requestId}`}`;
          desc = isSinhala
            ? `${req.field?.cropType || "බෝග"} ඉසීම සාර්ථකව අවසන් විය`
            : `${req.field?.cropType || "Crop"} application finished successfully`;
        } else if (req.status === "IN_PROGRESS") {
          title = isSinhala
            ? `පියාසැරියේ: ${req.requestCode || `REQ-${req.requestId}`}`
            : `In Flight: ${req.requestCode || `REQ-${req.requestId}`}`;
          desc = isSinhala
            ? `ටෙලිමෙට්‍රි සජීවීව සම්බන්ධයි — ${req.field?.district || "Field"}`
            : `Telemetry streaming from ${req.field?.district || "Field"}`;
        } else if (req.status === "ASSIGNED") {
          title = isSinhala
            ? `නියමුවෙකු පවරන ලදි: ${req.assignedPilot?.fullName || "Pilot"}`
            : `Pilot Assigned: ${req.assignedPilot?.fullName || "Pilot"}`;
          desc = isSinhala
            ? `${req.field?.fieldName || "Field Block"} සඳහා වෙන් කෙරිණි`
            : `Scheduled for ${req.field?.fieldName || "Field Block"}`;
        }

        return {
          id: String(req.requestId),
          title,
          desc,
          time: timeStr,
        };
      });
    }
    return [];
  }, [recentRequests, isSinhala]);

  return (
    <div className={`bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 flex flex-col h-full font-sans shadow-xs ${isSinhala ? "font-sinhala" : ""}`}>
      <h3 className="text-xl font-medium text-slate-900 mb-6 font-display">
        {dict.admin.dashboard.recentActivityTitle}
      </h3>

      <div className="flex-1 flex flex-col">
        {activities.length > 0 ? (
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
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs py-8 text-center font-normal">
            {dict.admin.dashboard.noActivity}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentActivity;

