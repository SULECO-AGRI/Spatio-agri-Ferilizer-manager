import { useState, useEffect, useRef, useMemo } from "react";
import {
  MapPin,
  Maximize2,
  Minimize2,
  Navigation,
  Plus,
  Minus,
  ExternalLink,
} from "lucide-react";
import { useLeaflet, type LeafletTileStyle } from "@/hooks/useLeaflet";

interface FieldPolygonMapProps {
  fieldName: string;
  locationCoordinates?: [number, number][] | [number, number] | any;
  cropType?: string;
  area?: number;
  district?: string;
  city?: string;
  province?: string;
  village?: string;
}

const SRI_LANKA_DISTRICT_CENTROIDS: Record<string, [number, number]> = {
  "Nuwara Eliya": [6.9497, 80.7891],
  Kandy: [7.2906, 80.6337],
  Matale: [7.4675, 80.6234],
  Kurunegala: [7.4863, 80.3623],
  Puttalam: [8.0362, 79.8283],
  Anuradhapura: [8.3114, 80.4037],
  Polonnaruwa: [7.9403, 81.0188],
  Badulla: [6.9934, 81.055],
  Monaragala: [6.8728, 81.3507],
  Matara: [5.9549, 80.555],
  Galle: [6.0535, 80.221],
  Hambantota: [6.1429, 81.1212],
  Colombo: [6.9271, 79.8612],
  Gampaha: [7.084, 79.9939],
  Kalutara: [6.5854, 79.9607],
  Ratnapura: [6.6828, 80.3992],
  Kegalle: [7.2513, 80.3464],
  Ampara: [7.2882, 81.6724],
  Batticaloa: [7.731, 81.6747],
  Trincomalee: [8.5874, 81.2152],
  Jaffna: [9.6615, 80.0255],
  Kilinochchi: [9.3803, 80.377],
  Mannar: [8.981, 79.9042],
  Mullaitivu: [9.2671, 80.8143],
  Vavuniya: [8.7514, 80.4971],
};

const DEFAULT_FALLBACK_CENTER: [number, number] = [6.9497, 80.7891]; // Nuwara Eliya center

/**
 * Robust parser that extracts single point or polygon vertices from any format
 */
function parseFieldCoordinates(
  rawCoords: any,
  district?: string,
): {
  center: [number, number];
  polygon: [number, number][];
  isSinglePoint: boolean;
  isValid: boolean;
} {
  let parsed: any = rawCoords;

  if (typeof rawCoords === "string") {
    try {
      parsed = JSON.parse(rawCoords);
    } catch {
      // ignore
    }
  }

  // Check for GeoJSON format
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    if (Array.isArray(parsed.coordinates)) {
      parsed = parsed.coordinates;
    } else if (parsed.lat !== undefined && parsed.lng !== undefined) {
      parsed = [Number(parsed.lat), Number(parsed.lng)];
    }
  }

  // Case 1: Array of points
  if (Array.isArray(parsed) && parsed.length > 0) {
    // Case 1A: [[lat, lng], [lat, lng], ...]
    if (Array.isArray(parsed[0])) {
      // If single point in array: [[lat, lng]]
      if (parsed.length === 1 && parsed[0].length >= 2) {
        const lat = Number(parsed[0][0]);
        const lng = Number(parsed[0][1]);
        if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
          return {
            center: [lat, lng],
            polygon: [],
            isSinglePoint: true,
            isValid: true,
          };
        }
      }

      // If multi-point polygon: 3+ points
      if (parsed.length >= 3) {
        const validPolygon: [number, number][] = [];
        let sumLat = 0;
        let sumLng = 0;

        for (const pt of parsed) {
          if (Array.isArray(pt) && pt.length >= 2) {
            const lat = Number(pt[0]);
            const lng = Number(pt[1]);
            if (!isNaN(lat) && !isNaN(lng)) {
              validPolygon.push([lat, lng]);
              sumLat += lat;
              sumLng += lng;
            }
          }
        }

        if (validPolygon.length >= 3) {
          return {
            center: [sumLat / validPolygon.length, sumLng / validPolygon.length],
            polygon: validPolygon,
            isSinglePoint: false,
            isValid: true,
          };
        }
      }

      // If 2 points, treat first as point
      if (parsed.length === 2 && parsed[0].length >= 2) {
        const lat = Number(parsed[0][0]);
        const lng = Number(parsed[0][1]);
        if (!isNaN(lat) && !isNaN(lng)) {
          return {
            center: [lat, lng],
            polygon: [],
            isSinglePoint: true,
            isValid: true,
          };
        }
      }
    } else if (typeof parsed[0] === "number" && parsed.length >= 2) {
      // Case 1B: [lat, lng]
      const lat = Number(parsed[0]);
      const lng = Number(parsed[1]);
      if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
        return {
          center: [lat, lng],
          polygon: [],
          isSinglePoint: true,
          isValid: true,
        };
      }
    }
  }

  // Fallback to district centroid
  const fallbackCenter =
    (district && SRI_LANKA_DISTRICT_CENTROIDS[district]) || DEFAULT_FALLBACK_CENTER;

  return {
    center: fallbackCenter,
    polygon: [],
    isSinglePoint: true,
    isValid: false,
  };
}

