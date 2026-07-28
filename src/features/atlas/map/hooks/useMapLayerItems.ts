import { useMemo } from "react";
import { type MapMode } from "@features/atlas/core";
import { useCountryFilters } from "@features/atlas/countries/context/CountryFiltersContext";
import { useCountryLists } from "@features/atlas/countries/context/CountryListsContext";
import { useSharedMapInfo } from "@features/atlas/export";
import {
  isTimelineLayer,
  useLayers,
  useTimelineLayerItems,
  useTrackingLayerItems,
  getLayerItems,
  normalizeLayers,
  type TimelineLayer,
} from "@features/atlas/layers";
import { useSavedMaps } from "@features/atlas/savedMaps";
import { useTimeline } from "@features/atlas/timeline";
import { useVisitedCountries } from "@features/visits";
import { useMapView } from "../context/MapViewContext";

/**
 * Returns map layer items based on map mode and active global sidebar triggers.
 * @param mode Current map mode.
 * @returns Array of layer items based on the current active toggles.
 */
export function useMapLayerItems(mode: MapMode = "view") {
  const { filteredCountries, visitedOnly, wantToVisitOnly } =
    useCountryFilters();
  const { selectedListId, countryLists } = useCountryLists();
  const { layers } = useLayers();
  const { colorMode, isEdit } = useMapView();
  const { activeSavedMap } = useSavedMaps();
  const { layers: sharedLayers } = useSharedMapInfo();
  const { timelineMode, selectedYear } = useTimeline();
  const { visitedCountryCodes } = useVisitedCountries();

  // Generate tracking layer items based on active toggles and selected list
  const trackingLayerFilters = useMemo(
    () => ({
      visitedOnly: visitedOnly,
      wantToVisitOnly,
      selectedListId,
      countryLists,
      filteredCountries,
    }),
    [
      visitedOnly,
      wantToVisitOnly,
      selectedListId,
      countryLists,
      filteredCountries,
    ],
  );
  const trackingLayerItems = useTrackingLayerItems(trackingLayerFilters);

  // Combine virtual visited layer with actual timeline layers
  const timelineLayers: TimelineLayer[] = useMemo(() => {
    const virtualVisitedLayer: TimelineLayer = {
      id: "timeline-visited",
      name: "Visited",
      color: "",
      countries: visitedCountryCodes,
      visible: true,
      timelineEnabled: true,
    };

    return [virtualVisitedLayer, ...layers.filter(isTimelineLayer)];
  }, [visitedCountryCodes, layers]);

  // Generate user-defined layer items for visible layers, excluding tracking and timeline layers
  const userCustomItems = useMemo(() => {
    if (visitedOnly || selectedListId) {
      return [];
    }
    return layers.filter((o) => o.visible).flatMap(getLayerItems);
  }, [layers, visitedOnly, selectedListId]);

  // Generate standard view items by combining tracking and user-defined items
  const standardViewItems = useMemo(() => {
    return [...trackingLayerItems, ...userCustomItems];
  }, [trackingLayerItems, userCustomItems]);

  // Generate timeline layer items if in timeline mode
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

  return timelineMode ? timelineItems : standardViewItems;
}
