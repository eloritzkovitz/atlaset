import { useMemo } from "react";
import { decodeMapData } from "../utils/mapShare";
import type { Layer } from "@features/atlas/layers";
import { VISITED_LAYER_ID } from "@features/atlas/layers/constants/layers";

export interface SharedMapMarker {
  lat: number;
  lng: number;
  label?: string;
}

export interface SharedMapInfo {
  mapName?: string;
  sharer?: string;
  layers?: Layer[];
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

    // Ensure layers have id and visible (as before)
    const normalizedLayers = Array.isArray(layers)
      ? layers.map((layer, idx) => {
          // Type guard for possible missing properties
          const l = layer as Partial<Layer> & {
            name: string;
            color: string;
            countries: string[] | string;
          };

          // Heuristic: treat first layer or layer named 'visited' as visited layer
          const isVisited =
            idx === 0 ||
            (typeof l.name === "string" &&
              l.name.toLowerCase().includes("visited"));
          return {
            ...l,
            id: isVisited
              ? VISITED_LAYER_ID
              : typeof l.id === "string"
              ? l.id
              : `shared-layer-${idx}`,
            visible: typeof l.visible === "boolean" ? l.visible : true,
            countries: Array.isArray(l.countries)
              ? l.countries
              : typeof l.countries === "string"
              ? [l.countries]
              : [],
          };
        })
      : undefined;

    return {
      mapName,
      sharer,
      layers: normalizedLayers,
      markers,
      ...rest,
    };
  }, []);
}