export function FieldPolygonMap({
  fieldName,
  locationCoordinates,
  cropType = "Paddy",
  area,
  district,
  city,
  province,
  village,
}: FieldPolygonMapProps) {
  const [mapStyle, setMapStyle] = useState<LeafletTileStyle>("osm");
  const [isExpanded, setIsExpanded] = useState(false);

  const polygonRef = useRef<ReturnType<typeof import("leaflet").polygon> | null>(null);
  const markerRef = useRef<ReturnType<typeof import("leaflet").marker> | null>(null);

  const parsedGeom = useMemo(() => {
    return parseFieldCoordinates(locationCoordinates, district);
  }, [locationCoordinates, district]);

  const { L, isReady, mapContainerRef, mapInstanceRef, layerGroupRef, invalidateSize } = useLeaflet({
    center: parsedGeom.center,
    zoom: 15,
    tileStyle: mapStyle,
  });

  // Render Map Pin Point on map
  useEffect(() => {
    if (!L || !isReady || !mapInstanceRef.current || !layerGroupRef.current) return;

    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();
    polygonRef.current = null;
    markerRef.current = null;

    const locationText =
      [village, city, district, province].filter(Boolean).join(", ") ||
      district ||
      "Field Location";

    const popupHtml = `
      <div style="padding: 10px; font-family: 'Inter', system-ui, sans-serif; min-width: 200px;">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
          <span style="font-size: 13px; font-weight: 700; color: #064e3b;">${fieldName}</span>
          <span style="font-size: 10px; font-weight: 600; background: #ecfdf5; color: #047857; padding: 2px 6px; border-radius: 9999px; border: 1px solid #a7f3d0;">
            ${cropType}
          </span>
        </div>
        <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">${locationText}</div>
        
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px 8px; margin-bottom: 8px; font-size: 11px; line-height: 1.5; color: #334155;">
          ${area !== undefined ? `<div><strong>Area:</strong> ${area} Ha (${(area * 2.471).toFixed(1)} acres)</div>` : ""}
          <div style="font-family: monospace; font-size: 10.5px; color: #475569; margin-top: 2px;">
            ${parsedGeom.center[0].toFixed(5)}° N, ${parsedGeom.center[1].toFixed(5)}° E
          </div>
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

    // 1. If explicit multi-point polygon (3+ vertices), render polygon
    if (parsedGeom.polygon && parsedGeom.polygon.length >= 3) {
      const polygon = L.polygon(parsedGeom.polygon, {
        color: "#059669",
        weight: 2.5,
        opacity: 0.95,
        fillColor: "#10b981",
        fillOpacity: 0.28,
      });
      polygon.bindPopup(popupHtml);
      polygon.addTo(layerGroup);
      polygonRef.current = polygon;
      mapInstanceRef.current.fitBounds(polygon.getBounds(), {
        padding: [45, 45],
        maxZoom: 16,
      });
    }

    // 2. High-precision SVG Map Pin Marker at the exact field coordinates
    const pinIcon = L.divIcon({
      className: "custom-field-pinpoint",
      html: `
        <div style="position: relative; width: 36px; height: 46px; cursor: pointer; display: flex; flex-direction: column; align-items: center;">
          <!-- SVG Pin Teardrop Shape -->
          <svg viewBox="0 0 36 46" width="36" height="46" style="filter: drop-shadow(0 4px 6px rgba(6,78,59,0.35));">
            <path
              d="M18 0C8.05887 0 0 8.05887 0 18C0 29.5 18 46 18 46C18 46 36 29.5 36 18C36 8.05887 27.9411 0 18 0Z"
              fill="#064e3b"
              stroke="#ffffff"
              stroke-width="2"
            />
            <circle cx="18" cy="17" r="7" fill="#ffffff" />
            <circle cx="18" cy="17" r="4.5" fill="#10b981" />
          </svg>
          <!-- Ground Shadow / Pulse Ripple -->
          <div style="position: absolute; bottom: -2px; width: 14px; height: 5px; background: rgba(0,0,0,0.25); border-radius: 50%; filter: blur(1px);"></div>
        </div>
      `,
      iconSize: [36, 46],
      iconAnchor: [18, 46], // Bottom tip of the pin
      popupAnchor: [0, -46],
    });

    const marker = L.marker(parsedGeom.center, { icon: pinIcon });
    marker.bindPopup(popupHtml);
    marker.addTo(layerGroup);
    markerRef.current = marker;

    // Center map view on pin point
    if (!parsedGeom.polygon || parsedGeom.polygon.length < 3) {
      mapInstanceRef.current.setView(parsedGeom.center, 15, { animate: true });
    }
  }, [
    L,
    isReady,
    parsedGeom,
    fieldName,
    cropType,
    area,
    district,
    city,
    province,
    village,
    mapInstanceRef,
    layerGroupRef,
  ]);

  // Recenter on field pin
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    if (polygonRef.current) {
      mapInstanceRef.current.fitBounds(polygonRef.current.getBounds(), {
        padding: [45, 45],
        maxZoom: 16,
        animate: true,
        duration: 0.8,
      });
    } else {
      mapInstanceRef.current.flyTo(parsedGeom.center, 16, {
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
    <div
      className={`bg-slate-900 border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs relative transition-all duration-300 ${
        isExpanded
          ? "fixed inset-4 sm:inset-10 z-[9990] shadow-2xl flex flex-col ring-8 ring-slate-950/20"
          : "w-full h-[320px]"
      }`}
    >
      {/* Top Map Toolbar Header (Field details pill) */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 max-w-[calc(100%-180px)] pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-2 text-xs text-slate-800">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="font-semibold text-slate-900 truncate max-w-[140px] sm:max-w-[200px]">
            {fieldName}
          </span>
          {area !== undefined && (
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md font-mono font-medium hidden sm:inline">
              {area} Ha
            </span>
          )}
          {cropType && (
            <span className="text-[11px] text-slate-500 hidden md:inline border-l border-slate-200 pl-2">
              {cropType}
            </span>
          )}
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
          title="Recenter Field Location"
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
          {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Leaflet OpenStreetMap / Satellite Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[260px] z-10 bg-slate-100" />

      {/* Bottom Coordinates & Telemetry Bar */}
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
      <div className="absolute bottom-3 right-3 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 px-2.5 py-1.5 rounded-xl shadow-xs flex items-center gap-2 text-[10px] text-slate-600 pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-700 fill-emerald-100" />
          <span className="font-medium">Field Location</span>
        </div>
      </div>
    </div>
  );
}

export default FieldPolygonMap;


