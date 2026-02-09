import { useMemo } from "react";
import { DEFAULT_VISITED_LAYER } from "@features/atlas/layers/constants/layers";
import type { Layer } from "@features/atlas/layers";
import type { Marker } from "@features/atlas/markers/types";

/**
 * Prepares map export data based on user selections.
 * @param visitedCountryCodes - List of country codes that have been visited.
 * @param layers - All available layers in the atlas.
 * @param markers - All available markers in the atlas.
 * @returns An object containing layers and markers to be exported.
 */
export function useExportData({
  visitedCountryCodes,
  layers,
  markers,
}: {
  visitedCountryCodes: string[];
  layers: Layer[];
  markers: Marker[];
}) {
  // Prepare visited countries for sharing
  const visitedCountriesLayer = useMemo(() => {
    return {
      name: DEFAULT_VISITED_LAYER.name,
      color: DEFAULT_VISITED_LAYER.color,
      countries: visitedCountryCodes,
    };
  }, [visitedCountryCodes]);

  // Prepare layers for sharing
  const layersToShare = useMemo(() => {
    return layers
      .filter((l) => l.visible && l.countries && l.countries.length > 0)
      .map((l) => ({
        name: l.name,
        color: l.color,
        countries: l.countries,
      }));
  }, [layers]);

  // Prepare markers for sharing
  const markersToShare = useMemo(() => {
    return Array.isArray(markers)
      ? markers
          .filter((m) => m.visible !== false)
          .map((m) => ({
            name: m.name,
            coordinates: m.coordinates,
            color: m.color,
            description: m.description,
          }))
      : [];
  }, [markers]);

  return { visitedCountriesLayer, layersToShare, markersToShare };
}
