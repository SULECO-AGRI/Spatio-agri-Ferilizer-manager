import { useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Users,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { PageHeader, FilterPills, TableToolbar } from "@/components/ui";
import { usePilots, pilotFilterTabs } from "./hooks/usePilots";
import { PilotCard } from "./PilotCard";
import { PilotDetailsView } from "./PilotDetailsView";
import { DeletePilotDialog } from "./components/DeletePilotDialog";
import type { ApiPilotItem } from "@/types/pilot";

interface PilotManagementProps {
  initialPilotId?: string | number | null;
}

export function PilotManagementView({ initialPilotId = null }: PilotManagementProps) {
  const {
    pilots,
    pagination,
    totalCount,
    isLoading,
    isError,
    error,
    refetch,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    limit,
    setLimit,
    selectedPilotId,
    selectPilot,
    clearSelectedPilot,
    updateStatus,
    updatingPilotIds,
    deletePilot,
    deletingPilotId,
  } = usePilots({ initialPilotId });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pilotToDelete, setPilotToDelete] = useState<ApiPilotItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleOpenDelete = useCallback((pilot: ApiPilotItem) => {
    setPilotToDelete(pilot);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(
    async (pilotId: number | string) => {
      await deletePilot(pilotId);
      showToast("Pilot profile deleted successfully.");
    },
    [deletePilot],
  );

  const handleViewDetails = useCallback(
    (pilotId: number | string) => {
      selectPilot(pilotId);
    },
    [selectPilot],
  );

  const handleToggleStatus = useCallback(
    async (pilotId: number | string, currentStatus: string) => {
      const nextStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      try {
        await updateStatus(pilotId, nextStatus);
      } catch {
        // Handled within usePilots hook rollback
      }
    },
    [updateStatus],
  );

  // If a pilot is selected, display the detailed view
  if (selectedPilotId) {
    return (
      <PilotDetailsView
        pilotId={selectedPilotId}
        onBack={clearSelectedPilot}
        onDelete={async () => {
          await deletePilot(selectedPilotId);
          clearSelectedPilot();
          showToast("Pilot profile deleted successfully.");
        }}
      />
    );
  }

  const startItem = totalCount === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(pagination.page * pagination.limit, totalCount);

  return (
    <div className="space-y-6 font-sans">
      {/* Header Info */}
      <PageHeader
        title="Pilot Management"
        description="All registered drone pilots, availability status, and fleet telemetry"
        actions={
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-normal hover:bg-slate-50 disabled:opacity-50 transition-all cursor-pointer shadow-2xs"
            title="Refresh list"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-600" : ""}`}
            />
            <span>Refresh</span>
          </button>
        }
      />

      {/* Error Banner */}
      {isError && (
        <div
          role="alert"
          className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center justify-between gap-3 shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error || "Failed to load pilots from the server."}</span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-3 py-1 bg-white border border-rose-200 hover:bg-rose-100/50 rounded-lg text-rose-700 font-medium transition-colors cursor-pointer text-[11px]"
          >
            Retry
          </button>
        </div>
      )}

      {/* Tabs and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tab Pills */}
        <FilterPills items={pilotFilterTabs} active={activeFilter} onChange={setActiveFilter} />

        {/* Search Input */}
        <TableToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by name, email, mobile, license..."
        />
      </div>

      {/* Pilots Card Grid & Loading State */}
      {isLoading ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-16 flex items-center justify-center min-h-[360px]">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pilots.map((pilot) => (
            <PilotCard
              key={pilot.userId}
              pilot={pilot}
              isUpdating={
                updatingPilotIds.has(pilot.userId) ||
                updatingPilotIds.has(Number(pilot.userId)) ||
                updatingPilotIds.has(String(pilot.userId))
              }
              onViewDetails={handleViewDetails}
              onToggleStatus={handleToggleStatus}
              onDelete={handleOpenDelete}
            />
          ))}

          {/* Empty State */}
          {pilots.length === 0 && !isLoading && (
            <div className="col-span-full py-16 text-center text-slate-400 bg-white border border-slate-200/80 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-slate-700">No pilots found</h4>
                <p className="text-xs text-slate-400 max-w-sm">
                  {searchQuery
                    ? `No registered pilots matched "${searchQuery}".`
                    : `No pilots available under the "${activeFilter}" filter tab.`}
                </p>
              </div>
              {(searchQuery || activeFilter !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("All");
                  }}
                  className="mt-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-normal transition-colors cursor-pointer"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-900 text-white text-xs font-medium rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeletePilotDialog
        isOpen={isDeleteDialogOpen}
        pilot={pilotToDelete}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setPilotToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={deletingPilotId === pilotToDelete?.userId}
      />

      {/* Pagination & Counter Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-500 font-normal">
        <div>
          Showing <span className="font-medium text-slate-800">{startItem}</span> to{" "}
          <span className="font-medium text-slate-800">{endItem}</span> of{" "}
          <span className="font-medium text-slate-800">{totalCount}</span> pilots
        </div>

        {/* Page controls */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={!pagination.hasPrevPage || isLoading}
              onClick={() => setPage(page - 1)}
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
              onClick={() => setPage(page + 1)}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer text-slate-600"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Rows selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Cards per page:</span>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="px-2.5 py-1 border border-slate-200 rounded-lg bg-white text-slate-700 text-xs outline-none focus:border-emerald-600 cursor-pointer"
          >
            <option value={6}>6</option>
            <option value={9}>9</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default PilotManagementView;
