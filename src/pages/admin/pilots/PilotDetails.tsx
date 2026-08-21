import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { StatusBadge } from "@/components/ui";
import { detailedPilotsInfo, mockPilots } from "@/data/mockData";
import type { PilotDocument, DetailedPilotInfo } from "@/types";
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
  pilotId: string;
  onBack: () => void;
}

export function PilotDetails({ pilotId, onBack }: PilotDetailsProps) {
  const [selectedDoc, setSelectedDoc] = useState<PilotDocument | null>(null);

  // Retrieve pilot details or build safe fallback from basic mock if needed
  const basicPilot = mockPilots.find((p) => p.id === pilotId);
  const details: DetailedPilotInfo = detailedPilotsInfo[pilotId] || {
    pilotId,
    name: basicPilot?.name || "Nimal Perera",
    initials: basicPilot?.initials || "NP",
    status: basicPilot?.status || "Available",
    license: basicPilot?.license || "DP-2291",
    experience: basicPilot ? `${basicPilot.experience} experience` : "6 yrs experience",
    phone: "+94 71 987 6543",
    email: "pilot@spatioagri.lk",
    rating: basicPilot?.rating || 4.9,
    reviewsCount: basicPilot?.missions || 312,
    missionsCount: basicPilot?.missions || 312,
    flightHours: basicPilot ? `${basicPilot.flightHours} hrs` : "1,240 hrs",
    certificates: ["CAASL-DP-004", "First Aid"],
    droneDetails: {
      model: basicPilot?.drone || "DJI Agras T40",
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
    missionHistory: [
      { id: "MSN-0231", field: "North Paddy Field", date: "Jul 20", result: "Active" },
      { id: "MSN-0229", field: "South Maize Plot", date: "Jul 19", result: "Completed" },
      { id: "MSN-0221", field: "East Tea Estate", date: "Jul 15", result: "Completed" },
    ],
    documents: [
      {
        id: "doc-1",
        title: "CAASL Drone Pilot License",
        docNumber: "CAASL-DP-004",
        issueDate: "Jan 12, 2024",
        expiryDate: "Jan 12, 2027",
        fileSize: "1.4 MB",
      },
      {
        id: "doc-2",
        title: "First Aid Certificate",
        docNumber: "SLRC-FA-992",
        issueDate: "Mar 05, 2025",
        expiryDate: "Mar 05, 2028",
        fileSize: "820 KB",
      },
      {
        id: "doc-3",
        title: "Insurance Document",
        docNumber: "INS-AGRI-4820",
        issueDate: "Jun 01, 2026",
        expiryDate: "Jun 01, 2027",
        fileSize: "2.1 MB",
      },
    ],
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-200">
      {/* Back Link Breadcrumb */}
      <div>
        <button
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
        </div>
        <StatusBadge status={details.status} size="md" />
      </div>

      {/* Main Content Layout matching Screen 8 Wireframe */}
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
          <CertificatesCard
            documents={details.documents}
            onViewDocument={setSelectedDoc}
          />
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
