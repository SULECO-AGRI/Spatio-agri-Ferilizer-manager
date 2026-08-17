import type { ReactNode } from "react";
import { Search } from "lucide-react";

interface TableToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  actions?: ReactNode;
  className?: string;
  widthClassName?: string;
}

export function TableToolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  actions,
  className = "",
  widthClassName = "w-full md:w-64",
}: TableToolbarProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative flex-1 ${widthClassName}`}>
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 text-slate-800 font-normal transition-colors"
        />
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
