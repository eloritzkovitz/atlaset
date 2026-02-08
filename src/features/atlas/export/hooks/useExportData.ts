import { useMemo } from "react";
import { DEFAULT_VISITED_LAYER } from "@features/atlas/layers/constants/layers";
import type { Layer } from "@features/atlas/layers";
import type { Marker } from "@features/atlas/markers/types";

/**
 * Prepares export data (layers and markers) based on user selections.
 * @param allLayers - All available layers in the atlas.
 * @param visitedCountryCodes - List of country codes that have been visited.
 * @param includeMarkers - Whether to include markers in the export.
 * @param markers - All available markers in the atlas.
 * @returns An object containing layers and markers to be exported.
 */
export function useExportData({
  allLayers,
  visitedCountryCodes,
  includeMarkers,
  markers,
}: {
  allLayers: Layer[];
  visitedCountryCodes: string[];
  includeMarkers: boolean;
  markers: Marker[] | undefined;
}) {
  // Prepare layers for sharing
  const layersToShare = useMemo(() => {
    return allLayers
      .filter((l) => l.visible && l.countries && l.countries.length > 0)
      .map((l) => ({
        name: l.name,
        color: l.color,
        countries: l.countries,
      }));
  }, [allLayers]);

  // Prepare visited countries for sharing
  const visitedCountriesLayer = useMemo(() => {
    return {
      name: DEFAULT_VISITED_LAYER.name,
      color: DEFAULT_VISITED_LAYER.color,
      countries: visitedCountryCodes,
    };
  }, [visitedCountryCodes]);

  // Prepare markers for sharing
  const markersToShare = useMemo(() => {
    if (!includeMarkers) return undefined;
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
  }, [includeMarkers, markers]);

  return { visitedCountriesLayer, layersToShare, markersToShare };
}
