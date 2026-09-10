import { X, MapPin, User, Sprout, Calendar, Layers, Phone, Mail, Navigation } from "lucide-react";
import type { Field } from "@/types/field";
import { formatDate } from "@/lib/utils";

interface FieldDetailsModalProps {
  isOpen: boolean;
  field: Field | null;
  onClose: () => void;
  onEdit?: (field: Field) => void;
}

export function FieldDetailsModal({ isOpen, field, onClose, onEdit }: FieldDetailsModalProps) {
  if (!isOpen || !field) return null;

  const farmer = field.farmer;
  const coords = field.location_coordinates || field.locationCoordinates;
  const lat = coords?.lat ?? (Array.isArray(coords?.coordinates) ? coords.coordinates[1] : null);
  const lng = coords?.lng ?? (Array.isArray(coords?.coordinates) ? coords.coordinates[0] : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs font-sans animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 font-display">
                {field.field_name || field.fieldName}
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                Parcel ID #{field.id} • {field.crop_type || field.cropType}
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

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
              <span className="text-[10px] text-emerald-700 font-medium uppercase block">Area</span>
              <span className="text-base font-semibold text-emerald-950 font-display">{field.area} ha</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{(field.area * 2.471).toFixed(1)} acres</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-500 font-medium uppercase block">Crop</span>
              <span className="text-sm font-semibold text-slate-800 truncate block mt-0.5">
                {field.crop_type || field.cropType}
              </span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-500 font-medium uppercase block">Division</span>
              <span className="text-sm font-semibold text-slate-800 truncate block mt-0.5">
                {field.district}
              </span>
            </div>
          </div>

          {/* Farmer Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <User className="w-3.5 h-3.5 text-emerald-700" />
              Farmer / Ownership
            </h4>
            <div className="p-3.5 bg-slate-50/80 border border-slate-200/60 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Name:</span>
                <span className="font-medium text-slate-800">
                  {farmer?.fullName || `Farmer ID #${field.farmer_id}`}
                </span>
              </div>
              {farmer?.mobile && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 inline-flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> Mobile:
                  </span>
                  <span className="text-slate-700">{farmer.mobile}</span>
                </div>
              )}
              {farmer?.email && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 inline-flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" /> Email:
                  </span>
                  <span className="text-slate-700">{farmer.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Location & Geospatial */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              Geographic Details
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-slate-400 block text-[11px]">Province:</span>
                <span className="font-medium text-slate-800">{field.province || "Southern"}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-slate-400 block text-[11px]">District:</span>
                <span className="font-medium text-slate-800">{field.district || "Matara"}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-slate-400 block text-[11px]">City / Division:</span>
                <span className="font-medium text-slate-800">{field.city || "Kamburupitiya"}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-slate-400 block text-[11px]">Village / GN:</span>
                <span className="font-medium text-slate-800">{field.village || "N/A"}</span>
              </div>
            </div>

            {lat && lng && (
              <div className="p-3 bg-emerald-50/40 border border-emerald-100 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-emerald-700" />
                  <span className="font-mono text-slate-700 text-[11px]">
                    {Number(lat).toFixed(6)}° N, {Number(lng).toFixed(6)}° E
                  </span>
                </div>
                <a
                  href={`https://www.google.com/maps?q=${lat},${lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 hover:text-emerald-800 text-[11px] font-medium underline"
                >
                  Open in Maps
                </a>
              </div>
            )}
          </div>

          {/* Timestamps */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Registered: {formatDate(field.created_at || field.createdAt)}
            </span>
            <span>ID: {field.id}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>
          {onEdit && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(field);
              }}
              className="px-4 py-2 bg-[#062419] hover:bg-[#0a3828] text-white rounded-xl text-xs font-medium transition-all shadow-2xs cursor-pointer"
            >
              Edit Field
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
