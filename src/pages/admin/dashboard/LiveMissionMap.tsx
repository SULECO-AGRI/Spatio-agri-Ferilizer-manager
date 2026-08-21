import { useState, useMemo } from "react";
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
} from "lucide-react";
import { mockActiveMissions } from "@/data/mockData";
import type { ActiveMission } from "@/types";

type MapStyle = "satellite" | "standard" | "terrain";

export function LiveMissionMap() {
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>("MSN-401");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [mapStyle, setMapStyle] = useState<MapStyle>("satellite");
  const [isExpanded, setIsExpanded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

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
          bg: "bg-emerald-500",
          text: "text-emerald-700",
          badgeBg: "bg-emerald-50 border-emerald-200",
          stroke: "#10b981",
          fill: "rgba(16, 185, 129, 0.15)",
        };
      case "Spraying":
        return {
          bg: "bg-cyan-500",
          text: "text-cyan-700",
          badgeBg: "bg-cyan-50 border-cyan-200",
          stroke: "#06b6d4",
          fill: "rgba(6, 182, 212, 0.15)",
        };
      case "Surveying":
        return {
          bg: "bg-indigo-500",
          text: "text-indigo-700",
          badgeBg: "bg-indigo-50 border-indigo-200",
          stroke: "#6366f1",
          fill: "rgba(99, 102, 241, 0.15)",
        };
      case "Returning":
        return {
          bg: "bg-amber-500",
          text: "text-amber-700",
          badgeBg: "bg-amber-50 border-amber-200",
          stroke: "#f59e0b",
          fill: "rgba(245, 158, 11, 0.15)",
        };
      default:
        return {
          bg: "bg-slate-500",
          text: "text-slate-700",
          badgeBg: "bg-slate-50 border-slate-200",
          stroke: "#64748b",
          fill: "rgba(100, 116, 139, 0.15)",
        };
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
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />5 Drones
              Airborne
            </span>
          </div>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            Real-time GPS telemetry, precision flight paths & live fertilizer spray rates
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

          {/* Map Layer Mode Buttons */}
          <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 text-xs">
            <button
              type="button"
              onClick={() => setMapStyle("satellite")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                mapStyle === "satellite"
                  ? "bg-[#062419] text-white font-normal shadow-2xs"
                  : "text-slate-500 hover:text-slate-850"
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Satellite</span>
            </button>
            <button
              type="button"
              onClick={() => setMapStyle("standard")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                mapStyle === "standard"
                  ? "bg-[#062419] text-white font-normal shadow-2xs"
                  : "text-slate-500 hover:text-slate-850"
              }`}
            >
              <span>Vector</span>
            </button>
            <button
              type="button"
              onClick={() => setMapStyle("terrain")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                mapStyle === "terrain"
                  ? "bg-[#062419] text-white font-normal shadow-2xs"
                  : "text-slate-500 hover:text-slate-850"
              }`}
            >
              <span>Terrain</span>
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
        {/* Map Canvas (8 Columns) */}
        <div className="lg:col-span-8 relative w-full h-[380px] sm:h-[430px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-inner group">
          {/* Base Map Background Styling by Layer Mode */}
          <div
            className={`absolute inset-0 transition-colors duration-500 ${
              mapStyle === "satellite"
                ? "bg-[#0c1f17]"
                : mapStyle === "terrain"
                  ? "bg-[#e8ece5]"
                  : "bg-[#f1f5f9]"
            }`}
          />

          {/* Map Vector Cartography / Satellite Grid Elements */}
          <svg
            className="w-full h-full absolute inset-0 select-none"
            viewBox="0 0 600 400"
            preserveAspectRatio="xMidYMid meet"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: "center center",
              transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <defs>
              {/* Satellite Terrain Noise & Pattern */}
              <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke={
                    mapStyle === "satellite"
                      ? "rgba(255,255,255,0.04)"
                      : mapStyle === "terrain"
                        ? "rgba(0,0,0,0.05)"
                        : "rgba(0,0,0,0.04)"
                  }
                  strokeWidth="0.8"
                />
              </pattern>
              {/* Pulse Radial Glow for Drones */}
              <radialGradient id="droneGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background Grid */}
            <rect width="100%" height="100%" fill="url(#gridPattern)" />

            {/* Geographical Contour Topography & River Basins */}
            {mapStyle === "satellite" ? (
              <>
                {/* Dark Satellite Agri Parcels */}
                <path
                  d="M0,80 Q150,120 300,70 T600,100 L600,0 L0,0 Z"
                  fill="rgba(16, 185, 129, 0.04)"
                />
                <path
                  d="M0,280 Q200,240 400,320 T600,290 L600,400 L0,400 Z"
                  fill="rgba(6, 78, 59, 0.2)"
                />
                {/* Mahaweli River Path */}
                <path
                  d="M120,0 C160,110 240,160 330,240 S480,330 520,400"
                  fill="none"
                  stroke="#0369a1"
                  strokeWidth="3.5"
                  strokeOpacity="0.4"
                  strokeLinecap="round"
                />
                {/* Secondary Water Channels */}
                <path
                  d="M330,240 C280,290 210,320 180,400"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2"
                  strokeOpacity="0.3"
                  strokeLinecap="round"
                />
                {/* Road Networks */}
                <path
                  d="M0,180 L230,170 L380,240 L600,260"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="1.5"
                  strokeDasharray="4,2"
                />
                <path d="M260,0 L270,160 L320,400" fill="none" stroke="#334155" strokeWidth="1.5" />
              </>
            ) : (
              <>
                {/* Light Vector & Terrain Background Elements */}
                <path
                  d="M120,0 C160,110 240,160 330,240 S480,330 520,400"
                  fill="none"
                  stroke="#7dd3fc"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M0,180 L230,170 L380,240 L600,260"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="2.5"
                />
                <path d="M260,0 L270,160 L320,400" fill="none" stroke="#94a3b8" strokeWidth="2" />
              </>
            )}

            {/* Sri Lanka Region Zone Labels on Map */}
            <g
              className={`text-[10px] font-mono select-none ${
                mapStyle === "satellite" ? "fill-slate-400" : "fill-slate-500"
              }`}
            >
              <text x="180" y="55" opacity="0.65">
                ZONE 01 • ANURADHAPURA NORTH
              </text>
              <text x="400" y="90" opacity="0.65">
                ZONE 02 • POLONNARUWA BASIN
              </text>
              <text x="320" y="270" opacity="0.65">
                ZONE 03 • DAMBULLA AGRITECH
              </text>
              <text x="70" y="360" opacity="0.65">
                ZONE 04 • KURUNEGALA PADDY
              </text>
            </g>

            {/* Field Boundary Polygons for Active Missions */}
            {filteredMissions.map((m) => {
              const colors = getStatusColor(m.status);
              const isSelected = selectedMissionId === m.id;
              return (
                <g key={`poly-${m.id}`}>
                  {/* Field Polygon Area */}
                  <polygon
                    points={m.polygonPoints}
                    fill={isSelected ? colors.fill : "rgba(255,255,255,0.03)"}
                    stroke={isSelected ? colors.stroke : "rgba(148, 163, 184, 0.4)"}
                    strokeWidth={isSelected ? "2" : "1"}
                    strokeDasharray={isSelected ? "none" : "3,3"}
                    className="transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedMissionId(m.id)}
                  />

                  {/* Flight Path Breadcrumb Trail with Animated Dash */}
                  {isSelected && (
                    <polyline
                      points={m.flightPath.map((p) => `${p.x},${p.y}`).join(" ")}
                      fill="none"
                      stroke={colors.stroke}
                      strokeWidth="2"
                      strokeDasharray="4,4"
                      strokeLinecap="round"
                      className="animate-[dash_1.5s_linear_infinite]"
                    />
                  )}
                </g>
              );
            })}

            {/* Active Drones Radar Halos & Markers */}
            {filteredMissions.map((m) => {
              const colors = getStatusColor(m.status);
              const isSelected = selectedMissionId === m.id;
              return (
                <g
                  key={`marker-${m.id}`}
                  transform={`translate(${m.coordinates.x}, ${m.coordinates.y})`}
                  className="cursor-pointer transition-transform duration-300"
                  onClick={() => setSelectedMissionId(m.id)}
                >
                  {/* Pulsing Concentric Radar Halo */}
                  <circle
                    r={isSelected ? "22" : "14"}
                    fill={colors.stroke}
                    fillOpacity="0.15"
                    className="animate-ping"
                  />
                  <circle r={isSelected ? "14" : "10"} fill={colors.stroke} fillOpacity="0.3" />

                  {/* Drone Pin Core */}
                  <circle
                    r="8"
                    fill={isSelected ? "#062419" : "#ffffff"}
                    stroke={colors.stroke}
                    strokeWidth="2.5"
                    className="shadow-md"
                  />

                  {/* Drone Mini Icon */}
                  <g transform="translate(-4, -4) scale(0.65)">
                    <path d="M6 2L10 6L6 10L2 6Z" fill={isSelected ? "#10b981" : colors.stroke} />
                  </g>

                  {/* Floating Tag Label Above Drone Pin */}
                  <g transform="translate(0, -16)">
                    <rect
                      x="-36"
                      y="-12"
                      width="72"
                      height="18"
                      rx="6"
                      fill={isSelected ? "#062419" : "rgba(15, 23, 42, 0.85)"}
                      stroke={isSelected ? colors.stroke : "rgba(255,255,255,0.2)"}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="1"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="500"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {m.missionCode}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Google Maps Style Bottom-Left Map HUD Badge */}
          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl px-3 py-1.5 text-white flex items-center gap-2.5 shadow-lg select-none">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-normal tracking-wide">
              RTK-GPS Fixed • Accuracy ±1.5cm
            </span>
            <span className="text-[10px] text-slate-400 border-l border-slate-700 pl-2">
              Sri Lanka Grid (SLD99)
            </span>
          </div>

          {/* Google Maps Style Bottom-Right Zoom & Recenter Controls */}
          <div className="absolute bottom-3 right-3 flex flex-col gap-1 select-none">
            <div className="bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden flex flex-col">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
                className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 text-sm font-normal border-b border-slate-100 cursor-pointer"
                title="Zoom In"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
                className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 text-sm font-normal cursor-pointer"
                title="Zoom Out"
              >
                −
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedMissionId("MSN-401");
                setZoomLevel(1);
              }}
              className="w-8 h-8 bg-white border border-slate-200 rounded-xl shadow-md flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer"
              title="Recenter All Missions"
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
                Click any drone pin on the map to inspect live telemetry
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
                    onClick={() => setSelectedMissionId(m.id)}
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
