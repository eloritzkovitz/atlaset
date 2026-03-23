import { useCallback, useEffect, useMemo, useState } from "react";
import { useCountryLists } from "@contexts/CountryListsContext";
import { useLayers } from "@contexts/LayersContext";
import { useMapView } from "@contexts/MapViewContext";
import { useTimeline } from "@contexts/TimelineContext";
import { useTrips } from "@contexts/TripsContext";
import { useSharedMapInfo } from "@features/atlas/export";
import {
  getDefaultLayerSelections,
  useEffectiveLayers,
} from "@features/atlas/layers";
import {
  createSovereigntyFilter,
  filterCountries,
  filterCountriesByProperty,
  getCountryCounts,
  getFilteredIsoCodes,
  parsePropertySearch,
  useCountryData,
  type CountryFilterOptions,
  type SovereigntyType,
} from "@features/countries";
import {
  filterByVisitCount,
  filterByVisitStatus,
  getLatestYear,
  getVisitCountStats,
  type VisitedStatus,
} from "@features/visits";
import { useDebounce } from "@hooks";

/**
 * Manages and applies country filters.
 * @returns Various filter states and the filtered list of countries.
 */
export function useCountryFilters() {
  const { countries } = useCountryData();
  const { countryLists, selectedListId } = useCountryLists();
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
  const [sovereignOnly, setSovereignOnly] = useState(false);
  const [selectedVisited, setSelectedVisited] = useState<VisitedStatus>("any");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 250);

  // Whether to include transcontinental additional region/subregion matches
  const [includeTranscontinental, setIncludeTranscontinental] = useState(false);

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
      includeTranscontinental,
    }),
    [
      debouncedSearch,
      selectedRegion,
      selectedSubregion,
      selectedSovereignty,
      includeTranscontinental,
    ],
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

  // With layers applied, including visited filter
  const filteredIsoCodes = useMemo(
    () => getFilteredIsoCodes(countries, layers, layerSelections),
    [countries, layers, layerSelections],
  );

  // Main filtering logic
  const filteredCountries = useMemo(() => {
    const parsed = parsePropertySearch(debouncedSearch);
    let base = parsed
      ? filterCountriesByProperty(
          countries,
          parsed.property,
          parsed.query,
          visitedIsoCodes,
        )
      : filterCountries(countries, {
          ...filterParams,
          layerCountries: filteredIsoCodes,
        });

    if (selectedListId) {
      const selectedList = countryLists.find((l) => l.id === selectedListId);
      base = base.filter((c) =>
        selectedList?.countryCodes?.includes(c.isoCode),
      );
    }

    if (showVisitedOnly) {
      if (isReadonly && effectiveSharedVisitedIsoCodes) {
        base = base.filter((c) =>
          effectiveSharedVisitedIsoCodes.includes(c.isoCode),
        );
      } else {
        base = filterByVisitCount(
          base,
          visitedMap,
          minVisitCount,
          maxVisitCount,
        );
      }
    }

    if (sovereignOnly) {
      base = base.filter(createSovereigntyFilter(true));
    }
    return filterByVisitStatus(base, visitedIsoCodes, selectedVisited);
  }, [
    countries,
    filterParams,
    filteredIsoCodes,
    selectedVisited,
    visitedIsoCodes,
    debouncedSearch,
    countryLists,
    selectedListId,
    showVisitedOnly,
    isReadonly,
    effectiveSharedVisitedIsoCodes,
    visitedMap,
    minVisitCount,
    maxVisitCount,
    sovereignOnly,
  ]);

  // Filtered countries without layer filtering for count calculations
  const filteredCountriesNoLayer = useMemo(() => {
    const base = filterCountries(countries, {
      ...filterParams,
      layerCountries: undefined,
    });
    return filterByVisitStatus(base, visitedIsoCodes, selectedVisited);
  }, [countries, filterParams, selectedVisited, visitedIsoCodes]);

  // Country counts
  const { allCount, allCountWithoutLayers, sovereignCount, visitedCount } =
    getCountryCounts({
      filteredCountries,
      filteredCountriesNoLayer,
      visitedIsoCodes,
    });

  // Reset core filters
  function resetCoreFilters() {
    setSelectedRegion("");
    setSelectedSubregion("");
    setSelectedSovereignty("");
    setSelectedVisited("any");
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
    selectedVisited,
    setSelectedVisited,
    search,
    setSearch,
    debouncedSearch,
    filteredIsoCodes,
    filteredCountries,
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
    includeTranscontinental,
    setIncludeTranscontinental,
  };
}
