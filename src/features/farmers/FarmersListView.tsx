import { ChevronRight } from "lucide-react";
import { PageHeader, TableToolbar } from "@/components/ui";
import { useFarmers } from "./hooks/useFarmers";
import { FarmerProfileView } from "./FarmerProfileView";

interface FarmersListViewProps {
  initialFarmerId?: string | null;
  onViewProfile?: (farmerId: string) => void;
}

export function FarmersListView({ initialFarmerId, onViewProfile }: FarmersListViewProps) {
  const {
    farmers,
    totalCount,
    searchQuery,
    setSearchQuery,
    selectedFarmerId,
    selectedFarmer,
    farmerFields,
    farmerServiceHistory,
    selectFarmer,
    clearSelectedFarmer,
  } = useFarmers({ initialFarmerId });

  const handleView = (id: string) => {
    if (onViewProfile) {
      onViewProfile(id);
    } else {
      selectFarmer(id);
    }
  };

  if (selectedFarmerId && selectedFarmer) {
    return (
      <FarmerProfileView
        farmer={selectedFarmer}
        fields={farmerFields}
        serviceHistory={farmerServiceHistory}
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

      <div className="flex justify-end">
        <TableToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by name, location, or NIC..."
        />
      </div>

      <div className="overflow-x-auto bg-white border border-slate-200/80 rounded-2xl shadow-xs">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-xs font-normal">
              <th className="p-4 pl-6">Farmer</th>
              <th className="p-4">Location</th>
              <th className="p-4">NIC</th>
              <th className="p-4 text-center">Fields</th>
              <th className="p-4 text-center">Active Requests</th>
              <th className="p-4">Total Spend</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/50 text-sm">
            {farmers.map((farmer) => (
              <tr
                key={farmer.id}
                onClick={() => handleView(farmer.id)}
                className="hover:bg-slate-50/40 transition-colors cursor-pointer"
              >
                <td className="p-4 pl-6 text-slate-900 font-medium">{farmer.name}</td>
                <td className="p-4 text-slate-600 font-normal">{farmer.location}</td>
                <td className="p-4 text-slate-500 font-mono text-xs">{farmer.nic}</td>
                <td className="p-4 text-center text-slate-700 font-normal">{farmer.fields}</td>
                <td className="p-4 text-center">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-normal ${
                      farmer.activeRequests > 0
                        ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                        : "text-slate-400"
                    }`}
                  >
                    {farmer.activeRequests}
                  </span>
                </td>
                <td className="p-4 text-slate-800 font-medium">{farmer.totalSpend}</td>
                <td className="p-4 pr-6 text-right">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 text-xs font-normal cursor-pointer"
                  >
                    <span>Profile</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </td>
              </tr>
            ))}
            {farmers.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400 font-normal">
                  No farmers found matching "{searchQuery}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-slate-400 font-normal">
        Showing {farmers.length} of {totalCount} farmers — click any row to inspect farmer profile
      </div>
    </div>
  );
}
