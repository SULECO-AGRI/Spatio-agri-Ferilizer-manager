import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import type { Farmer, FarmerField, FarmerServiceHistory } from "@/types";
import { farmerService } from "@/services/farmerService";
import { serviceRequestsService } from "@/services/serviceRequestsService";
import { FarmerOverviewCard } from "./components/FarmerOverviewCard";
import { FarmerFieldsGrid } from "./components/FarmerFieldsGrid";
import { FarmerHistoryTable } from "./components/FarmerHistoryTable";
import { DeleteFarmerDialog } from "./components/DeleteFarmerDialog";

interface FarmerProfileViewProps {
  farmer: Farmer;
  fields?: FarmerField[];
  serviceHistory?: FarmerServiceHistory[];
  onBack: () => void;
  onDelete?: () => Promise<void>;
}

const profileTabs = ["Fields", "Service History", "Payment History", "Service Notes"] as const;

export function FarmerProfileView({
  farmer,
  fields: initialFields = [],
  serviceHistory: initialHistory = [],
  onBack,
  onDelete,
}: FarmerProfileViewProps) {
  const [activeTab, setActiveTab] = useState<(typeof profileTabs)[number]>("Fields");
  const [fields, setFields] = useState<FarmerField[]>(initialFields);
  const [serviceHistory, setServiceHistory] = useState<FarmerServiceHistory[]>(initialHistory);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingDetails(true);

    async function loadFarmerDetails() {
      try {
        const [fieldsData, requestsData] = await Promise.allSettled([
          farmerService.getFarmerFields(farmer.userId),
          serviceRequestsService.getServiceRequests({
            search: farmer.fullName || undefined,
            limit: 20,
          }),
        ]);

        if (isMounted) {
          if (fieldsData.status === "fulfilled" && Array.isArray(fieldsData.value)) {
            const normalizedFields: FarmerField[] = fieldsData.value.map((f: any) => ({
              id: f.id || f.fieldId,
              name: f.fieldName || "Field Parcel",
              size: `${f.area || 0} Hectares`,
              notes: `${f.cropType || "Crop"} • ${f.district || f.city || "Sri Lanka"}`,
            }));
            setFields(normalizedFields);
          }

          if (requestsData.status === "fulfilled" && requestsData.value?.requests) {
            const normalizedHistory: FarmerServiceHistory[] = requestsData.value.requests.map(
              (r) => ({
                date: r.createdAt
                  ? new Date(r.createdAt).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Recent",
                field: r.field?.fieldName || `${r.field?.cropType || "Crop"} Plot`,
                service: r.serviceType || "Fertilizing",
                amount: r.estimatedCost ? `LKR ${r.estimatedCost.toLocaleString()}` : "LKR 0",
              }),
            );
            setServiceHistory(normalizedHistory);
          }
        }
      } catch (err) {
        console.error("Failed to load farmer profile details:", err);
      } finally {
        if (isMounted) setIsLoadingDetails(false);
      }
    }

    loadFarmerDetails();

    return () => {
      isMounted = false;
    };
  }, [farmer.userId, farmer.fullName]);

  const handleDeleteConfirm = async (farmerId: number | string) => {
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
        await farmerService.deleteFarmer(farmerId);
        onBack();
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors cursor-pointer select-none group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Farmers</span>
          </button>
          <h1 className="text-3xl font-medium tracking-tight text-slate-900 mt-3 font-display">
            {farmer.fullName}
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsDeleteDialogOpen(true)}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 border border-rose-200 text-rose-700 bg-rose-50/50 hover:bg-rose-50 hover:border-rose-300 rounded-xl text-xs font-normal transition-colors cursor-pointer shadow-2xs"
          title="Delete Farmer Profile"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
          <span>Delete Profile</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left card */}
          <div className="col-span-1">
            <FarmerOverviewCard farmer={farmer} />
          </div>

          {/* Right content */}
          <div className="col-span-2 space-y-6">
            {/* Pill Tabs */}
            <div className="flex gap-2 flex-wrap">
              {profileTabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-normal transition-colors cursor-pointer ${
                      isActive
                        ? "bg-slate-100 text-slate-900 font-medium"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            {activeTab === "Fields" ? (
              <div className="space-y-4">
                <h3 className="text-xs font-normal uppercase tracking-wider text-slate-400">
                  Registered Parcels
                </h3>
                <FarmerFieldsGrid fields={fields} />
              </div>
            ) : (
              <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl text-center text-xs text-slate-400">
                {activeTab} records synchronized with central GIS database.
              </div>
            )}

            {/* Service History */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-normal uppercase tracking-wider text-slate-400">
                Recent Service History
              </h3>
              <FarmerHistoryTable history={serviceHistory} />
            </div>
          </div>
        </div>
      </div>

      {/* Delete Farmer Dialog */}
      <DeleteFarmerDialog
        isOpen={isDeleteDialogOpen}
        farmer={farmer}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
