import { Star, Phone, Mail, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { StatusBadge } from "@/components/ui";
import type { ApiPilotItem } from "@/types/pilot";

interface PilotCardProps {
  pilot: ApiPilotItem;
  onViewDetails: (pilotId: number | string) => void;
  onToggleStatus?: (pilotId: number | string, currentStatus: string) => void;
}

export function PilotCard({ pilot, onViewDetails, onToggleStatus }: PilotCardProps) {
  const initials =
    `${pilot.firstName?.[0] || ""}${pilot.lastName?.[0] || ""}`.toUpperCase() || "PL";
  const isBusy = pilot.status === "ON_MISSION" || pilot.status === "Busy";
  const isSuspended = pilot.status === "SUSPENDED";
  const ratingDisplay =
    pilot.ratings !== null && pilot.ratings !== undefined
      ? Number(pilot.ratings).toFixed(1)
      : "5.0";

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-200 font-sans group">
      {/* Card Top: Initials Avatar, Name & Status */}
      <div className="cursor-pointer" onClick={() => onViewDetails(pilot.userId)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-xs font-semibold shrink-0 border border-slate-200/70 shadow-2xs group-hover:border-emerald-500/40 transition-colors">
              {initials}
            </div>
            <div className="space-y-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-900 leading-snug truncate group-hover:text-emerald-800 transition-colors">
                {pilot.fullName || `${pilot.firstName} ${pilot.lastName}`.trim()}
              </h4>
              <StatusBadge status={pilot.status} />
            </div>
          </div>

          {/* Active Missions Badge if any */}
          {pilot.activeMissionsCount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200/80 rounded-full shrink-0 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              {pilot.activeMissionsCount} active
            </span>
          )}
        </div>

        {/* License & Contacts */}
        <div className="mt-4 pt-3 border-t border-slate-100/80 space-y-1.5 text-xs text-slate-500 font-normal">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-slate-400">License:</span>
            <span className="font-medium text-slate-800 font-mono text-[11px]">
              {pilot.licenceNumber || "N/A"}
            </span>
          </div>

          {pilot.mobile && (
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-400 inline-flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" /> Mobile:
              </span>
              <span className="text-slate-700">{pilot.mobile}</span>
            </div>
          )}

          {pilot.email && (
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-400 inline-flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" /> Email:
              </span>
              <span className="text-slate-700 truncate max-w-[170px]" title={pilot.email}>
                {pilot.email}
              </span>
            </div>
          )}
        </div>

        {/* Card Mid: Stats Info Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 my-4 p-3 bg-slate-50/70 border border-slate-100 rounded-xl text-center">
          <div>
            <div className="flex items-center justify-center gap-0.5 text-amber-500 font-medium text-xs">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{ratingDisplay}</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5 font-normal">Rating</span>
          </div>

          <div className="border-x border-slate-200/50">
            <div className="flex items-center justify-center gap-0.5 text-slate-800 font-medium text-xs">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{pilot.totalFlightHours}h</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5 font-normal">Flight Hrs</span>
          </div>

          <div>
            <div className="flex items-center justify-center gap-0.5 text-slate-800 font-medium text-xs">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>{pilot.completedMissions}</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5 font-normal">Missions</span>
          </div>
        </div>
      </div>

      {/* Card Bottom: Actions */}
      <div className="flex gap-2 pt-3 border-t border-slate-100 mt-1">
        <button
          type="button"
          onClick={() => onViewDetails(pilot.userId)}
          className="flex-1 py-1.5 px-3 border border-slate-200 hover:bg-slate-50 active:bg-slate-100 rounded-lg text-[11px] font-medium text-slate-700 text-center transition-colors cursor-pointer"
        >
          Details
        </button>

        {onToggleStatus && (
          <button
            type="button"
            onClick={() => onToggleStatus(pilot.userId, pilot.status)}
            className={`py-1.5 px-2.5 border rounded-lg text-[11px] font-normal text-center transition-colors cursor-pointer ${
              pilot.status === "ACTIVE"
                ? "border-slate-200 text-slate-600 hover:bg-slate-50"
                : "border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50"
            }`}
            title={`Toggle status (currently ${pilot.status})`}
          >
            {pilot.status === "ACTIVE" ? "Set Inactive" : "Activate"}
          </button>
        )}

        {isBusy ? (
          <button
            type="button"
            disabled
            className="flex-1 py-1.5 px-3 bg-slate-100 border border-slate-200/80 text-slate-400 rounded-lg text-[11px] font-normal text-center cursor-not-allowed"
          >
            On Mission
          </button>
        ) : isSuspended ? (
          <button
            type="button"
            disabled
            className="flex-1 py-1.5 px-3 bg-rose-50 border border-rose-200 text-rose-500 rounded-lg text-[11px] font-normal text-center cursor-not-allowed flex items-center justify-center gap-1"
          >
            <AlertCircle className="w-3 h-3" /> Suspended
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onViewDetails(pilot.userId)}
            className="flex-1 py-1.5 px-3 bg-[#062419] hover:bg-[#0a3828] active:scale-[0.99] text-white rounded-lg text-[11px] font-medium text-center transition-all cursor-pointer shadow-2xs"
          >
            View / Assign
          </button>
        )}
      </div>
    </div>
  );
}
