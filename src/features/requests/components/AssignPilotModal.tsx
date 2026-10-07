import { useState, useEffect, useMemo, useCallback } from "react";
import { X, Loader2, AlertCircle, Search } from "lucide-react";
import { StatusBadge } from "@/components/common";
import { useLanguage } from "@/context/LanguageContext";
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
  const { isSinhala } = useLanguage();
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
    const reqId = request?.requestId || (request as any)?.id;
    if (isOpen && reqId) {
      fetchCandidates(reqId);
      setSearchQuery("");
      setSortBy("match");
      setAssigningPilotId(null);
    }
  }, [isOpen, request, fetchCandidates]);

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
        const aMissions = a.completedMissions ?? a.totalMissions ?? 0;
        const bMissions = b.completedMissions ?? b.totalMissions ?? 0;
        return bMissions - aMissions;
      }
      return 0;
    });

    return list;
  }, [candidates, searchQuery, sortBy]);

  const handleAssign = async (pilot: CandidatePilot) => {
    if (!request) return;
    const reqId = request.requestId || (request as any).id;
    setAssigningPilotId(pilot.pilotId);

    try {
      const updated = await serviceRequestsService.assignPilot(reqId, pilot.pilotId);
      onAssignSuccess(updated, pilot);
      onClose();
    } catch (err: unknown) {
      console.error("Assignment failed:", err);
      alert(err instanceof Error ? err.message : "Failed to assign pilot. Please try again.");
    } finally {
      setAssigningPilotId(null);
    }
  };

  if (!isOpen || !request) return null;

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans ${isSinhala ? "font-sinhala" : ""}`}>
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
        <div className="p-6 bg-white flex items-start justify-between gap-4 border-b border-slate-100 shrink-0">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 font-mono text-xs font-semibold border border-emerald-200">
                {request.requestCode}
              </span>
              <StatusBadge status={request.priority} />
              <span className="text-xs text-slate-500">
                {request.field?.cropType || "Paddy"} •{" "}
                {request.field?.area ? `${request.field.area} Ha` : "Field"}
              </span>
            </div>

            <h2 className="text-lg font-bold tracking-tight text-slate-900 mt-2">
              {isSinhala ? "සුදුසු නියමුවා පවරන්න" : "Assign Candidate Pilot"}
            </h2>

            {/* Field name and farmer name preserved raw */}
            <p className="text-xs text-slate-500 mt-1">
              {isSinhala ? "ක්ෂේත්‍රය: " : "Field: "}
              <span className="text-slate-800 font-medium">
                {request.field?.fieldName || "Field Parcel"}
              </span>{" "}
              • {isSinhala ? "ගොවියා: " : "Farmer: "}
              <span className="text-slate-800 font-medium">
                {request.farmer?.fullName || "Client"}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={Boolean(assigningPilotId)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
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
              placeholder={isSinhala ? "නියමුවන් සොයන්න..." : "Search candidate pilots..."}
              className="w-full pl-9 pr-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 shadow-2xs transition-all"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-slate-500 font-medium">
              {isSinhala ? "වර්ග කිරීම:" : "Sort by:"}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-2xs cursor-pointer"
            >
              <option value="match">{isSinhala ? "ගැළපීමේ ලකුණු (ඉහළම)" : "Match Score (Highest)"}</option>
              <option value="distance">{isSinhala ? "දුර (ආසන්නතම)" : "Distance (Nearest)"}</option>
              <option value="rating">{isSinhala ? "ඇගයුම (ඉහළම)" : "Rating (Highest)"}</option>
              <option value="missions">{isSinhala ? "මෙහෙයුම් (වැඩිම)" : "Missions (Most)"}</option>
            </select>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
              <p className="text-xs font-medium text-slate-600">
                {isSinhala
                  ? "ගැළපීම සඳහා නියමු දත්ත සහ දුර තක්සේරු කරමින්..."
                  : "Evaluating fleet proximity & telemetry for match ranking..."}
              </p>
            </div>
          ) : isError ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage || (isSinhala ? "නියමු දත්ත පූරණය අසාර්ථක විය." : "Failed to load candidate pilots.")}</span>
              </div>
              <button
                type="button"
                onClick={() => fetchCandidates(request.requestId)}
                className="px-3 py-1 bg-white border border-rose-200 hover:bg-rose-100/50 rounded-lg text-rose-700 font-medium transition-colors cursor-pointer text-[11px]"
              >
                {isSinhala ? "නැවත උත්සාහ කරන්න" : "Retry"}
              </button>
            </div>
          ) : filteredAndSortedCandidates.length === 0 ? (
            <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <AlertCircle className="w-8 h-8 text-slate-300" />
              <p className="text-sm font-medium text-slate-700">
                {isSinhala ? "සුදුසු නියමුවන් හමු නොවීය" : "No candidate pilots found"}
              </p>
              <p className="text-xs text-slate-400 max-w-sm">
                {isSinhala
                  ? "වත්මන් සෙවුමට හෝ කලාපයට ගැළපෙන සක්‍රීය නියමුවන් නැත."
                  : "No active pilots match the current search or region. Try adjusting your query or check fleet availability."}
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
                    className={`relative p-4 rounded-xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${isTopMatch
                        ? "bg-emerald-50/50 border-emerald-300/80 shadow-xs"
                        : "bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-xs"
                      }`}
                  >
                    {/* Left details */}
                    <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                      {/* Avatar with Initials */}
                      <div className="shrink-0">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm ${
                            isTopMatch
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "bg-slate-100 border border-slate-200 text-slate-700"
                          }`}
                        >
                          {initials}
                        </div>
                      </div>

                      {/* Pilot Info - Person name kept raw */}
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-slate-900 truncate">
                            {pilot.fullName}
                          </h4>
                          {isTopMatch && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-medium border border-emerald-200">
                              {isSinhala ? "ඉහළම ගැළපීම" : "Top Match"}
                            </span>
                          )}
                        </div>

                        {/* Clean Metadata Line */}
                        <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                          <span className="text-slate-700 font-medium">
                            {isSinhala ? `${pilot.distanceKm} කි.මී. දුරින්` : `${pilot.distanceKm} km away`}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-600">
                            {isSinhala ? `ඇගයුම ${pilot.rating.toFixed(1)}` : `Rating ${pilot.rating.toFixed(1)}`}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500">
                            {pilot.completedMissions ?? pilot.totalMissions} {isSinhala ? "මෙහෙයුම්" : "missions"}
                          </span>
                          {pilot.mobile && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="text-slate-500 font-mono text-[11px]">
                                {pilot.mobile}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Action & Match Badge */}
                    <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                      {/* Overall Match Percentage Badge */}
                      <div className="text-right">
                        {(() => {
                          const displayScore = Math.min(
                            100,
                            Math.max(0, Math.round(pilot.matchScore)),
                          );
                          return (
                            <div
                              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold font-mono tracking-tight ${
                                displayScore >= 90
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                  : displayScore >= 75
                                    ? "bg-blue-50 text-blue-800 border border-blue-200"
                                    : "bg-slate-100 text-slate-700 border border-slate-200"
                              }`}
                            >
                              <span>{isSinhala ? `${displayScore}% ගැළපේ` : `${displayScore}% Match`}</span>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Assign CTA Button */}
                      <button
                        type="button"
                        onClick={() => handleAssign(pilot)}
                        disabled={Boolean(assigningPilotId)}
                        className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer shadow-xs disabled:opacity-60 ${isTopMatch
                            ? "bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-semibold"
                            : "bg-[#062419] hover:bg-[#0c3c2b] text-white"
                          }`}
                      >
                        {isAssigning ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>{isSinhala ? "පවරමින්..." : "Assigning..."}</span>
                          </>
                        ) : (
                          <span>{isSinhala ? "පවරන්න" : "Assign"}</span>
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
            {isSinhala ? (
              <>
                ලබාගත හැකි නියමුවන් <strong className="text-slate-800">{filteredAndSortedCandidates.length}</strong> ක් පෙන්වයි
              </>
            ) : (
              <>
                Showing <strong className="text-slate-800">{filteredAndSortedCandidates.length}</strong> available pilots
              </>
            )}
          </span>
          <button
            type="button"
            onClick={onClose}
            disabled={Boolean(assigningPilotId)}
            className="px-4 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSinhala ? "අවලංගු කරන්න" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignPilotModal;
