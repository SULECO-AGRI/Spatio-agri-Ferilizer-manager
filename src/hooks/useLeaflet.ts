import { useState, useEffect, useRef, useCallback } from "react";
import type * as LeafletModule from "leaflet";

export type LeafletTileStyle = "osm" | "satellite" | "terrain";

export const LEAFLET_TILE_PROVIDERS: Record<
  LeafletTileStyle,
  { url: string; attribution: string; maxZoom: number }
> = {
  osm: {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    maxZoom: 19,
  },
  terrain: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a>',
    maxZoom: 17,
  },
};

export interface UseLeafletOptions {
  center?: [number, number];
  zoom?: number;
  tileStyle?: LeafletTileStyle;
  attributionControl?: boolean;
}

export function useLeaflet(options: UseLeafletOptions = {}) {
  const {
    center = [7.8731, 80.6511],
    zoom = 9,
    tileStyle = "osm",
    attributionControl = true,
  } = options;

  const [L, setL] = useState<typeof LeafletModule | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletModule.Map | null>(null);
  const tileLayerRef = useRef<LeafletModule.TileLayer | null>(null);
  const layerGroupRef = useRef<LeafletModule.LayerGroup | null>(null);

  // 1. SSR-safe dynamic Leaflet module loader
  useEffect(() => {
    if (typeof window === "undefined") return;

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

  // 2. Initialize Leaflet Map instance on container attachment
  useEffect(() => {
    if (!L || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: false,
        attributionControl,
      });

      const initialLayerConfig = LEAFLET_TILE_PROVIDERS[tileStyle] || LEAFLET_TILE_PROVIDERS.osm;
      const tileLayer = L.tileLayer(initialLayerConfig.url, {
        attribution: initialLayerConfig.attribution,
        maxZoom: initialLayerConfig.maxZoom,
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;

      mapInstanceRef.current = map;
      setIsReady(true);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        tileLayerRef.current = null;
        layerGroupRef.current = null;
        setIsReady(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [L]);

  // 3. Reactive base tile layer switcher
  useEffect(() => {
    if (!L || !mapInstanceRef.current) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const currentLayerConfig = LEAFLET_TILE_PROVIDERS[tileStyle] || LEAFLET_TILE_PROVIDERS.osm;
    const newTileLayer = L.tileLayer(currentLayerConfig.url, {
      attribution: currentLayerConfig.attribution,
      maxZoom: currentLayerConfig.maxZoom,
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTileLayer;
  }, [L, tileStyle]);

  // Invalidate map dimensions on container resize/fullscreen toggle
  const invalidateSize = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize();
    }
  }, []);

  return {
    L,
    isReady,
    mapContainerRef,
    mapInstanceRef,
    tileLayerRef,
    layerGroupRef,
    invalidateSize,
  };
}

export default useLeaflet;
