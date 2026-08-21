import { Star } from "lucide-react";
import { StatusBadge } from "@/components/ui";
import type { Pilot } from "@/types";

interface PilotCardProps {
  pilot: Pilot;
  onViewDetails: (pilotId: string) => void;
}

export function PilotCard({ pilot, onViewDetails }: PilotCardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all font-sans">
      {/* Card Top: Initials Avatar, Name & Status */}
      <div className="cursor-pointer" onClick={() => onViewDetails(pilot.id)}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-normal shrink-0 border border-slate-200/50">
            {pilot.initials}
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-slate-800 leading-none hover:text-emerald-800 transition-colors">
              {pilot.name}
            </h4>
            <StatusBadge status={pilot.status} />
          </div>
        </div>

        {/* Card Mid: Stats Info */}
        <div className="space-y-1 my-4 text-xs text-slate-500 font-normal">
          <div>
            License: <span className="text-slate-700">{pilot.license}</span>
          </div>
          <div>
            Drone: <span className="text-slate-700">{pilot.drone}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>
              Experience: {pilot.experience} | Rating: {pilot.rating}
            </span>
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
          </div>
          <div>
            Missions: {pilot.missions} | Flight hrs: {pilot.flightHours} hrs
          </div>
        </div>
      </div>

      {/* Card Bottom: Actions */}
      <div className="flex gap-2 pt-4 border-t border-slate-100 mt-2">
        <button
          onClick={() => onViewDetails(pilot.id)}
          className="flex-1 py-1.5 px-3 border border-slate-200 hover:bg-slate-50 rounded-lg text-[11px] font-normal text-slate-700 text-center transition-colors cursor-pointer"
        >
          Details
        </button>
        <button className="flex-1 py-1.5 px-3 border border-slate-200 hover:bg-slate-50 rounded-lg text-[11px] font-normal text-slate-700 text-center transition-colors cursor-pointer">
          Disable
        </button>
        {pilot.status === "Busy" ? (
          <button
            disabled
            className="flex-1 py-1.5 px-3 bg-[#8da396]/60 text-white rounded-lg text-[11px] font-normal text-center cursor-not-allowed"
          >
            Assign
          </button>
        ) : (
          <button className="flex-1 py-1.5 px-3 bg-[#14532d] hover:bg-[#166534] text-white rounded-lg text-[11px] font-normal text-center transition-colors cursor-pointer">
            Assign
          </button>
        )}
      </div>
    </div>
  );
}
