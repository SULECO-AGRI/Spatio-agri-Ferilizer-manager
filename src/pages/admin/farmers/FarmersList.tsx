import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";

export interface Farmer {
  id: string;
  name: string;
  location: string;
  fields: number;
  activeRequests: number;
  totalSpend: string;
  memberSince: number;
  nic: string;
}

export const mockFarmers: Farmer[] = [
  {
    id: "1",
    name: "Kamal Silva",
    location: "Anuradhapura",
    fields: 3,
    activeRequests: 1,
    totalSpend: "LKR 84,200",
    memberSince: 2024,
    nic: "198823489201",
  },
  {
    id: "2",
    name: "W. Bandara",
    location: "Kandy",
    fields: 2,
    activeRequests: 1,
    totalSpend: "LKR 61,500",
    memberSince: 2023,
    nic: "197548392012",
  },
  {
    id: "3",
    name: "S. Fernando",
    location: "Polonnaruwa",
    fields: 4,
    activeRequests: 0,
    totalSpend: "LKR 112,900",
    memberSince: 2022,
    nic: "199248301290",
  },
  {
    id: "4",
    name: "N. Ratnayake",
    location: "Badulla",
    fields: 1,
    activeRequests: 0,
    totalSpend: "LKR 22,300",
    memberSince: 2025,
    nic: "196849302194",
  },
  {
    id: "5",
    name: "Chathurika Silva",
    location: "Matale",
    fields: 2,
    activeRequests: 0,
    totalSpend: "LKR 45,700",
    memberSince: 2024,
    nic: "199583920194",
  },
];

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
      <div>
        <h1 className="text-3xl font-medium tracking-tight text-slate-900 font-display">Farmers</h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1 font-normal">
          All registered farmers using SpatioAgri drone services
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search farmers by name or NIC..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 text-slate-800 font-normal"
        />
      </div>

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
