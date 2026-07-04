import { useMemo } from "react";
import { useLayers } from "@contexts/LayersContext";
import { useMapView } from "@contexts/MapViewContext";
import { useSavedMaps } from "@contexts/SavedMapsContext";
import { useTimeline } from "@contexts/TimelineContext";
import { useSharedMapInfo } from "@features/atlas/export";
import {
  isTimelineLayer,
  useTimelineLayerItems,
  getLayerItems,
  normalizeLayers,
  type TimelineLayer,
} from "@features/atlas/layers";
import { useCountryColors } from "@features/atlas/shared";
import { useVisitedCountries } from "@features/visits";
import type { MapMode } from "../types";

/**
 * Returns map layer items based on map mode.
 * @param mode Current map mode.
 * @returns Array of layer items based on the current mode.
 */
export function useMapLayerItems(mode: MapMode = "view") {
  const { layers } = useLayers();
  const { colorMode, isEdit } = useMapView();
  const { activeSavedMap } = useSavedMaps();
  const { layers: sharedLayers } = useSharedMapInfo();
  const { timelineMode, selectedYear } = useTimeline();

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
  const staticItems = useMemo(
    () => layers.filter((o) => o.visible).flatMap(getLayerItems),
    [layers],
  );
  const timelineItems = useTimelineLayerItems(
    timelineLayers,
    selectedYear,
    colorMode,
  );

  // Editing saved map layer items
  const editingItems = useMemo(
    () =>
      isEdit && activeSavedMap && Array.isArray(activeSavedMap.layers)
        ? activeSavedMap.layers.filter((l) => l.visible).flatMap(getLayerItems)
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
