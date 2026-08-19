import { useState } from "react";
import { Star } from "lucide-react";
import { PageHeader, FilterPills, TableToolbar, StatusBadge } from "@/components/ui";
import type { PilotStatus } from "@/types";
import { mockPilots } from "@/data/mockData";

const tabs = ["All", "Online", "Offline", "Busy", "Available"] as const;

export function PilotManagement() {
  const [activeFilter, setActiveFilter] = useState<(typeof tabs)[number]>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter pilots based on active tab and search query
  const filteredPilots = mockPilots.filter((pilot) => {
    const matchesTab = activeFilter === "All" || pilot.status === activeFilter;
    const matchesSearch =
      pilot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pilot.drone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pilot.license.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header Info */}
      <PageHeader
        title="Pilot Management"
        description="All registered drone pilots and their current status"
      />

      {/* Tabs and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tab Pills */}
        <FilterPills items={tabs} active={activeFilter} onChange={setActiveFilter} />

        {/* Search Input */}
        <TableToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search pilots..."
        />
      </div>

      {/* Pilots Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPilots.map((pilot) => (
          <div
            key={pilot.id}
            className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between shadow-xs"
          >
            {/* Card Top: Initials Avatar, Name & Status */}
            <div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-normal shrink-0">
                  {pilot.initials}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-slate-800 leading-none">{pilot.name}</h4>
                  <StatusBadge status={pilot.status} />
                </div>
              </div>

              {/* Card Mid: Stats Info */}
              <div className="space-y-1 my-4 text-xs text-slate-500 font-normal">
                <div>License: {pilot.license}</div>
                <div>Drone: {pilot.drone}</div>
                <div className="flex items-center gap-1">
                  <span>
                    Experience: {pilot.experience} | Rating: {pilot.rating}
                  </span>
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  Missions: {pilot.missions} | Flight hrs: {pilot.flightHours} hrs
                </div>
              </div>
            </div>

            {/* Card Bottom: Actions */}
            <div className="flex gap-2 pt-4 border-t border-slate-100 mt-2">
              <button className="flex-1 py-1.5 px-3 border border-slate-200 hover:bg-slate-50 rounded-lg text-[11px] font-normal text-slate-700 text-center transition-colors cursor-pointer">
                Details
              </button>
              <button className="flex-1 py-1.5 px-3 border border-slate-200 hover:bg-slate-50 rounded-lg text-[11px] font-normal text-slate-700 text-center transition-colors cursor-pointer">
                Disable
              </button>
              {pilot.status === "Busy" ? (
                <button
                  disabled
                  className="flex-1 py-1.5 px-3 bg-[#8da396]/60 text-white rounded-lg text-[11px] font-normal text-center cursor-not-allowed"
                >
                  Assign
                </button>
              ) : (
                <button className="flex-1 py-1.5 px-3 bg-[#14532d] hover:bg-[#166534] text-white rounded-lg text-[11px] font-normal text-center transition-colors cursor-pointer">
                  Assign
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
