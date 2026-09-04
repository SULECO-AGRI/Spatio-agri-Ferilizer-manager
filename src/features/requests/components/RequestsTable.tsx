import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChevronRight, Calendar, User, AlertCircle, Loader2, UserPlus } from "lucide-react";
import { StatusBadge } from "@/components/ui";
import { formatDate, formatServiceType } from "@/lib/utils";
import type { ApiServiceRequestItem } from "@/types/request";

interface RequestsTableProps {
  requests: ApiServiceRequestItem[];
  isLoading?: boolean;
  onSelectRequest: (id: number) => void;
  onAssignPilot?: (request: ApiServiceRequestItem) => void;
}

export function RequestsTable({
  requests,
  isLoading = false,
  onSelectRequest,
  onAssignPilot,
}: RequestsTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: requests.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 58,
    overscan: 8,
  });

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-16 flex items-center justify-center min-h-[360px]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const paddingTop = virtualItems.length > 0 ? (virtualItems[0]?.start ?? 0) : 0;
  const paddingBottom =
    virtualItems.length > 0 ? totalSize - (virtualItems[virtualItems.length - 1]?.end ?? 0) : 0;

  return (
    <div
      ref={parentRef}
      className="overflow-auto max-h-[640px] bg-white border border-slate-200/80 rounded-2xl shadow-xs font-sans relative"
    >
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
          <tr className="text-slate-400 text-xs font-normal">
            <th className="p-4 pl-6">Request Code</th>
            <th className="p-4">Farmer</th>
            <th className="p-4">Area</th>
            <th className="p-4">Service</th>
            <th className="p-4">Pref. Date</th>
            <th className="p-4">Assigned Pilot</th>
            <th className="p-4">Priority</th>
            <th className="p-4">Status</th>
            <th className="p-4 pr-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/60 text-sm">
          {paddingTop > 0 && (
            <tr>
              <td style={{ height: `${paddingTop}px` }} colSpan={9} />
            </tr>
          )}

          {virtualItems.map((virtualRow) => {
            const req = requests[virtualRow.index];
            if (!req) return null;

            return (
              <tr
                key={req.requestId}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                onClick={() => onSelectRequest(req.requestId)}
                className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
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
                <td className="p-4 pr-6 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    {req.status === "PENDING" && onAssignPilot && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAssignPilot(req);
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                        title="Assign candidate pilot"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Assign Pilot</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRequest(req.requestId);
                      }}
                      className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 text-xs font-medium cursor-pointer py-1 px-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                    >
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {paddingBottom > 0 && (
            <tr>
              <td style={{ height: `${paddingBottom}px` }} colSpan={9} />
            </tr>
          )}

          {requests.length === 0 && (
            <tr>
              <td colSpan={9} className="p-12 text-center text-slate-400 font-normal">
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
