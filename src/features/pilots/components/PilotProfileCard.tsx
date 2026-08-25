import { Star, Phone, Mail, Award, Clock } from "lucide-react";
import type { DetailedPilotInfo } from "@/types";

interface PilotProfileCardProps {
  pilot: DetailedPilotInfo;
}

export function PilotProfileCard({ pilot }: PilotProfileCardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs font-sans">
      <h3 className="text-xs font-normal uppercase tracking-wider text-slate-400 mb-4">
        Pilot Profile
      </h3>

      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-700 text-base font-medium shrink-0 shadow-xs">
          {pilot.initials}
        </div>

        {/* Info Body */}
        <div className="space-y-2 flex-1 min-w-0">
          <div>
            <h4 className="text-lg font-medium text-slate-900 leading-snug">{pilot.name}</h4>
            <div className="text-xs text-slate-500 font-normal mt-0.5">
              <span>License {pilot.license}</span>
              <span className="text-slate-300 mx-2">|</span>
              <span>{pilot.experience}</span>
            </div>
          </div>

          {/* Contact Row */}
          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600 font-normal">
            <span className="inline-flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {pilot.phone}
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="inline-flex items-center gap-1 text-slate-500">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {pilot.email}
            </span>
          </div>

          {/* Rating & Missions Completed */}
          <div className="flex items-center gap-2 text-xs text-slate-700 font-normal pt-0.5">
            <span className="font-medium text-slate-800">Rating {pilot.rating}</span>
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="text-slate-300 mx-1">|</span>
            <span>{pilot.missionsCount} missions completed</span>
          </div>

          {/* Footer Stats: Flight Hours & Certificates List */}
          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 font-normal space-y-1">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Flight Hours:{" "}
                <strong className="font-medium text-slate-700">{pilot.flightHours}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Certificates:{" "}
                <span className="text-slate-700">{pilot.certificates.join(", ")}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
