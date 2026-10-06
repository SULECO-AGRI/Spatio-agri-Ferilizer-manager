import { useState, useEffect, useMemo } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";
import { farmerService } from "@/services/farmerService";
import { fieldService } from "@/services/fieldService";
import { useCreateServiceRequestMutation } from "../api/requestApi";
import { useCostEstimation } from "../hooks/useCostEstimation";
import { CostEstimationCard } from "./CostEstimationCard";
import type { Field } from "@/types/field";
import type { ApiFarmerItem } from "@/types/farmer";
import type { CreateServiceRequestDTO } from "@/types/request";

interface CreateServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newRequest: any) => void;
  initialFieldId?: number;
}

const SERVICE_TYPE_OPTIONS = [
  {
    id: "FERTILIZING",
    name: "Fertilizing Broadcast",
    description: "Nutrient, Urea & organic bio-fertilizer aerial drone spray",
  },
  {
    id: "PRECISION_SPRAYING",
    name: "Precision Spraying",
    description: "Targeted foliar micro-nutrients with ultra-low drift nozzles",
  },
  {
    id: "PEST_CONTROL_SPRAY",
    name: "Pest & Disease Control",
    description: "Targeted fungicide & pesticide application against crop blight",
  },
  {
    id: "SEED_BROADCASTING",
    name: "Seed Broadcasting",
    description: "High-efficiency aerial cover crop and paddy seeding",
  },
];

const PRIORITY_OPTIONS = [
  { id: "LOW", label: "Low", desc: "Standard queue (+0%)" },
  { id: "MEDIUM", label: "Medium", desc: "Optimal dispatch (+0%)" },
  { id: "HIGH", label: "High", desc: "Expedited next-day (+25%)" },
  { id: "CRITICAL", label: "Critical", desc: "Emergency dispatch (+50%)" },
];

