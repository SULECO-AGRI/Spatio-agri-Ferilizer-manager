import { memo, isValidElement, type ReactNode, type ElementType } from "react";
import type { LucideIcon } from "lucide-react";

export interface MetricCardProps {
  title: string;
  value: string | number;
  footer?: string;
  icon?: LucideIcon | ElementType | ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  className?: string;
}

export const MetricCard = memo(function MetricCard({
  title,
  value,
  footer,
  icon: Icon,
  trend,
  className = "",
}: MetricCardProps) {
  const renderIcon = () => {
    if (!Icon) return null;
    if (isValidElement(Icon)) return Icon;
    const Component = Icon as ElementType;
    return <Component className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div
      className={`bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between font-sans shadow-xs ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-normal text-slate-400 uppercase tracking-wider block">
          {title}
        </span>
        {renderIcon()}
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
});

export default MetricCard;
