import { FileText, ChevronRight } from "lucide-react";
import type { PilotDocument } from "@/types";

interface CertificatesCardProps {
  documents: PilotDocument[];
  onViewDocument: (doc: PilotDocument) => void;
}

export function CertificatesCard({
  documents,
  onViewDocument,
}: CertificatesCardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs font-sans space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-normal uppercase tracking-wider text-slate-400">
          Certificates & Documents
        </h3>
        <span className="text-xs text-slate-400 font-normal">
          {documents.length} verified
        </span>
      </div>

      <div className="space-y-2.5">
        {documents.map((doc) => (
          <div
            key={doc.id}
            onClick={() => onViewDocument(doc)}
            className="flex items-center justify-between p-3.5 bg-slate-50/60 hover:bg-slate-100/70 border border-slate-200/70 rounded-xl transition-all duration-150 cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 group-hover:text-emerald-700 transition-colors">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-medium text-slate-800 truncate group-hover:text-slate-900">
                  {doc.title}
                </h4>
                {doc.docNumber && (
                  <p className="text-[10px] text-slate-400 font-normal font-mono">
                    {doc.docNumber}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 transition-colors shrink-0 ml-2 font-normal"
            >
              <span>View</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        ))}

        {documents.length === 0 && (
          <div className="text-center py-4 text-xs text-slate-400 font-normal">
            No documents uploaded yet.
          </div>
        )}
      </div>
    </div>
  );
}
