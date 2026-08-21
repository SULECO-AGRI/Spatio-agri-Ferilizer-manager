import { useState, useMemo, useCallback } from "react";
import { mockPilots, detailedPilotsInfo } from "@/data/mockData";
import type { DetailedPilotInfo } from "@/types";

export const pilotFilterTabs = ["All", "Online", "Offline", "Busy", "Available"] as const;
export type PilotFilterTab = (typeof pilotFilterTabs)[number];

interface UsePilotsOptions {
  initialPilotId?: string | null;
  initialFilter?: PilotFilterTab;
}

export function usePilots(options: UsePilotsOptions = {}) {
  const [selectedPilotId, setSelectedPilotId] = useState<string | null>(
    options.initialPilotId ?? null,
  );
  const [activeFilter, setActiveFilter] = useState<PilotFilterTab>(options.initialFilter ?? "All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPilots = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return mockPilots.filter((pilot) => {
      const matchesTab = activeFilter === "All" || pilot.status === activeFilter;
      if (!matchesTab) return false;
      if (!normalizedQuery) return true;
      return (
        pilot.name.toLowerCase().includes(normalizedQuery) ||
        pilot.drone.toLowerCase().includes(normalizedQuery) ||
        pilot.license.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [activeFilter, searchQuery]);

  const selectedPilotDetails: DetailedPilotInfo | null = useMemo(() => {
    if (!selectedPilotId) return null;
    const basic = mockPilots.find((p) => p.id === selectedPilotId);
    return (
      detailedPilotsInfo[selectedPilotId] ||
      (basic
        ? {
            pilotId: basic.id,
            name: basic.name,
            initials: basic.initials,
            status: basic.status,
            license: basic.license,
            experience: `${basic.experience} experience`,
            phone: "+94 71 987 6543",
            email: "pilot@spatioagri.lk",
            rating: basic.rating,
            reviewsCount: basic.missions,
            missionsCount: basic.missions,
            flightHours: `${basic.flightHours} hrs`,
            certificates: ["CAASL-DP-004", "First Aid"],
            droneDetails: {
              model: basic.drone,
              tankCapacity: "40L",
              maxSpeed: "10 m/s",
              lastServiced: "Jul 02, 2026",
              batteryHealth: "98%",
            },
            performanceData: [
              { label: "Feb", value: 38 },
              { label: "Mar", value: 46 },
              { label: "Apr", value: 32 },
              { label: "May", value: 54 },
              { label: "Jun", value: 48 },
              { label: "Jul", value: 52 },
            ],
            missionHistory: [],
            documents: [],
          }
        : null)
    );
  }, [selectedPilotId]);

  const selectPilot = useCallback((id: string | null) => {
    setSelectedPilotId(id);
  }, []);

  const clearSelectedPilot = useCallback(() => {
    setSelectedPilotId(null);
  }, []);

  return {
    pilots: filteredPilots,
    totalCount: mockPilots.length,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    selectedPilotId,
    selectedPilotDetails,
    selectPilot,
    clearSelectedPilot,
  };
}
