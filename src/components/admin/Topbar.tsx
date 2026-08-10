import { Search, Columns, CloudSun, Radio, PlayCircle } from "lucide-react";

export function Topbar() {
  return (
    <header className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100 font-sans">
      {/* Left Search Bar & Sidebar Toggle */}
      <div className="flex items-center gap-3 w-full md:max-w-md">
        <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors cursor-pointer shrink-0">
          <Columns className="w-4 h-4" />
        </button>

        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search requests, pilots, farmers..."
            className="w-full pl-11 pr-4 py-2 rounded-lg text-sm bg-white border border-slate-200 focus:outline-none focus:border-slate-400 transition-colors placeholder:text-slate-400 text-slate-800"
          />
        </div>
      </div>

      {/* Right Stats & Profile */}
      <div className="flex flex-wrap items-center justify-end gap-4 w-full md:w-auto">
        <div className="flex items-center gap-2">
          {/* Weather Widget */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-600">
            <CloudSun className="w-3.5 h-3.5 text-slate-400" />
            <span>28°C Clear</span>
          </div>

          {/* Online Pilots */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-600">
            <Radio className="w-3.5 h-3.5 text-slate-400" />
            <span>12 Online</span>
          </div>

          {/* Active Missions */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-600">
            <PlayCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>5 Active</span>
          </div>
        </div>

        {/* User Block */}
        <div className="flex items-center gap-3 pl-2 py-1 select-none">
          <div className="text-right leading-none">
            <p className="text-xs font-bold text-slate-800">Admin User</p>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mt-1 block">Operations</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shadow-xs">
            AU
          </div>
        </div>
      </div>
    </header>
  );
}
