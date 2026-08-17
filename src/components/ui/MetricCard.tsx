import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export interface MetricCardProps {
  title: string;
  value: string | number;
  footer?: string;
  icon?: LucideIcon | ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  className?: string;
}

export function MetricCard({
  title,
  value,
  footer,
  icon: Icon,
  trend,
  className = "",
}: MetricCardProps) {
  return (
    <div
      className={`bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between font-sans shadow-xs ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-normal text-slate-400 uppercase tracking-wider block">
          {title}
        </span>
        {Icon && (typeof Icon === "function" ? <Icon className="w-4 h-4 text-slate-400" /> : Icon)}
      </div>

      <div className="mt-2">
        <h3 className="text-2xl md:text-3xl font-medium text-slate-900 font-display">{value}</h3>
      </div>

      {(footer || trend) && (
        <div className="mt-1 flex items-center justify-between text-xs font-normal text-slate-400">
          {footer && <span>{footer}</span>}
          {trend && (
            <span
              className={
                trend.isPositive ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"
              }
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
