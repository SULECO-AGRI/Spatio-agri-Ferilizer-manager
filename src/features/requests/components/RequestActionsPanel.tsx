interface RequestActionsPanelProps {
  onApprove?: () => void;
  onReject?: () => void;
  onAssignPilot?: () => void;
  onReschedule?: () => void;
  onContactFarmer?: () => void;
}

export function RequestActionsPanel({
  onApprove,
  onReject,
  onAssignPilot,
  onReschedule,
  onContactFarmer,
}: RequestActionsPanelProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4 font-sans">
      <h3 className="text-sm font-normal text-slate-850 font-display">Actions</h3>

      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={onApprove}
          className="w-full py-2.5 px-4 bg-[#14532d] hover:bg-[#166534] text-white rounded-lg text-xs font-normal transition-colors cursor-pointer text-center"
        >
          Approve
        </button>
        <button
          type="button"
          onClick={onReject}
          className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-normal transition-colors cursor-pointer text-center"
        >
          Reject
        </button>
        <button
          type="button"
          onClick={onAssignPilot}
          className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-normal transition-colors cursor-pointer text-center"
        >
          Assign Pilot
        </button>
        <button
          type="button"
          onClick={onReschedule}
          className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-normal transition-colors cursor-pointer text-center"
        >
          Reschedule
        </button>
        <button
          type="button"
          onClick={onContactFarmer}
          className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-normal transition-colors cursor-pointer text-center"
        >
          Contact Farmer
        </button>
      </div>
    </div>
  );
}
