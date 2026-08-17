export interface LineChartPoint {
  label: string;
  x: number;
  y: number;
}

interface LineChartProps {
  title?: string;
  points: LineChartPoint[];
  viewBox?: string;
  className?: string;
}

export function LineChart({
  title,
  points,
  viewBox = "0 0 500 150",
  className = "",
}: LineChartProps) {
  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div
      className={`bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between font-sans ${className}`}
    >
      {title && (
        <h3 className="text-sm font-normal text-slate-500 mb-6 uppercase tracking-wider block font-sans">
          {title}
        </h3>
      )}

      {/* SVG Container */}
      <div className="relative h-[180px] w-full flex items-center justify-center">
        <svg className="w-full h-full overflow-visible" viewBox={viewBox}>
          {/* Background grid lines */}
          <line x1="0" y1="25" x2="500" y2="25" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="0" y1="125" x2="500" y2="125" stroke="#f1f5f9" strokeWidth="1" />

          {/* Trend Polyline */}
          <polyline fill="none" stroke="#64748b" strokeWidth="1.5" points={polylinePoints} />

          {/* Data points (circles) */}
          {points.map((p) => (
            <circle
              key={p.label}
              cx={p.x}
              cy={p.y}
              r="3.5"
              fill="white"
              stroke="#64748b"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      </div>

      {/* Labels Row */}
      <div className="flex justify-between px-3 pt-2 text-[10px] text-slate-400 font-normal border-t border-slate-100">
        {points.map((p) => (
          <span key={p.label} className="w-10 text-center">
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}
