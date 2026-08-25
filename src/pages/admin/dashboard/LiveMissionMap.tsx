import { useState, useMemo, useEffect } from "react";
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
} from "lucide-react";
import { mockActiveMissions } from "@/data/mockData";
import type { ActiveMission } from "@/types";
import { useLeaflet, type LeafletTileStyle } from "@/hooks/useLeaflet";

// Geographic field polygon vertices for each Sri Lanka agricultural zone
const MISSION_GEO_BOUNDS: Record<string, [number, number][]> = {
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

// Flight path geo-waypoints for each active mission
const MISSION_GEO_FLIGHT_PATHS: Record<string, [number, number][]> = {
  "MSN-401": [
    [8.3075, 80.4012],
    [8.3092, 80.4058],
    [8.3125, 80.4022],
    [8.3114, 80.4037],
  ],
  "MSN-402": [
    [7.9358, 81.0155],
    [7.9388, 81.0228],
    [7.9425, 81.0168],
    [7.9403, 81.0188],
  ],
  "MSN-403": [
    [7.8695, 80.6478],
    [7.8718, 80.6548],
    [7.8752, 80.6492],
    [7.8731, 80.6511],
  ],
  "MSN-404": [
    [7.4815, 80.3595],
    [7.4842, 80.3662],
    [7.4882, 80.3608],
    [7.4863, 80.3623],
  ],
  "MSN-405": [
    [7.4635, 80.6202],
    [7.4658, 80.6268],
    [7.4695, 80.6218],
    [7.4675, 80.6234],
  ],
};

export function LiveMissionMap() {
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>("MSN-401");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [mapStyle, setMapStyle] = useState<LeafletTileStyle>("osm");
  const [isExpanded, setIsExpanded] = useState(false);

  const { L, mapContainerRef, mapInstanceRef, layerGroupRef, invalidateSize } = useLeaflet({
    center: [7.8731, 80.6511],
    zoom: 9,
    tileStyle: mapStyle,
  });

  const filteredMissions = useMemo(() => {
    return mockActiveMissions.filter((m) => {
      if (activeFilter === "All") return true;
      return m.status === activeFilter;
    });
  }, [activeFilter]);

  const selectedMission = useMemo(() => {
    return mockActiveMissions.find((m) => m.id === selectedMissionId) || null;
  }, [selectedMissionId]);

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

  // Render drone markers, field polygons, and flight trajectories
  useEffect(() => {
    if (!L || !mapInstanceRef.current || !layerGroupRef.current) return;

    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    filteredMissions.forEach((mission) => {
      const isSelected = selectedMissionId === mission.id;
      const colors = getStatusColor(mission.status);
      const latLng: [number, number] = [mission.coordinates.lat, mission.coordinates.lng];

      // 1. Draw Field Boundary Polygon
      const polygonCoords = MISSION_GEO_BOUNDS[mission.id];
      if (polygonCoords) {
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

      // 2. Draw Flight Path Trail
      const flightCoords = MISSION_GEO_FLIGHT_PATHS[mission.id];
      if (flightCoords && isSelected) {
        const polyline = L.polyline(flightCoords, {
          color: colors.hex,
          weight: 3,
          opacity: 0.85,
          dashArray: "6, 6",
          lineCap: "round",
          lineJoin: "round",
        });
        polyline.addTo(layerGroup);
      }

      // 3. Custom HTML Drone Radar Marker
      const markerHtml = `
        <div class="drone-radar-marker cursor-pointer" style="width: 48px; height: 48px;">
          <div class="drone-radar-pulse" style="width: ${isSelected ? "44px" : "32px"}; height: ${isSelected ? "44px" : "32px"}; background-color: ${colors.hex}; opacity: 0.35;"></div>
          <div style="
            width: ${isSelected ? "34px" : "28px"};
            height: ${isSelected ? "34px" : "28px"};
            background: #062419;
            border: 2.5px solid ${colors.hex};
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            transition: transform 0.2s ease;
          ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${colors.hex}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14"/>
            </svg>
          </div>
          <div style="
            position: absolute;
            top: -14px;
            left: 50%;
            transform: translateX(-50%);
            background: ${isSelected ? "#062419" : "rgba(15, 23, 42, 0.9)"};
            color: #ffffff;
            font-family: monospace;
            font-size: 10px;
            font-weight: 600;
            padding: 2px 6px;
            border-radius: 6px;
            border: 1px solid ${isSelected ? colors.hex : "rgba(255,255,255,0.2)"};
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          ">
            ${mission.missionCode}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: "custom-drone-icon",
        iconSize: [48, 48],
        iconAnchor: [24, 24],
      });

      const marker = L.marker(latLng, { icon: customIcon });

      marker.on("click", () => {
        setSelectedMissionId(mission.id);
        mapInstanceRef.current?.flyTo(latLng, Math.max(mapInstanceRef.current.getZoom(), 11), {
          duration: 0.8,
        });
      });

      marker.bindPopup(`
        <div style="padding: 12px; font-family: 'Inter', sans-serif; min-width: 190px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
            <span style="background: #062419; color: #fff; font-size: 11px; font-family: monospace; padding: 2px 6px; border-radius: 4px;">${mission.missionCode}</span>
            <span style="font-size: 11px; font-weight: 500; color: ${colors.hex};">${mission.status}</span>
          </div>
          <div style="font-size: 12px; font-weight: 600; color: #0f172a; margin-bottom: 2px;">${mission.field}</div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">${mission.region}</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px; padding-top: 6px; border-top: 1px solid #f1f5f9;">
            <div><span style="color:#94a3b8;">Pilot:</span> <span style="color:#1e293b; font-weight:500;">${mission.pilotName}</span></div>
            <div><span style="color:#94a3b8;">Battery:</span> <span style="color:#1e293b; font-weight:500;">${mission.battery}%</span></div>
            <div><span style="color:#94a3b8;">Rate:</span> <span style="color:#1e293b; font-weight:500;">${mission.sprayFlowRate}</span></div>
            <div><span style="color:#94a3b8;">Progress:</span> <span style="color:#10b981; font-weight:600;">${mission.progress}%</span></div>
          </div>
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
      mapInstanceRef.current.flyTo([7.8731, 80.6511], 9, { duration: 0.8 });
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
              <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
              Live Active Drone Missions Map
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              {filteredMissions.length} Drones Active
            </span>
          </div>
          <p className="text-xs text-slate-400 font-normal mt-0.5 flex items-center gap-1.5">
            <span>OpenStreetMap live GIS telemetry, precision flight paths & spray rates</span>
          </p>
        </div>

        {/* Action Controls & Layer Switcher */}
        <div className="flex flex-wrap items-center gap-2">
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
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-normal tracking-wide">
              RTK-GPS Fixed • Accuracy ±1.5cm
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
                      Target Nutrient:
                    </span>
                    <span className="text-[11px] font-mono text-emerald-700 font-medium">
                      {selectedMission.sprayFlowRate}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-normal truncate">
                    {selectedMission.targetFertilizer}
                  </p>
                  <p className="text-[10px] text-slate-500 font-normal pt-1 border-t border-emerald-200/40">
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
                Click any drone pin on the OpenStreetMap map to inspect live telemetry
              </p>
            </div>
          )}

          {/* Quick Mission Roster Strip */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-normal text-slate-400 uppercase tracking-wider block">
              Quick Mission Switcher
            </span>
            <div className="grid grid-cols-5 gap-1.5">
              {mockActiveMissions.map((m) => {
                const isSelected = selectedMissionId === m.id;
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
                    className={`py-1.5 px-1 rounded-xl text-[11px] font-mono transition-all text-center border cursor-pointer ${
                      isSelected
                        ? "bg-[#062419] text-white border-[#062419] font-normal shadow-2xs"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {m.missionCode.replace("MSN-", "#")}
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
