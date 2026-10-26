import { useState, useRef } from "react";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  Loader2,
  ExternalLink,
  Satellite,
  UserCheck,
} from "lucide-react";
import type { ApiServiceRequestItem, ApiVraMap } from "@/types/request";
import { useUploadVraMapMutation } from "../api/requestApi";

interface VraPrescriptionCardProps {
  request: ApiServiceRequestItem;
}

export function VraPrescriptionCard({ request }: VraPrescriptionCardProps) {
  const [uploadVraMap, { isLoading }] = useUploadVraMapMutation();
  const [adminNotes, setAdminNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sType = (request.serviceType || "").toUpperCase();
  const isDroneMapping = sType.includes("MAPPING");

  // Drone mapping requests do not need NDVI to VRA maps
  if (isDroneMapping) {
    return null;
  }

  const mission = request.mission || request.missions?.[0];
  const assignedPilot = request.assignedPilot || mission?.pilot;

  let vra: ApiVraMap | null = mission?.vra || null;
  if (!vra && mission?.pilotNotes) {
    try {
      const parsed = JSON.parse(mission.pilotNotes);
      if (parsed?.vra) vra = parsed.vra;
    } catch (_) {}
  }

  const isRequested = vra?.status === "REQUESTED";
  const isUploaded = vra?.status === "UPLOADED";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = () => {
      setFileBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!mission?.missionId) {
      setErrorMessage("No active mission found for this request.");
      return;
    }
    if (!selectedFile && !fileBase64) {
      setErrorMessage("Please select a prescription map file to send.");
      return;
    }

    try {
      setErrorMessage(null);
      await uploadVraMap({
        requestId: request.requestId,
        missionId: mission.missionId,
        fileName: selectedFile?.name || "NDVI_to_VRA_Prescription_Map.pdf",
        fileType: selectedFile?.type || "application/pdf",
        fileData: fileBase64,
        adminNotes: adminNotes.trim() || "3-zone variable rate application prescription map.",
      }).unwrap();

      setUploadSuccess(true);
      setSelectedFile(null);
      setFileBase64("");
      setTimeout(() => setUploadSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err?.data?.message || err?.message || "Failed to upload prescription map.");
    }
  };

  const backendUrl = "https://spatio-agri-ferilizer-manager-backend-1.onrender.com";

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
            <Satellite className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 font-display">
              NDVI to VRA Prescription Map
            </h3>
            <p className="text-xs text-slate-400">
              Variable-rate aerial fertilizer / pesticide application zone file
            </p>
          </div>
        </div>

        {isUploaded ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Prescription Sent
          </span>
        ) : isRequested ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 animate-pulse">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pilot Requested Map
          </span>
        ) : (
          <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
            Optional
          </span>
        )}
      </div>

      {assignedPilot && (
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <div>
              <span className="text-xs font-semibold text-slate-800">
                Assigned Pilot: {assignedPilot.fullName}
              </span>
              <span className="text-[11px] text-slate-500 block">
                Phone: {assignedPilot.mobile} • License: {assignedPilot.licenceNumber || "Certified"}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
            Accepted by Pilot
          </span>
        </div>
      )}

      {isRequested && (
        <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-semibold text-amber-900">
              Pilot {assignedPilot?.fullName || "Assigned Pilot"} has requested an NDVI to VRA Prescription Map
            </p>
            {vra?.pilotNote && (
              <p className="text-xs text-amber-800 italic bg-amber-100/60 p-1.5 rounded-md">
                "{vra.pilotNote}"
              </p>
            )}
            <p className="text-[11px] text-amber-700">
              Please upload the prescription zones file (PDF, GeoTIFF, PNG, or Shapefile) below so the pilot can commence variable-rate spraying.
            </p>
          </div>
        </div>
      )}

      {isUploaded && vra && (
        <div className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-emerald-700" />
              <div>
                <p className="text-xs font-semibold text-emerald-950 font-mono">
                  {vra.fileName || "NDVI_to_VRA_Prescription_Map.pdf"}
                </p>
                <p className="text-[10px] text-emerald-700">
                  Delivered on {new Date(vra.uploadedAt || "").toLocaleDateString()}
                </p>
              </div>
            </div>
            {vra.fileUrl && (
              <a
                href={vra.fileUrl.startsWith("http") ? vra.fileUrl : backendUrl + vra.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-emerald-300 text-emerald-800 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View File
              </a>
            )}
          </div>
          {vra.adminNotes && (
            <div className="text-xs text-emerald-900 bg-white/70 p-2 rounded-lg border border-emerald-100">
              <span className="font-semibold block text-[10px] text-emerald-700 uppercase tracking-wider">
                Prescription Dosage & Notes:
              </span>
              {vra.adminNotes}
            </div>
          )}
        </div>
      )}

      <div className="space-y-3 pt-1">
        <label className="block text-xs font-semibold text-slate-700">
          {isUploaded ? "Replace / Update Prescription File:" : "Upload Prescription File for Pilot:"}
        </label>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all rounded-xl p-4 text-center cursor-pointer select-none"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.tif,.tiff,.geojson,.zip"
            onChange={handleFileChange}
            className="hidden"
          />
          <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
          <p className="text-xs font-medium text-slate-700">
            {selectedFile ? (
              <span className="text-emerald-700 font-semibold">{selectedFile.name} (Ready to send)</span>
            ) : (
              "Click to browse or drag & drop NDVI / VRA map file"
            )}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Supports PDF, GeoTIFF, PNG, JPG, GeoJSON, or ZIP</p>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Prescription Notes & Application Instructions:
          </label>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="e.g. Zone 1 (High NDVI): 25 L/ha, Zone 2: 40 L/ha, Zone 3: 55 L/ha. Spray height: 3.5m."
            rows={2}
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {errorMessage && (
          <div className="p-2.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs">
            {errorMessage}
          </div>
        )}

        {uploadSuccess && (
          <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Prescription map successfully uploaded and delivered to Pilot!
          </div>
        )}

        <button
          type="button"
          disabled={isLoading || (!selectedFile && !fileBase64)}
          onClick={handleUpload}
          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium rounded-xl text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Delivering File to Pilot...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send VRA Map to Pilot</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
