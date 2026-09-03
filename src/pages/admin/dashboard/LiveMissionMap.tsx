import { useState, useMemo, useEffect, useCallback } from "react";
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
} from "lucide-react";
import { mockActiveMissions } from "@/data/mockData";
import { serviceRequestsService } from "@/services/serviceRequestsService";
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
  polonnaruwa: [7.9403, 81.0188],
  matale: [7.4675, 80.6234],
  dambulla: [7.8731, 80.6511],
  kurunegala: [7.4863, 80.3623],
  kandy: [7.2906, 80.6337],
  nuwaraeliya: [6.9497, 80.7891],
  badulla: [6.9934, 81.0550],
  monaragala: [6.8728, 81.3507],
  ampara: [7.2882, 81.6724],
  batticaloa: [7.7310, 81.6747],
  trincomalee: [8.5874, 81.2152],
  hambantota: [6.1429, 81.1212],
  matara: [5.9549, 80.5550],
  galle: [6.0535, 80.2210],
  ratnapura: [6.7056, 80.3847],
  kegalle: [7.2513, 80.3464],
  puttalam: [8.0362, 79.8283],
  jaffna: [9.6615, 80.0255],
  kilinochchi: [9.3803, 80.3770],
  vavuniya: [8.7514, 80.4971],
  mannar: [8.9810, 79.9044],
  mullaitivu: [9.2671, 80.8142],
  colombo: [6.9271, 79.8612],
  gampaha: [7.0840, 80.0098],
  kalutara: [6.5854, 79.9607],
};

// Default geographic field polygon vertices
const DEFAULT_GEO_BOUNDS: Record<string, [number, number][]> = {
  "MSN-401": [
    [8.3155, 80.3985],
    [8.3168, 80.4092],
    [8.3065, 80.4105],
    [8.3052, 80.3998],
  ],
  "MSN-402": [
    [7.9455, 81.0125],
    [7.9472, 81.0265],
    [7.9348, 81.0278],
    [7.9332, 81.0138],
  ],
  "MSN-403": [
    [7.8778, 80.6455],
    [7.8792, 80.6575],
    [7.8682, 80.6588],
    [7.8668, 80.6468],
  ],
  "MSN-404": [
    [7.4912, 80.3565],
    [7.4928, 80.3695],
    [7.4808, 80.3708],
    [7.4792, 80.3578],
  ],
  "MSN-405": [
    [7.4722, 80.6178],
    [7.4735, 80.6298],
    [7.4622, 80.6312],
    [7.4608, 80.6192],
  ],
};

// Transform database service request into ActiveMission structure
function transformRequestToActiveMission(req: ApiServiceRequestItem, index: number): ActiveMissionDisplay {
  const districtKey = (req.field?.district || "").toLowerCase().replace(/[^a-z]/g, "");
  const baseCoord: [number, number] =
    DISTRICT_COORDINATES[districtKey] || [7.8731 + (index % 3) * 0.15, 80.6511 + (index % 3) * 0.15];

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
    // Generate an offset polygon for display
    const offsetLat = ((req.requestId % 5) - 2) * 0.012;
    const offsetLng = (((req.requestId * 3) % 5) - 2) * 0.012;
    centerLat += offsetLat;
    centerLng += offsetLng;

    fieldPolygonCoords = [
      [centerLat - 0.004, centerLng - 0.005],
      [centerLat - 0.004, centerLng + 0.005],
      [centerLat + 0.004, centerLng + 0.005],
      [centerLat + 0.004, centerLng - 0.005],
    ];
  }

  // Derive status
  let status: ActiveMission["status"] = "Fertilizing";
  const typeLower = (req.serviceType || "").toLowerCase();
  if (typeLower.includes("spray")) status = "Spraying";
  else if (typeLower.includes("survey") || typeLower.includes("mapping") || typeLower.includes("ndvi"))
    status = "Surveying";
  else if (req.status === "COMPLETED") status = "Returning";
  else status = "Fertilizing";

  const missionCode = req.mission?.missionId
    ? `MSN-${req.mission.missionId}`
    : req.requestCode || `REQ-${req.requestId}`;

  const progress =
    req.status === "COMPLETED"
      ? 100
      : req.status === "IN_PROGRESS"
        ? 45 + (req.requestId % 40)
        : 15;

  const droneModels = ["DJI Agras T40", "DJI Agras T30", "XAG P100 Pro", "DJI Agras T25"];
  const droneModel = droneModels[req.requestId % droneModels.length];

  return {
    id: `REQ-${req.requestId}`,
    missionCode,
    field: `${req.field?.fieldName || "Field Block"} (${req.field?.area ? `${req.field.area} Ha` : req.field?.cropType || "Paddy"})`,
    region: `${req.field?.district || "Sri Lanka"}${req.field?.city ? ` (${req.field.city})` : ""}`,
    pilotName: req.assignedPilot?.fullName || "Assigned Pilot",
    droneModel,
    status,
    progress,
    battery: Math.max(20, 95 - (req.requestId % 50)),
    payloadLiters: Math.max(2, 35 - (req.requestId % 25)),
    maxPayloadLiters: 40.0,
    altitudeMeters: 12 + (req.requestId % 8),
    speedKmh: 16 + (req.requestId % 10),
    sprayFlowRate: `${(3.5 + (req.requestId % 3) * 0.7).toFixed(1)} L/min`,
    coordinates: {
      x: 200,
      y: 200,
      lat: centerLat,
      lng: centerLng,
    },
    polygonPoints: "",
    flightPath: [],
    targetFertilizer: `${req.field?.cropType || "Crop"} Nutrient Blend`,
    estimatedCompletion: req.status === "COMPLETED" ? "Completed" : `${15 + (req.requestId % 25)} mins remaining`,
    farmerName: req.farmer?.fullName,
    farmerMobile: req.farmer?.mobile,
    cropType: req.field?.cropType,
    areaHa: req.field?.area,
    priority: req.priority,
    isRealDb: true,
    fieldPolygonCoords,
  };
}

