import { useMemo } from "react";
import { useCountryFilters } from "@features/atlas/countries/context/CountryFiltersContext";
import { useCountryLists } from "@features/atlas/countries/context/CountryListsContext";
import {
  getLayerItems,
  isTimelineLayer,
  normalizeLayers,
  useEffectiveLayers,
  useTimelineLayerItems,
  useTrackingLayerItems,
  type TimelineLayer,
} from "@features/atlas/layers";
import { useMapView } from "@features/atlas/map";
import { useTimeline } from "@features/atlas/timeline";
import { useVisitedCountries } from "@features/visits";
import type { MapMode } from "../types";

/**
 * Returns map layer items based on map mode and active global sidebar triggers.
 * @param mode Current map mode.
 * @returns Array of layer items based on the current active toggles.
 */
export function useActiveLayerItems(mode: MapMode = "view") {
  const { filteredCountries, visitedOnly, wantToVisitOnly } =
    useCountryFilters();
  const { selectedListId, countryLists } = useCountryLists();
  const effectiveLayers = useEffectiveLayers();
  const { colorMode } = useMapView();
  const { timelineMode, selectedYear } = useTimeline();
  const { visitedCountryCodes } = useVisitedCountries();

  // Get the layer items that are shared between edit and readonly modes
  const sharedOrEditItems = useMemo(() => {
    const normalized = normalizeLayers(effectiveLayers) ?? [];
    return normalized.filter((l) => l.visible).flatMap(getLayerItems);
  }, [effectiveLayers]);

  const trackingLayerFilters = useMemo(
    () => ({
      visitedOnly,
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

  // Get the layer items that are user-customized (not tracking layers)
  const userCustomItems = useMemo(() => {
    if (visitedOnly || selectedListId) return [];
    return effectiveLayers.filter((o) => o.visible).flatMap(getLayerItems);
  }, [effectiveLayers, visitedOnly, selectedListId]);

  // Get the layer items that are relevant for timeline mode
  const timelineLayers: TimelineLayer[] = useMemo(() => {
    const virtualVisitedLayer: TimelineLayer = {
      id: "timeline-visited",
      name: "Visited",
      color: "",
      countries: visitedCountryCodes,
      visible: true,
      timelineEnabled: true,
    };

    return [virtualVisitedLayer, ...effectiveLayers.filter(isTimelineLayer)];
  }, [visitedCountryCodes, effectiveLayers]);

  const timelineItems = useTimelineLayerItems(
    timelineLayers,
    selectedYear,
    colorMode,
  );

  // Get the layer items that are relevant for standard view mode (non-timeline)
  const standardViewItems = useMemo(
    () => [...trackingLayerItems, ...userCustomItems],
    [trackingLayerItems, userCustomItems],
  );

  // Return the appropriate layer items based on the current map mode
  if (mode === "edit" || mode === "readonly") {
    return sharedOrEditItems;
  }

  return timelineMode ? timelineItems : standardViewItems;
}
