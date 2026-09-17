import { useState, useEffect } from "react";
import { X, Loader2, MapPin, Sprout, User, Layers, Check, AlertCircle } from "lucide-react";
import { farmerService } from "@/services/farmerService";
import type { Field, CreateFieldDTO, UpdateFieldDTO } from "@/types/field";
import type { ApiFarmerItem } from "@/types/farmer";
import { FieldLocationMapPicker } from "./FieldLocationMapPicker";

interface FieldFormModalProps {
  isOpen: boolean;
  field?: Field | null; // If provided, edit mode; else create mode
  onClose: () => void;
  onSubmit: (data: CreateFieldDTO | UpdateFieldDTO) => Promise<void>;
}

const COMMON_CROP_TYPES = [
  "Paddy (Rice)",
  "Tea",
  "Coconut",
  "Rubber",
  "Cinnamon",
  "Maize",
  "Vegetables",
  "Fruits",
  "Sugarcane",
  "Pepper",
  "Betel",
];

const SRI_LANKA_PROVINCES = [
  "Southern",
  "Western",
  "Central",
  "North Western",
  "North Central",
  "Uva",
  "Sabaragamuwa",
  "Eastern",
  "Northern",
];

const SRI_LANKA_DISTRICTS: Record<string, string[]> = {
  Southern: ["Matara", "Galle", "Hambantota"],
  Western: ["Colombo", "Gampaha", "Kalutara"],
  Central: ["Kandy", "Matale", "Nuwara Eliya"],
  "North Western": ["Kurunegala", "Puttalam"],
  "North Central": ["Anuradhapura", "Polonnaruwa"],
  Uva: ["Badulla", "Monaragala"],
  Sabaragamuwa: ["Ratnapura", "Kegalle"],
  Eastern: ["Ampara", "Batticaloa", "Trincomalee"],
  Northern: ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
};

