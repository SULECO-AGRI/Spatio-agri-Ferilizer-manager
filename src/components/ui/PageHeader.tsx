import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className = "" }: PageHeaderProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans ${className}`}
    >
      <div>
        <h1 className="text-3xl font-medium tracking-tight text-slate-900 font-display">{title}</h1>
        {description && (
          <p className="text-slate-400 text-xs md:text-sm mt-1 font-normal">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
}
