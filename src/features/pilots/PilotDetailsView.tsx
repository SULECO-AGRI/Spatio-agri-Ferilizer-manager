import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { pilotService } from "@/services/pilotService";
import type { DetailedPilotInfo, PilotMission, MissionResult } from "@/types/pilot";
import {
  PilotProfileCard,
  MissionHistoryCard,
  PilotPerformanceCard,
  PilotMetricsRow,
  DeletePilotDialog,
  type PilotDeleteTarget,
} from "./components";

interface PilotDetailsProps {
  pilotId: number | string;
  onBack: () => void;
  onDelete?: () => Promise<void>;
}

export function PilotDetailsView({ pilotId, onBack, onDelete }: PilotDetailsProps) {
  const [details, setDetails] = useState<DetailedPilotInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    async function loadDetails() {
      try {
        const data = await pilotService.getPilotById(pilotId);
        if (isMounted) {
          const initials =
            `${data.firstName?.[0] || ""}${data.lastName?.[0] || ""}`.toUpperCase() || "PL";
          const rawRating =
            data.stats?.ratings ??
            data.stats?.rating ??
            data.stats?.averageRatings ??
            (data as any)?.ratings ??
            (data as any)?.rating ??
            (data as any)?.profile?.rating ??
            (data as any)?.profile?.ratings;

          const ratingVal =
            rawRating !== null &&
            rawRating !== undefined &&
            !isNaN(Number(rawRating)) &&
            Number(rawRating) > 0
              ? Number(rawRating)
              : 0;

          const completedMissions = data.stats?.completedMissions ?? 0;
          const totalFlightHours = data.stats?.totalFlightHours ?? 0;

          const rawMissions =
            (data as any)?.missions ||
            (data as any)?.serviceRequests ||
            (data as any)?.recentMissions ||
            [];

          const missionHistory: PilotMission[] = Array.isArray(rawMissions)
            ? rawMissions.map((m: any) => ({
                id:
                  m.missionCode ||
                  m.requestCode ||
                  `MSN-${m.id || m.missionId || m.serviceRequestId || data.userId}`,
                field: m.fieldName || m.fieldLocation || m.farmName || m.cropType || "Agri Field",
                date: formatDate(m.completedAt || m.scheduledDate || m.createdAt || m.date),
                result: (m.status === "COMPLETED" || m.status === "Completed"
                  ? "Completed"
                  : m.status === "IN_PROGRESS" || m.status === "On Mission"
                    ? "Active"
                    : m.status === "FAILED" || m.status === "Failed"
                      ? "Failed"
                      : m.status === "CANCELLED" || m.status === "Cancelled"
                        ? "Cancelled"
                        : "Completed") as MissionResult,
              }))
            : [];

          const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          const now = new Date();
          const performanceData = Array.from({ length: 6 }, (_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
            const monthName = months[d.getMonth()];
            const count = missionHistory.filter((m) => {
              if (!m.date) return false;
              const md = new Date(m.date);
              return (
                !isNaN(md.getTime()) &&
                md.getMonth() === d.getMonth() &&
                md.getFullYear() === d.getFullYear() &&
                m.result === "Completed"
              );
            }).length;
            return { label: monthName, value: count };
          });

          setDetails({
            pilotId: data.userId,
            name: data.fullName || `${data.firstName} ${data.lastName}`.trim(),
            initials,
            status: data.status,
            license: data.licenceNumber || "N/A",
            experience:
              totalFlightHours > 0
                ? `${Math.max(1, Math.round(totalFlightHours / 50))} yrs experience`
                : "Certified Operator",
            phone: data.mobile || "N/A",
            email: data.email || "N/A",
            rating: ratingVal,
            reviewsCount: data.stats?.totalReviews ?? completedMissions,
            missionsCount: completedMissions,
            flightHours: `${totalFlightHours} hrs`,
            activeMissionsCount: data.stats?.inProgressMissions ?? 0,
            performanceData,
            missionHistory,
          });
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load pilot details.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDetails();

    return () => {
      isMounted = false;
    };
  }, [pilotId]);

  const handleDeleteConfirm = async (id: number | string) => {
    if (onDelete) {
      setIsDeleting(true);
      try {
        await onDelete();
      } finally {
        setIsDeleting(false);
      }
    } else {
      setIsDeleting(true);
      try {
        await pilotService.deletePilot(id);
        onBack();
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 font-sans">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Pilot Management</span>
          </button>
        </div>
        <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-sm text-slate-500">Loading pilot profile & flight telemetry...</p>
        </div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="space-y-6 font-sans">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Pilot Management</span>
          </button>
        </div>
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
          <h3 className="text-base font-medium text-rose-800">Failed to load pilot details</h3>
          <p className="text-xs text-rose-600">{error || "Pilot not found."}</p>
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 bg-white border border-rose-200 text-rose-700 rounded-lg text-xs font-medium hover:bg-rose-50 transition-colors cursor-pointer"
          >
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  const pilotItemForDialog: PilotDeleteTarget = {
    userId: Number(details.pilotId),
    fullName: details.name,
    firstName: details.name.split(" ")[0] || "",
    lastName: details.name.split(" ").slice(1).join(" ") || "",
    mobile: details.phone,
    licenceNumber: details.license,
    status: details.status,
    totalFlightHours: parseInt(details.flightHours, 10) || 0,
    completedMissions: details.missionsCount,
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-200">
      {/* Back Link Breadcrumb */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors cursor-pointer select-none group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Pilot Management</span>
        </button>
      </div>

      {/* Header Bar: Pilot Name, Status Badge & Delete Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-slate-900 font-display">
            {details.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">Pilot ID: #{details.pilotId}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={details.status} size="md" />
          <button
            type="button"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-rose-200 text-rose-700 bg-rose-50/50 hover:bg-rose-50 hover:border-rose-300 rounded-xl text-xs font-normal transition-colors cursor-pointer shadow-2xs"
            title="Delete Pilot Profile"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Delete Pilot</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Pilot Profile & Key Metrics */}
        <div className="space-y-6">
          <PilotProfileCard pilot={details} />
          <PilotMetricsRow
            flightHours={details.flightHours}
            rating={details.rating}
            reviewsCount={details.reviewsCount}
          />
        </div>

        {/* Right Column: Performance Bar Chart */}
        <div className="space-y-6">
          <PilotPerformanceCard data={details.performanceData || []} />
        </div>
      </div>

      {/* Mission History (Real Dynamic History or Clean Empty State) */}
      <div className="pt-2">
        <MissionHistoryCard missions={details.missionHistory} />
      </div>

      {/* Delete Pilot Dialog */}
      <DeletePilotDialog
        isOpen={isDeleteDialogOpen}
        pilot={pilotItemForDialog}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default PilotDetailsView;
