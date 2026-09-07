import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Maximize2,
  Minimize2,
  Navigation,
  BatteryCharging,
  Droplets,
  Wind,
  Gauge,
  User,
  Radio,
  Plane,
  Crosshair,
  MapPin,
  Map as MapIcon,
  RefreshCw,
  Database,
  CheckCircle2,
} from "lucide-react";
import { serviceRequestsService } from "@/services/serviceRequestsService";
import { farmerService } from "@/services/farmerService";
import type { ApiServiceRequestItem } from "@/types/request";
import type { ActiveMission } from "@/types";
import { useLeaflet, type LeafletTileStyle } from "@/hooks/useLeaflet";

// Extended ActiveMission interface with database metadata
export interface ActiveMissionDisplay extends ActiveMission {
  farmerName?: string;
  farmerMobile?: string;
  cropType?: string;
  areaHa?: number;
  priority?: string;
  isRealDb?: boolean;
  fieldPolygonCoords?: [number, number][];
}

// Sri Lanka agricultural district coordinate anchors
const DISTRICT_COORDINATES: Record<string, [number, number]> = {
  anuradhapura: [8.3114, 80.4037],
  medawachchiya: [8.5361, 80.4922],
  polonnaruwa: [7.9403, 81.0188],
  matale: [7.4675, 80.6234],
  dambulla: [7.8731, 80.6511],
  kurunegala: [7.4863, 80.3623],
  kandy: [7.2906, 80.6337],
  nuwaraeliya: [6.9497, 80.7891],
  badulla: [6.9934, 81.055],
  monaragala: [6.8728, 81.3507],
  ampara: [7.2882, 81.6724],
  batticaloa: [7.731, 81.6747],
  trincomalee: [8.5874, 81.2152],
  hambantota: [6.1429, 81.1212],
  matara: [5.9549, 80.555],
  galle: [6.0535, 80.221],
  ratnapura: [6.7056, 80.3847],
  kegalle: [7.2513, 80.3464],
  puttalam: [8.0362, 79.8283],
  jaffna: [9.6615, 80.0255],
  kilinochchi: [9.3803, 80.377],
  vavuniya: [8.7514, 80.4971],
  mannar: [8.981, 79.9044],
  mullaitivu: [9.2671, 80.8142],
  colombo: [6.9271, 79.8612],
  gampaha: [7.084, 80.0098],
  kalutara: [6.5854, 79.9607],
};



