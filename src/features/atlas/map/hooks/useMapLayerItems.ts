import { useMemo } from "react";
import { useCountryFilters } from "@contexts/CountryFiltersContext";
import { useLayers } from "@contexts/LayersContext";
import { useMapView } from "@contexts/MapViewContext";
import { useSavedMaps } from "@contexts/SavedMapsContext";
import { useTimeline } from "@contexts/TimelineContext";
import { useCountryLists } from "@contexts/CountryListsContext";
import { useSharedMapInfo } from "@features/atlas/export";
import {
  isTimelineLayer,
  useTimelineLayerItems,
  useTrackingLayerItems,
  getLayerItems,
  normalizeLayers,
  type TimelineLayer,
} from "@features/atlas/layers";
import { type MapMode } from "@features/atlas/shared";
import { useVisitedCountries } from "@features/visits";

/**
 * Returns map layer items based on map mode and active global sidebar triggers.
 * @param mode Current map mode.
 * @returns Array of layer items based on the current active toggles.
 */
export function useMapLayerItems(mode: MapMode = "view") {
  const { filteredCountries, showVisitedOnly, wantToVisitOnly } =
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
      visitedOnly: showVisitedOnly,
      wantToVisitOnly,
      selectedListId,
      countryLists,
      filteredCountries,
    }),
    [
      showVisitedOnly,
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
    if (showVisitedOnly || selectedListId) {
      return [];
    }
    return layers.filter((o) => o.visible).flatMap(getLayerItems);
  }, [layers, showVisitedOnly, selectedListId]);

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