export function CreateServiceRequestModal({
  isOpen,
  onClose,
  onSuccess,
  initialFieldId,
}: CreateServiceRequestModalProps) {
  // Form State
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>("");
  const [selectedFieldId, setSelectedFieldId] = useState<string>(initialFieldId ? String(initialFieldId) : "");
  const [serviceType, setServiceType] = useState<string>("FERTILIZING");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "CRITICAL">("MEDIUM");
  const [preferredDate, setPreferredDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  });
  const [notes, setNotes] = useState<string>("");

  // Data Lists
  const [farmersList, setFarmersList] = useState<ApiFarmerItem[]>([]);
  const [fieldsList, setFieldsList] = useState<Field[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // RTK Query Mutation
  const [createServiceRequest, { isLoading: isSubmitting }] = useCreateServiceRequestMutation();

  // Load Farmers and Fields on Open
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setIsLoadingData(true);
    setErrorMsg(null);

    async function loadData() {
      try {
        const [farmersRes, fieldsRes] = await Promise.all([
          farmerService.getFarmers({ limit: 100 }),
          fieldService.getFields({ limit: 100 }),
        ]);

        if (isMounted) {
          if (farmersRes?.farmers) setFarmersList(farmersRes.farmers);
          if (fieldsRes?.fields) {
            setFieldsList(fieldsRes.fields);
            if (initialFieldId) {
              const matched = fieldsRes.fields.find((f) => f.id === initialFieldId);
              if (matched) {
                setSelectedFieldId(String(matched.id));
                if (matched.farmer_id || matched.farmerId) {
                  setSelectedFarmerId(String(matched.farmer_id || matched.farmerId));
                }
              }
            }
          }
        }
      } catch (err: any) {
        console.error("Failed to load farmers/fields for request creation:", err);
      } finally {
        if (isMounted) setIsLoadingData(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [isOpen, initialFieldId]);

  // Filter fields based on selected farmer
  const filteredFields = useMemo(() => {
    if (!selectedFarmerId) return fieldsList;
    const fId = Number(selectedFarmerId);
    return fieldsList.filter(
      (f) => f.farmer_id === fId || f.farmerId === fId || f.farmer?.id === fId || f.owner?.id === fId,
    );
  }, [fieldsList, selectedFarmerId]);

  // Selected Field Object
  const currentField = useMemo(() => {
    if (!selectedFieldId) return null;
    const fId = Number(selectedFieldId);
    return fieldsList.find((f) => f.id === fId) || null;
  }, [fieldsList, selectedFieldId]);

  // Derive Field Area in Acres and Crop Type
  const areaAcres = useMemo(() => {
    if (!currentField) return 0;
    const ha = Number(currentField.area) || 0;
    return Number((ha * 2.471).toFixed(2));
  }, [currentField]);

  const cropType = currentField?.crop_type || currentField?.cropType || "Paddy";

  // Dynamic Cost Estimation Hook
  const {
    estimation,
    isLoading: isEstimating,
    isFetching: isFetchingEstimate,
    isError: isEstimateError,
  } = useCostEstimation(
    {
      fieldId: currentField ? currentField.id : undefined,
      area: areaAcres > 0 ? areaAcres : undefined,
      cropType: cropType,
      serviceType: serviceType,
      priority: priority,
    },
    { skip: !currentField },
  );

  // Handle Farmer change
  const handleFarmerChange = (farmerId: string) => {
    setSelectedFarmerId(farmerId);
    // Reset selected field if it doesn't belong to newly selected farmer
    if (selectedFieldId) {
      const fId = Number(farmerId);
      const isMatch = fieldsList.some(
        (f) =>
          f.id === Number(selectedFieldId) &&
          (f.farmer_id === fId || f.farmerId === fId || f.farmer?.id === fId || f.owner?.id === fId),
      );
      if (!isMatch) {
        setSelectedFieldId("");
      }
    }
  };

  // Handle Field change
  const handleFieldChange = (fieldId: string) => {
    setSelectedFieldId(fieldId);
    if (fieldId) {
      const field = fieldsList.find((f) => f.id === Number(fieldId));
      if (field && (field.farmer_id || field.farmerId || field.farmer?.id || field.owner?.id)) {
        setSelectedFarmerId(String(field.farmer_id || field.farmerId || field.farmer?.id || field.owner?.id));
      }
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const fId = Number(selectedFieldId);
    if (!fId || isNaN(fId) || fId <= 0) {
      setErrorMsg("Please select an agricultural field for this service request.");
      return;
    }

    if (!preferredDate) {
      setErrorMsg("Please specify a preferred execution date.");
      return;
    }

    const payload: CreateServiceRequestDTO = {
      fieldId: fId,
      farmerId: selectedFarmerId ? Number(selectedFarmerId) : undefined,
      serviceType,
      preferredDate: new Date(preferredDate).toISOString(),
      priority,
      notes: notes.trim() || undefined,
      estimatedCost: estimation ? estimation.totalEstimatedCost : undefined,
    };

    try {
      const result = await createServiceRequest(payload).unwrap();
      if (onSuccess) onSuccess(result);
      onClose();
    } catch (err: any) {
      setErrorMsg(
        err?.data?.message || err?.message || "Failed to create service request. Please try again.",
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs font-sans animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              New Service Request
            </h3>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Configure drone flight mission and calculate costs
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-6 space-y-6"
        >
          {/* Error Alert */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMsg}</div>
            </div>
          )}

          {/* Section 1: Farmer & Field Selection */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              1. Farmer & Field Selection
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Farmer Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Registered Farmer <span className="text-slate-400 font-normal">(Optional filter)</span>
                </label>
                <select
                  value={selectedFarmerId}
                  onChange={(e) => handleFarmerChange(e.target.value)}
                  disabled={isLoadingData}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                >
                  <option value="">-- All Registered Farmers --</option>
                  {farmersList.map((farmer) => (
                    <option key={farmer.userId} value={farmer.userId}>
                      {farmer.fullName || `${farmer.firstName} ${farmer.lastName}`.trim()} ({farmer.mobile || farmer.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Field Parcel Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Target Field Parcel <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedFieldId}
                  onChange={(e) => handleFieldChange(e.target.value)}
                  disabled={isLoadingData}
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer font-medium"
                >
                  <option value="">-- Select Field Parcel --</option>
                  {filteredFields.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.field_name || f.fieldName} — {f.crop_type || f.cropType} ({f.area} ha / {(f.area * 2.471).toFixed(1)} ac, {f.district})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected Field Quick Specs */}
            {currentField && (
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Cultivated Crop</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{cropType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Total Acreage</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{areaAcres} Acres ({currentField.area} ha)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">District Division</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{currentField.district}, {currentField.province}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Location</span>
                  <span className="text-slate-600 mt-0.5 block text-[11px]">
                    {currentField.city || "Mapped"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Service Type & Operations */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              2. Kind of Operation (Service Type)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICE_TYPE_OPTIONS.map((opt) => {
                const isSelected = serviceType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setServiceType(opt.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-emerald-50/70 border-emerald-600 ring-1 ring-emerald-600/20"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-semibold text-slate-900 block">{opt.name}</span>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center transition-colors ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-600"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Priority & Schedule */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              3. Dispatch Priority & Schedule
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Priority Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Dispatch Priority Level <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRIORITY_OPTIONS.map((p) => {
                    const isSelected = priority === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPriority(p.id as any)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#062419] border-[#062419] text-white shadow-2xs"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-xs font-medium block">{p.label}</span>
                        <span className={`text-[9px] block mt-0.5 ${isSelected ? "text-emerald-300" : "text-slate-400"}`}>
                          {p.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Date */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Preferred Execution Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Field Notes / Special Instructions <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Focus on North sector; watch for powerlines on East boundary..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Section 4: Live Cost Estimation Breakdown Card */}
          <div className="space-y-2 pt-1">
            <CostEstimationCard
              estimation={estimation}
              isLoading={isEstimating}
              isFetching={isFetchingEstimate}
              fieldAreaAcres={areaAcres}
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <div className="text-xs text-slate-500">
            {estimation ? (
              <span>
                Payable Total: <strong className="font-mono font-semibold text-slate-900">{estimation.currency} {Number(estimation.totalEstimatedCost).toLocaleString()}</strong>
              </span>
            ) : (
              <span>Select field parcel to preview pricing</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedFieldId}
              className="px-5 py-2 bg-[#062419] hover:bg-[#0a3828] text-white rounded-xl text-xs font-medium transition-all shadow-2xs cursor-pointer disabled:opacity-50 flex items-center justify-center min-w-[140px]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </span>
              ) : (
                <span>Submit Service Request</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateServiceRequestModal;
