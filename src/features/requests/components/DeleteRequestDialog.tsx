import { useState } from "react";
import { AlertTriangle, Loader2, X, Calendar, User, Sprout } from "lucide-react";
import { formatFullDate as formatDate, formatServiceType } from "@/lib/utils";
import type { ApiServiceRequestItem } from "@/types/request";

interface DeleteRequestDialogProps {
  isOpen: boolean;
  request: ApiServiceRequestItem | null;
  onClose: () => void;
  onConfirm: (requestId: number | string) => Promise<void>;
  isDeleting?: boolean;
}

export function DeleteRequestDialog({
  isOpen,
  request,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteRequestDialogProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !request) return null;

  const handleConfirm = async () => {
    setErrorMsg(null);
    try {
      await onConfirm(request.requestId);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to delete service request.");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs font-sans animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-slate-900 font-display">
                Delete Service Request?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to permanently delete request{" "}
                <strong className="text-slate-800 font-mono font-semibold">
                  {request.requestCode}
                </strong>
                ? This will remove all associated logs and scheduling details from the system.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Request Details Summary Card */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-2 text-slate-600">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Farmer:
              </span>
              <span className="font-medium text-slate-800">
                {request.farmer?.fullName || "Registered Farmer"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-slate-400" />
                Service / Crop:
              </span>
              <span className="font-medium text-slate-800">
                {formatServiceType(request.serviceType)} • {request.field?.cropType || "Crop"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Pref. Date:
              </span>
              <span className="text-slate-700">{formatDate(request.preferredDate)}</span>
            </div>

            <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
              <span className="text-slate-400">Current Status:</span>
              <span className="font-semibold text-slate-800">{request.status}</span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              {errorMsg}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-medium transition-colors shadow-2xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Confirm Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