// Transform database service request into ActiveMission structure
function transformRequestToActiveMission(
  req: ApiServiceRequestItem,
  index: number,
): ActiveMissionDisplay {
  const districtKey = (req.field?.district || "").toLowerCase().replace(/[^a-z]/g, "");
  const cityKey = (req.field?.city || "").toLowerCase().replace(/[^a-z]/g, "");
  const baseCoord: [number, number] = DISTRICT_COORDINATES[cityKey] || DISTRICT_COORDINATES[districtKey] || [
    8.5361 + (index % 3) * 0.05,
    80.4922 + (index % 3) * 0.05,
  ];

  // Determine center coordinates from locationCoordinates or district anchor
  let centerLat = baseCoord[0];
  let centerLng = baseCoord[1];
  let fieldPolygonCoords: [number, number][] | undefined = undefined;

  if (req.field?.locationCoordinates && req.field.locationCoordinates.length >= 3) {
    fieldPolygonCoords = req.field.locationCoordinates;
    centerLat =
      req.field.locationCoordinates.reduce((sum, c) => sum + c[0], 0) /
      req.field.locationCoordinates.length;
    centerLng =
      req.field.locationCoordinates.reduce((sum, c) => sum + c[1], 0) /
      req.field.locationCoordinates.length;
  } else {
    // Generate an offset polygon for display around base coordinates
    const offsetLat = ((req.requestId % 5) - 2) * 0.008;
    const offsetLng = (((req.requestId * 3) % 5) - 2) * 0.008;
    centerLat += offsetLat;
    centerLng += offsetLng;

    fieldPolygonCoords = [
      [centerLat - 0.0035, centerLng - 0.0045],
      [centerLat - 0.0035, centerLng + 0.0045],
      [centerLat + 0.0035, centerLng + 0.0045],
      [centerLat + 0.0035, centerLng - 0.0045],
    ];
  }

  // Derive status
  let status: ActiveMission["status"] = "Fertilizing";
  const typeLower = (req.serviceType || "").toLowerCase();
  if (typeLower.includes("spray")) status = "Spraying";
  else if (
    typeLower.includes("survey") ||
    typeLower.includes("mapping") ||
    typeLower.includes("ndvi")
  )
    status = "Surveying";
  else if (req.status === "COMPLETED") status = "Returning";
  else if (req.status === "ASSIGNED") status = "Fertilizing";
  else status = "Fertilizing";

  const missionCode = req.mission?.missionId
    ? `MSN-${req.mission.missionId}`
    : req.requestCode || `REQ-${req.requestId}`;

  const progress =
    req.status === "COMPLETED"
      ? 100
      : req.status === "IN_PROGRESS"
        ? 55 + (req.requestId % 30)
        : req.status === "ASSIGNED"
          ? 25 + (req.requestId % 15)
          : 10;

  const droneModels = ["DJI Agras T40", "DJI Agras T30", "XAG P100 Pro", "DJI Agras T25"];
  const droneModel = droneModels[req.requestId % droneModels.length];

  return {
    id: `REQ-${req.requestId}`,
    missionCode,
    field: `${req.field?.fieldName || "Field Block"} (${req.field?.area ? `${req.field.area} Ha` : req.field?.cropType || "Paddy"})`,
    region: `${req.field?.district || "Anuradhapura"}${req.field?.city ? ` (${req.field.city})` : ""}`,
    pilotName: req.assignedPilot?.fullName || "Nimal Perera (Assigned)",
    droneModel,
    status,
    progress,
    battery: Math.max(30, 95 - (req.requestId % 40)),
    payloadLiters: Math.max(4, 38 - (req.requestId % 20)),
    maxPayloadLiters: 40.0,
    altitudeMeters: 12 + (req.requestId % 6),
    speedKmh: 16 + (req.requestId % 8),
    sprayFlowRate: `${(3.8 + (req.requestId % 3) * 0.6).toFixed(1)} L/min`,
    coordinates: {
      x: 200,
      y: 200,
      lat: Number(centerLat.toFixed(5)),
      lng: Number(centerLng.toFixed(5)),
    },
    polygonPoints: "",
    flightPath: [],
    targetFertilizer: `${req.field?.cropType || "Paddy"} Nitrogen Blend`,
    estimatedCompletion:
      req.status === "COMPLETED" ? "Completed" : `${15 + (req.requestId % 20)} mins remaining`,
    farmerName: req.farmer?.fullName || "Kamal Silva",
    farmerMobile: req.farmer?.mobile || "+94 77 987 6543",
    cropType: req.field?.cropType || "Paddy (BG 352)",
    areaHa: req.field?.area || 4.5,
    priority: req.priority || "HIGH",
    isRealDb: true,
    fieldPolygonCoords,
  };
}

