import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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
import { CountryFiltersContext } from "./CountryFiltersContext";
import { useCountryLists } from "./CountryListsContext";
import { useLayers } from "./LayersContext";
import { useMapView } from "./MapViewContext";
import { useTimeline } from "./TimelineContext";
import { useTrips } from "./TripsContext";

interface CountryFiltersProviderProps {
  children: ReactNode;
}

export function CountryFiltersProvider({
  children,
}: CountryFiltersProviderProps) {
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

  const sovereignOnly = sovereignState.only;
  const visitedOnly = visitedState.value === "visited";
  const wantToVisitOnly = visitedState.wantToVisitOnly;

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
  };

  const setSovereignOnly = (only: boolean) => {
    setSovereignState({ value: only ? "sovereign" : "", only });
  };

  const setSelectedVisited = (val: VisitedStatus) => {
    setVisitedState({
      value: val,
      wantToVisitOnly: false,
    });
  };

  const setWantToVisitOnly = (only: boolean) => {
    setVisitedState((prev) => ({
      value: only ? "any" : prev.value,
      wantToVisitOnly: only,
    }));
  };

  const setVisitedOnly = (only: boolean) => {
    setVisitedState((prev) => ({
      value: only ? "visited" : prev.value === "visited" ? "any" : prev.value,
      wantToVisitOnly: only ? false : prev.wantToVisitOnly,
    }));
  };

  // Sync visitedOnly with visitedState when visitedOnly changes
  useEffect(() => {
    setVisitedState((prev) =>
      visitedOnly
        ? { value: "visited", wantToVisitOnly: false }
        : prev.value === "visited"
          ? { ...prev, value: "any" }
          : prev,
    );
  }, [visitedOnly]);

  // Sync visitedOnly with timelineMode
  useEffect(() => {
    if (timelineMode) {
      setVisitedState({ value: "visited", wantToVisitOnly: false });
    } else {
      setVisitedState((prev) => ({ ...prev, value: "any" }));
    }
  }, [timelineMode]);

  // Determine if any filters are active
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

  // Determine effective shared visited ISO codes if in readonly mode
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

  const bypassLayers = visitedOnly || wantToVisitOnly || selectedListId;
  const effectiveIsoCodes = useMemo(
    () => (bypassLayers ? countries.map((c) => c.isoCode) : filteredIsoCodes),
    [bypassLayers, countries, filteredIsoCodes],
  );

  // Calculate global search results without any active tab reductions
  const searchedCountries = useMemo(
    () =>
      applyQualifierSearch(
        countries,
        search,
        visitedIsoCodes,
        filterParams,
        effectiveIsoCodes,
        visitedMap,
        visitedYearMap,
        wantToVisitCountryCodes,
      ),
    [
      countries,
      search,
      visitedIsoCodes,
      filterParams,
      effectiveIsoCodes,
      visitedMap,
      visitedYearMap,
      wantToVisitCountryCodes,
    ],
  );

  // Main filtering logic
  const filteredCountries = useMemo(() => {
    let base = applyQualifierSearch(
      countries,
      debouncedSearch,
      visitedIsoCodes,
      filterParams,
      effectiveIsoCodes,
      visitedMap,
      visitedYearMap,
      wantToVisitCountryCodes,
    );

    if (
      selectedListId &&
      selectedListId !== "VISITED_COUNTRIES" &&
      selectedListId !== "WANT_TO_VISIT"
    ) {
      const listCodes = new Set(
        countryLists.find((l) => l.id === selectedListId)?.countryCodes || [],
      );
      base = base.filter((c) => listCodes.has(c.isoCode));
    }

    if (wantToVisitOnly || selectedListId === "WANT_TO_VISIT") {
      const wantToVisitSet = new Set(wantToVisitCountryCodes);
      base = base.filter((c) => wantToVisitSet.has(c.isoCode));
    } else if (visitedOnly || selectedListId === "VISITED_COUNTRIES") {
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
    effectiveIsoCodes,
    visitedState.value,
    visitedIsoCodes,
    debouncedSearch,
    countryLists,
    selectedListId,
    visitedOnly,
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
  const resetFilters = useCallback(() => {
    setGeoFilters({ region: "", subregion: "", geoType: "" });
    setSovereignState({ value: "", only: false });
    setVisitedState({ value: "any", wantToVisitOnly: false });
    setLayerSelections(getDefaultLayerSelections(layers));
    resetTimelineFilters();
  }, [layers, setLayerSelections, resetTimelineFilters]);

  const contextValue = useMemo(
    () => ({
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
      visitedOnly,
      setVisitedOnly,
      wantToVisitOnly,
      setWantToVisitOnly,
      minVisitCount: visitRange.min,
      maxVisitCount: visitRange.max,
      setMinVisitCount,
      setMaxVisitCount,
      resetFilters,
    }),
    [
      search,
      debouncedSearch,
      filteredIsoCodes,
      filteredCountries,
      searchedCountries,
      visitedIsoCodes,
      wantToVisitCountryCodes,
      counts,
      geoFilters,
      sovereignState.value,
      sovereignOnly,
      visitedState.value,
      visitedOnly,
      wantToVisitOnly,
      visitRange,
      resetFilters,
    ],
  );

  return (
    <CountryFiltersContext.Provider value={contextValue}>
      {children}
    </CountryFiltersContext.Provider>
  );
}
