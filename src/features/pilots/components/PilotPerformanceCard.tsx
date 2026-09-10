import { memo, useMemo } from "react";

interface MonthlyPerformanceItem {
  label: string;
  value: number;
}

interface PilotPerformanceCardProps {
  data: MonthlyPerformanceItem[];
}

export const PilotPerformanceCard = memo(function PilotPerformanceCard({
  data,
}: PilotPerformanceCardProps) {
  const maxValue = useMemo(() => {
    return Math.max(...data.map((d) => d.value), 1);
  }, [data]);

  const chartHeightPx = 140;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between font-sans">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-normal uppercase tracking-wider text-slate-400">Performance</h3>
        <span className="text-xs text-slate-400 font-normal">Monthly Completed Missions</span>
      </div>

      {/* Bars Graphic */}
      {data && data.length > 0 ? (
        <>
          <div
            className="flex items-end justify-between px-3 border-b border-slate-100 pb-2 relative"
            style={{ height: `${chartHeightPx + 20}px` }}
          >
            {data.map((item) => {
              const heightPercent =
                item.value > 0 ? Math.max(15, Math.round((item.value / maxValue) * 100)) : 6;
              const heightPx = `${(heightPercent / 100) * chartHeightPx}px`;

              return (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-2 group w-full relative"
                >
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded absolute bottom-full mb-1.5 pointer-events-none z-10 whitespace-nowrap shadow-xs">
                    {item.value} missions
                  </div>

                  {/* Bar */}
                  <div
                    className={`w-7 sm:w-9 rounded-t-sm transition-all duration-200 ${
                      item.value > 0
                        ? "bg-[#14532d]/20 border border-[#14532d]/40 hover:bg-[#14532d]/35"
                        : "bg-slate-100 border border-slate-200"
                    }`}
                    style={{ height: heightPx }}
                  />
                </div>
              );
            })}
          </div>

          {/* Month Labels */}
          <div className="flex justify-between px-3 pt-2 text-[11px] text-slate-400 font-normal">
            {data.map((item) => (
              <span key={item.label} className="w-7 sm:w-9 text-center block">
                {item.label}
              </span>
            ))}
          </div>
        </>
      ) : (
        <div className="py-12 text-center text-slate-400 text-xs font-normal">
          No monthly flight telemetry recorded yet.
        </div>
      )}
    </div>
  );
});
