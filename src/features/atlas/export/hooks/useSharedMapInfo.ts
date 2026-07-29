import { useMemo } from "react";
import { decodeMapData } from "../utils/mapShare";
import { normalizeLayers, type Layer } from "@features/atlas/layers";
import { normalizeMarkers, type Marker } from "@features/atlas/markers";

export interface SharedMapInfo {
  mapName?: string;
  sharer?: string;
  layers?: Layer[];
  markers?: Marker[];
  [key: string]: unknown;
}

/**
 * Returns shared map information from the URL.
 * @returns
 */
export function useSharedMapInfo(): SharedMapInfo {
  return useMemo((): SharedMapInfo => {
    const params = new URLSearchParams(window.location.search);
    const mapParam = params.get("map");

    // If no map parameter, return empty object
    if (!mapParam) return {};

    const decoded = decodeMapData(mapParam);

    // Destructure all possible fields
    const {
      mapName = undefined,
      sharer = undefined,
      layers = undefined,
      markers = undefined,
      // add any other fields your decodeMapData returns
      ...rest
    } = decoded || {};

    // Normalize layers and markers
    const normalizedLayers = normalizeLayers(layers);
    const normalizedMarkers = normalizeMarkers(markers);

    return {
      mapName,
      sharer,
      layers: normalizedLayers,
      markers: normalizedMarkers,
      ...rest,
    };
  }, []);
}
