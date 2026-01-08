import { useMemo } from "react";
import { decodeMapData } from "../utils/mapShare";

export interface SharedMapLayer {
  name: string;
  color: string;
  countries: string[];
}

export interface SharedMapMarker {
  lat: number;
  lng: number;
  label?: string;
}

export interface SharedMapInfo {
  mapName?: string;
  sharer?: string;
  layers?: SharedMapLayer[];
  markers?: SharedMapMarker[];
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
    return { mapName, sharer, layers, markers, ...rest };
  }, []);
}
