import { useCallback, useEffect, useMemo, useState } from "react";
import { useLayers } from "@contexts/LayersContext";
import { useMapView } from "@contexts/MapViewContext";
import { useTimeline } from "@contexts/TimelineContext";
import { useTrips } from "@contexts/TripsContext";
import {
  getDefaultLayerSelections,
  useEffectiveLayers,
} from "@features/atlas/layers";
import { useSharedMapInfo } from "@features/atlas/export";
import {
  createSovereigntyFilter,
  filterCountries,
  getCountryCounts,
  getFilteredIsoCodes,
  useCountryData,
  type CountryFilterOptions,
  type SovereigntyType,
} from "@features/countries";
import { getLatestYear, getVisitCountStats } from "@features/visits";
import { filterByVisitCount } from "@features/visits/utils/visitFilters";
import { useDebounce } from "@hooks";

/**
 * Manages and applies country filters.
 * @returns Various filter states and the filtered list of countries.
 */
export function useCountryFilters() {
  const { countries } = useCountryData();
  const { layerSelections, setLayerSelections } = useLayers();
  const layers = useEffectiveLayers();
  const {
    timelineMode,
    years,
    selectedYear,
    setSelectedYear,
    showVisitedOnly,
  } = useTimeline();
  const { trips } = useTrips();
  const { isReadonly } = useMapView();
  const sharedMapInfo = useSharedMapInfo();

  // Sovereign toggle
  const [sovereignOnly, setSovereignOnly] = useState(false);

  // Determine effective shared visited iso codes in readonly mode
  const effectiveSharedVisitedIsoCodes = useMemo(() => {
    if (isReadonly && sharedMapInfo?.layers) {
      return (
        sharedMapInfo.layers.find((l) => l.name === "Visited Countries")
          ?.countries ?? []
      );
    }
    return undefined;
  }, [isReadonly, sharedMapInfo]);

  // Filter states
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedSubregion, setSelectedSubregion] = useState<string>("");
  const [selectedSovereignty, setSelectedSovereignty] = useState<
    SovereigntyType | ""
  >("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 250);

  // Visit count filters
  const [minVisitCount, setMinVisitCount] = useState<number>(1);
  const [maxVisitCount, setMaxVisitCount] = useState<number | undefined>(
    undefined,
  );

  // Core filter parameters
  const filterParams: CountryFilterOptions = useMemo(
    () => ({
      search: debouncedSearch,
      selectedRegion,
      selectedSubregion,
      selectedSovereignty,
    }),
    [debouncedSearch, selectedRegion, selectedSubregion, selectedSovereignty],
  );

  // With layers applied
  const filteredIsoCodes = useMemo(
    () => getFilteredIsoCodes(countries, layers, layerSelections),
    [countries, layers, layerSelections],
  );
  const filteredCountries = useMemo(
    () =>
      filterCountries(countries, {
        ...(filterParams ?? {}),
        layerCountries: filteredIsoCodes,
      }),
    [countries, filterParams, filteredIsoCodes],
  );

  // Without layers for counts
  const filteredCountriesNoLayer = useMemo(
    () =>
      filterCountries(countries, {
        ...(filterParams ?? {}),
        layerCountries: undefined,
      }),
    [countries, filterParams],
  );

  // Counts and visit map
  const {
    map: visitedMap,
    min: absoluteMin,
    max: absoluteMax,
  } = getVisitCountStats(trips, selectedYear);

  // Determine visited iso codes based on mode
  const visitedIsoCodes =
    isReadonly && effectiveSharedVisitedIsoCodes
      ? effectiveSharedVisitedIsoCodes
      : Object.keys(visitedMap);

  // Country counts
  const { allCount, allCountWithoutLayers, sovereignCount, visitedCount } =
    getCountryCounts({
      filteredCountries,
      filteredCountriesNoLayer,
      visitedIsoCodes,
    });

  // Apply visit count and sovereign filtering
  const finalFilteredCountries = useMemo(() => {
    let result = filteredCountries;
    if (showVisitedOnly) {
      // In readonly mode with sharedVisitedIsoCodes, filter by those iso codes only
      if (isReadonly && effectiveSharedVisitedIsoCodes) {
        result = filteredCountries.filter((c) =>
          effectiveSharedVisitedIsoCodes.includes(c.isoCode),
        );
      } else {
        result = filterByVisitCount(
          filteredCountries,
          visitedMap,
          minVisitCount,
          maxVisitCount,
        );
      }
    }
    if (sovereignOnly) {
      result = result.filter(createSovereigntyFilter(true));
    }
    return result;
  }, [
    showVisitedOnly,
    sovereignOnly,
    filteredCountries,
    visitedMap,
    minVisitCount,
    maxVisitCount,
    isReadonly,
    effectiveSharedVisitedIsoCodes,
  ]);

  // Reset core filters
  function resetCoreFilters() {
    setSelectedRegion("");
    setSelectedSubregion("");
    setSelectedSovereignty("");
  }

  // Reset timeline-related filters
  const resetTimelineFilters = useCallback(() => {
    setSelectedYear(getLatestYear(years));
    setMinVisitCount(absoluteMin);
    setMaxVisitCount(absoluteMax);
  }, [setSelectedYear, years, absoluteMin, absoluteMax]);

  // Reset filters
  function resetFilters() {
    resetCoreFilters();
    setLayerSelections(getDefaultLayerSelections(layers));
    resetTimelineFilters();
  }

  // Reset timeline filters when timeline mode is disabled
  useEffect(() => {
    if (!timelineMode) {
      resetTimelineFilters();
    }
  }, [timelineMode, resetTimelineFilters]);

  return {
    selectedRegion,
    setSelectedRegion,
    selectedSubregion,
    setSelectedSubregion,
    selectedSovereignty,
    setSelectedSovereignty,
    search,
    setSearch,
    debouncedSearch,
    filteredIsoCodes,
    filteredCountries: finalFilteredCountries,
    allCount,
    allCountWithoutLayers,
    sovereignCount,
    sovereignOnly,
    setSovereignOnly,
    visitedCount,
    visitedIsoCodes,
    minVisitCount,
    setMinVisitCount,
    maxVisitCount,
    setMaxVisitCount,
    resetFilters,
  };
}
