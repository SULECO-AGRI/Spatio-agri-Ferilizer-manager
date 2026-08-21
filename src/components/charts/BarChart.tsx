import { memo, useMemo } from "react";

export interface BarChartItem {
  label: string;
  value: number;
  height?: string;
}

interface BarChartProps {
  data: BarChartItem[];
  title?: string;
  maxHeightPx?: number;
  className?: string;
}

export const BarChart = memo(function BarChart({
  data,
  title,
  maxHeightPx = 160,
  className = "",
}: BarChartProps) {
  const maxValue = useMemo(() => {
    return Math.max(...data.map((d) => d.value), 1);
  }, [data]);

  return (
    <div
      className={`bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between font-sans ${className}`}
    >
      {title && (
        <h3 className="text-sm font-normal text-slate-500 mb-6 uppercase tracking-wider block font-sans">
          {title}
        </h3>
      )}

      {/* Bars Container */}
      <div
        className="flex items-end justify-between px-4 border-b border-slate-100 pb-2 relative"
        style={{ height: `${maxHeightPx + 20}px` }}
      >
        {data.map((item) => {
          const heightPx = item.height || `${(item.value / maxValue) * maxHeightPx}px`;

          return (
            <div
              key={item.label}
              className="flex flex-col items-center gap-2 group w-full relative"
            >
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded-sm absolute bottom-full mb-1 pointer-events-none z-10 whitespace-nowrap shadow-xs">
                {item.value}
              </div>

              {/* Bar */}
              <div
                className="w-8 md:w-10 bg-slate-200 border border-slate-300 rounded-t-xs hover:bg-slate-300 transition-colors"
                style={{ height: heightPx }}
              />
            </div>
          );
        })}
      </div>

      {/* Labels Row */}
      <div className="flex justify-between px-4 pt-2 text-[10px] text-slate-400 font-normal">
        {data.map((item) => (
          <span key={item.label} className="w-8 md:w-10 text-center block">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
});
