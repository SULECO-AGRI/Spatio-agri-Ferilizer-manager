import { useEffect } from "react";
import { AlertTriangle, Loader2, X, MapPin, User, Sprout } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  const handleConfirm = async () => {
    if (!field) return;
    const id = field.id;
    onClose();
    try {
      await onConfirm(id);
    } catch (err: unknown) {
      console.error("Failed to delete field:", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && field && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => !isDeleting && onClose()}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-white border border-slate-200/80 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 shrink-0 shadow-2xs">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <h3 className="text-base font-semibold text-slate-900 font-display">
                    Delete Field Parcel?
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Are you sure you want to delete{" "}
                    <strong className="text-slate-800 font-semibold font-sans">
                      {field.field_name || field.fieldName}
                    </strong>
                    ? This will remove the parcel record and crop allocations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isDeleting}
                  className="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Field Info Card */}
              <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 text-xs space-y-2 text-slate-600">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Farmer:
                  </span>
                  <span className="font-medium text-slate-800">
                    {field.farmer?.fullName || `Farmer #${field.farmer_id}`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Sprout className="w-3.5 h-3.5 text-slate-400" />
                    Crop & Area:
                  </span>
                  <span className="font-medium text-slate-800">
                    {field.crop_type || field.cropType} • {field.area} ha (
                    {(field.area * 2.471).toFixed(1)} ac)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Location:
                  </span>
                  <span className="text-slate-700">
                    {field.district}, {field.province}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-white hover:border-slate-300 transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white rounded-xl text-xs font-medium transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Parcel</span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
