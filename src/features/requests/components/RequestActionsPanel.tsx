import { UserPlus, Phone, XCircle, Trash2 } from "lucide-react";

interface RequestActionsPanelProps {
  status?: string;
  onReject?: () => void;
  onAssignPilot?: () => void;
  onContactFarmer?: () => void;
  onDelete?: () => void;
}

export function RequestActionsPanel({
  status,
  onReject,
  onAssignPilot,
  onContactFarmer,
  onDelete,
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
            className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <UserPlus className="w-4 h-4 text-emerald-600" />
            <span>Reassign Pilot</span>
          </button>
        )}

        <button
          type="button"
          onClick={onReject}
          className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
        >
          <XCircle className="w-3.5 h-3.5 text-slate-500" />
          <span>Reject Request</span>
        </button>

        <button
          type="button"
          onClick={onContactFarmer}
          className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
        >
          <Phone className="w-3.5 h-3.5 text-slate-500" />
          <span>Contact Farmer</span>
        </button>

        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="w-full py-2.5 px-4 bg-rose-50 border border-rose-200 hover:bg-rose-100/70 text-rose-700 rounded-xl text-xs font-medium transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 mt-1"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Delete Request</span>
          </button>
        )}
      </div>
    </div>
  );
}

