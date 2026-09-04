import { useState, useEffect, useMemo, useCallback } from "react";
import {
  X,
  UserPlus,
  Star,
  MapPin,
  Award,
  Sparkles,
  Phone,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowUpDown,
  Search,
} from "lucide-react";
import { StatusBadge } from "@/components/ui";
import type { ApiServiceRequestItem, CandidatePilot } from "@/types/request";
import { serviceRequestsService } from "@/services/serviceRequestsService";

interface AssignPilotModalProps {
  isOpen: boolean;
  request: ApiServiceRequestItem | null;
  onClose: () => void;
  onAssignSuccess: (updatedRequest: ApiServiceRequestItem, candidate: CandidatePilot) => void;
}

type SortOption = "match" | "distance" | "rating" | "missions";

export function AssignPilotModal({
  isOpen,
  request,
  onClose,
  onAssignSuccess,
}: AssignPilotModalProps) {
  const [candidates, setCandidates] = useState<CandidatePilot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("match");
  const [assigningPilotId, setAssigningPilotId] = useState<number | null>(null);

  const fetchCandidates = useCallback(async (reqId: number | string) => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage("");

    try {
      const data = await serviceRequestsService.getCandidatePilots(reqId);
      setCandidates(data);
    } catch (err: unknown) {
      console.error("Failed to load candidate pilots:", err);
      setIsError(true);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Could not retrieve candidate pilots for this request.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && request?.requestId) {
      fetchCandidates(request.requestId);
      setSearchQuery("");
      setSortBy("match");
      setAssigningPilotId(null);
    }
  }, [isOpen, request?.requestId, fetchCandidates]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !assigningPilotId) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose, assigningPilotId]);

  const filteredAndSortedCandidates = useMemo(() => {
    let list = [...candidates];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.fullName.toLowerCase().includes(query) ||
          c.licenceNumber?.toLowerCase().includes(query) ||
          c.mobile?.toLowerCase().includes(query) ||
          c.email?.toLowerCase().includes(query),
      );
    }

    list.sort((a, b) => {
      if (sortBy === "match") {
        return b.matchScore - a.matchScore;
      }
      if (sortBy === "distance") {
        return a.distanceKm - b.distanceKm;
      }
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      if (sortBy === "missions") {
        return b.totalMissions - a.totalMissions;
      }
      return 0;
    });

    return list;
  }, [candidates, searchQuery, sortBy]);

  const handleAssign = async (candidate: CandidatePilot) => {
    if (!request) return;
    setAssigningPilotId(candidate.pilotId);

    try {
      const updatedRequest = await serviceRequestsService.assignPilot(
        request.requestId,
        candidate.pilotId,
      );

      // Notify parent view
      onAssignSuccess(updatedRequest, candidate);
      onClose();
    } catch (err: unknown) {
      console.error("Failed to assign pilot:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Failed to assign pilot to the service request. Please try again.",
      );
    } finally {
      setAssigningPilotId(null);
    }
  };

  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={() => {
          if (!assigningPilotId) onClose();
        }}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between gap-4 border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-xs font-semibold border border-emerald-500/30">
                {request.requestCode}
              </span>
              <StatusBadge status={request.priority} />
              <span className="text-xs text-slate-300">
                {request.field?.cropType || "Paddy"} • {request.field?.area ?? "12"} Ha
              </span>
            </div>

            <h2 className="text-xl font-bold tracking-tight text-white mt-2 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-emerald-400" />
              <span>Assign Candidate Pilot</span>
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              Field:{" "}
              <span className="text-slate-200 font-medium">
                {request.field?.fieldName || "Field Parcel"}
              </span>{" "}
              • Farmer:{" "}
              <span className="text-slate-200 font-medium">
                {request.farmer?.fullName || "Client"}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={Boolean(assigningPilotId)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Sort Toolbar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate pilots..."
              className="w-full pl-9 pr-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 shadow-2xs transition-all"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-2xs cursor-pointer"
            >
              <option value="match">Match Score (Highest)</option>
              <option value="distance">Distance (Nearest)</option>
              <option value="rating">Rating (Highest)</option>
              <option value="missions">Missions (Most)</option>
            </select>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
              <p className="text-xs font-medium text-slate-600">
                Evaluating fleet proximity & telemetry for match ranking...
              </p>
            </div>
          ) : isError ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage || "Failed to load candidate pilots."}</span>
              </div>
              <button
                type="button"
                onClick={() => fetchCandidates(request.requestId)}
                className="px-3 py-1 bg-white border border-rose-200 hover:bg-rose-100/50 rounded-lg text-rose-700 font-medium transition-colors cursor-pointer text-[11px]"
              >
                Retry
              </button>
            </div>
          ) : filteredAndSortedCandidates.length === 0 ? (
            <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <AlertCircle className="w-8 h-8 text-slate-300" />
              <p className="text-sm font-medium text-slate-700">No candidate pilots found</p>
              <p className="text-xs text-slate-400 max-w-sm">
                No active pilots match the current search or region. Try adjusting your query or
                check fleet availability.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAndSortedCandidates.map((pilot, index) => {
                const isTopMatch = index === 0 && sortBy === "match" && pilot.matchScore >= 80;
                const isAssigning = assigningPilotId === pilot.pilotId;

                const initials =
                  pilot.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase() || "PT";

                return (
                  <div
                    key={pilot.pilotId}
                    className={`relative p-4 rounded-xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isTopMatch
                        ? "bg-emerald-50/50 border-emerald-300/80 shadow-xs"
                        : "bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-xs"
                    }`}
                  >
                    {/* Left details */}
                    <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                      {/* Rank & Initials */}
                      <div className="relative shrink-0">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm ${
                            isTopMatch
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "bg-slate-100 border border-slate-200 text-slate-700"
                          }`}
                        >
                          {initials}
                        </div>
                        <span className="absolute -top-1.5 -left-1.5 px-1.5 py-0.2 rounded-full bg-slate-800 text-[9px] font-mono text-white font-bold shadow-2xs">
                          #{index + 1}
                        </span>
                      </div>

                      {/* Pilot Info */}
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-semibold text-slate-900 truncate">
                            {pilot.fullName}
                          </h4>
                          {isTopMatch && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold border border-emerald-300/50">
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              Best Match
                            </span>
                          )}
                        </div>

                        {/* Badges / Metrics Row */}
                        <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap pt-0.5">
                          {/* Distance */}
                          <div className="flex items-center gap-1 text-slate-600 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>{pilot.distanceKm} km away</span>
                          </div>

                          {/* Star Rating */}
                          <div className="flex items-center gap-1 text-amber-600 font-semibold font-mono">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                            <span>{pilot.rating.toFixed(1)} / 5.0</span>
                          </div>

                          {/* Completed Missions Experience */}
                          <div className="flex items-center gap-1 text-slate-600">
                            <Award className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            <span>{pilot.totalMissions} missions</span>
                          </div>

                          {/* Contact Info (if available) */}
                          {pilot.mobile && (
                            <div className="flex items-center gap-1 text-slate-400 text-[11px] hidden sm:flex">
                              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{pilot.mobile}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Action & Match Badge */}
                    <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                      {/* Overall Match Percentage Badge */}
                      <div className="text-right">
                        <div
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold font-mono tracking-tight ${
                            pilot.matchScore >= 90
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300/60"
                              : pilot.matchScore >= 75
                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{pilot.matchScore}% Match</span>
                        </div>
                      </div>

                      {/* Assign CTA Button */}
                      <button
                        type="button"
                        onClick={() => handleAssign(pilot)}
                        disabled={Boolean(assigningPilotId)}
                        className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer shadow-xs disabled:opacity-60 ${
                          isTopMatch
                            ? "bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-semibold"
                            : "bg-slate-900 hover:bg-slate-800 text-white"
                        }`}
                      >
                        {isAssigning ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Assigning...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Assign</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>
            Showing <strong className="text-slate-800">{filteredAndSortedCandidates.length}</strong>{" "}
            available pilots
          </span>
          <button
            type="button"
            onClick={onClose}
            disabled={Boolean(assigningPilotId)}
            className="px-4 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
