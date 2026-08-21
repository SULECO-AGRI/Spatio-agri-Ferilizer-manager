import { ArrowLeft } from "lucide-react";
import { StatusBadge } from "@/components/ui";
import type { DetailedRequestInfo } from "@/types";
import { FieldPolygonMap } from "./components/FieldPolygonMap";
import { RequestFarmerCard } from "./components/RequestFarmerCard";
import { RequestFieldMetrics } from "./components/RequestFieldMetrics";
import { RequestSummaryCard } from "./components/RequestSummaryCard";
import { RequestActionsPanel } from "./components/RequestActionsPanel";

interface RequestDetailsViewProps {
  requestId: string;
  details: DetailedRequestInfo;
  onBack: () => void;
}

export function RequestDetailsView({ requestId, details, onBack }: RequestDetailsViewProps) {
  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-200">
      {/* Back Link */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors cursor-pointer select-none group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        <span>Service Requests</span>
      </button>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-slate-900 font-display">
            Request {requestId}
          </h1>
        </div>
        <StatusBadge status={details.status} size="md" />
      </div>

      {/* Main Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Detailed Cards (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Farmer Information */}
          <RequestFarmerCard
            farmerName={details.farmerName}
            phone={details.phone}
            email={details.email}
            district={details.district}
            memberSince={details.memberSince}
          />

          {/* Card 2: Field Information */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="text-xs font-normal uppercase tracking-wider text-slate-400">
              Field Information
            </h3>

            <FieldPolygonMap fieldName={details.fieldName} svgPoints={details.svgPoints} />

            <RequestFieldMetrics
              crop={details.crop}
              growthStage={details.growthStage}
              service={details.service}
              prefDate={details.prefDate}
              duration={details.duration}
              drone={details.drone}
            />
          </div>

          {/* Card 3: Weather Forecast */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-normal uppercase tracking-wider text-slate-400">
              Weather Forecast
            </h3>

            <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-200/50 rounded-xl text-xs font-normal">
              <span className="text-slate-700">{details.weather}</span>
              <StatusBadge status={details.risk} />
            </div>
          </div>
        </div>

        {/* Right Sidebar panels (1/3 width) */}
        <div className="space-y-6">
          <RequestSummaryCard
            requestId={requestId}
            area={details.area}
            priority={details.priority}
            status={details.status}
          />

          <RequestActionsPanel />
        </div>
      </div>
    </div>
  );
}