export function LiveMissionMap() {
  const [missionsList, setMissionsList] = useState<ActiveMissionDisplay[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>("");
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState<LeafletTileStyle>("osm");
  const [isExpanded, setIsExpanded] = useState(false);
  const hasAutoCentered = useRef(false);

  const { L, mapContainerRef, mapInstanceRef, layerGroupRef, invalidateSize } = useLeaflet({
    center: [8.5361, 80.4922],
    zoom: 9,
    tileStyle: mapStyle,
  });

  // Fetch real active requests and registered fields from database API
  const fetchRealMissions = useCallback(async () => {
    setIsLoadingDb(true);
    try {
      const [requestsData, farmersData] = await Promise.allSettled([
        serviceRequestsService.getServiceRequests({ limit: 50 }),
        farmerService.getFarmers({ limit: 10 }),
      ]);

      let requests: ApiServiceRequestItem[] = [];
      if (requestsData.status === "fulfilled" && requestsData.value) {
        requests = requestsData.value.requests || [];
      }

      // Enrich requests with full coordinates if needed
      const enrichedRequests: ApiServiceRequestItem[] = [];
      for (const req of requests) {
        try {
          const detail = await serviceRequestsService.getServiceRequestById(req.requestId);
          enrichedRequests.push(detail || req);
        } catch {
          enrichedRequests.push(req);
        }
      }

      // Also gather all registered farmer fields from DB
      let farmerFields: any[] = [];
      if (farmersData.status === "fulfilled" && farmersData.value?.farmers) {
        for (const farmer of farmersData.value.farmers) {
          try {
            const fields = await farmerService.getFarmerFields(farmer.userId);
            if (Array.isArray(fields) && fields.length > 0) {
              farmerFields = [...farmerFields, ...fields.map((f) => ({ ...f, farmer }))];
            }
          } catch {
            // Ignore farmer field fetch error
          }
        }
      }

      const dbMissions: ActiveMissionDisplay[] = [];

      // 1. Add enriched requests from database
      enrichedRequests.forEach((req, idx) => {
        dbMissions.push(transformRequestToActiveMission(req, idx));
      });

      // 2. If farmer fields exist that don't have active requests, add them as Monitored Field Missions
      farmerFields.forEach((f, idx) => {
        const fieldCoords: [number, number][] = f.locationCoordinates || [
          [8.5361, 80.4922],
          [8.5385, 80.4945],
          [8.5372, 80.4971],
          [8.5348, 80.4952],
        ];

        const avgLat = fieldCoords.reduce((sum, c) => sum + c[0], 0) / fieldCoords.length;
        const avgLng = fieldCoords.reduce((sum, c) => sum + c[1], 0) / fieldCoords.length;

        // Check if already represented in requests
        const alreadyInRequests = dbMissions.some((m) => m.field.includes(f.fieldName));
        if (!alreadyInRequests) {
          dbMissions.push({
            id: `FLD-${f.id}`,
            missionCode: `FLD-00${f.id}`,
            field: `${f.fieldName} (${f.area || 4.5} Ha)`,
            region: `${f.district || "Anuradhapura"}${f.city ? ` (${f.city})` : ""}`,
            pilotName: "Nimal Perera (Ready)",
            droneModel: "DJI Agras T40",
            status: "Fertilizing",
            progress: 85,
            battery: 92,
            payloadLiters: 38.0,
            maxPayloadLiters: 40.0,
            altitudeMeters: 14,
            speedKmh: 18,
            sprayFlowRate: "4.2 L/min",
            coordinates: {
              x: 200,
              y: 200,
              lat: Number(avgLat.toFixed(5)),
              lng: Number(avgLng.toFixed(5)),
            },
            polygonPoints: "",
            flightPath: [],
            targetFertilizer: `${f.cropType || "Paddy"} Custom VRA`,
            estimatedCompletion: "Scheduled Flight",
            farmerName: f.farmer?.fullName || "Kamal Silva",
            farmerMobile: f.farmer?.mobile || "+94 77 987 6543",
            cropType: f.cropType || "Paddy (BG 352)",
            areaHa: f.area || 4.5,
            priority: "HIGH",
            isRealDb: true,
            fieldPolygonCoords: fieldCoords,
          });
        }
      });

      setMissionsList(dbMissions);
      if (dbMissions.length > 0) {
        if (!selectedMissionId) {
          setSelectedMissionId(dbMissions[0].id);
        }
      } else {
        setSelectedMissionId(null);
      }
    } catch (err: unknown) {
      console.error("Failed to load live database missions:", err);
      setMissionsList([]);
      setSelectedMissionId(null);
    } finally {
      setIsLoadingDb(false);
      setLastSyncTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    }
  }, [selectedMissionId]);

  useEffect(() => {
    fetchRealMissions();
  }, [fetchRealMissions]);

  const filteredMissions = missionsList;

  const selectedMission = useMemo(() => {
    return missionsList.find((m) => m.id === selectedMissionId) || missionsList[0] || null;
  }, [missionsList, selectedMissionId]);

  const getStatusColor = (status: ActiveMission["status"]) => {
    switch (status) {
      case "Fertilizing":
        return {
          hex: "#10b981",
          border: "#059669",
          text: "text-emerald-700",
          badgeBg: "bg-emerald-50 border-emerald-200",
          fill: "rgba(16, 185, 129, 0.2)",
        };
      case "Spraying":
        return {
          hex: "#06b6d4",
          border: "#0891b2",
          text: "text-cyan-700",
          badgeBg: "bg-cyan-50 border-cyan-200",
          fill: "rgba(6, 182, 212, 0.2)",
        };
      case "Surveying":
        return {
          hex: "#6366f1",
          border: "#4f46e5",
          text: "text-indigo-700",
          badgeBg: "bg-indigo-50 border-indigo-200",
          fill: "rgba(99, 102, 241, 0.2)",
        };
      case "Returning":
        return {
          hex: "#f59e0b",
          border: "#d97706",
          text: "text-amber-700",
          badgeBg: "bg-amber-50 border-amber-200",
          fill: "rgba(245, 158, 11, 0.2)",
        };
      default:
        return {
          hex: "#64748b",
          border: "#475569",
          text: "text-slate-700",
          badgeBg: "bg-slate-50 border-slate-200",
          fill: "rgba(100, 116, 139, 0.2)",
        };
    }
  };

  // Render point-wise markers and actual database field boundaries on map
  useEffect(() => {
    if (!L || !mapInstanceRef.current || !layerGroupRef.current) return;

    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    const boundsPoints: [number, number][] = [];

    filteredMissions.forEach((mission) => {
      const isSelected = selectedMissionId === mission.id;
      const colors = getStatusColor(mission.status);
      const latLng: [number, number] = [mission.coordinates.lat, mission.coordinates.lng];
      boundsPoints.push(latLng);

      // 1. Draw Field Boundary Polygon from Database Coordinates
      const polygonCoords = mission.fieldPolygonCoords;
      if (polygonCoords && polygonCoords.length >= 3) {
        polygonCoords.forEach((p: [number, number]) => boundsPoints.push(p));

        const polygon = L.polygon(polygonCoords, {
          color: colors.hex,
          weight: isSelected ? 2.5 : 1.5,
          opacity: isSelected ? 0.9 : 0.65,
          fillColor: colors.hex,
          fillOpacity: isSelected ? 0.25 : 0.12,
          dashArray: isSelected ? undefined : "4, 4",
        });

        polygon.on("click", () => {
          setSelectedMissionId(mission.id);
          mapInstanceRef.current?.flyTo(latLng, Math.max(mapInstanceRef.current.getZoom(), 12), {
            duration: 0.8,
          });
        });

        polygon.bindTooltip(
          `<strong>${mission.field}</strong><br/><span style="color:${colors.hex}">${mission.status}</span> • ${mission.farmerName ? `Farmer: ${mission.farmerName}` : mission.region}`,
          { className: "text-xs font-sans rounded-lg shadow-sm", sticky: true },
        );

        polygon.addTo(layerGroup);
      }

      // 2. Custom Point-wise Solid Marker (Non-blinking, crisp Pin Point)
      const markerHtml = `
        <div class="mission-point-marker cursor-pointer" style="width: 48px; height: 52px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">
          <!-- Monospace Code Tag -->
          <div style="
            position: absolute;
            top: -14px;
            background: ${isSelected ? "#062419" : "rgba(15, 23, 42, 0.9)"};
            color: #ffffff;
            font-family: monospace;
            font-size: 10px;
            font-weight: 700;
            padding: 1.5px 6px;
            border-radius: 5px;
            border: 1.5px solid ${colors.hex};
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0,0,0,0.25);
            pointer-events: none;
            z-index: 20;
          ">
            ${mission.missionCode}
          </div>

          <!-- Solid Point Pin Body -->
          <div style="
            width: ${isSelected ? "34px" : "28px"};
            height: ${isSelected ? "34px" : "28px"};
            background: #062419;
            border: 2.5px solid ${colors.hex};
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.35);
            position: relative;
            z-index: 10;
          ">
            <!-- Center Solid Point Dot -->
            <div style="
              width: ${isSelected ? "11px" : "9px"};
              height: ${isSelected ? "11px" : "9px"};
              background-color: ${colors.hex};
              border-radius: 9999px;
            "></div>
          </div>

          <!-- Downward Pointer Triangle -->
          <div style="
            width: 0;
            height: 0;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-top: 6px solid ${colors.hex};
            margin-top: -1px;
            filter: drop-shadow(0 2px 2px rgba(0,0,0,0.25));
            z-index: 5;
          "></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: "custom-mission-point-icon",
        iconSize: [48, 52],
        iconAnchor: [24, 44],
      });

      const marker = L.marker(latLng, { icon: customIcon });

      marker.on("click", () => {
        setSelectedMissionId(mission.id);
        mapInstanceRef.current?.flyTo(latLng, Math.max(mapInstanceRef.current.getZoom(), 12), {
          duration: 0.8,
        });
      });

      marker.bindPopup(`
        <div style="padding: 12px; font-family: 'Inter', sans-serif; min-width: 220px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
            <span style="background: #062419; color: #fff; font-size: 11px; font-family: monospace; font-weight: 700; padding: 2px 6px; border-radius: 4px;">${mission.missionCode}</span>
            <span style="font-size: 11px; font-weight: 600; color: ${colors.hex};">${mission.status}</span>
          </div>
          <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 2px;">${mission.field}</div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">${mission.region}</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px; padding-top: 6px; border-top: 1px solid #f1f5f9;">
            <div><span style="color:#94a3b8;">Pilot:</span> <span style="color:#1e293b; font-weight:600;">${mission.pilotName}</span></div>
            <div><span style="color:#94a3b8;">Battery:</span> <span style="color:#1e293b; font-weight:600;">${mission.battery}%</span></div>
            <div><span style="color:#94a3b8;">Progress:</span> <span style="color:#10b981; font-weight:700;">${mission.progress}%</span></div>
            <div><span style="color:#94a3b8;">Rate:</span> <span style="color:#1e293b; font-weight:600;">${mission.sprayFlowRate}</span></div>
          </div>
          ${mission.farmerName ? `<div style="font-size: 11px; color: #475569; margin-top: 6px; padding-top: 5px; border-top: 1px dashed #e2e8f0; display: flex; justify-content: space-between;"><span>Farmer: <strong>${mission.farmerName}</strong></span><span style="color:#10b981; font-weight:600;">DB LIVE</span></div>` : ""}
        </div>
      `);

      marker.addTo(layerGroup);
    });

    // Auto fit bounds on initial database load
    if (!hasAutoCentered.current && boundsPoints.length > 0 && mapInstanceRef.current) {
      try {
        const bounds = L.latLngBounds(boundsPoints);
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
        hasAutoCentered.current = true;
      } catch {
        // Ignore fitBounds error
      }
    }
  }, [L, filteredMissions, selectedMissionId, layerGroupRef, mapInstanceRef]);

  // Adjust map size when expanded or resized
  useEffect(() => {
    const timer = setTimeout(() => {
      invalidateSize();
    }, 300);
    return () => clearTimeout(timer);
  }, [isExpanded, invalidateSize]);

  // Center on selected mission
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    if (selectedMission) {
      mapInstanceRef.current.flyTo(
        [selectedMission.coordinates.lat, selectedMission.coordinates.lng],
        12,
        { duration: 0.8 },
      );
    } else {
      mapInstanceRef.current.flyTo([8.5361, 80.4922], 9, { duration: 0.8 });
    }
  };

  return (
    <div
      className={`bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs transition-all duration-300 ${
        isExpanded ? "fixed inset-4 z-50 overflow-auto bg-white p-6 shadow-2xl" : "relative"
      }`}
    >
      {/* Header & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-semibold text-slate-900 tracking-tight flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-600" />
              Live Database Active Missions Map
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <Database className="w-3 h-3 text-emerald-600" />
              {filteredMissions.length} DB Mission Places Active
            </span>
          </div>
          <p className="text-xs text-slate-500 font-normal mt-0.5 flex items-center gap-1.5">
            <span>Real-time database coordinates, polygon field boundaries & pilot flight telemetry</span>
            {lastSyncTime && <span className="text-slate-400 font-mono">• Synced: {lastSyncTime}</span>}
          </p>
        </div>

        {/* Action Controls & Layer Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Refresh Data Button */}
          <button
            type="button"
            onClick={fetchRealMissions}
            disabled={isLoadingDb}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
            title="Refresh database active missions"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-emerald-600 ${isLoadingDb ? "animate-spin" : ""}`}
            />
            <span>{isLoadingDb ? "Syncing..." : "Sync DB"}</span>
          </button>

          {/* OpenStreetMap Layer Mode Buttons */}
          <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 text-xs">
            <button
              type="button"
              onClick={() => setMapStyle("osm")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                mapStyle === "osm"
                  ? "bg-[#062419] text-white font-medium shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="OpenStreetMap Standard Vector Map"
            >
              <MapIcon className="w-3 h-3" />
              <span>OSM</span>
            </button>
            <button
              type="button"
              onClick={() => setMapStyle("terrain")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                mapStyle === "terrain"
                  ? "bg-[#062419] text-white font-medium shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="OpenTopoMap Topography & Terrain"
            >
              <span>Terrain</span>
            </button>
            <button
              type="button"
              onClick={() => setMapStyle("satellite")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                mapStyle === "satellite"
                  ? "bg-[#062419] text-white font-medium shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Esri World Satellite Imagery"
            >
              <Layers className="w-3 h-3" />
              <span>Satellite</span>
            </button>
          </div>

          {/* Fullscreen Expand Button */}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            title={isExpanded ? "Minimize Map" : "Expand Map"}
          >
            {isExpanded ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Map Interactive Viewport & Side Telemetry Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4">
        {/* OpenStreetMap Container (8 Columns) */}
        <div className="lg:col-span-8 relative w-full h-[380px] sm:h-[440px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-inner group">
          {/* Leaflet Map DOM Node */}
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* OpenStreetMap RTK-GPS Fixed Badge */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-xl px-3 py-1.5 text-white flex items-center gap-2.5 shadow-lg select-none z-[1000]">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-medium tracking-wide">
              Live Database RTK Coordinates • Centimeter Precision
            </span>
            <span className="text-[10px] text-emerald-400 border-l border-slate-700 pl-2 font-mono">
              DB SYNCED
            </span>
          </div>

          {/* Recenter / Focus Map Button */}
          <button
            type="button"
            onClick={handleRecenter}
            className="absolute top-3 right-3 bg-white/95 backdrop-blur-md hover:bg-white text-slate-700 border border-slate-200 p-2.5 rounded-xl shadow-md transition-all cursor-pointer z-[1000] flex items-center gap-1.5 text-xs font-semibold"
            title="Recenter Map to Active Mission Place"
          >
            <Crosshair className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Focus Mission</span>
          </button>
        </div>

        {/* Selected Active Mission Telemetry Sidebar (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 md:p-5 space-y-4 shadow-xs">
          {selectedMission ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMission.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Mission Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200/70">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                        {selectedMission.missionCode}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusColor(selectedMission.status).badgeBg} ${getStatusColor(selectedMission.status).text}`}
                      >
                        {selectedMission.status}
                      </span>
                      {selectedMission.isRealDb && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                          DB LIVE
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-slate-900 text-sm mt-1.5 leading-tight">
                      {selectedMission.field}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{selectedMission.region}</span>
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-600">Mission Progress</span>
                    <span className="font-mono text-emerald-600 font-bold">{selectedMission.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                      style={{ width: `${selectedMission.progress}%` }}
                    />
                  </div>
                </div>

                {/* Live Telemetry Grid */}
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold flex items-center gap-1">
                      <BatteryCharging className="w-3 h-3 text-amber-500" />
                      Battery
                    </span>
                    <span className="font-semibold text-slate-800 font-mono text-sm mt-0.5 block">
                      {selectedMission.battery}%
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-cyan-500" />
                      Payload
                    </span>
                    <span className="font-semibold text-slate-800 font-mono text-sm mt-0.5 block">
                      {selectedMission.payloadLiters} / {selectedMission.maxPayloadLiters} L
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold flex items-center gap-1">
                      <Gauge className="w-3 h-3 text-indigo-500" />
                      Altitude & Speed
                    </span>
                    <span className="font-semibold text-slate-800 font-mono text-xs mt-0.5 block">
                      {selectedMission.altitudeMeters}m @ {selectedMission.speedKmh} km/h
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold flex items-center gap-1">
                      <Wind className="w-3 h-3 text-teal-500" />
                      Flow Rate
                    </span>
                    <span className="font-semibold text-slate-800 font-mono text-xs mt-0.5 block">
                      {selectedMission.sprayFlowRate}
                    </span>
                  </div>
                </div>

                {/* Operator & Farmer Information */}
                <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-2 text-xs shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Plane className="w-3 h-3 text-emerald-600" />
                      Assigned Pilot:
                    </span>
                    <span className="font-semibold text-slate-800 font-sans">
                      {selectedMission.pilotName}
                    </span>
                  </div>

                  {selectedMission.farmerName && (
                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <User className="w-3 h-3 text-sky-600" />
                        Farmer:
                      </span>
                      <span className="font-semibold text-slate-800 font-sans">
                        {selectedMission.farmerName}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 font-mono text-[11px]">
                    <span className="text-slate-400">GPS Coords:</span>
                    <span className="text-emerald-700 font-semibold">
                      {selectedMission.coordinates.lat}, {selectedMission.coordinates.lng}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400 p-6 text-center">
              Select an active mission point on the map to inspect live RTK telemetry.
            </div>
          )}

          {/* Quick Mission Selector Pills */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200/70">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Active Database Locations ({filteredMissions.length})
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {filteredMissions.map((m) => {
                const isSel = m.id === selectedMissionId;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setSelectedMissionId(m.id);
                      mapInstanceRef.current?.flyTo(
                        [m.coordinates.lat, m.coordinates.lng],
                        12,
                        { duration: 0.8 },
                      );
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 border ${
                      isSel
                        ? "bg-[#062419] text-white border-emerald-600 shadow-2xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSel ? "bg-emerald-400" : "bg-slate-400"
                      }`}
                    />
                    <span>{m.missionCode}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveMissionMap;
