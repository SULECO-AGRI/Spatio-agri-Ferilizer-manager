import { memo } from "react";
import { Plus, Plane, Upload, FileBarChart } from "lucide-react";
import type { TabId } from "@/types";

interface QuickActionsProps {
  onNavigate?: (tab: TabId) => void;
}

export const QuickActions = memo(function QuickActions({ onNavigate }: QuickActionsProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 font-sans shadow-xs">
      <h3 className="text-xl font-medium text-slate-900 mb-6 font-display">Quick Actions</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Review Requests */}
        <button
          type="button"
          onClick={() => onNavigate?.("requests")}
          className="flex items-center gap-4 p-4 rounded-xl border border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/50 transition-all text-left cursor-pointer group"
        >
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 group-hover:scale-105 transition-transform">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-800">Assign Pilot</h4>
            <p className="text-xs text-slate-400 mt-0.5 font-normal">Review pending queue</p>
          </div>
        </button>

        {/* 2. Dispatch Flight */}
        <button
          type="button"
          onClick={() => onNavigate?.("pilots")}
          className="flex items-center gap-4 p-4 rounded-xl border border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/50 transition-all text-left cursor-pointer group"
        >
          <div className="p-3 rounded-lg bg-sky-50 text-sky-700 group-hover:scale-105 transition-transform">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-800">Pilot Roster</h4>
            <p className="text-xs text-slate-400 mt-0.5 font-normal">Check pilot telemetry</p>
          </div>
        </button>

        {/* 3. Prescription Upload */}
        <button
          type="button"
          onClick={() => onNavigate?.("farmers")}
          className="flex items-center gap-4 p-4 rounded-xl border border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/50 transition-all text-left cursor-pointer group"
        >
          <div className="p-3 rounded-lg bg-amber-50 text-amber-700 group-hover:scale-105 transition-transform">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-800">Farmer Directory</h4>
            <p className="text-xs text-slate-400 mt-0.5 font-normal">Inspect registered fields</p>
          </div>
        </button>

        {/* 4. Generate Reports */}
        <button
          type="button"
          onClick={() => onNavigate?.("reports")}
          className="flex items-center gap-4 p-4 rounded-xl border border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/50 transition-all text-left cursor-pointer group"
        >
          <div className="p-3 rounded-lg bg-indigo-50 text-indigo-700 group-hover:scale-105 transition-transform">
            <FileBarChart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-800">Export Analytics</h4>
            <p className="text-xs text-slate-400 mt-0.5 font-normal">Mission & revenue reports</p>
          </div>
        </button>
      </div>
    </div>
  );
});

export default QuickActions;
