import { useState, useMemo, useCallback } from "react";
import { mockFarmers, mockFarmerFields, mockFarmerServiceHistory } from "@/data/mockData";
import type { Farmer } from "@/types";

interface UseFarmersOptions {
  initialFarmerId?: string | null;
}

export function useFarmers(options: UseFarmersOptions = {}) {
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(
    options.initialFarmerId ?? null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFarmers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return mockFarmers;
    return mockFarmers.filter((farmer) => {
      return (
        farmer.name.toLowerCase().includes(query) ||
        farmer.location.toLowerCase().includes(query) ||
        farmer.nic.includes(query)
      );
    });
  }, [searchQuery]);

  const selectedFarmer: Farmer | null = useMemo(() => {
    if (!selectedFarmerId) return null;
    return mockFarmers.find((f) => f.id === selectedFarmerId) ?? null;
  }, [selectedFarmerId]);

  const selectFarmer = useCallback((id: string | null) => {
    setSelectedFarmerId(id);
  }, []);

  const clearSelectedFarmer = useCallback(() => {
    setSelectedFarmerId(null);
  }, []);

  return {
    farmers: filteredFarmers,
    totalCount: mockFarmers.length,
    searchQuery,
    setSearchQuery,
    selectedFarmerId,
    selectedFarmer,
    farmerFields: mockFarmerFields,
    farmerServiceHistory: mockFarmerServiceHistory,
    selectFarmer,
    clearSelectedFarmer,
  };
}
