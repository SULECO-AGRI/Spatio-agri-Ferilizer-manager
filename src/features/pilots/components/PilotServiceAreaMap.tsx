import { useState, useEffect, useRef, useMemo } from "react";
import {
  MapPin,
  Maximize2,
  Minimize2,
  Navigation,
  Plus,
  Minus,
  ExternalLink,
  ShieldCheck,
  Radio,
  Layers,
} from "lucide-react";
import { useLeaflet, type LeafletTileStyle } from "@/hooks/useLeaflet";

interface PilotServiceAreaMapProps {
  pilotName: string;
  pilotStatus?: string;
  mobile?: string;
  serviceArea?: [number, number][] | [number, number] | any;
}

const DEFAULT_SRI_LANKA_CENTER: [number, number] = [6.9271, 80.7781];

/**
 * Calculates geodesic surface area of a polygon in Hectares (Ha)
 */
function calculatePolygonAreaHa(coords: [number, number][]): number {
  if (!coords || coords.length < 3) return 0;
  const earthRadius = 6378137; // meters
  let total = 0;
  const len = coords.length;

  for (let i = 0; i < len; i++) {
    const p1 = coords[i];
    const p2 = coords[(i + 1) % len];
    const lat1 = (p1[0] * Math.PI) / 180;
    const lat2 = (p2[0] * Math.PI) / 180;
    const dLng = ((p2[1] - p1[1]) * Math.PI) / 180;
    total += dLng * (2 + Math.sin(lat1) + Math.sin(lat2));
  }
  const areaM2 = Math.abs((total * earthRadius * earthRadius) / 2.0);
  return Number((areaM2 / 10000).toFixed(2));
}

/**
 * Parses raw service area coordinate payload into normalized polygon and centroid
 */
function parseServiceArea(raw: any): {
  center: [number, number];
  polygon: [number, number][];
  vertexCount: number;
  areaHa: number;
  hasValidPolygon: boolean;
} {
  let parsed = raw;

  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch {
      // ignore
    }
  }

  // Handle GeoJSON object wrapper
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    if (Array.isArray(parsed.coordinates)) {
      parsed = parsed.coordinates;
      if (Array.isArray(parsed[0]) && Array.isArray(parsed[0][0])) {
        parsed = parsed[0]; // Nested GeoJSON polygon rings
      }
    }
  }

  if (Array.isArray(parsed) && parsed.length > 0) {
    if (Array.isArray(parsed[0])) {
      const validPts: [number, number][] = [];
      let sumLat = 0;
      let sumLng = 0;

      for (const pt of parsed) {
        if (Array.isArray(pt) && pt.length >= 2) {
          const lat = Number(pt[0]);
          const lng = Number(pt[1]);
          if (!isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0)) {
            validPts.push([lat, lng]);
            sumLat += lat;
            sumLng += lng;
          }
        }
      }

      if (validPts.length >= 3) {
        const center: [number, number] = [
          sumLat / validPts.length,
          sumLng / validPts.length,
        ];
        const areaHa = calculatePolygonAreaHa(validPts);
        return {
          center,
          polygon: validPts,
          vertexCount: validPts.length,
          areaHa,
          hasValidPolygon: true,
        };
      }

      if (validPts.length >= 1) {
        return {
          center: validPts[0],
          polygon: [],
          vertexCount: 1,
          areaHa: 0,
          hasValidPolygon: false,
        };
      }
    } else if (typeof parsed[0] === "number" && parsed.length >= 2) {
      const lat = Number(parsed[0]);
      const lng = Number(parsed[1]);
      if (!isNaN(lat) && !isNaN(lng)) {
        return {
          center: [lat, lng],
          polygon: [],
          vertexCount: 1,
          areaHa: 0,
          hasValidPolygon: false,
        };
      }
    }
  }

  return {
    center: DEFAULT_SRI_LANKA_CENTER,
    polygon: [],
    vertexCount: 0,
    areaHa: 0,
    hasValidPolygon: false,
  };
}

