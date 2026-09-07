import React, { memo } from "react";
import { LucideIcon, Inbox } from "lucide-react";

export interface EmptyStateProps {
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState = memo(function EmptyState({
  icon: Icon = Inbox,
  title = "No data available",
  description,
  actionText,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 md:p-12 text-center font-sans bg-white border border-slate-200/80 rounded-2xl shadow-2xs ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-slate-100/80 border border-slate-200 flex items-center justify-center mb-3.5 text-slate-400">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-slate-800 tracking-tight">{title}</h4>
      {description && (
        <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">{description}</p>
      )}
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
});

export default EmptyState;
