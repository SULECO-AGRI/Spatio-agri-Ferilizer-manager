import { UserPlus } from "lucide-react";

interface RequestActionsPanelProps {
  status?: string;
  onApprove?: () => void;
  onReject?: () => void;
  onAssignPilot?: () => void;
  onReschedule?: () => void;
  onContactFarmer?: () => void;
}

export function RequestActionsPanel({
  status,
  onApprove,
  onReject,
  onAssignPilot,
  onReschedule,
  onContactFarmer,
}: RequestActionsPanelProps) {
  const isPending = !status || status.toUpperCase() === "PENDING";

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4 font-sans">
      <h3 className="text-sm font-semibold text-slate-900 font-display">Actions</h3>

      <div className="flex flex-col gap-2.5">
        {isPending ? (
          <button
            type="button"
            onClick={onAssignPilot}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-xs transition-all duration-150 shadow-xs cursor-pointer text-center flex items-center justify-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Assign Pilot</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onAssignPilot}
            className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-normal transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
          >
            <UserPlus className="w-4 h-4 text-slate-500" />
            <span>Reassign Pilot</span>
          </button>
        )}

        <button
          type="button"
          onClick={onApprove}
          className="w-full py-2.5 px-4 bg-[#14532d] hover:bg-[#166534] text-white rounded-xl text-xs font-normal transition-colors cursor-pointer text-center"
        >
          Approve
        </button>
        <button
          type="button"
          onClick={onReject}
          className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-normal transition-colors cursor-pointer text-center"
        >
          Reject
        </button>
        <button
          type="button"
          onClick={onReschedule}
          className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-normal transition-colors cursor-pointer text-center"
        >
          Reschedule
        </button>
        <button
          type="button"
          onClick={onContactFarmer}
          className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-normal transition-colors cursor-pointer text-center"
        >
          Contact Farmer
        </button>
      </div>
    </div>
  );
}
