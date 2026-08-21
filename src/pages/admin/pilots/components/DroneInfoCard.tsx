import { Radio, BatteryMedium, Wrench } from "lucide-react";
import type { PilotDroneDetails } from "@/types";

interface DroneInfoCardProps {
  drone: PilotDroneDetails;
}

export function DroneInfoCard({ drone }: DroneInfoCardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs font-sans">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-normal uppercase tracking-wider text-slate-400">
          Drone Information
        </h3>
        {drone.batteryHealth && (
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 font-normal">
            <BatteryMedium className="w-3.5 h-3.5" />
            Health {drone.batteryHealth}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 bg-slate-50/60 border border-slate-200/60 p-4 rounded-xl">
        {/* Drone Icon / Thumbnail Box */}
        <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 shadow-2xs">
          <Radio className="w-6 h-6 text-[#14532d]" />
        </div>

        {/* Drone Details */}
        <div className="space-y-1 min-w-0 flex-1">
          <h4 className="text-sm font-medium text-slate-800 leading-snug">{drone.model}</h4>
          <div className="text-xs text-slate-500 font-normal">
            <span>Tank: {drone.tankCapacity}</span>
            <span className="text-slate-300 mx-2">|</span>
            <span>Max Speed: {drone.maxSpeed}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-normal pt-0.5">
            <Wrench className="w-3 h-3 text-slate-400" />
            <span>
              Last Serviced: <span className="text-slate-700">{drone.lastServiced}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