export function PilotServiceAreaMap({
  pilotName,
  pilotStatus = "ACTIVE",
  mobile,
  serviceArea,
}: PilotServiceAreaMapProps) {
  const [mapStyle, setMapStyle] = useState<LeafletTileStyle>("osm");
  const [isExpanded, setIsExpanded] = useState(false);

  const polygonRef = useRef<ReturnType<typeof import("leaflet").polygon> | null>(null);

  const parsedGeom = useMemo(() => {
    return parseServiceArea(serviceArea);
  }, [serviceArea]);

  const { L, isReady, mapContainerRef, mapInstanceRef, layerGroupRef, invalidateSize } = useLeaflet({
    center: parsedGeom.center,
    zoom: parsedGeom.hasValidPolygon ? 13 : 11,
    tileStyle: mapStyle,
  });

  // Render Service Area Polygon
  useEffect(() => {
    if (!L || !isReady || !mapInstanceRef.current || !layerGroupRef.current) return;

    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();
    polygonRef.current = null;

    const popupHtml = `
      <div style="padding: 10px; font-family: 'Inter', system-ui, sans-serif; min-width: 220px;">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
          <span style="font-size: 13px; font-weight: 700; color: #064e3b;">${pilotName}</span>
          <span style="font-size: 10px; font-weight: 600; background: #ecfdf5; color: #047857; padding: 2px 6px; border-radius: 9999px; border: 1px solid #a7f3d0;">
            ${pilotStatus}
          </span>
        </div>
        
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px; margin-bottom: 8px; font-size: 11px; line-height: 1.5; color: #334155;">
          <div><strong>Designated Service Zone</strong></div>
          ${
            parsedGeom.hasValidPolygon
              ? `<div>Coverage Area: <strong>${parsedGeom.areaHa} Ha</strong> (${(parsedGeom.areaHa * 2.471).toFixed(1)} ac)</div>
                 <div>Boundary Vertices: <strong>${parsedGeom.vertexCount} pts</strong></div>`
              : `<div>Center Station</div>`
          }
          <div style="font-family: monospace; font-size: 10px; color: #64748b; margin-top: 3px;">
            ${parsedGeom.center[0].toFixed(5)}° N, ${parsedGeom.center[1].toFixed(5)}° E
          </div>
          ${mobile ? `<div style="margin-top: 4px; color: #0f172a;">Contact: <strong>${mobile}</strong></div>` : ""}
        </div>

        <a
          href="https://www.google.com/maps?q=${parsedGeom.center[0]},${parsedGeom.center[1]}"
          target="_blank"
          rel="noopener noreferrer"
          style="display: inline-flex; align-items: center; gap: 4px; font-size: 11px; color: #059669; text-decoration: none; font-weight: 600;"
        >
          Open in Google Maps ↗
        </a>
      </div>
    `;

    // 1. Render Service Area Polygon
    if (parsedGeom.hasValidPolygon) {
      const polygon = L.polygon(parsedGeom.polygon, {
        color: "#059669",
        weight: 2.5,
        opacity: 0.95,
        fillColor: "#10b981",
        fillOpacity: 0.22,
        dashArray: "6, 4",
      });
      polygon.bindPopup(popupHtml);
      polygon.addTo(layerGroup);
      polygonRef.current = polygon;

      mapInstanceRef.current.fitBounds(polygon.getBounds(), {
        padding: [50, 50],
        maxZoom: 15,
      });
    } else {
      mapInstanceRef.current.setView(parsedGeom.center, 12, { animate: true });
    }
  }, [
    L,
    isReady,
    parsedGeom,
    pilotName,
    pilotStatus,
    mobile,
    mapInstanceRef,
    layerGroupRef,
  ]);

  // Recenter map on polygon bounds or center
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    if (polygonRef.current) {
      mapInstanceRef.current.fitBounds(polygonRef.current.getBounds(), {
        padding: [50, 50],
        maxZoom: 15,
        animate: true,
        duration: 0.8,
      });
    } else {
      mapInstanceRef.current.flyTo(parsedGeom.center, 13, {
        animate: true,
        duration: 0.8,
      });
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  // Resize invalidation on expand
  useEffect(() => {
    const timer = setTimeout(() => {
      invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [isExpanded, invalidateSize]);

  // Handle escape key to close fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded]);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs font-sans space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 font-display flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Designated Flight Service Area & Geofence</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Geographic boundary and authorized flight perimeter assigned to this pilot
          </p>
        </div>

        {/* Telemetry quick indicators */}
        <div className="flex items-center gap-2">
          {parsedGeom.hasValidPolygon ? (
            <>
              <div className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/80 text-[11px] font-medium text-emerald-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>{parsedGeom.areaHa} Hectares Zone</span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] font-medium text-slate-600 font-mono hidden sm:inline-block">
                {parsedGeom.vertexCount} Polygon Vertices
              </div>
            </>
          ) : (
            <div className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/80 text-[11px] font-medium text-amber-700">
              No Boundary Set
            </div>
          )}
        </div>
      </div>

      {/* Map Display Container */}
      <div
        className={`bg-slate-900 border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs relative transition-all duration-300 ${
          isExpanded
            ? "fixed inset-4 sm:inset-10 z-[9990] shadow-2xl flex flex-col ring-8 ring-slate-950/20"
            : "w-full h-[360px]"
        }`}
      >
        {/* Top Floating Badge */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 max-w-[calc(100%-180px)] pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-2 text-xs text-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-semibold text-slate-900 truncate max-w-[140px] sm:max-w-[200px]">
              {pilotName}
            </span>
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md font-medium hidden sm:inline">
              {parsedGeom.hasValidPolygon ? `${parsedGeom.areaHa} Ha Area` : "Station Position"}
            </span>
          </div>
        </div>

        {/* Map Action Controls (Top Right) */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 pointer-events-auto">
          {/* Style Selector */}
          <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl p-1 shadow-xs flex items-center gap-1 text-[11px]">
            <button
              type="button"
              onClick={() => setMapStyle("osm")}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                mapStyle === "osm"
                  ? "bg-[#062419] text-white font-medium shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              OSM
            </button>
            <button
              type="button"
              onClick={() => setMapStyle("satellite")}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                mapStyle === "satellite"
                  ? "bg-[#062419] text-white font-medium shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Satellite
            </button>
            <button
              type="button"
              onClick={() => setMapStyle("terrain")}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                mapStyle === "terrain"
                  ? "bg-[#062419] text-white font-medium shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Terrain
            </button>
          </div>

          {/* Recenter button */}
          <button
            type="button"
            onClick={handleRecenter}
            title="Recenter Service Area"
            className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/90 flex items-center justify-center text-slate-700 hover:text-emerald-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5" />
          </button>

          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl p-0.5 shadow-xs">
            <button
              type="button"
              onClick={handleZoomIn}
              title="Zoom In"
              className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              title="Zoom Out"
              className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fullscreen Expand button */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Minimize Map (Esc)" : "Expand Map"}
            className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/90 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            {isExpanded ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Leaflet Map DOM Node */}
        <div ref={mapContainerRef} className="w-full h-full min-h-[300px] z-10 bg-slate-100" />

        {/* Bottom Coordinates HUD */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-2 text-[11px] text-slate-700 font-mono">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              {parsedGeom.center[0].toFixed(5)}° N, {parsedGeom.center[1].toFixed(5)}° E
            </span>
            <a
              href={`https://www.google.com/maps?q=${parsedGeom.center[0]},${parsedGeom.center[1]}`}
              target="_blank"
              rel="noopener noreferrer"
              title="View on Google Maps"
              className="text-slate-400 hover:text-emerald-700 ml-1 transition-colors inline-flex items-center"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Bottom Right Legend Badge */}
        <div className="absolute bottom-3 right-3 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 px-2.5 py-1.5 rounded-xl shadow-xs flex items-center gap-3 text-[10px] text-slate-600 pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-700" />
            <span className="font-medium">Service Perimeter</span>
          </div>
          <div className="flex items-center gap-1.5 border-l border-slate-200 pl-2">
            <Layers className="w-3 h-3 text-emerald-700" />
            <span>{parsedGeom.hasValidPolygon ? "Active Geofence" : "Default Point"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PilotServiceAreaMap;
