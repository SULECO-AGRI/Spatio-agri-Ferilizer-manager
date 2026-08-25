import { ChevronRight, Calendar, User, Sprout, Layers, AlertCircle, Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/ui";
import type { ApiServiceRequestItem } from "@/types/request";

interface RequestsTableProps {
  requests: ApiServiceRequestItem[];
  isLoading?: boolean;
  onSelectRequest: (id: number) => void;
}

export function RequestsTable({
  requests,
  isLoading = false,
  onSelectRequest,
}: RequestsTableProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatServiceType = (service?: string) => {
    if (!service) return "General";
    return service
      .toLowerCase()
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-16 flex items-center justify-center min-h-[360px]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white border border-slate-200/80 rounded-2xl shadow-xs font-sans">
      <table className="w-full text-left border-collapse min-w-[950px]">
        <thead>
          <tr className="border-b border-slate-100 text-slate-400 text-xs font-normal">
            <th className="p-4 pl-6">Request Code</th>
            <th className="p-4">Farmer</th>
            <th className="p-4">Field</th>
            <th className="p-4">Crop</th>
            <th className="p-4">Area</th>
            <th className="p-4">Service</th>
            <th className="p-4">Pref. Date</th>
            <th className="p-4">Assigned Pilot</th>
            <th className="p-4">Priority</th>
            <th className="p-4">Status</th>
            <th className="p-4 pr-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/50 text-sm">
          {requests.map((req) => (
            <tr
              key={req.requestId}
              onClick={() => onSelectRequest(req.requestId)}
              className="hover:bg-slate-50/60 transition-colors cursor-pointer group"
            >
              {/* Request Code */}
              <td className="p-4 pl-6 font-mono text-xs font-medium text-slate-900 group-hover:text-emerald-700 transition-colors">
                {req.requestCode}
              </td>

              {/* Farmer Name */}
              <td className="p-4 text-slate-700 font-normal">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate max-w-[140px]">
                    {req.farmer?.fullName || "Unknown"}
                  </span>
                </div>
              </td>

              {/* Field Name */}
              <td className="p-4 text-slate-600 font-normal">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate max-w-[150px]">
                    {req.field?.fieldName || "Field N/A"}
                  </span>
                </div>
              </td>

              {/* Crop */}
              <td className="p-4 text-slate-800 font-normal">
                <div className="flex items-center gap-1.5">
                  <Sprout className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{req.field?.cropType || "Paddy"}</span>
                </div>
              </td>

              {/* Area */}
              <td className="p-4 text-slate-600 font-normal">
                {req.field?.area !== undefined ? `${req.field.area} Ha` : "N/A"}
              </td>

              {/* Service Type */}
              <td className="p-4 text-slate-700 font-normal">
                {formatServiceType(req.serviceType)}
              </td>

              {/* Preferred Date */}
              <td className="p-4 text-slate-600 font-normal text-xs">
                <div className="flex items-center gap-1 text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{formatDate(req.preferredDate)}</span>
                </div>
              </td>

              {/* Assigned Pilot */}
              <td className="p-4 text-slate-600 font-normal text-xs">
                {req.assignedPilot ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-medium">
                    {req.assignedPilot.fullName}
                  </span>
                ) : (
                  <span className="text-slate-400 italic">Unassigned</span>
                )}
              </td>

              {/* Priority Badge */}
              <td className="p-4">
                <StatusBadge status={req.priority} />
              </td>

              {/* Status Badge */}
              <td className="p-4">
                <StatusBadge status={req.status} />
              </td>

              {/* Actions */}
              <td className="p-4 pr-6 text-right">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRequest(req.requestId);
                  }}
                  className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 text-xs font-medium cursor-pointer"
                >
                  <span>View</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </td>
            </tr>
          ))}

          {requests.length === 0 && (
            <tr>
              <td colSpan={11} className="p-12 text-center text-slate-400 font-normal">
                <div className="flex flex-col items-center justify-center gap-2">
                  <AlertCircle className="w-6 h-6 text-slate-300" />
                  <p className="text-sm text-slate-600 font-medium">No service requests found</p>
                  <p className="text-xs text-slate-400">
                    Try adjusting your filters or search criteria.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RequestsTable;
