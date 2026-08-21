import { useState, useMemo, useCallback } from "react";
import { mockRequests, detailedRequestsInfo } from "@/data/mockData";
import type { DetailedRequestInfo } from "@/types";

export const requestFilterTabs = ["All", "Pending", "Assigned", "Completed", "Cancelled"] as const;
export type RequestFilterTab = (typeof requestFilterTabs)[number];

interface UseServiceRequestsOptions {
  initialRequestId?: string | null;
  initialFilter?: RequestFilterTab;
}

export function useServiceRequests(options: UseServiceRequestsOptions = {}) {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    options.initialRequestId ?? null,
  );
  const [activeFilter, setActiveFilter] = useState<RequestFilterTab>(
    options.initialFilter ?? "Pending",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(false);

  const filteredRequests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return mockRequests.filter((req) => {
      const matchesTab = activeFilter === "All" || req.status === activeFilter;
      if (!matchesTab) return false;
      if (!query) return true;
      return (
        req.id.toLowerCase().includes(query) ||
        req.farmer.toLowerCase().includes(query) ||
        req.field.toLowerCase().includes(query) ||
        req.service.toLowerCase().includes(query)
      );
    });
  }, [activeFilter, searchQuery]);

  const sortedRequests = useMemo(() => {
    return [...filteredRequests].sort((a, b) => {
      const idA = parseInt(a.id.replace("REQ-", ""), 10);
      const idB = parseInt(b.id.replace("REQ-", ""), 10);
      return sortAsc ? idA - idB : idB - idA;
    });
  }, [filteredRequests, sortAsc]);

  const selectedRequestDetails: DetailedRequestInfo | null = useMemo(() => {
    if (!selectedRequestId) return null;
    return (
      detailedRequestsInfo[selectedRequestId] || {
        farmerName: "S. Fernando",
        phone: "+94 75 222 3333",
        email: "s.fernando@mail.com",
        district: "Polonnaruwa District",
        memberSince: "2022",
        fieldName: "Boundary - West Paddy",
        crop: "Rice (BG 352)",
        growthStage: "Tillering",
        service: "Pesticide Spraying",
        prefDate: "Jul 22, 2026 - 02:00 PM",
        duration: "45 minutes",
        drone: "DJI Agras T40",
        weather: "Jul 22: 30°C, Wind 11 km/h, Rain 20%",
        risk: "Low Risk",
        area: "1.8 ha",
        priority: "High",
        status: "Pending Review",
        svgPoints: "120,60 380,80 340,180 80,160",
      }
    );
  }, [selectedRequestId]);

  const toggleSort = useCallback(() => {
    setSortAsc((prev) => !prev);
  }, []);

  const selectRequest = useCallback((id: string | null) => {
    setSelectedRequestId(id);
  }, []);

  const clearSelectedRequest = useCallback(() => {
    setSelectedRequestId(null);
  }, []);

  return {
    requests: sortedRequests,
    totalCount: mockRequests.length,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    sortAsc,
    toggleSort,
    selectedRequestId,
    selectedRequestDetails,
    selectRequest,
    clearSelectedRequest,
  };
}
