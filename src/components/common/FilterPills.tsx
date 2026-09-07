import { memo } from "react";

export interface FilterPillsProps<T extends string = string> {
  items: readonly T[] | T[];
  active: T;
  onChange: (item: T) => void;
  className?: string;
  pillClassName?: string;
  counts?: Partial<Record<T, number>>;
}

export const FilterPills = memo(function FilterPills<T extends string>({
  items,
  active,
  onChange,
  className = "",
  pillClassName = "",
  counts,
}: FilterPillsProps<T>) {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 font-sans ${className}`}>
      {items.map((item) => {
        const isActive = active === item;
        const count = counts?.[item];

        return (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              isActive
                ? "bg-[#062419] text-white shadow-2xs border border-emerald-800/50 font-semibold"
                : "bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200/60"
            } ${pillClassName}`}
          >
            <span>{item}</span>
            {count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}) as <T extends string>(props: FilterPillsProps<T>) => React.ReactElement;

export default FilterPills;
