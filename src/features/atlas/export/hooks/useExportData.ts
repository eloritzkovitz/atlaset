import { useMemo } from "react";
import { DEFAULT_VISITED_LAYER } from "@features/atlas/layers/constants/layers";
import type { Layer } from "@features/atlas/layers";
import type { Marker } from "@features/atlas/markers/types";

/**
 * Prepares export data (layers and markers) based on user selections.
 * @param exportMode - The mode of export, either "visited" or "layers".
 * @param allLayers - All available layers in the atlas.
 * @param visitedCountryCodes - List of country codes that have been visited.
 * @param includeMarkers - Whether to include markers in the export.
 * @param markers - All available markers in the atlas.
 * @returns
 */
export function useExportData({
  exportMode,
  allLayers,
  visitedCountryCodes,
  includeMarkers,
  markers,
}: {
  exportMode: "visited" | "layers";
  allLayers: Layer[];
  visitedCountryCodes: string[];
  includeMarkers: boolean;
  markers: Marker[] | undefined;
}) {
  // Prepare layers for sharing
  const layersToShare = useMemo(() => {
    if (exportMode === "visited") {
      const visitedLayer = allLayers.find(
        (l) => l.id === DEFAULT_VISITED_LAYER.id
      );
      return [
        {
          name: visitedLayer?.name ?? DEFAULT_VISITED_LAYER.name,
          color: visitedLayer?.color ?? DEFAULT_VISITED_LAYER.color,
          countries: visitedLayer?.countries ?? visitedCountryCodes,
        },
      ];
    } else {
      return allLayers
        .filter((l) => l.visible && l.countries && l.countries.length > 0)
        .map((l) => ({
          name: l.name,
          color: l.color,
          countries: l.countries,
        }));
    }
  }, [exportMode, allLayers, visitedCountryCodes]);

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

  return { layersToShare, markersToShare };
}