export function FieldFormModal({ isOpen, field, onClose, onSubmit }: FieldFormModalProps) {
  const isEditing = Boolean(field);

  const [farmerId, setFarmerId] = useState<string>("");
  const [fieldName, setFieldName] = useState<string>("");
  const [cropType, setCropType] = useState<string>("Tea");
  const [customCrop, setCustomCrop] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [province, setProvince] = useState<string>("Central");
  const [district, setDistrict] = useState<string>("Nuwara Eliya");
  const [city, setCity] = useState<string>("Nuwara Eliya");
  const [village, setVillage] = useState<string>("Pedro");

  // Coordinate modes: "polygon" | "point"
  const [coordMode, setCoordMode] = useState<"polygon" | "point">("polygon");
  const [polygonCoordsText, setPolygonCoordsText] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");

  const [showAdvancedCoords, setShowAdvancedCoords] = useState<boolean>(false);
  const [farmersList, setFarmersList] = useState<ApiFarmerItem[]>([]);
  const [isLoadingFarmers, setIsLoadingFarmers] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Load farmers list for selector
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setIsLoadingFarmers(true);

    async function loadFarmers() {
      try {
        const res = await farmerService.getFarmers({ limit: 100 });
        if (isMounted && res && res.farmers) {
          setFarmersList(res.farmers);
        }
      } catch (err) {
        console.error("Failed to load farmers list in FieldFormModal:", err);
      } finally {
        if (isMounted) setIsLoadingFarmers(false);
      }
    }

    loadFarmers();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Sync state with selected field if editing
  useEffect(() => {
    if (field) {
      setFarmerId(String(field.farmer_id || field.farmer?.id || ""));
      setFieldName(field.field_name || field.fieldName || "");
      const matchedCrop = COMMON_CROP_TYPES.find(
        (c) => c.toLowerCase() === (field.crop_type || field.cropType || "").toLowerCase(),
      );
      if (matchedCrop) {
        setCropType(matchedCrop);
        setCustomCrop("");
      } else {
        setCropType("Other");
        setCustomCrop(field.crop_type || field.cropType || "");
      }
      setArea(String(field.area || ""));
      setProvince(field.province || "Central");
      setDistrict(field.district || "Nuwara Eliya");
      setCity(field.city || "Nuwara Eliya");
      setVillage(field.village || "Pedro");

      // Handle coordinates
      const coords = field.location_coordinates || field.locationCoordinates;
      if (coords) {
        if (Array.isArray(coords) && coords.length > 0) {
          if (Array.isArray(coords[0])) {
            // Nested polygon array [[lat, lng], [lat, lng], ...]
            setCoordMode("polygon");
            setPolygonCoordsText(JSON.stringify(coords, null, 2));
            setLatitude(String(coords[0][0]));
            setLongitude(String(coords[0][1]));
          } else if (typeof coords[0] === "number") {
            setCoordMode("point");
            setLatitude(String(coords[0]));
            setLongitude(String(coords[1]));
          }
        } else if (typeof coords === "object") {
          if (coords.lat !== undefined && coords.lng !== undefined) {
            setCoordMode("point");
            setLatitude(String(coords.lat));
            setLongitude(String(coords.lng));
          } else if (coords.coordinates && Array.isArray(coords.coordinates)) {
            setCoordMode("polygon");
            setPolygonCoordsText(JSON.stringify(coords.coordinates, null, 2));
          }
        }
      } else {
        setLatitude("");
        setLongitude("");
      }
    } else {
      setFarmerId("");
      setFieldName("");
      setCropType("Tea");
      setCustomCrop("");
      setArea("");
      setProvince("Central");
      setDistrict("Nuwara Eliya");
      setCity("Nuwara Eliya");
      setVillage("Pedro");
      setCoordMode("polygon");
      setPolygonCoordsText("");
      setLatitude("");
      setLongitude("");
    }
    setValidationError(null);
  }, [field, isOpen]);

  // Handle province change updating available districts
  const handleProvinceChange = (newProvince: string) => {
    setProvince(newProvince);
    const districts = SRI_LANKA_DISTRICTS[newProvince] || ["Nuwara Eliya"];
    if (!districts.includes(district)) {
      setDistrict(districts[0]);
    }
  };

  const handleLoadSamplePolygon = () => {
    setPolygonCoordsText(
      JSON.stringify(
        [
          [6.9271, 80.7781],
          [6.9295, 80.7812],
          [6.9255, 80.7845],
          [6.923, 80.78],
        ],
        null,
        2,
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const fId = Number(farmerId);
    if (!farmerId || isNaN(fId) || fId <= 0) {
      setValidationError("Please select a registered farmer for this field.");
      return;
    }

    if (!fieldName.trim()) {
      setValidationError("Please enter a descriptive field name.");
      return;
    }

    const finalCrop = cropType === "Other" ? customCrop.trim() : cropType;
    if (!finalCrop) {
      setValidationError("Please specify the crop type.");
      return;
    }

    const numArea = parseFloat(area);
    if (isNaN(numArea) || numArea <= 0) {
      setValidationError("Field area must be a positive number greater than 0 hectares.");
      return;
    }

    if (!district.trim()) {
      setValidationError("Please specify the district.");
      return;
    }

    let location_coordinates: any = null;
    if (coordMode === "polygon") {
      if (polygonCoordsText.trim()) {
        try {
          const parsed = JSON.parse(polygonCoordsText.trim());
          if (!Array.isArray(parsed)) {
            setValidationError(
              "Location coordinates must be an array of [latitude, longitude] pairs.",
            );
            return;
          }
          location_coordinates = parsed;
        } catch {
          setValidationError(
            "Invalid JSON format for location coordinates. Format example: [[6.9271, 80.7781], [6.9295, 80.7812]]",
          );
          return;
        }
      }
    } else {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        location_coordinates = [
          [lat, lng],
          [lat + 0.002, lng + 0.003],
          [lat - 0.002, lng + 0.004],
          [lat - 0.004, lng],
        ];
      }
    }

    setIsSubmitting(true);
    try {
      const selectedFarmer = farmersList.find((f) => Number(f.userId) === fId);

      const payload: CreateFieldDTO = {
        farmer_id: fId,
        field_name: fieldName.trim(),
        crop_type: finalCrop,
        area: Number(numArea.toFixed(2)),
        location_coordinates,
        province: province.trim(),
        district: district.trim(),
        city: city.trim() || district.trim(),
        village: village.trim(),
        farmer: selectedFarmer
          ? {
              id: fId,
              fullName:
                selectedFarmer.fullName ||
                `${selectedFarmer.firstName || ""} ${selectedFarmer.lastName || ""}`.trim() ||
                `Farmer #${fId}`,
              firstName: selectedFarmer.firstName,
              lastName: selectedFarmer.lastName,
              email: selectedFarmer.email,
              mobile: selectedFarmer.mobile,
            }
          : undefined,
      };

      await onSubmit(payload);
      onClose();
    } catch (err: unknown) {
      setValidationError(err instanceof Error ? err.message : "Failed to save field details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs font-sans animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 font-display">
                {isEditing ? "Edit Agricultural Field" : "Register New Field Parcel"}
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                {isEditing
                  ? "Modify field boundary parameters, crop profile, or location"
                  : "Associate a new precision polygon with an active farmer"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Validation Alert */}
          {validationError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">{validationError}</div>
            </div>
          )}

          {/* Section 1: Farmer & Field Identity */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <User className="w-3.5 h-3.5 text-emerald-700" />
              1. Owner & Field Identity
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Farmer Selection */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Registered Farmer <span className="text-rose-500">*</span>
                </label>
                <select
                  value={farmerId}
                  onChange={(e) => setFarmerId(e.target.value)}
                  disabled={isLoadingFarmers}
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer disabled:opacity-60"
                >
                  <option value="">-- Select Farmer --</option>
                  {farmersList.map((f) => (
                    <option key={f.userId} value={f.userId}>
                      {f.fullName ||
                        `${f.firstName || ""} ${f.lastName || ""}`.trim() ||
                        `Farmer #${f.userId}`}{" "}
                      ({f.mobile || f.email || `ID: ${f.userId}`})
                    </option>
                  ))}
                </select>
                {isLoadingFarmers && (
                  <span className="text-[10px] text-slate-400 mt-1 inline-flex items-center gap-1">
                    <Loader2 className="w-2.5 h-2.5 animate-spin text-emerald-600" /> Loading
                    farmers...
                  </span>
                )}
              </div>

              {/* Field Name */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Field Name / Identifier <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  placeholder="e.g. Maha Kumbura Sector 2"
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Crop & Area Specs */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              2. Agricultural Specifications
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Crop Type */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Crop Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                >
                  {COMMON_CROP_TYPES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="Other">Other (Custom Crop)</option>
                </select>

                {cropType === "Other" && (
                  <input
                    type="text"
                    value={customCrop}
                    onChange={(e) => setCustomCrop(e.target.value)}
                    placeholder="Enter custom crop name..."
                    className="w-full mt-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                )}
              </div>

              {/* Area in Hectares */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Field Area (Hectares) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. 4.25"
                    required
                    className="w-full pl-3 pr-12 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                    ha
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  ≈ {area && !isNaN(Number(area)) ? (Number(area) * 2.471).toFixed(2) : "0"} acres
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Geographic Division & Location */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              3. Geographic & Administrative Division
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Province */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Province</label>
                <select
                  value={province}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                >
                  {SRI_LANKA_PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p} Province
                    </option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  District <span className="text-rose-500">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                >
                  {(SRI_LANKA_DISTRICTS[province] || [district]).map((d) => (
                    <option key={d} value={d}>
                      {d} District
                    </option>
                  ))}
                </select>
              </div>

              {/* City / Town */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  City / Division
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Kamburupitiya"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Village / Grama Niladhari */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Village / GN Division
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Mapalana North"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Interactive Geospatial Map Location & Boundary Selector */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Interactive Map Location & Precision Boundary
                </label>
                <button
                  type="button"
                  onClick={() => setShowAdvancedCoords((prev) => !prev)}
                  className="text-[11px] text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer"
                >
                  {showAdvancedCoords ? "Hide Raw Coordinates" : "Advanced / Raw Input"}
                </button>
              </div>

              {/* Leaflet Map Picker Component */}
              <FieldLocationMapPicker
                coordinates={
                  (() => {
                    try {
                      const parsed = JSON.parse(polygonCoordsText);
                      if (Array.isArray(parsed)) return parsed;
                    } catch {
                      // ignore parse error
                    }
                    return [];
                  })()
                }
                initialDistrict={district}
                initialCity={city}
                onChange={(newCoords, center, calculatedAreaHa) => {
                  setPolygonCoordsText(JSON.stringify(newCoords, null, 2));
                  if (center) {
                    setLatitude(String(center[0]));
                    setLongitude(String(center[1]));
                  }
                  if (calculatedAreaHa && calculatedAreaHa > 0 && (!area || Number(area) <= 0)) {
                    setArea(String(calculatedAreaHa));
                  }
                }}
                onLocationSelect={({ city: locCity, district: locDistrict, province: locProvince }) => {
                  if (locDistrict) {
                    // Match with known districts
                    const matchedDistrict = Object.keys(SRI_LANKA_DISTRICTS).flatMap(p => SRI_LANKA_DISTRICTS[p]).find(
                      d => d.toLowerCase().includes(locDistrict.toLowerCase()) || locDistrict.toLowerCase().includes(d.toLowerCase())
                    );
                    if (matchedDistrict) setDistrict(matchedDistrict);
                  }
                  if (locCity) setCity(locCity);
                  if (locProvince) {
                    const matchedProv = SRI_LANKA_PROVINCES.find(
                      p => p.toLowerCase().includes(locProvince.toLowerCase())
                    );
                    if (matchedProv) setProvince(matchedProv);
                  }
                }}
              />

              {/* Advanced / Manual Coordinate Text Inputs (Collapsible) */}
              {showAdvancedCoords && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-700">
                      Manual Coordinate Override (JSON / Lat-Lng)
                    </span>
                    <div className="flex items-center gap-1 p-0.5 bg-white border border-slate-200 rounded-lg text-[10px]">
                      <button
                        type="button"
                        onClick={() => setCoordMode("polygon")}
                        className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                          coordMode === "polygon" ? "bg-emerald-50 text-emerald-800" : "text-slate-500"
                        }`}
                      >
                        Polygon Matrix
                      </button>
                      <button
                        type="button"
                        onClick={() => setCoordMode("point")}
                        className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                          coordMode === "point" ? "bg-emerald-50 text-emerald-800" : "text-slate-500"
                        }`}
                      >
                        Point (Lat/Lng)
                      </button>
                    </div>
                  </div>

                  {coordMode === "polygon" ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Array of [lat, lng] boundary points:</span>
                        <button
                          type="button"
                          onClick={handleLoadSamplePolygon}
                          className="text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer"
                        >
                          Load Sample Polygon
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={polygonCoordsText}
                        onChange={(e) => setPolygonCoordsText(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">Latitude</label>
                        <input
                          type="text"
                          value={latitude}
                          onChange={(e) => setLatitude(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">Longitude</label>
                        <input
                          type="text"
                          value={longitude}
                          onChange={(e) => setLongitude(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
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
            disabled={isSubmitting}
            className="px-5 py-2 bg-[#062419] hover:bg-[#0a3828] text-white rounded-xl text-xs font-medium transition-all shadow-2xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving Field...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{isEditing ? "Update Field" : "Create Field"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
