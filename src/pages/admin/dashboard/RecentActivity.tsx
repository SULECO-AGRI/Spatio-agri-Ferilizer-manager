import { mockActivities } from "@/data/mockData";

export function RecentActivity() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 flex-1 font-sans shadow-xs">
      <h3 className="text-xl font-medium text-slate-900 mb-6 font-display">Recent Activity</h3>

      <div className="space-y-6">
        {mockActivities.map(({ id, title, desc, time }) => (
          <div key={id} className="flex items-start gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 mt-1.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-normal text-slate-800">{title}</p>
              <p className="text-xs text-slate-400 mt-0.5 font-normal">
                {desc} — {time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
