import { UserPlus, Plane, FileText, ArrowRight } from "lucide-react";

export function QuickActions() {
  return (
    <div className="space-y-4 font-sans">
      <h3 className="text-xs font-normal uppercase tracking-wider text-slate-400">
        Quick Actions
      </h3>

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <button className="flex items-center justify-between gap-4 bg-[#14532d] hover:bg-[#166534] text-white px-5 py-2.5 rounded-lg text-sm font-normal transition-colors duration-200 cursor-pointer min-w-[200px]">
          <span>Assign Pilot</span>
          <UserPlus className="w-4 h-4" />
        </button>

        <button className="flex items-center justify-between gap-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 px-5 py-2.5 rounded-lg text-sm font-normal transition-colors duration-200 cursor-pointer min-w-[200px]">
          <span>Create Mission</span>
          <Plane className="w-4 h-4" />
        </button>

        <button className="flex items-center justify-between gap-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 px-5 py-2.5 rounded-lg text-sm font-normal transition-colors duration-200 cursor-pointer min-w-[200px]">
          <span>View Reports</span>
          <FileText className="w-4 h-4" />
        </button>
      </div>

      <div className="pt-2">
        <a
          href="/admin/requests"
          className="inline-flex items-center gap-1.5 text-xs font-normal text-slate-400 hover:text-slate-600 transition-colors"
        >
          Open Service Requests for the full queue
          <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
