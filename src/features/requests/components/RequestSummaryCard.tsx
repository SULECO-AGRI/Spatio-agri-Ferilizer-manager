interface RequestSummaryCardProps {
  requestId: string;
  submittedDate?: string;
  area: string;
  priority: string;
  status: string;
}

export function RequestSummaryCard({
  requestId,
  submittedDate = "Jul 19, 2026",
  area,
  priority,
  status,
}: RequestSummaryCardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4 font-normal text-xs font-sans">
      <h3 className="text-sm font-normal text-slate-800 font-display">Request Summary</h3>

      <div className="divide-y divide-slate-100">
        <div className="flex justify-between py-2.5">
          <span className="text-slate-400">Request ID</span>
          <span className="text-slate-700 font-medium">{requestId}</span>
        </div>
        <div className="flex justify-between py-2.5">
          <span className="text-slate-400">Submitted</span>
          <span className="text-slate-700">{submittedDate}</span>
        </div>
        <div className="flex justify-between py-2.5">
          <span className="text-slate-400">Area</span>
          <span className="text-slate-700">{area}</span>
        </div>
        <div className="flex justify-between py-2.5">
          <span className="text-slate-400">Priority</span>
          <span className="text-slate-700">{priority}</span>
        </div>
        <div className="flex justify-between py-2.5">
          <span className="text-slate-400">Status</span>
          <span className="text-slate-700">{status}</span>
        </div>
      </div>
    </div>
  );
}
