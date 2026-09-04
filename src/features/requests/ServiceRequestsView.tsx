import { useState, useEffect, useCallback } from "react";
import {
  ArrowUpDown,
  RefreshCw,
  AlertCircle,
  Clock,
  UserCheck,
  PlayCircle,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { PageHeader, FilterPills, TableToolbar } from "@/components/ui";
import { useServiceRequests, requestFilterTabs } from "./hooks/useServiceRequests";
import { RequestsTable } from "./components/RequestsTable";
import { RequestDetailsView } from "./RequestDetailsView";
import { AssignPilotModal } from "./components/AssignPilotModal";
import type { ApiServiceRequestItem, CandidatePilot } from "@/types/request";

interface ServiceRequestsViewProps {
  initialRequestId?: string | number | null;
}

interface ToastNotification {
  id: number;
  title: string;
  message: string;
  type: "success" | "error";
}

export function ServiceRequestsView({ initialRequestId }: ServiceRequestsViewProps) {
  const {
    requests,
    summary,
    pagination,
    isLoading,
    isError,
    error,
    refetch,
    activeFilter,
    setActiveFilter,
    priorityFilter,
    setPriorityFilter,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    limit,
    setLimit,
    sortOrder,
    toggleSort,
    selectedRequestId,
    selectedRequestDetails,
    selectRequest,
    clearSelectedRequest,
  } = useServiceRequests({ initialRequestId });

  const [assigningRequest, setAssigningRequest] = useState<ApiServiceRequestItem | null>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleAssignSuccess = useCallback(
    (updatedRequest: ApiServiceRequestItem, candidate: CandidatePilot) => {
      setToast({
        id: Date.now(),
        title: "Pilot Assigned Successfully",
        message: `${candidate.fullName} has been assigned to request ${updatedRequest.requestCode}. Status updated to ASSIGNED.`,
        type: "success",
      });

      // Refetch live list & counters
      refetch();
    },
    [refetch],
  );

  if (selectedRequestId && selectedRequestDetails) {
    return (
      <>
        <RequestDetailsView
          request={selectedRequestDetails}
          onBack={clearSelectedRequest}
          onAssignPilot={(req) => setAssigningRequest(req)}
        />

        {/* Candidate Pilot Assignment Modal */}
        <AssignPilotModal
          isOpen={assigningRequest !== null}
          request={assigningRequest}
          onClose={() => setAssigningRequest(null)}
          onAssignSuccess={handleAssignSuccess}
        />

        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 max-w-md bg-white border border-emerald-200 rounded-2xl p-4 shadow-xl flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-200">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-slate-900">{toast.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </>
    );
  }

  // Calculate showing range for pagination
  const startItem = pagination.total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, pagination.total);

  return (
    <div className="space-y-6 font-sans">
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Service Requests"
          description="All farmer requests awaiting validation, pilot assignment or field execution"
        />

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-2xs transition-colors cursor-pointer disabled:opacity-60 self-start sm:self-auto"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-600" : ""}`}
          />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary KPI Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-amber-800 font-normal block">Pending</span>
            <span className="text-lg font-semibold text-amber-950 font-mono">
              {summary.totalPending}
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-blue-800 font-normal block">Assigned</span>
            <span className="text-lg font-semibold text-blue-950 font-mono">
              {summary.totalAssigned}
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-purple-50/70 border border-purple-200/80 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
            <PlayCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-purple-800 font-normal block">In Progress</span>
            <span className="text-lg font-semibold text-purple-950 font-mono">
              {summary.totalInProgress}
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-emerald-800 font-normal block">Completed</span>
            <span className="text-lg font-semibold text-emerald-950 font-mono">
              {summary.totalCompleted}
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-rose-50/70 border border-rose-200/80 rounded-2xl flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700 shrink-0">
            <XCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-rose-800 font-normal block">Cancelled</span>
            <span className="text-lg font-semibold text-rose-950 font-mono">
              {summary.totalCancelled}
            </span>
          </div>
        </div>
      </div>

      {/* Error Alert Banner */}
      {isError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start justify-between gap-3 text-xs text-rose-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error || "Failed to load requests from server."}</span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="font-medium underline hover:text-rose-900 cursor-pointer"
          >
            Try again
          </button>
        </div>
      )}

      {/* Filter Tabs, Search, Priority & Sort */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Status Pills Selector */}
        <FilterPills items={requestFilterTabs} active={activeFilter} onChange={setActiveFilter} />

        {/* Toolbar Tools: Priority, Search and Sort */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-normal text-slate-700 outline-none focus:border-emerald-500 transition-colors cursor-pointer shadow-2xs"
            aria-label="Filter by priority"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>

          {/* Search Box */}
          <TableToolbar
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              setPage(1);
            }}
            searchPlaceholder="Search requests..."
            actions={
              <button
                type="button"
                onClick={toggleSort}
                className="flex items-center gap-2 px-3.5 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs font-normal hover:bg-slate-50 transition-colors cursor-pointer shrink-0 shadow-2xs"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span>Sort ({sortOrder === "asc" ? "Date ↑" : "Date ↓"})</span>
              </button>
            }
          />
        </div>
      </div>

      {/* Main Live Requests Table */}
      <RequestsTable
        requests={requests}
        isLoading={isLoading}
        onSelectRequest={(id) => selectRequest(id)}
        onAssignPilot={(req) => setAssigningRequest(req)}
      />

      {/* Pagination & Counter Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-500 font-normal">
        <div>
          Showing <span className="font-medium text-slate-800">{startItem}</span> to{" "}
          <span className="font-medium text-slate-800">{endItem}</span> of{" "}
          <span className="font-medium text-slate-800">{pagination.total}</span> requests
        </div>

        {/* Page controls */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={!pagination.hasPrevPage || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer text-slate-600"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  page === p
                    ? "bg-[#062419] text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              disabled={!pagination.hasNextPage || isLoading}
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer text-slate-600"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Rows per page selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Rows:</span>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="p-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 outline-none cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Candidate Pilot Assignment Modal */}
      <AssignPilotModal
        isOpen={assigningRequest !== null}
        request={assigningRequest}
        onClose={() => setAssigningRequest(null)}
        onAssignSuccess={handleAssignSuccess}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-white border border-emerald-200 rounded-2xl p-4 shadow-xl flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-200">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-slate-900">{toast.title}</h4>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default ServiceRequestsView;
