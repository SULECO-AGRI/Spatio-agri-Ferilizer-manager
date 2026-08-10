const activities = [
  {
    id: "1",
    title: "Request REQ-1042 submitted",
    desc: "Kamal Silva — North Paddy Field",
    time: "2 min ago",
  },
  { id: "2", title: "Pilot assigned to REQ-1038", desc: "Nimal Perera", time: "18 min ago" },
  { id: "3", title: "Mission MSN-0229 completed", desc: "South Maize Plot", time: "1 hr ago" },
  { id: "4", title: "Report published for MSN-0227", desc: "Approved by admin", time: "2 hr ago" },
  { id: "5", title: "Payment received", desc: "LKR 8,500 from W. Bandara", time: "3 hr ago" },
];

export function RecentActivity() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 flex-1 font-sans shadow-xs">
      <h3 className="text-xl font-medium text-slate-900 mb-6 font-display">Recent Activity</h3>

      <div className="space-y-6">
        {activities.map(({ id, title, desc, time }) => (
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
