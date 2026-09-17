import { useState, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  Trash2,
  Loader2,
  X,
  Crosshair,
} from "lucide-react";
import { useLeaflet, type LeafletTileStyle } from "@/hooks/useLeaflet";

interface SearchResultItem {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    district?: string;
  };
}

interface FieldLocationMapPickerProps {
  coordinates: [number, number][] | [number, number] | null;
  onChange: (coords: [number, number][], center: [number, number], areaHa?: number) => void;
  initialDistrict?: string;
  initialCity?: string;
  onLocationSelect?: (info: { city?: string; district?: string; province?: string }) => void;
  className?: string;
}

const DISTRICT_COORDINATES: Record<string, [number, number]> = {
  "Nuwara Eliya": [6.9497, 80.7891],
  Anuradhapura: [8.3114, 80.4037],
  Kandy: [7.2906, 80.6337],
  Dambulla: [7.8731, 80.6511],
  Polonnaruwa: [7.9403, 81.0188],
  Matara: [5.9549, 80.555],
  Badulla: [6.9934, 81.055],
  Kurunegala: [7.4863, 80.3623],
  Jaffna: [9.6615, 80.0255],
  Ampara: [7.2882, 81.6724],
};

function extractPoint(coords: any): [number, number] | null {
  if (!coords) return null;
  if (Array.isArray(coords)) {
    if (coords.length === 2 && typeof coords[0] === "number" && typeof coords[1] === "number") {
      return [coords[0], coords[1]];
    }
    if (coords.length > 0 && Array.isArray(coords[0]) && coords[0].length >= 2) {
      return [Number(coords[0][0]), Number(coords[0][1])];
    }
  }
  return null;
}

