import {
  ChevronRight,
  ChevronLeft,
  Search,
  User,
  MapPin,
  RefreshCw,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/ui";
import { useFarmers } from "./hooks/useFarmers";
import { FarmerProfileView } from "./FarmerProfileView";

interface FarmersListViewProps {
  initialFarmerId?: string | number | null;
  onViewProfile?: (farmerId: string | number) => void;
}

export function FarmersListView({ initialFarmerId, onViewProfile }: FarmersListViewProps) {
  const {
    farmers,
    pagination,
    totalCount,
    isLoading,
    isError,
    error,
    refetch,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    selectedFarmerId,
    selectedFarmer,
    selectFarmer,
    clearSelectedFarmer,
  } = useFarmers({ initialFarmerId });

  const handleView = (id: string | number) => {
    if (onViewProfile) {
      onViewProfile(id);
    } else {
      selectFarmer(id);
    }
  };

  const formatMemberYear = (memberSince?: string): string => {
    if (!memberSince) return "N/A";
    const date = new Date(memberSince);
    return isNaN(date.getFullYear()) ? memberSince : String(date.getFullYear());
  };

  if (selectedFarmerId && selectedFarmer) {
    return (
      <FarmerProfileView
        farmer={selectedFarmer}
        fields={[]}
        serviceHistory={[]}
        onBack={clearSelectedFarmer}
      />
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Farmers Directory"
        description="Active farming clients, registered field parcels, and engagement history"
      />

      {/* Toolbar with Search and Refetch */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500 font-normal">
          Total Registered: <span className="font-medium text-slate-800">{totalCount}</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, location, or NIC..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-xs"
            />
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading}
            title="Refresh farmers directory"
            className="p-2 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-xl text-slate-500 hover:text-slate-700 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-emerald-600" : ""}`} />
          </button>
        </div>
      </div>

      {/* Error state banner */}
      {isError && (
        <div className="p-4 bg-red-50/70 border border-red-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error || "Failed to load farmers from server."}</span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded-lg font-medium text-red-800 transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto bg-white border border-slate-200/80 rounded-2xl shadow-xs">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-xs font-normal bg-slate-50/50">
              <th className="p-4 pl-6">Farmer</th>
              <th className="p-4">Location</th>
              <th className="p-4">NIC</th>
              <th className="p-4 text-center">Fields / Area</th>
              <th className="p-4 text-center">Service Requests</th>
              <th className="p-4 text-center">Member Since</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/60 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="p-16 text-center">
                  <div className="flex items-center justify-center min-h-[300px]">
                    <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                  </div>
                </td>
              </tr>
            ) : farmers.length > 0 ? (
              farmers.map((farmer) => {
                const initials =
                  farmer.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase() || "FR";

                const fieldCount = farmer.totalFields ?? 0;
                const areaCount = Number(farmer.totalArea ?? 0);
                const reqCount = farmer.totalServiceRequests ?? 0;

                return (
                  <tr
                    key={farmer.userId}
                    onClick={() => handleView(farmer.userId)}
                    className="hover:bg-slate-50/60 transition-colors cursor-pointer group"
                  >
                    {/* Farmer Name & Email */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 font-medium text-xs flex items-center justify-center shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="text-slate-900 font-medium text-xs sm:text-sm group-hover:text-emerald-950 transition-colors">
                            {farmer.fullName || "Unnamed Farmer"}
                          </div>
                          <div className="text-slate-400 text-xs truncate max-w-[200px]">
                            {farmer.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{farmer.address || "Sri Lanka"}</span>
                      </div>
                    </td>

                    {/* NIC */}
                    <td className="p-4 text-slate-500 font-mono text-xs">{farmer.nic || "N/A"}</td>

                    {/* Fields & Area */}
                    <td className="p-4 text-center">
                      <div className="text-xs font-medium text-slate-800">
                        {fieldCount} {fieldCount === 1 ? "parcel" : "parcels"}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {areaCount > 0 ? `${areaCount.toFixed(1)} ha` : "0.0 ha"}
                      </div>
                    </td>

                    {/* Service Requests */}
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-normal ${
                          reqCount > 0
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-medium"
                            : "bg-slate-50 text-slate-400 border border-slate-100"
                        }`}
                      >
                        {reqCount}
                      </span>
                    </td>

                    {/* Member Since Year */}
                    <td className="p-4 text-center text-xs text-slate-600 font-normal">
                      {formatMemberYear(farmer.memberSince)}
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(farmer.userId);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-normal transition-colors cursor-pointer"
                      >
                        <span>Profile</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              // Empty State
              <tr>
                <td colSpan={7} className="p-12 text-center text-slate-400 font-normal">
                  <User className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-700 mb-1">No farmers found</p>
                  <p className="text-xs text-slate-400">
                    {searchQuery
                      ? `No registered farmers matched "${searchQuery}".`
                      : "No farmers registered in the system."}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-normal">
        <div>
          Showing {farmers.length} of {totalCount} farmers
          {pagination.totalPages > 1 && ` (Page ${pagination.page} of ${pagination.totalPages})`}
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPage(page - 1)}
              disabled={!pagination.hasPrevPage || isLoading}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200/80 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-xs cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <span className="px-3 py-1 text-slate-700 font-medium">
              {pagination.page} / {pagination.totalPages}
            </span>

            <button
              type="button"
              onClick={() => setPage(page + 1)}
              disabled={!pagination.hasNextPage || isLoading}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200/80 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-xs cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
