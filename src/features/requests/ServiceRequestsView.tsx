import { ArrowUpDown } from "lucide-react";
import { PageHeader, FilterPills, TableToolbar } from "@/components/ui";
import { useServiceRequests, requestFilterTabs } from "./hooks/useServiceRequests";
import { RequestsTable } from "./components/RequestsTable";
import { RequestDetailsView } from "./RequestDetailsView";

interface ServiceRequestsViewProps {
  initialRequestId?: string | null;
}

export function ServiceRequestsView({ initialRequestId }: ServiceRequestsViewProps) {
  const {
    requests,
    totalCount,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    sortAsc,
    toggleSort,
    selectedRequestId,
    selectedRequestDetails,
    selectRequest,
    clearSelectedRequest,
  } = useServiceRequests({ initialRequestId });

  if (selectedRequestId && selectedRequestDetails) {
    return (
      <RequestDetailsView
        requestId={selectedRequestId}
        details={selectedRequestDetails}
        onBack={clearSelectedRequest}
      />
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Title & Description */}
      <PageHeader
        title="Service Requests"
        description="All farmer requests awaiting validation, assignment or review"
      />

      {/* Filter Tabs, Search & Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Pills Selector */}
        <FilterPills items={requestFilterTabs} active={activeFilter} onChange={setActiveFilter} />

        {/* Search and Sort tools */}
        <TableToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search requests..."
          actions={
            <button
              type="button"
              onClick={toggleSort}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-850 text-xs font-normal hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort ({sortAsc ? "Oldest" : "Newest"})</span>
            </button>
          }
        />
      </div>

      {/* Main Table */}
      <RequestsTable requests={requests} onSelectRequest={selectRequest} />

      {/* Showing count subtext */}
      <div className="text-xs text-slate-400 font-normal">
        Showing {requests.length} of {totalCount} requests — each row opens Request Details on click
      </div>
    </div>
  );
}
