import { useState } from "react";
import { PageHeader, FilterPills, TableToolbar } from "@/components/ui";
import { mockPilots } from "@/data/mockData";
import { PilotCard } from "./PilotCard";
import { PilotDetails } from "./PilotDetails";

const tabs = ["All", "Online", "Offline", "Busy", "Available"] as const;

interface PilotManagementProps {
  initialPilotId?: string | null;
}

export function PilotManagement({ initialPilotId = null }: PilotManagementProps) {
  const [selectedPilotId, setSelectedPilotId] = useState<string | null>(initialPilotId);
  const [activeFilter, setActiveFilter] = useState<(typeof tabs)[number]>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // If a pilot is selected, display the detailed Screen 8 view
  if (selectedPilotId) {
    return (
      <PilotDetails
        pilotId={selectedPilotId}
        onBack={() => setSelectedPilotId(null)}
      />
    );
  }

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
          <PilotCard
            key={pilot.id}
            pilot={pilot}
            onViewDetails={(pilotId) => setSelectedPilotId(pilotId)}
          />
        ))}
        {filteredPilots.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
            No pilots found matching "{searchQuery}" in {activeFilter} category.
          </div>
        )}
      </div>

      {/* Subtext info */}
      <div className="text-xs text-slate-400 font-normal">
        Showing {filteredPilots.length} of {mockPilots.length} pilots — click "Details" or a pilot card to inspect drone telemetry, mission logs, and certifications
      </div>
    </div>
  );
}
