import {
  ArrowLeft,
  Calendar,
  Layers,
  Sprout,
  DollarSign,
  UserCheck,
  Radio,
  MapPin,
} from "lucide-react";
import { StatusBadge } from "@/components/ui";
import type { ApiServiceRequestItem } from "@/types/request";
import { FieldPolygonMap } from "./components/FieldPolygonMap";
import { RequestActionsPanel } from "./components/RequestActionsPanel";

interface RequestDetailsViewProps {
  request: ApiServiceRequestItem;
  onBack: () => void;
  onAssignPilot?: (request: ApiServiceRequestItem) => void;
}

export function RequestDetailsView({ request, onBack, onAssignPilot }: RequestDetailsViewProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatServiceType = (service?: string) => {
    if (!service) return "General";
    return service
      .toLowerCase()
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-200">
      {/* Back Link */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors cursor-pointer select-none group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to Service Requests</span>
      </button>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-slate-900 font-display">
              {request.requestCode}
            </h1>
            <StatusBadge status={request.status} size="md" />
            <StatusBadge status={request.priority} size="md" />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Submitted on {formatDate(request.createdAt)} • Preferred Date:{" "}
            {formatDate(request.preferredDate)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-emerald-50 border border-emerald-200/80 rounded-xl text-right">
            <span className="text-[10px] text-emerald-700 font-medium block">Estimated Cost</span>
            <span className="text-sm font-semibold text-emerald-900 font-mono">
              LKR {request.estimatedCost ? request.estimatedCost.toLocaleString() : "0"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Detailed Cards (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Farmer Information */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-normal uppercase tracking-wider text-slate-400">
              Farmer Information
            </h3>

            <div className="bg-slate-50/70 border border-slate-200/60 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/40 pb-3">
                <div>
                  <h4 className="text-base font-semibold text-slate-900">
                    {request.farmer?.fullName || "Farmer"}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    NIC: <span className="font-mono">{request.farmer?.nic || "N/A"}</span>
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs flex items-center justify-center shadow-2xs">
                  {request.farmer?.fullName
                    ? request.farmer.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                    : "FM"}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 pt-1">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
                    Mobile Phone
                  </span>
                  <span className="font-mono text-slate-800 font-medium">
                    {request.farmer?.mobile || "N/A"}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
                    Email Address
                  </span>
                  <span className="text-slate-800">{request.farmer?.email || "N/A"}</span>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
                    Residential Address
                  </span>
                  <span className="text-slate-800">{request.farmer?.address || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Field Information & Telemetry Boundary */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="text-xs font-normal uppercase tracking-wider text-slate-400">
              Field & Crop Telemetry
            </h3>

            {/* Field Boundary OpenStreetMap */}
            <FieldPolygonMap
              fieldName={request.field?.fieldName || "Field Alpha"}
              locationCoordinates={request.field?.locationCoordinates}
              cropType={request.field?.cropType}
              area={request.field?.area}
              district={request.field?.district}
            />

            {/* Field Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-normal pt-2">
              <div className="p-3 bg-slate-50/70 border border-slate-200/50 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Sprout className="w-3 h-3 text-emerald-600" /> Crop Type
                </span>
                <span className="text-slate-850 font-medium mt-1 block">
                  {request.field?.cropType || "Paddy"}
                </span>
              </div>

              <div className="p-3 bg-slate-50/70 border border-slate-200/50 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Layers className="w-3 h-3 text-slate-500" /> Total Area
                </span>
                <span className="text-slate-850 font-medium mt-1 block">
                  {request.field?.area !== undefined ? `${request.field.area} Hectares` : "N/A"}
                </span>
              </div>

              <div className="p-3 bg-slate-50/70 border border-slate-200/50 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" /> Location
                </span>
                <span className="text-slate-850 font-medium mt-1 block truncate">
                  {request.field?.district
                    ? `${request.field.city}, ${request.field.district}`
                    : "N/A"}
                </span>
              </div>

              <div className="p-3 bg-slate-50/70 border border-slate-200/50 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-600" /> Service Type
                </span>
                <span className="text-slate-850 font-medium mt-1 block">
                  {formatServiceType(request.serviceType)}
                </span>
              </div>

              <div className="p-3 bg-slate-50/70 border border-slate-200/50 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" /> Preferred Date
                </span>
                <span className="text-slate-850 font-medium mt-1 block">
                  {formatDate(request.preferredDate)}
                </span>
              </div>

              <div className="p-3 bg-slate-50/70 border border-slate-200/50 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-emerald-600" /> Estimated Cost
                </span>
                <span className="text-slate-850 font-medium mt-1 block font-mono">
                  LKR {request.estimatedCost ? request.estimatedCost.toLocaleString() : "0"}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Pilot Assignment & Mission Status */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-normal uppercase tracking-wider text-slate-400">
              Pilot & Mission Allocation
            </h3>

            {request.assignedPilot ? (
              <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-semibold text-xs">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-emerald-950">
                      {request.assignedPilot.fullName}
                    </h5>
                    <p className="text-xs text-emerald-700">
                      Licence:{" "}
                      <span className="font-mono">{request.assignedPilot.licenceNumber}</span> •{" "}
                      {request.assignedPilot.mobile}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  {request.assignedPilot.status}
                </span>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center justify-between text-xs text-slate-500">
                <span>No pilot has been allocated to this service request yet.</span>
                {onAssignPilot && (
                  <button
                    type="button"
                    onClick={() => onAssignPilot(request)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium cursor-pointer transition-colors shadow-2xs"
                  >
                    Assign Pilot
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Actions & Metadata */}
        <div className="space-y-6">
          {/* Request Meta Summary Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-semibold text-slate-900 font-display">Request Metadata</h3>

            <div className="divide-y divide-slate-100">
              <div className="flex justify-between py-2.5">
                <span className="text-slate-400">Request Code</span>
                <span className="font-mono text-slate-800 font-medium">{request.requestCode}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-slate-400">Submission Date</span>
                <span className="text-slate-700">{formatDate(request.createdAt)}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-slate-400">Field Size</span>
                <span className="text-slate-700">{request.field?.area} Hectares</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-slate-400">Priority Level</span>
                <StatusBadge status={request.priority} />
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-slate-400">Status</span>
                <StatusBadge status={request.status} />
              </div>
            </div>
          </div>

          {/* Action Control Buttons */}
          <RequestActionsPanel
            status={request.status}
            onApprove={() => alert(`Approved request ${request.requestCode}`)}
            onReject={() => alert(`Rejected request ${request.requestCode}`)}
            onAssignPilot={onAssignPilot ? () => onAssignPilot(request) : undefined}
            onReschedule={() => alert(`Rescheduling request ${request.requestCode}`)}
            onContactFarmer={() =>
              alert(`Calling farmer ${request.farmer?.fullName} at ${request.farmer?.mobile}`)
            }
          />
        </div>
      </div>
    </div>
  );
}

export default RequestDetailsView;
