import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { PageHeader, TableToolbar } from "@/components/ui";
import { mockFarmers } from "@/data/mockData";

export function FarmersList({ onViewProfile }: { onViewProfile?: (id: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter farmers based on name or NIC
  const filteredFarmers = mockFarmers.filter((farmer) => {
    return (
      farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.nic.includes(searchQuery)
    );
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header Title */}
      <PageHeader
        title="Farmers"
        description="All registered farmers using Fertilizer manager drone services"
      />

      {/* Search Bar */}
      <TableToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search farmers by name or NIC..."
        widthClassName="w-full md:w-80"
      />

      {/* Farmers Table */}
      <div className="overflow-x-auto bg-white border border-slate-200/80 rounded-2xl shadow-xs">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-xs font-normal">
              <th className="p-4 pl-6">Farmer</th>
              <th className="p-4">Location</th>
              <th className="p-4">Fields</th>
              <th className="p-4">Active Requests</th>
              <th className="p-4">Total Spend</th>
              <th className="p-4">Member Since</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/50 text-sm">
            {filteredFarmers.map((farmer) => (
              <tr key={farmer.id} className="hover:bg-slate-50/20 transition-colors">
                <td className="p-4 pl-6 text-slate-850 font-normal">{farmer.name}</td>
                <td className="p-4 text-slate-600 font-normal">{farmer.location}</td>
                <td className="p-4 text-slate-600 font-normal">{farmer.fields}</td>
                <td className="p-4 text-slate-600 font-normal">{farmer.activeRequests}</td>
                <td className="p-4 text-slate-855 font-normal">{farmer.totalSpend}</td>
                <td className="p-4 text-slate-600 font-normal">{farmer.memberSince}</td>
                <td className="p-4 pr-6 text-right">
                  <button
                    onClick={() => onViewProfile?.(farmer.id)}
                    className="inline-flex items-center gap-1 text-slate-800 hover:text-slate-900 text-xs font-normal cursor-pointer"
                  >
                    <span>View Profile</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredFarmers.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400 font-normal">
                  No farmers found matching your query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
