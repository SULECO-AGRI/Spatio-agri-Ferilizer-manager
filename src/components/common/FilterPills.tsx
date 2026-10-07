import { memo } from "react";
import { useLanguage } from "@/context/LanguageContext";

export interface FilterPillsProps<T extends string = string> {
  items: readonly T[] | T[];
  active: T;
  onChange: (item: T) => void;
  formatLabel?: (item: T) => string;
  variant?: "pill" | "dark" | "outline";
  className?: string;
  pillClassName?: string;
  counts?: Partial<Record<T, number>>;
}

const sinhalaPillLabels: Record<string, string> = {
  All: "සියල්ල",
  Pending: "පොරොත්තු",
  Assigned: "පවරා ඇත",
  "In Progress": "ක්‍රියාත්මක වෙමින්",
  Completed: "නිම කළ",
  Cancelled: "අවලංගු කළ",
  Available: "ලබාගත හැක",
  "On Mission": "මෙහෙයුමක",
  Offline: "විසන්ධි",
  Paddy: "වී",
  Tea: "තේ",
  Rubber: "රබර්",
  Coconut: "පොල්",
  Maize: "බඩඉරිඟු",
  Vegetables: "එළවළු",
  Sugarcane: "උක්",
  High: "ඉහළ",
  Medium: "මධ්‍යම",
  Low: "අඩු",
  Paid: "ගෙවා ඇත",
  Failed: "අසාර්ථක",
  Invoices: "ඉන්වොයිස්",
  "Pilot Payouts": "නියමු ගෙවීම්",
  Overview: "දළ විශ්ලේෂණය",
  Pilots: "නියමුවන්",
  Revenue: "ආදායම",
  Farmers: "ගොවීන්",
};

export const FilterPills = memo(function FilterPills<T extends string>({
  items,
  active,
  onChange,
  formatLabel,
  variant = "pill",
  className = "",
  pillClassName = "",
  counts,
}: FilterPillsProps<T>) {
  const { isSinhala } = useLanguage();

  const resolveLabel = (item: T): string => {
    if (formatLabel) return formatLabel(item);
    if (isSinhala && sinhalaPillLabels[item]) return sinhalaPillLabels[item];
    return item;
  };

  if (variant === "dark") {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {items.map((item) => {
          const isActive = active === item;
          const label = resolveLabel(item);
          const count = counts?.[item];
          return (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              className={`px-4 py-2 text-xs font-normal rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? "bg-[#1e293b] text-white border-[#1e293b]"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              } ${pillClassName}`}
            >
              <span>{label}</span>
              {count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-600"
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
  }

  return (
    <div className={`flex flex-wrap items-center gap-1.5 font-sans ${className}`}>
      {items.map((item) => {
        const isActive = active === item;
        const count = counts?.[item];
        const label = resolveLabel(item);

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
            <span>{label}</span>
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

