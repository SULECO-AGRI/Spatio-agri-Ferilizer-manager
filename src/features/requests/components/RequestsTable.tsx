import { ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/ui";
import type { ServiceRequest } from "@/types";

interface RequestsTableProps {
  requests: ServiceRequest[];
  onSelectRequest: (id: string) => void;
}

export function RequestsTable({ requests, onSelectRequest }: RequestsTableProps) {
  return (
    <div className="overflow-x-auto bg-white border border-slate-200/80 rounded-2xl shadow-xs font-sans">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b border-slate-100 text-slate-400 text-xs font-normal">
            <th className="p-4 pl-6">Request ID</th>
            <th className="p-4">Farmer</th>
            <th className="p-4">Field</th>
            <th className="p-4">Crop</th>
            <th className="p-4">Area</th>
            <th className="p-4">Service</th>
            <th className="p-4">Pref. Date</th>
            <th className="p-4">Weather</th>
            <th className="p-4">Priority</th>
            <th className="p-4">Status</th>
            <th className="p-4 pr-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/50 text-sm">
          {requests.map((req) => (
            <tr
              key={req.id}
              onClick={() => onSelectRequest(req.id)}
              className="hover:bg-slate-50/40 transition-colors cursor-pointer"
            >
              <td className="p-4 pl-6 text-slate-850 font-normal">{req.id}</td>
              <td className="p-4 text-slate-600 font-normal">{req.farmer}</td>
              <td className="p-4 text-slate-600 font-normal">{req.field}</td>
              <td
                className={`p-4 font-normal ${req.crop === "Tea" ? "text-amber-900" : "text-slate-800"}`}
              >
                {req.crop}
              </td>
              <td className="p-4 text-slate-600 font-normal">{req.area}</td>
              <td className="p-4 text-slate-600 font-normal">{req.service}</td>
              <td className="p-4 text-indigo-600 font-normal">{req.prefDate}</td>
              <td className="p-4 text-slate-600 font-normal">{req.weather}</td>
              <td className="p-4">
                <StatusBadge status={req.priority} />
              </td>
              <td className="p-4">
                <StatusBadge status={req.status} />
              </td>
              <td className="p-4 pr-6 text-right">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-slate-800 hover:text-slate-900 text-xs font-normal cursor-pointer"
                >
                  <span>View</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </td>
            </tr>
          ))}
          {requests.length === 0 && (
            <tr>
              <td colSpan={11} className="p-8 text-center text-slate-400 font-normal">
                No requests found matching your query.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
