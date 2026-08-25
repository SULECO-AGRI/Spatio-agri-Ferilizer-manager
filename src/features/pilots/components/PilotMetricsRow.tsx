import { Star, Clock } from "lucide-react";

interface PilotMetricsRowProps {
  flightHours: string;
  rating: number;
  reviewsCount: number;
}

export function PilotMetricsRow({ flightHours, rating, reviewsCount }: PilotMetricsRowProps) {
  return (
    <div className="grid grid-cols-2 gap-4 font-sans">
      {/* Flight Hours Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-normal text-slate-400 uppercase tracking-wider block">
            Flight Hours
          </span>
          <Clock className="w-4 h-4 text-slate-400" />
        </div>
        <div className="my-2">
          <h3 className="text-2xl font-medium text-slate-900 font-display">{flightHours}</h3>
        </div>
        <div className="text-xs text-slate-400 font-normal">lifetime</div>
      </div>

      {/* Avg Rating Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-normal text-slate-400 uppercase tracking-wider block">
            Avg Rating
          </span>
          <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
        </div>
        <div className="my-2 flex items-center gap-1.5">
          <h3 className="text-2xl font-medium text-slate-900 font-display">{rating}</h3>
          <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
        </div>
        <div className="text-xs text-slate-400 font-normal">{reviewsCount} reviews</div>
      </div>
    </div>
  );
}