export function LiveMissionMap() {
  const [missionsList, setMissionsList] = useState<ActiveMissionDisplay[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState(true);
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("");
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [mapStyle, setMapStyle] = useState<LeafletTileStyle>("osm");
  const [isExpanded, setIsExpanded] = useState(false);

  const { L, mapContainerRef, mapInstanceRef, layerGroupRef, invalidateSize } = useLeaflet({
    center: [7.8731, 80.6511],
    zoom: 8,
    tileStyle: mapStyle,
  });

  // Fetch real active requests from database API
  const fetchRealMissions = useCallback(async () => {
    setIsLoadingDb(true);
    try {
      const data = await serviceRequestsService.getServiceRequests({ limit: 50 });
      const requests = data.requests || [];

      // Filter for active or scheduled requests (IN_PROGRESS, ASSIGNED, or all recent)
      const activeRequests = requests.filter(
        (r) => r.status === "IN_PROGRESS" || r.status === "ASSIGNED" || r.status === "COMPLETED",
      );

      const targetList = activeRequests.length > 0 ? activeRequests : requests;

      if (targetList.length > 0) {
        const transformed = targetList.map((req, idx) => transformRequestToActiveMission(req, idx));
        setMissionsList(transformed);
        setIsDbConnected(true);
        if (!selectedMissionId && transformed.length > 0) {
          setSelectedMissionId(transformed[0].id);
        }
      } else {
        // Fallback to mock active missions if database table is empty
        const fallback = mockActiveMissions.map((m) => ({
          ...m,
          isRealDb: false,
          fieldPolygonCoords: DEFAULT_GEO_BOUNDS[m.id],
        }));
        setMissionsList(fallback);
        setIsDbConnected(false);
        if (!selectedMissionId && fallback.length > 0) {
          setSelectedMissionId(fallback[0].id);
        }
      }
    } catch {
      // Backend not running or offline: fallback to mock missions
      const fallback = mockActiveMissions.map((m) => ({
        ...m,
        isRealDb: false,
        fieldPolygonCoords: DEFAULT_GEO_BOUNDS[m.id],
      }));
      setMissionsList(fallback);
      setIsDbConnected(false);
      if (!selectedMissionId && fallback.length > 0) {
        setSelectedMissionId(fallback[0].id);
      }
    } finally {
      setIsLoadingDb(false);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }
  }, [selectedMissionId]);

  useEffect(() => {
    fetchRealMissions();
  }, [fetchRealMissions]);

  const filteredMissions = useMemo(() => {
    return missionsList.filter((m) => {
      if (activeFilter === "All") return true;
      return m.status === activeFilter;
    });
  }, [missionsList, activeFilter]);

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

  // Render point-wise markers (without blinking) and field boundaries on map
  useEffect(() => {
    if (!L || !mapInstanceRef.current || !layerGroupRef.current) return;

    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    filteredMissions.forEach((mission) => {
      const isSelected = selectedMissionId === mission.id;
      const colors = getStatusColor(mission.status);
      const latLng: [number, number] = [mission.coordinates.lat, mission.coordinates.lng];

      // 1. Draw Field Boundary Polygon
      const polygonCoords = mission.fieldPolygonCoords || DEFAULT_GEO_BOUNDS[mission.id];
      if (polygonCoords && polygonCoords.length >= 3) {
        const polygon = L.polygon(polygonCoords, {
          color: colors.hex,
          weight: isSelected ? 2.5 : 1.5,
          opacity: isSelected ? 0.9 : 0.6,
          fillColor: colors.hex,
          fillOpacity: isSelected ? 0.22 : 0.08,
          dashArray: isSelected ? undefined : "4, 4",
        });

        polygon.on("click", () => {
          setSelectedMissionId(mission.id);
          mapInstanceRef.current?.flyTo(latLng, Math.max(mapInstanceRef.current.getZoom(), 11), {
            duration: 0.8,
          });
        });

        polygon.bindTooltip(
          `<strong>${mission.field}</strong><br/><span style="color:${colors.hex}">${mission.status}</span>`,
          { className: "text-xs font-sans rounded-lg shadow-sm", sticky: true },
        );

        polygon.addTo(layerGroup);
      }

      // 2. Custom Point-wise Solid Marker (Non-blinking, crisp Pin Point)
      const markerHtml = `
        <div class="mission-point-marker cursor-pointer" style="width: 44px; height: 50px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">
          <!-- Monospace Code Tag -->
          <div style="
            position: absolute;
            top: -12px;
            background: ${isSelected ? "#062419" : "rgba(15, 23, 42, 0.9)"};
            color: #ffffff;
            font-family: monospace;
            font-size: 10px;
            font-weight: 600;
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
            width: ${isSelected ? "32px" : "26px"};
            height: ${isSelected ? "32px" : "26px"};
            background: #062419;
            border: 2.5px solid ${colors.hex};
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 8px rgba(0,0,0,0.35);
            position: relative;
            z-index: 10;
          ">
            <!-- Center Solid Point Dot -->
            <div style="
              width: ${isSelected ? "10px" : "8px"};
              height: ${isSelected ? "10px" : "8px"};
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
        iconSize: [44, 50],
        iconAnchor: [22, 42],
      });

      const marker = L.marker(latLng, { icon: customIcon });

      marker.on("click", () => {
        setSelectedMissionId(mission.id);
        mapInstanceRef.current?.flyTo(latLng, Math.max(mapInstanceRef.current.getZoom(), 11), {
          duration: 0.8,
        });
      });

      marker.bindPopup(`
        <div style="padding: 12px; font-family: 'Inter', sans-serif; min-width: 200px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
            <span style="background: #062419; color: #fff; font-size: 11px; font-family: monospace; padding: 2px 6px; border-radius: 4px;">${mission.missionCode}</span>
            <span style="font-size: 11px; font-weight: 500; color: ${colors.hex};">${mission.status}</span>
          </div>
          <div style="font-size: 12px; font-weight: 600; color: #0f172a; margin-bottom: 2px;">${mission.field}</div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">${mission.region}</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px; padding-top: 6px; border-top: 1px solid #f1f5f9;">
            <div><span style="color:#94a3b8;">Pilot:</span> <span style="color:#1e293b; font-weight:500;">${mission.pilotName}</span></div>
            <div><span style="color:#94a3b8;">Battery:</span> <span style="color:#1e293b; font-weight:500;">${mission.battery}%</span></div>
            <div><span style="color:#94a3b8;">Progress:</span> <span style="color:#10b981; font-weight:600;">${mission.progress}%</span></div>
            <div><span style="color:#94a3b8;">Rate:</span> <span style="color:#1e293b; font-weight:500;">${mission.sprayFlowRate}</span></div>
          </div>
          ${mission.farmerName ? `<div style="font-size: 10px; color: #64748b; margin-top: 6px; padding-top: 4px; border-top: 1px dashed #e2e8f0;">Farmer: <strong>${mission.farmerName}</strong></div>` : ""}
        </div>
      `);

      marker.addTo(layerGroup);
    });
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
        11,
        { duration: 0.8 },
      );
    } else {
      mapInstanceRef.current.flyTo([7.8731, 80.6511], 8, { duration: 0.8 });
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
            <h2 className="text-base font-normal text-slate-850 tracking-tight flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-600" />
              Live Active Drone Missions Map
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {filteredMissions.length} Missions Active
            </span>
            {isDbConnected && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-normal bg-slate-100 text-slate-700 border border-slate-200">
                <Database className="w-3 h-3 text-emerald-600" />
                Live DB
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 font-normal mt-0.5 flex items-center gap-1.5">
            <span>Point-wise telemetry, precision flight boundaries & field coordinates</span>
            {lastSyncTime && <span className="text-slate-300">• Synced: {lastSyncTime}</span>}
          </p>
        </div>

        {/* Action Controls & Layer Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Refresh Database Data Button */}
          <button
            type="button"
            onClick={fetchRealMissions}
            disabled={isLoadingDb}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
            title="Refresh active missions from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isLoadingDb ? "animate-spin" : ""}`} />
            <span>Sync DB</span>
          </button>

          {/* Status Filter Pills */}
          <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 text-xs">
            {["All", "Fertilizing", "Spraying", "Surveying", "Returning"].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                  activeFilter === filter
                    ? "bg-white text-slate-850 font-normal shadow-2xs"
                    : "text-slate-500 hover:text-slate-850"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* OpenStreetMap Layer Mode Buttons */}
          <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 text-xs">
            <button
              type="button"
              onClick={() => setMapStyle("osm")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                mapStyle === "osm"
                  ? "bg-[#062419] text-white font-normal shadow-2xs"
                  : "text-slate-500 hover:text-slate-850"
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
                  ? "bg-[#062419] text-white font-normal shadow-2xs"
                  : "text-slate-500 hover:text-slate-850"
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
                  ? "bg-[#062419] text-white font-normal shadow-2xs"
                  : "text-slate-500 hover:text-slate-850"
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
            className="p-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
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
        <div className="lg:col-span-8 relative w-full h-[380px] sm:h-[430px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-inner group">
          {/* Leaflet Map DOM Node */}
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* OpenStreetMap RTK-GPS Fixed Badge */}
          <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md border border-white/10 rounded-xl px-3 py-1.5 text-white flex items-center gap-2.5 shadow-lg select-none z-[1000]">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-normal tracking-wide">
              Point-Wise RTK Fix • Accuracy ±1.5cm
            </span>
            <span className="text-[10px] text-emerald-400 border-l border-slate-700 pl-2">
              OpenStreetMap Active
            </span>
          </div>

          {/* Map Zoom & Recenter Controls */}
          <div className="absolute bottom-3 right-3 flex flex-col gap-1 select-none z-[1000]">
            <div className="bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden flex flex-col">
              <button
                type="button"
                onClick={() => mapInstanceRef.current?.zoomIn()}
                className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 text-sm font-normal border-b border-slate-100 cursor-pointer"
                title="Zoom In"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => mapInstanceRef.current?.zoomOut()}
                className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 text-sm font-normal cursor-pointer"
                title="Zoom Out"
              >
                −
              </button>
            </div>
            <button
              type="button"
              onClick={handleRecenter}
              className="w-8 h-8 bg-white border border-slate-200 rounded-xl shadow-md flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer"
              title="Recenter Map"
            >
              <Crosshair className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
        </div>

        {/* Selected Mission Live Telemetry Panel (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          {selectedMission ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMission.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs"
              >
                {/* Mission Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-[#062419] text-white">
                        {selectedMission.missionCode}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-normal border ${
                          getStatusColor(selectedMission.status).badgeBg
                        } ${getStatusColor(selectedMission.status).text}`}
                      >
                        {selectedMission.status}
                      </span>
                      {selectedMission.isRealDb && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100/70 text-emerald-800 font-medium border border-emerald-200">
                          DB
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-normal text-slate-850 mt-1">
                      {selectedMission.field}
                    </h3>
                    <p className="text-xs text-slate-400 font-normal flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {selectedMission.region}
                    </p>
                  </div>

                  {/* Progress Gauge */}
                  <div className="text-right">
                    <span className="text-sm font-normal text-emerald-600 font-mono">
                      {selectedMission.progress}%
                    </span>
                    <p className="text-[10px] text-slate-400 font-normal">Completed</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${selectedMission.progress}%` }}
                  />
                </div>

                {/* Pilot & Drone Specs */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 font-normal flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" /> Pilot
                    </span>
                    <p className="font-normal text-slate-850 mt-0.5 truncate">
                      {selectedMission.pilotName}
                    </p>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 font-normal flex items-center gap-1">
                      <Plane className="w-3 h-3 text-slate-400" /> Drone
                    </span>
                    <p className="font-normal text-slate-850 mt-0.5 truncate">
                      {selectedMission.droneModel}
                    </p>
                  </div>
                </div>

                {/* Real-time Telemetry Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Battery */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 font-normal flex items-center gap-1">
                      <BatteryCharging className="w-3 h-3 text-emerald-600" /> Battery
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-normal text-slate-850 font-mono">
                        {selectedMission.battery}%
                      </span>
                      <span className="text-[10px] text-slate-400">22.8V</span>
                    </div>
                  </div>

                  {/* Payload */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 font-normal flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-cyan-600" /> Tank Payload
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-normal text-slate-850 font-mono">
                        {selectedMission.payloadLiters}L
                      </span>
                      <span className="text-[10px] text-slate-400">
                        / {selectedMission.maxPayloadLiters}L
                      </span>
                    </div>
                  </div>

                  {/* Flight Altitude */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 font-normal flex items-center gap-1">
                      <Gauge className="w-3 h-3 text-slate-400" /> AGL Altitude
                    </span>
                    <p className="font-normal text-slate-850 mt-0.5 font-mono">
                      {selectedMission.altitudeMeters} m
                    </p>
                  </div>

                  {/* Ground Speed */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 font-normal flex items-center gap-1">
                      <Wind className="w-3 h-3 text-slate-400" /> Ground Speed
                    </span>
                    <p className="font-normal text-slate-850 mt-0.5 font-mono">
                      {selectedMission.speedKmh} km/h
                    </p>
                  </div>
                </div>

                {/* Target Fertilizer & Flow Rate Info */}
                <div className="p-3 bg-emerald-50/60 border border-emerald-200/60 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-emerald-800 font-normal">
                      Target Nutrient / Service:
                    </span>
                    <span className="text-[11px] font-mono text-emerald-700 font-medium">
                      {selectedMission.sprayFlowRate}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-normal truncate">
                    {selectedMission.targetFertilizer}
                  </p>
                  {selectedMission.farmerName && (
                    <p className="text-[10px] text-slate-600 font-normal pt-1 border-t border-emerald-200/40">
                      Farmer: <strong className="text-slate-800">{selectedMission.farmerName}</strong>
                      {selectedMission.farmerMobile ? ` • ${selectedMission.farmerMobile}` : ""}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-500 font-normal pt-0.5">
                    ⏱ {selectedMission.estimatedCompletion}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center">
              <Navigation className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs font-normal text-slate-700">Select a mission marker</p>
              <p className="text-[11px] text-slate-400 font-normal mt-0.5">
                Click any point pin on the OpenStreetMap map to inspect live telemetry
              </p>
            </div>
          )}

          {/* Quick Mission Roster Strip */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-normal text-slate-400 uppercase tracking-wider block">
              Active Missions Roster ({missionsList.length})
            </span>
            <div className="grid grid-cols-5 gap-1.5 max-h-24 overflow-y-auto pr-0.5">
              {missionsList.slice(0, 10).map((m) => {
                const isSelected = selectedMission?.id === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setSelectedMissionId(m.id);
                      mapInstanceRef.current?.flyTo(
                        [m.coordinates.lat, m.coordinates.lng],
                        Math.max(mapInstanceRef.current.getZoom(), 11),
                        { duration: 0.8 },
                      );
                    }}
                    className={`py-1.5 px-1 rounded-xl text-[10px] font-mono transition-all text-center border cursor-pointer truncate ${
                      isSelected
                        ? "bg-[#062419] text-white border-[#062419] font-normal shadow-2xs"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                    title={`${m.missionCode} - ${m.field}`}
                  >
                    {m.missionCode.replace("MSN-", "#").replace("REQ-", "#R")}
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

