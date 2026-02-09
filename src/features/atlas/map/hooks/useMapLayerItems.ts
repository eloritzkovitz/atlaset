import { useMemo } from "react";
import { useLayers } from "@contexts/LayersContext";
import { useMapView } from "@contexts/MapViewContext";
import { useSavedMaps } from "@contexts/SavedMapsContext";
import { useCountryColors } from "@features/settings";
import { useTimeline } from "@contexts/TimelineContext";
import { useSharedMapInfo } from "@features/atlas/export/hooks/useSharedMapInfo";
import {
  isTimelineLayer,
  useLayerItems,
  useTimelineLayerItems,
  getLayerItems,
  normalizeLayers,
  type TimelineLayer,
} from "@features/atlas/layers";
import { useVisitedCountries } from "@features/visits/hooks/useVisitedCountries";
import type { MapMode } from "../types";

/**
 * Returns map layer items based on map mode.
 * @param mode Current map mode.
 * @returns Array of layer items based on the current mode.
 */
export function useMapLayerItems(mode: MapMode = "view") {
  const { layers } = useLayers();
  const { isEdit } = useMapView();
  const { activeSavedMap } = useSavedMaps();
  const { layers: sharedLayers } = useSharedMapInfo();
  const { timelineMode, selectedYear, colorMode } = useTimeline();

  // Timeline mode: add virtual visited countries layer
  const { visitedCountryCodes } = useVisitedCountries();
  const { VISITED_COUNTRY_COLOR } = useCountryColors();

  const virtualVisitedLayer: TimelineLayer = {
    id: "timeline-visited",
    name: "Visited",
    color: VISITED_COUNTRY_COLOR,
    countries: visitedCountryCodes,
    visible: true,
    timelineEnabled: true,
  };

  // Combine virtual visited layer with actual timeline layers
  const timelineLayers: TimelineLayer[] = [
    virtualVisitedLayer,
    ...layers.filter(isTimelineLayer),
  ];

  // Get static and timeline layer items
  const staticItems = useLayerItems(layers);
  const timelineItems = useTimelineLayerItems(
    timelineLayers,
    selectedYear,
    colorMode,
  );

  // Editing saved map layer items
  const editingItems = useMemo(
    () =>
      isEdit && activeSavedMap && Array.isArray(activeSavedMap.layers)
        ? activeSavedMap.layers.flatMap(getLayerItems)
        : [],
    [isEdit, activeSavedMap],
  );

  // Shared layer items
  const sharedLayerItems = useMemo(() => {
    const normalized = normalizeLayers(sharedLayers) ?? [];
    return normalized.flatMap(getLayerItems);
  }, [sharedLayers]);

  // Select result conditionally
  if (mode === "edit") {
    if (editingItems.length > 0) return editingItems;
    return sharedLayerItems;
  }

  if (mode === "readonly") {
    return sharedLayerItems;
  }

  return timelineMode ? timelineItems : staticItems;
}
