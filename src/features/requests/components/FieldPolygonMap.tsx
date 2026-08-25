import { useState, useEffect, useRef } from "react";
import type * as LeafletModule from "leaflet";
import { MapPin, Maximize2, Minimize2, Navigation } from "lucide-react";

interface FieldPolygonMapProps {
  fieldName: string;
  locationCoordinates?: [number, number][];
  cropType?: string;
  area?: number;
  district?: string;
}

const DEFAULT_COORDS: [number, number][] = [
  [8.5361, 80.4922],
  [8.5385, 80.4945],
  [8.5372, 80.4971],
  [8.5348, 80.4952],
];

type MapStyle = "osm" | "satellite" | "terrain";

const TILE_LAYERS: Record<MapStyle, { url: string; attribution: string; maxZoom: number }> = {
  osm: {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye",
    maxZoom: 19,
  },
  terrain: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 17,
  },
};

export function FieldPolygonMap({
  fieldName,
  locationCoordinates,
  cropType = "Paddy",
  area,
  district,
}: FieldPolygonMapProps) {
  const [mapStyle, setMapStyle] = useState<MapStyle>("osm");
  const [isExpanded, setIsExpanded] = useState(false);
  const [L, setL] = useState<typeof LeafletModule | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletModule.Map | null>(null);
  const tileLayerRef = useRef<LeafletModule.TileLayer | null>(null);
  const polygonRef = useRef<LeafletModule.Polygon | null>(null);

  const coordinates: [number, number][] =
    locationCoordinates && locationCoordinates.length >= 3 ? locationCoordinates : DEFAULT_COORDS;

  // Dynamically load Leaflet on the client to avoid SSR issues
  useEffect(() => {
    let isMounted = true;
    Promise.all([import("leaflet"), import("leaflet/dist/leaflet.css")]).then(([leafletModule]) => {
      if (isMounted) {
        setL(leafletModule.default ?? leafletModule);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!L || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const centerLat = coordinates.reduce((sum, c) => sum + c[0], 0) / coordinates.length;
      const centerLng = coordinates.reduce((sum, c) => sum + c[1], 0) / coordinates.length;

      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 15,
        zoomControl: false,
        attributionControl: true,
      });

      const initialLayer = TILE_LAYERS[mapStyle];
      const tileLayer = L.tileLayer(initialLayer.url, {
        attribution: initialLayer.attribution,
        maxZoom: initialLayer.maxZoom,
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      // Draw agricultural field polygon
      const polygon = L.polygon(coordinates, {
        color: "#10b981",
        weight: 3,
        opacity: 0.9,
        fillColor: "#10b981",
        fillOpacity: 0.25,
      }).addTo(map);

      polygonRef.current = polygon;

      polygon.bindPopup(`
        <div style="padding: 8px; font-family: 'Inter', sans-serif;">
          <div style="font-size: 13px; font-weight: 600; color: #064e3b; margin-bottom: 2px;">${fieldName}</div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">${district || "Field Location"}</div>
          <div style="font-size: 11px; color: #334155;">
            <strong>Crop:</strong> ${cropType}<br/>
            ${area !== undefined ? `<strong>Area:</strong> ${area} Hectares` : ""}
          </div>
        </div>
      `);

      // Fit map bounds to field polygon with smooth padding
      map.fitBounds(polygon.getBounds(), { padding: [30, 30] });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        tileLayerRef.current = null;
        polygonRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [L]);

  // Update base tile layer on style toggle
  useEffect(() => {
    if (!L || !mapInstanceRef.current) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const currentLayer = TILE_LAYERS[mapStyle];
    const newTileLayer = L.tileLayer(currentLayer.url, {
      attribution: currentLayer.attribution,
      maxZoom: currentLayer.maxZoom,
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTileLayer;
  }, [L, mapStyle]);

  // Center / Recenter on field
  const handleRecenter = () => {
    if (!mapInstanceRef.current || !polygonRef.current) return;
    mapInstanceRef.current.fitBounds(polygonRef.current.getBounds(), {
      padding: [30, 30],
      animate: true,
      duration: 0.8,
    });
  };

  // Resize invalidation on expand
  useEffect(() => {
    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [isExpanded]);

  return (
    <div
      className={`bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs relative transition-all duration-300 ${
        isExpanded ? "fixed inset-6 z-50 shadow-2xl flex flex-col" : "w-full h-[280px]"
      }`}
    >
      {/* Top Map Toolbar Header */}
      <div className="absolute top-3 left-3 z-[1000] flex items-center gap-2">
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-2 text-xs text-slate-800">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="font-medium truncate max-w-[160px] sm:max-w-[240px]">{fieldName}</span>
          {area !== undefined && (
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              • {area} Ha
            </span>
          )}
        </div>
      </div>

      {/* Map Action Controls */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5">
        {/* Style Selector */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl p-1 shadow-xs flex items-center gap-1 text-[11px]">
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
          title="Recenter Field"
          className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-emerald-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
        >
          <Navigation className="w-4 h-4" />
        </button>

        {/* Fullscreen Expand button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? "Minimize Map" : "Expand Map"}
          className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
        >
          {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Leaflet OpenStreetMap Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[240px] z-10" />

      {/* Bottom Right Legend Badge */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-white/90 backdrop-blur-md border border-slate-200/80 px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1.5 text-[10px] text-slate-600">
        <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/30 border border-emerald-600" />
        <span>Field Boundary</span>
      </div>
    </div>
  );
}

export default FieldPolygonMap;
