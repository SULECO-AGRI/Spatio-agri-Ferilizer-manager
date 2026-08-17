import { useState } from "react";
import { ArrowUpDown, ChevronRight } from "lucide-react";
import { PageHeader, FilterPills, TableToolbar, StatusBadge } from "@/components/ui";
import { RequestDetails } from "./RequestDetails";

type RequestStatus = "Pending" | "Assigned" | "Completed" | "Cancelled";
type Priority = "High" | "Medium" | "Low";

interface ServiceRequest {
  id: string;
  farmer: string;
  field: string;
  crop: string;
  area: string;
  service: string;
  prefDate: string;
  weather: string;
  priority: Priority;
  status: RequestStatus;
}

const mockRequests: ServiceRequest[] = [
  {
    id: "REQ-1042",
    farmer: "Kamal Silva",
    field: "North Paddy Field",
    crop: "Rice",
    area: "2.4 ha",
    service: "Spraying",
    prefDate: "Jul 21",
    weather: "Clear",
    priority: "High",
    status: "Pending",
  },
  {
    id: "REQ-1041",
    farmer: "W. Bandara",
    field: "East Tea Estate",
    crop: "Tea",
    area: "5.1 ha",
    service: "Fertilizing",
    prefDate: "Jul 21",
    weather: "Rain 40%",
    priority: "Medium",
    status: "Pending",
  },
  {
    id: "REQ-1040",
    farmer: "N. Perera",
    field: "South Maize Plot",
    crop: "Maize",
    area: "3.2 ha",
    service: "Mapping",
    prefDate: "Jul 22",
    weather: "Clear",
    priority: "Low",
    status: "Assigned",
  },
  {
    id: "REQ-1039",
    farmer: "S. Fernando",
    field: "West Paddy Field",
    crop: "Rice",
    area: "1.8 ha",
    service: "Spraying",
    prefDate: "Jul 22",
    weather: "Cloudy",
    priority: "High",
    status: "Completed",
  },
  {
    id: "REQ-1038",
    farmer: "K. Silva",
    field: "North Paddy Field",
    crop: "Rice",
    area: "2.4 ha",
    service: "Fertilizing",
    prefDate: "Jul 20",
    weather: "Clear",
    priority: "High",
    status: "Completed",
  },
  {
    id: "REQ-1037",
    farmer: "M. Fernando",
    field: "East Tea Estate",
    crop: "Tea",
    area: "4.5 h",
    service: "Mapping",
    prefDate: "Jul 19",
    weather: "Rain 60%",
    priority: "Medium",
    status: "Cancelled",
  },
  {
    id: "REQ-1036",
    farmer: "A. Silva",
    field: "South Maize Plot",
    crop: "Maize",
    area: "3.0 ha",
    service: "Spraying",
    prefDate: "Jul 18",
    weather: "Clear",
    priority: "Low",
    status: "Completed",
  },
];

const tabs = ["All", "Pending", "Assigned", "Completed", "Cancelled"] as const;

export function ServiceRequests() {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<(typeof tabs)[number]>("Pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(false);

  // Filter requests based on status tab and search queries
  const filteredRequests = mockRequests.filter((req) => {
    const matchesTab = activeFilter === "All" || req.status === activeFilter;
    const matchesSearch =
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.service.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Sort requests by ID
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const idA = parseInt(a.id.replace("REQ-", ""));
    const idB = parseInt(b.id.replace("REQ-", ""));
    return sortAsc ? idA - idB : idB - idA;
  });

  if (selectedRequestId) {
    return (
      <RequestDetails requestId={selectedRequestId} onBack={() => setSelectedRequestId(null)} />
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
        <FilterPills items={tabs} active={activeFilter} onChange={setActiveFilter} />

        {/* Search and Sort tools */}
        <TableToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search requests..."
          actions={
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-850 text-xs font-normal hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort</span>
            </button>
          }
        />
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto bg-white border border-slate-200/80 rounded-2xl shadow-xs">
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
            {sortedRequests.map((req) => (
              <tr
                key={req.id}
                onClick={() => setSelectedRequestId(req.id)}
                className="hover:bg-slate-50/20 transition-colors cursor-pointer"
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
                  <button className="inline-flex items-center gap-1 text-slate-800 hover:text-slate-900 text-xs font-normal cursor-pointer">
                    <span>View</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </td>
              </tr>
            ))}
            {sortedRequests.length === 0 && (
              <tr>
                <td colSpan={11} className="p-8 text-center text-slate-400 font-normal">
                  No requests found matching your query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Showing count subtext */}
      <div className="text-xs text-slate-400 font-normal">
        Showing {sortedRequests.length} of {mockRequests.length} requests — each row opens Request
        Details on click
      </div>
    </div>
  );
}
