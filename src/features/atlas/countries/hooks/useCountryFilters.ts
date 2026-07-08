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
  const { trips } = useTrips();
  const { isReadonly } = useMapView();
  const sharedMapInfo = useSharedMapInfo();
  const { visitedCountryCodes, wantToVisitCountryCodes } =
    useVisitedCountries();
  const { timelineMode, years, selectedYear, setSelectedYear } = useTimeline();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 250);

  const [geoFilters, setGeoFilters] = useState({
    region: "",
    subregion: "",
    geoType: "" as GeoType | "",
  });

  const [sovereignOnly, setSovereignOnlyState] = useState(false);
  const [showVisitedOnly, setShowVisitedOnly] = useState(false);
  const [wantToVisitOnly, setWantToVisitOnlyState] = useState(false);

  const [sovereignState, setSovereignState] = useState({
    value: "" as SovereigntyStatus | "",
    only: false,
  });
  const [visitedState, setVisitedState] = useState({
    value: "any" as VisitedStatus,
    wantToVisitOnly: false,
  });
  const [visitRange, setVisitRange] = useState<{
    min: number;
    max: number | undefined;
  }>({ min: 1, max: undefined });

  const setSelectedRegion = (region: string) =>
    setGeoFilters((p) => ({ ...p, region }));
  const setSelectedSubregion = (subregion: string) =>
    setGeoFilters((p) => ({ ...p, subregion }));
  const setSelectedGeoType = (geoType: GeoType | "") =>
    setGeoFilters((p) => ({ ...p, geoType }));

  const setMinVisitCount = (value: React.SetStateAction<number>) =>
    setVisitRange((p) => ({
      ...p,
      min: typeof value === "function" ? value(p.min) : value,
    }));
  const setMaxVisitCount = (value: React.SetStateAction<number | undefined>) =>
    setVisitRange((p) => ({
      ...p,
      max: typeof value === "function" ? value(p.max) : value,
    }));

  const setSelectedSovereignty = (val: SovereigntyStatus | "") => {
    setSovereignState({ value: val, only: val === "sovereign" });
    setSovereignOnlyState(val === "sovereign");
  };

  const setSovereignOnly = (only: boolean) => {
    setSovereignState({ value: only ? "sovereign" : "", only });
    setSovereignOnlyState(only);
  };

  const setSelectedVisited = (val: VisitedStatus) => {
    setVisitedState((prev) => ({
      value: val,
      wantToVisitOnly: val === "visited" ? false : prev.wantToVisitOnly,
    }));
    setShowVisitedOnly(val === "visited");
    if (val === "visited") {
      setWantToVisitOnlyState(false);
    }
  };

  const setWantToVisitOnly = (only: boolean) => {
    setVisitedState((prev) => ({
      value: only ? "any" : prev.value,
      wantToVisitOnly: only,
    }));
    setWantToVisitOnlyState(only);
    if (only) {
      setShowVisitedOnly(false);
    }
  };

  // Sync showVisitedOnly with visitedState when showVisitedOnly changes
  useEffect(() => {
    setVisitedState((prev) =>
      showVisitedOnly
        ? { value: "visited", wantToVisitOnly: false }
        : prev.value === "visited"
          ? { ...prev, value: "any" }
          : prev,
    );
  }, [showVisitedOnly]);

  // Sync showVisitedOnly with timelineMode
  useEffect(() => {
    if (timelineMode) {
      setShowVisitedOnly(true);
      setWantToVisitOnlyState(false);
    } else {
      setShowVisitedOnly(false);
    }
  }, [timelineMode]);

  const filterParams = useMemo<CountryFilterOptions>(
    () => ({
      search: debouncedSearch,
      selectedRegion: geoFilters.region,
      selectedSubregion: geoFilters.subregion,
      selectedGeoType: geoFilters.geoType,
      selectedSovereignty: sovereignState.value,
    }),
    [debouncedSearch, geoFilters, sovereignState.value],
  );

  const effectiveSharedVisitedIsoCodes = useMemo(
    () =>
      isReadonly
        ? sharedMapInfo?.layers?.find((l) => l.name === "Visited Countries")
            ?.countries
        : undefined,
    [isReadonly, sharedMapInfo],
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
    const cleanSearch = search
      .replace(/(sovereigntyStatus|sovereign|visited|wantToVisit):\s*\S+/gi, "")
      .trim();
    return {
      search: cleanSearch,
      params: {
        ...filterParams,
        search: cleanSearch,
        selectedSovereignty: /(sovereigntyStatus|sovereign):\s*\S+/i.test(
          search,
        )
          ? ("" as const)
          : filterParams.selectedSovereignty,
      },
    };
  }, [search, filterParams]);

  // Calculate global search results without any active tab reductions
  const searchedCountries = useMemo(
    () =>
      applyQualifierSearch(
        countries,
        countPipelineConfig.search,
        visitedIsoCodes,
        countPipelineConfig.params,
        filteredIsoCodes,
        visitedMap,
        visitedYearMap,
      ),
    [
      countries,
      countPipelineConfig,
      visitedIsoCodes,
      filteredIsoCodes,
      visitedMap,
      visitedYearMap,
    ],
  );

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
      const listCodes = new Set(
        countryLists.find((l) => l.id === selectedListId)?.countryCodes || [],
      );
      base = base.filter((c) => listCodes.has(c.isoCode));
    }

    if (wantToVisitOnly) {
      const wantToVisitSet = new Set(wantToVisitCountryCodes);
      base = base.filter((c) => wantToVisitSet.has(c.isoCode));
    } else if (showVisitedOnly) {
      if (isReadonly && effectiveSharedVisitedIsoCodes) {
        const sharedSet = new Set(effectiveSharedVisitedIsoCodes);
        base = base.filter((c) => sharedSet.has(c.isoCode));
      } else if (timelineMode) {
        base = filterByVisitCount(
          base,
          visitedMap,
          visitRange.min,
          visitRange.max,
        );
      } else {
        const manualSet = new Set(visitedCountryCodes);
        base = base.filter(
          (c) =>
            manualSet.has(c.isoCode) ||
            Object.prototype.hasOwnProperty.call(visitedMap, c.isoCode),
        );
      }
    }

    if (sovereignOnly) {
      base = base.filter(createSovereigntyFilter(true));
    }

    return filterByVisitStatus(
      base,
      visitedIsoCodes,
      wantToVisitCountryCodes,
      visitedState.value,
    );
  }, [
    countries,
    filterParams,
    filteredIsoCodes,
    visitedState.value,
    visitedIsoCodes,
    debouncedSearch,
    countryLists,
    selectedListId,
    showVisitedOnly,
    wantToVisitOnly,
    isReadonly,
    effectiveSharedVisitedIsoCodes,
    visitedMap,
    visitedYearMap,
    visitRange,
    sovereignOnly,
    visitedCountryCodes,
    wantToVisitCountryCodes,
    timelineMode,
  ]);

  // Country counts
  const counts = useMemo(
    () =>
      getCountryCounts({
        filteredCountries: searchedCountries,
        visitedIsoCodes,
        wantToVisitIsoCodes: wantToVisitCountryCodes,
      }),
    [searchedCountries, visitedIsoCodes, wantToVisitCountryCodes],
  );

  // Reset timeline-related filters
  const resetTimelineFilters = useCallback(() => {
    setSelectedYear(getLatestYear(years));
    setVisitRange({ min: absoluteMin, max: absoluteMax });
  }, [setSelectedYear, years, absoluteMin, absoluteMax]);

  // Reset timeline filters when timeline mode is disabled
  useEffect(() => {
    if (!timelineMode) resetTimelineFilters();
  }, [timelineMode, resetTimelineFilters]);

  // Reset filters
  const resetFilters = () => {
    setGeoFilters({ region: "", subregion: "", geoType: "" });
    setSovereignState({ value: "", only: false });
    setSovereignOnlyState(false);
    setVisitedState({ value: "any", wantToVisitOnly: false });
    setWantToVisitOnlyState(false);
    setShowVisitedOnly(false);
    setLayerSelections(getDefaultLayerSelections(layers));
    resetTimelineFilters();
  };

  return {
    search,
    setSearch,
    debouncedSearch,
    filteredIsoCodes,
    filteredCountries,
    searchedCountries,
    visitedIsoCodes,
    wantToVisitCountryCodes,
    ...counts,
    selectedRegion: geoFilters.region,
    selectedSubregion: geoFilters.subregion,
    selectedGeoType: geoFilters.geoType,
    setSelectedRegion,
    setSelectedSubregion,
    setSelectedGeoType,
    selectedSovereignty: sovereignState.value,
    sovereignOnly,
    setSelectedSovereignty,
    setSovereignOnly,
    selectedVisited: visitedState.value,
    setSelectedVisited,
    showVisitedOnly,
    setShowVisitedOnly,
    wantToVisitOnly,
    setWantToVisitOnly,
    minVisitCount: visitRange.min,
    maxVisitCount: visitRange.max,
    setMinVisitCount,
    setMaxVisitCount,
    resetFilters,
  };
}
