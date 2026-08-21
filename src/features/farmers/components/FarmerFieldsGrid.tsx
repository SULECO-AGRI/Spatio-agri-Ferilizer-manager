import type { FarmerField } from "@/types";

interface FarmerFieldsGridProps {
  fields: FarmerField[];
}

export function FarmerFieldsGrid({ fields }: FarmerFieldsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
      {fields.map((f) => (
        <div
          key={f.id}
          className="p-4 border border-slate-200/80 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors shadow-xs"
        >
          <div className="font-medium text-slate-900 text-sm">{f.name}</div>
          <div className="text-xs text-slate-600 mt-1">
            {f.size} • {f.notes}
          </div>
        </div>
      ))}
      {fields.length === 0 && (
        <div className="col-span-full text-center py-6 text-xs text-slate-400">
          No registered fields found.
        </div>
      )}
    </div>
  );
}
