interface FieldPolygonMapProps {
  fieldName: string;
  svgPoints: string;
}

export function FieldPolygonMap({ fieldName, svgPoints }: FieldPolygonMapProps) {
  return (
    <div className="relative w-full h-[240px] bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 500 240">
        {/* Grid lines */}
        <line x1="0" y1="60" x2="500" y2="60" stroke="#e2e8f0" strokeDasharray="3,3" />
        <line x1="0" y1="120" x2="500" y2="120" stroke="#e2e8f0" strokeDasharray="3,3" />
        <line x1="0" y1="180" x2="500" y2="180" stroke="#e2e8f0" strokeDasharray="3,3" />
        <line x1="125" y1="0" x2="125" y2="240" stroke="#e2e8f0" strokeDasharray="3,3" />
        <line x1="250" y1="0" x2="250" y2="240" stroke="#e2e8f0" strokeDasharray="3,3" />
        <line x1="375" y1="0" x2="375" y2="240" stroke="#e2e8f0" strokeDasharray="3,3" />

        {/* Outer dashed boundary */}
        <polygon
          points={svgPoints}
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="1.5"
          strokeDasharray="4,4"
        />

        {/* Field Polygon Area */}
        <polygon
          points={svgPoints}
          fill="rgba(16, 185, 129, 0.08)"
          stroke="#10b981"
          strokeWidth="1.5"
        />

        {/* Center Label */}
        <text
          x="240"
          y="125"
          fill="#047857"
          textAnchor="middle"
          fontSize="11"
          fontFamily="sans-serif"
        >
          {fieldName}
        </text>
      </svg>

      {/* Map controls overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-xs select-none">
        <button
          type="button"
          className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-800 text-xs font-normal border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
        >
          +
        </button>
        <button
          type="button"
          className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-800 text-xs font-normal hover:bg-slate-50 cursor-pointer"
        >
          -
        </button>
      </div>
    </div>
  );
}
