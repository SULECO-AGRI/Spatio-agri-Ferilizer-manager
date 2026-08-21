import { X, FileCheck, Download, Calendar, ShieldCheck } from "lucide-react";
import type { PilotDocument } from "@/types";

interface DocumentViewerModalProps {
  document: PilotDocument | null;
  pilotName: string;
  onClose: () => void;
}

export function DocumentViewerModal({
  document,
  pilotName,
  onClose,
}: DocumentViewerModalProps) {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-900 leading-tight">
                {document.title}
              </h3>
              <p className="text-[11px] text-slate-500 font-normal">
                Issued to {pilotName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-5">
          {/* Document Preview Certificate Box */}
          <div className="p-6 rounded-xl border border-emerald-200 bg-emerald-50/30 text-center space-y-2 relative overflow-hidden">
            <div className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified CAASL Document
            </div>
            <h4 className="text-base font-semibold text-slate-800 tracking-tight">
              {document.title}
            </h4>
            <div className="text-xs text-slate-500 font-mono">
              Ref: {document.docNumber || "N/A"}
            </div>
          </div>

          {/* Meta Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs font-normal bg-slate-50 border border-slate-100 rounded-xl p-4">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Issue Date
              </span>
              <span className="text-slate-800 font-medium mt-0.5 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                {document.issueDate || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Expiry Date
              </span>
              <span className="text-slate-800 font-medium mt-0.5 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                {document.expiryDate || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                File Size
              </span>
              <span className="text-slate-700 mt-0.5 block">
                {document.fileSize || "1.2 MB"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Status
              </span>
              <span className="text-emerald-700 font-medium mt-0.5 block">
                Active & Compliant
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs text-white bg-[#14532d] hover:bg-[#166534] rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
