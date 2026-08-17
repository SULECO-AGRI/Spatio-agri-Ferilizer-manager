interface FilterPillsProps<T extends string> {
  items: readonly T[] | T[];
  active: T;
  onChange: (item: T) => void;
  formatLabel?: (item: T) => string;
  variant?: "pill" | "dark" | "outline";
  className?: string;
}

export function FilterPills<T extends string>({
  items,
  active,
  onChange,
  formatLabel,
  variant = "pill",
  className = "",
}: FilterPillsProps<T>) {
  if (variant === "dark") {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {items.map((item) => {
          const isActive = active === item;
          const label = formatLabel ? formatLabel(item) : item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              className={`px-4 py-2 text-xs font-normal rounded-lg border transition-colors cursor-pointer ${
                isActive
                  ? "bg-[#1e293b] text-white border-[#1e293b]"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-wrap items-center bg-slate-100 p-1.5 rounded-xl w-fit gap-1 ${className}`}
    >
      {items.map((item) => {
        const isActive = active === item;
        const label = formatLabel ? formatLabel(item) : item;
        return (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`px-4 py-2 text-xs font-normal rounded-lg transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-white text-slate-800 border border-slate-200/50 shadow-xs"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
