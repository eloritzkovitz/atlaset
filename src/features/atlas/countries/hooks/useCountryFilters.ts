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
  applyQualifierSearch,
  getCountryCounts,
  getFilteredIsoCodes,
  useCountryData,
  type CountryFilterOptions,
  type SovereigntyStatus,
  type GeoType,
} from "@features/countries";
import {
  filterByVisitCount,
  filterByVisitStatus,
  getLatestYear,
  useVisitedCountries,
  useVisitStats,
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
  const { visitedCountryCodes, wantToVisitCountryCodes } =
    useVisitedCountries();

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
  const [selectedGeoType, setSelectedGeoType] = useState<GeoType | "">("");
  const [selectedSovereignty, setSelectedSovereignty] = useState<
    SovereigntyStatus | ""
  >("");
  const [sovereignOnly, setSovereignOnly] = useState(false);
  const [selectedVisited, setSelectedVisited] = useState<VisitedStatus>("any");
  const [wantToVisitOnly, setWantToVisitOnly] = useState(false);
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
      selectedGeoType,
      selectedSovereignty,
    }),
    [
      debouncedSearch,
      selectedRegion,
      selectedSubregion,
      selectedGeoType,
      selectedSovereignty,
    ],
  );

  // Get visit stats for visited filter and counts
  const {
    visitedMap,
    absoluteMin,
    absoluteMax,
    visitedYearMap,
    visitedIsoCodes,
  } = useVisitStats(
    trips,
    selectedYear,
    years,
    isReadonly,
    effectiveSharedVisitedIsoCodes,
    timelineMode ? [] : visitedCountryCodes,
  );

  // With layers applied, including visited filter
  const filteredIsoCodes = useMemo(
    () => getFilteredIsoCodes(countries, layers, layerSelections),
    [countries, layers, layerSelections],
  );

  // Compute counts for country lists based on filtered countries
  const countPipelineConfig = useMemo(() => {
    let cleanSearch = search;

    // Explicitly check the string presence to decouple from state-batching race conditions
    const hasSovereignQualifier =
      /sovereigntyStatus:\s*\S+|sovereign:\s*\S+/i.test(cleanSearch);
    const hasVisitedQualifier = /visited:\s*\S+/i.test(cleanSearch);
    const hasWantToVisitQualifier = /wantToVisit:\s*\S+/i.test(cleanSearch);

    if (hasSovereignQualifier) {
      cleanSearch = cleanSearch.replace(
        /sovereigntyStatus:\s*\S+|sovereign:\s*\S+/gi,
        "",
      );
    }

    if (hasVisitedQualifier) {
      cleanSearch = cleanSearch.replace(/visited:\s*\S+/i, "");
    }

    if (hasWantToVisitQualifier) {
      cleanSearch = cleanSearch.replace(/wantToVisit:\s*\S+/i, "");
    }

    cleanSearch = cleanSearch.trim();

    return {
      search: cleanSearch,
      params: {
        ...filterParams,
        search: cleanSearch,
        selectedSovereignty: hasSovereignQualifier
          ? ("" as const)
          : filterParams.selectedSovereignty,
      },
      isTransitioning:
        hasVisitedQualifier || hasSovereignQualifier || hasWantToVisitQualifier,
    };
  }, [search, filterParams]);

  // Calculate global search results without any active tab reductions
  const searchedCountries = useMemo(() => {
    return applyQualifierSearch(
      countries,
      countPipelineConfig.search,
      visitedIsoCodes,
      countPipelineConfig.params,
      filteredIsoCodes,
      visitedMap,
      visitedYearMap,
    );
  }, [
    countries,
    countPipelineConfig,
    visitedIsoCodes,
    filteredIsoCodes,
    visitedMap,
    visitedYearMap,
  ]);

  // Main filtering logic
  const filteredCountries = useMemo(() => {
    let base = applyQualifierSearch(
      countries,
      debouncedSearch,
      visitedIsoCodes,
      filterParams,
      filteredIsoCodes,
      visitedMap,
      visitedYearMap,
      wantToVisitCountryCodes,
    );

    if (selectedListId) {
      const selectedList = countryLists.find((l) => l.id === selectedListId);
      base = base.filter((c) =>
        selectedList?.countryCodes?.includes(c.isoCode),
      );
    }

    if (wantToVisitOnly) {
      const wantToVisitSet = new Set(wantToVisitCountryCodes);
      base = base.filter((c) => wantToVisitSet.has(c.isoCode));
    } else if (showVisitedOnly) {
      if (isReadonly && effectiveSharedVisitedIsoCodes) {
        base = base.filter((c) =>
          effectiveSharedVisitedIsoCodes.includes(c.isoCode),
        );
      } else {
        // If timeline mode is active, filter purely by trip footprint metrics
        if (timelineMode) {
          base = filterByVisitCount(
            base,
            visitedMap,
            minVisitCount,
            maxVisitCount,
          );
        } else {
          // Otherwise, show countries that are either manual entries OR have trip records
          const manualSet = new Set(visitedCountryCodes);
          base = base.filter(
            (c) =>
              manualSet.has(c.isoCode) ||
              Object.prototype.hasOwnProperty.call(visitedMap, c.isoCode),
          );
        }
      }
    }

    if (sovereignOnly) {
      base = base.filter(createSovereigntyFilter(true));
    }

    return filterByVisitStatus(
      base,
      visitedIsoCodes,
      wantToVisitCountryCodes,
      selectedVisited,
    );
  }, [
    countries,
    filterParams,
    filteredIsoCodes,
    selectedVisited,
    visitedIsoCodes,
    debouncedSearch,
    countryLists,
    selectedListId,
    wantToVisitOnly,
    showVisitedOnly,
    isReadonly,
    effectiveSharedVisitedIsoCodes,
    visitedMap,
    visitedYearMap,
    minVisitCount,
    maxVisitCount,
    sovereignOnly,
    visitedCountryCodes,
    wantToVisitCountryCodes,
    timelineMode,
  ]);

  // Country counts
  const { allCount, sovereignCount, visitedCount, wantToVisitCount } =
    getCountryCounts({
      filteredCountries: searchedCountries,
      visitedIsoCodes,
      wantToVisitIsoCodes: wantToVisitCountryCodes,
    });

  // Reset core filters
  function resetCoreFilters() {
    setSelectedRegion("");
    setSelectedSubregion("");
    setSelectedGeoType("");
    setSelectedSovereignty("");
    setSelectedVisited("any");
    setWantToVisitOnly(false);
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
    selectedGeoType,
    setSelectedGeoType,
    selectedSovereignty,
    setSelectedSovereignty,
    selectedVisited,
    setSelectedVisited,
    search,
    setSearch,
    debouncedSearch,
    filteredIsoCodes,
    filteredCountries,
    searchedCountries,
    allCount,
    sovereignCount,
    sovereignOnly,
    setSovereignOnly,
    visitedCount,
    visitedIsoCodes,
    wantToVisitCountryCodes,
    wantToVisitCount,
    wantToVisitOnly,
    setWantToVisitOnly,
    minVisitCount,
    setMinVisitCount,
    maxVisitCount,
    setMaxVisitCount,
    resetFilters,
  };
}
