interface MetricCardProps {
  title: string;
  value: string | number;
  footer: string;
}

export function MetricCard({
  title,
  value,
  footer,
}: MetricCardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col font-sans shadow-xs">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        {title}
      </p>
      <h3 className="text-3xl font-extrabold text-slate-900 mt-2 font-display">
        {value}
      </h3>
      <p className="text-xs text-slate-400 mt-1 font-medium">
        {footer}
      </p>
    </div>
  );
}
