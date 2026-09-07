import { memo, type ReactNode } from "react";
import { Search } from "lucide-react";

export interface TableToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  filterComponent?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export const TableToolbar = memo(function TableToolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterComponent,
  actions,
  className = "",
}: TableToolbarProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans ${className}`}
    >
      <div className="flex flex-wrap items-center gap-3 flex-1">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-white border border-slate-200/80 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 shadow-2xs font-normal"
          />
        </div>
        {filterComponent}
      </div>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
});

export default TableToolbar;
