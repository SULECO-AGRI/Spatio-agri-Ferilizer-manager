import { useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import type { Field } from "@/types/field";

interface DeleteFieldDialogProps {
  isOpen: boolean;
  field: Field | null;
  onClose: () => void;
  onConfirm: (fieldId: number | string) => Promise<void>;
  isDeleting?: boolean;
}

export function DeleteFieldDialog({
  isOpen,
  field,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteFieldDialogProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !field) return null;

  const handleConfirm = async () => {
    setErrorMsg(null);
    try {
      await onConfirm(field.id);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to delete field.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs font-sans animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-slate-900 font-display">
                Delete Field Parcel?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to permanently delete{" "}
                <strong className="text-slate-800 font-medium font-sans">
                  {field.field_name || field.fieldName}
                </strong>
                ? This action cannot be undone.
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

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1 text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400">Owner / Farmer:</span>
              <span className="font-medium text-slate-800">
                {field.farmer?.fullName || `Farmer #${field.farmer_id}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Crop & Area:</span>
              <span className="font-medium text-slate-800">
                {field.crop_type || field.cropType} ({field.area} ha)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Location:</span>
              <span className="text-slate-700">
                {field.district}, {field.province}
              </span>
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