export function FieldLocationMapPicker({
  coordinates,
  onChange,
  initialDistrict = "Nuwara Eliya",
  onLocationSelect,
  className = "",
}: FieldLocationMapPickerProps) {
  const [mapStyle, setMapStyle] = useState<LeafletTileStyle>("osm");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Single pinpoint location [lat, lng] or null
  const [pinpoint, setPinpoint] = useState<[number, number] | null>(() => extractPoint(coordinates));

  const defaultCenter: [number, number] =
    DISTRICT_COORDINATES[initialDistrict] || [7.8731, 80.6511];

  const initialMapCenter = pinpoint || defaultCenter;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const { L, isReady, mapContainerRef, mapInstanceRef, layerGroupRef, invalidateSize } = useLeaflet({
    center: initialMapCenter,
    zoom: 13,
    tileStyle: mapStyle,
  });

  // Sync external coordinates
  useEffect(() => {
    setPinpoint(extractPoint(coordinates));
  }, [coordinates]);

  // Sync map center when district changes if no pinpoint placed yet
  useEffect(() => {
    if (isReady && !pinpoint && initialDistrict && DISTRICT_COORDINATES[initialDistrict] && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(DISTRICT_COORDINATES[initialDistrict], 13, { duration: 0.5 });
    }
  }, [isReady, initialDistrict, pinpoint]);

  // Handle map resizing
  useEffect(() => {
    const timer = setTimeout(() => {
      invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [invalidateSize]);

  // Search geocoding via OpenStreetMap Nominatim (Sri Lanka scoped)
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const endpoint = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=lk&addressdetails=1&limit=5&q=${encodeURIComponent(
        query.trim(),
      )}`;
      const res = await fetch(endpoint, {
        headers: { "Accept-Language": "en" },
      });
      if (res.ok) {
        const data = (await res.json()) as SearchResultItem[];
        setSearchResults(data);
        setShowResults(true);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Select searched location - flies map straight to destination without placing marker
  const handleSelectSearchResult = (item: SearchResultItem) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    if (isNaN(lat) || isNaN(lng)) return;

    setShowResults(false);
    setSearchQuery(item.display_name.split(",")[0]);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 14, { duration: 0.5 });
    }

    // Extract address metadata for parent form sync
    if (onLocationSelect && item.address) {
      const city = item.address.city || item.address.town || item.address.village || item.display_name.split(",")[0];
      const district = item.address.county || item.address.district || "";
      const province = item.address.state || "";
      onLocationSelect({ city, district, province });
    }
  };

  // Direct submit on Enter key press
  const handleSearchKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchResults.length > 0) {
        handleSelectSearchResult(searchResults[0]);
      } else if (searchQuery.trim()) {
        const query = searchQuery.trim();
        const matchedKey = Object.keys(DISTRICT_COORDINATES).find(
          (k) => k.toLowerCase() === query.toLowerCase() || k.toLowerCase().includes(query.toLowerCase()),
        );
        if (matchedKey && DISTRICT_COORDINATES[matchedKey]) {
          handleQuickJump(matchedKey);
          return;
        }

        try {
          const endpoint = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=lk&addressdetails=1&limit=1&q=${encodeURIComponent(
            query,
          )}`;
          const res = await fetch(endpoint, {
            headers: { "Accept-Language": "en" },
          });
          if (res.ok) {
            const data = (await res.json()) as SearchResultItem[];
            if (data && data.length > 0) {
              handleSelectSearchResult(data[0]);
            }
          }
        } catch {
          // ignore
        }
      }
    }
  };

  // Quick jump to known agricultural district
  const handleQuickJump = (districtName: string) => {
    const coords = DISTRICT_COORDINATES[districtName];
    if (coords && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(coords, 14, { duration: 0.5 });
      if (onLocationSelect) {
        onLocationSelect({ district: districtName, city: districtName });
      }
    }
  };

  // Render single pinpoint marker on Leaflet map
  useEffect(() => {
    if (!L || !isReady || !mapInstanceRef.current || !layerGroupRef.current) return;

    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    if (!pinpoint) return;

    const pinHtml = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;">
        <svg width="28" height="34" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 3px 6px rgba(0,0,0,0.35));">
          <path d="M12 0C5.37258 0 0 5.37258 0 12C0 19.5 12 30 12 30C12 30 24 19.5 24 12C24 5.37258 18.6274 0 12 0Z" fill="#059669" stroke="#ffffff" stroke-width="1.8"/>
          <circle cx="12" cy="11" r="4.5" fill="#ffffff"/>
        </svg>
      </div>
    `;

    const pinIcon = L.divIcon({
      html: pinHtml,
      className: "field-pinpoint-marker-icon",
      iconSize: [28, 34],
      iconAnchor: [14, 32],
    });

    const marker = L.marker(pinpoint, { icon: pinIcon });
    marker.addTo(layerGroup);
  }, [L, isReady, pinpoint]);

  // Bind map click handler to place/move pinpoint
  useEffect(() => {
    if (!isReady || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    const onMapClick = (e: any) => {
      const lat = Number(e.latlng.lat.toFixed(5));
      const lng = Number(e.latlng.lng.toFixed(5));

      const newPoint: [number, number] = [lat, lng];
      setPinpoint(newPoint);
      if (onChangeRef.current) {
        onChangeRef.current([newPoint], newPoint);
      }
    };

    map.on("click", onMapClick);
    return () => {
      map.off("click", onMapClick);
    };
  }, [isReady]);

  // Clear pinpoint
  const handleClear = () => {
    setPinpoint(null);
    onChange([], [0, 0]);
  };

  return (
    <div className={`space-y-3 font-sans ${className}`}>
      {/* Top Search & Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Search Place Box */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            onFocus={() => {
              if (searchResults.length > 0) setShowResults(true);
            }}
            placeholder="Search city, town, or place in Sri Lanka (e.g. Nuwara Eliya, Dambulla)..."
            className="w-full pl-8 pr-8 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-2xs"
          />
          {isSearching ? (
            <Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin absolute right-2.5 top-1/2 -translate-y-1/2" />
          ) : searchQuery ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
                setShowResults(false);
              }}
              className="p-1 text-slate-400 hover:text-slate-600 absolute right-1.5 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-[2000] max-h-48 overflow-y-auto divide-y divide-slate-100 text-xs">
              {searchResults.map((item) => (
                <button
                  key={item.place_id}
                  type="button"
                  onClick={() => handleSelectSearchResult(item)}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-start gap-2 transition-colors cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-normal line-clamp-1">
                    {item.display_name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tile Switcher (OSM / Satellite) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center p-0.5 bg-slate-100 border border-slate-200/60 rounded-xl text-[11px]">
            <button
              type="button"
              onClick={() => setMapStyle("osm")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                mapStyle === "osm"
                  ? "bg-[#062419] text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              OSM
            </button>
            <button
              type="button"
              onClick={() => setMapStyle("satellite")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                mapStyle === "satellite"
                  ? "bg-[#062419] text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Satellite
            </button>
          </div>
        </div>
      </div>

      {/* Quick Jump Pills for Key Agronomy Hubs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] text-slate-500">
        <span className="text-slate-400 shrink-0 font-medium">Quick jump:</span>
        {Object.keys(DISTRICT_COORDINATES)
          .slice(0, 6)
          .map((dist) => (
            <button
              key={dist}
              type="button"
              onClick={() => handleQuickJump(dist)}
              className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80 rounded-lg shrink-0 transition-colors cursor-pointer"
            >
              {dist}
            </button>
          ))}
      </div>

      {/* Interactive Map Canvas Container */}
      <div className="relative w-full h-[260px] sm:h-[300px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner group">
        {/* Leaflet DOM Node */}
        <div ref={mapContainerRef} className="w-full h-full cursor-crosshair" />

        {/* Floating Interactive Instructions Banner */}
        <div className="absolute top-2.5 left-2.5 bg-slate-900/85 backdrop-blur-md border border-white/10 text-white text-[11px] px-2.5 py-1 rounded-lg shadow-md z-[1000] pointer-events-none flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            {pinpoint
              ? "Pinpoint set — click anywhere on map to reposition"
              : "Click anywhere on map to place field pinpoint"}
          </span>
        </div>

        {/* Action Button Overlay (Clear Pinpoint) */}
        {pinpoint && (
          <div className="absolute bottom-2.5 right-2.5 z-[1000]">
            <button
              type="button"
              onClick={handleClear}
              className="px-2.5 py-1 bg-white/95 backdrop-blur-md hover:bg-white text-rose-700 text-xs font-medium border border-rose-200 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1"
              title="Remove pinpoint"
            >
              <Trash2 className="w-3 h-3 text-rose-500" />
              <span>Clear Pin</span>
            </button>
          </div>
        )}
      </div>

      {/* Selected Coordinates Status Bar */}
      <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="text-slate-400">Pinpoint Location:</span>
          {pinpoint ? (
            <span className="font-mono text-slate-800 font-semibold bg-white px-2 py-0.5 rounded-md border border-slate-200">
              {pinpoint[0].toFixed(5)}, {pinpoint[1].toFixed(5)}
            </span>
          ) : (
            <span className="text-slate-400 italic">Not set (click on map)</span>
          )}
        </div>

        {pinpoint && (
          <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[11px] font-medium">
            <Crosshair className="w-3 h-3 text-emerald-600" />
            <span>Ready</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default FieldLocationMapPicker;

