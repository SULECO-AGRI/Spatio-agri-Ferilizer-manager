import { PageHeader, FilterPills, TableToolbar } from "@/components/ui";
import { usePilots, pilotFilterTabs } from "./hooks/usePilots";
import { PilotCard } from "./PilotCard";
import { PilotDetailsView } from "./PilotDetailsView";

interface PilotManagementProps {
  initialPilotId?: string | null;
}

export function PilotManagementView({ initialPilotId = null }: PilotManagementProps) {
  const {
    pilots,
    totalCount,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    selectedPilotId,
    selectPilot,
    clearSelectedPilot,
  } = usePilots({ initialPilotId });

  // If a pilot is selected, display the detailed view
  if (selectedPilotId) {
    return <PilotDetailsView pilotId={selectedPilotId} onBack={clearSelectedPilot} />;
  }

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
        <FilterPills items={pilotFilterTabs} active={activeFilter} onChange={setActiveFilter} />

        {/* Search Input */}
        <TableToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search pilots..."
        />
      </div>

      {/* Pilots Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pilots.map((pilot) => (
          <PilotCard
            key={pilot.id}
            pilot={pilot}
            onViewDetails={(pilotId) => selectPilot(pilotId)}
          />
        ))}
        {pilots.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
            No pilots found matching "{searchQuery}" in {activeFilter} category.
          </div>
        )}
      </div>

      {/* Subtext info */}
      <div className="text-xs text-slate-400 font-normal">
        Showing {pilots.length} of {totalCount} pilots — click "Details" or a pilot card to inspect
        drone telemetry, mission logs, and certifications
      </div>
    </div>
  );
}

export default PilotManagementView;
