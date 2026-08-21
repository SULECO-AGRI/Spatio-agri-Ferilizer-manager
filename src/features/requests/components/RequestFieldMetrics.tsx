interface RequestFieldMetricsProps {
  crop: string;
  growthStage: string;
  service: string;
  prefDate: string;
  duration: string;
  drone: string;
}

export function RequestFieldMetrics({
  crop,
  growthStage,
  service,
  prefDate,
  duration,
  drone,
}: RequestFieldMetricsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 gap-6 text-xs font-normal pt-2 font-sans">
      <div className="space-y-4">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Crop</span>
          <span className="text-slate-800 font-medium mt-1 block">{crop}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Requested Service
          </span>
          <span className="text-slate-800 font-medium mt-1 block">{service}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Estimated Duration
          </span>
          <span className="text-slate-800 font-medium mt-1 block">{duration}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Growth Stage
          </span>
          <span className="text-slate-800 font-medium mt-1 block">{growthStage}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Preferred Date
          </span>
          <span className="text-slate-800 font-medium mt-1 block">{prefDate}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Recommended Drone
          </span>
          <span className="text-slate-800 font-medium mt-1 block">{drone}</span>
        </div>
      </div>
    </div>
  );
}
