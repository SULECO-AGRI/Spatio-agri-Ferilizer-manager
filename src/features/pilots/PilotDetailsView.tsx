import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { StatusBadge } from "@/components/ui";
import { pilotService } from "@/services/pilotService";
import type { PilotDocument, DetailedPilotInfo } from "@/types/pilot";
import {
  PilotProfileCard,
  DroneInfoCard,
  MissionHistoryCard,
  PilotPerformanceCard,
  PilotMetricsRow,
  CertificatesCard,
  DocumentViewerModal,
} from "./components";

interface PilotDetailsProps {
  pilotId: number | string;
  onBack: () => void;
}

export function PilotDetailsView({ pilotId, onBack }: PilotDetailsProps) {
  const [selectedDoc, setSelectedDoc] = useState<PilotDocument | null>(null);
  const [details, setDetails] = useState<DetailedPilotInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
          const ratingVal = data.stats?.ratings ?? 5.0;
          const completedMissions = data.stats?.completedMissions ?? 0;
          const totalFlightHours = data.stats?.totalFlightHours ?? 0;

          setDetails({
            pilotId: data.userId,
            name: data.fullName || `${data.firstName} ${data.lastName}`.trim(),
            initials,
            status: data.status,
            license: data.licenceNumber || "N/A",
            experience: `${Math.max(1, Math.round(totalFlightHours / 50))} yrs experience`,
            phone: data.mobile || "N/A",
            email: data.email || "N/A",
            rating: typeof ratingVal === "number" ? ratingVal : Number(ratingVal || 5),
            reviewsCount: data.stats?.totalReviews ?? completedMissions,
            missionsCount: completedMissions,
            flightHours: `${totalFlightHours} hrs`,
            activeMissionsCount: data.stats?.inProgressMissions ?? 0,
            certificates: [data.licenceNumber || "CAASL-DP-001", "Precision Ag Drone Ops"],
            droneDetails: {
              model: "DJI Agras T40",
              tankCapacity: "40L",
              maxSpeed: "10 m/s",
              lastServiced: "Jul 2026",
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
            missionHistory: [
              {
                id: `MSN-${data.userId}01`,
                field: "Precision Agri Zone",
                date: new Date(data.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                }),
                result: "Completed",
              },
            ],
            documents: [
              {
                id: "doc-1",
                title: "CAASL Drone Pilot License",
                docNumber: data.licenceNumber || "CAA-UAV-001",
                issueDate: new Date(data.createdAt).toLocaleDateString(),
                expiryDate: "Valid 3 Years",
                fileSize: "1.4 MB",
              },
              {
                id: "doc-2",
                title: "Safety & First Aid Certificate",
                docNumber: `SLRC-FA-${data.userId}`,
                issueDate: new Date(data.createdAt).toLocaleDateString(),
                expiryDate: "Valid",
                fileSize: "820 KB",
              },
            ],
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

      {/* Header Bar: Pilot Name & Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-slate-900 font-display">
            {details.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">Pilot ID: #{details.pilotId}</p>
        </div>
        <StatusBadge status={details.status} size="md" />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Pilot Profile, Drone Information, Mission History */}
        <div className="space-y-6">
          <PilotProfileCard pilot={details} />
          <DroneInfoCard drone={details.droneDetails} />
          <MissionHistoryCard missions={details.missionHistory} />
        </div>

        {/* Right Column: Performance Bar Chart, Flight Hours / Rating Metrics, Certificates & Documents */}
        <div className="space-y-6">
          <PilotPerformanceCard data={details.performanceData} />
          <PilotMetricsRow
            flightHours={details.flightHours}
            rating={details.rating}
            reviewsCount={details.reviewsCount}
          />
          <CertificatesCard documents={details.documents} onViewDocument={setSelectedDoc} />
        </div>
      </div>

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        document={selectedDoc}
        pilotName={details.name}
        onClose={() => setSelectedDoc(null)}
      />
    </div>
  );
}

export default PilotDetailsView;
