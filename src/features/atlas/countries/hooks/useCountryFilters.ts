import { useCallback, useEffect, useMemo, useState } from "react";
import { useCountryData } from "@contexts/CountryDataContext";
import { useOverlays } from "@contexts/OverlaysContext";
import { useTimeline } from "@contexts/TimelineContext";
import { useTrips } from "@contexts/TripsContext";
import { getDefaultOverlaySelections } from "@features/atlas/overlays/utils/overlay";
import type { CountryFilterOptions, SovereigntyType } from "@features/countries";
import {
  filterCountries,
  getFilteredIsoCodes,
} from "@features/countries/utils/countryFilters";
import { getLatestYear, getVisitCountStats } from "@features/visits";
import { filterByVisitCount } from "@features/visits/utils/visitFilters";
import { useDebounce } from "@hooks";

/**
 * Manages and applies country filters.
 * @returns Various filter states and the filtered list of countries.
 */
export function useCountryFilters() {
  const { countries } = useCountryData();
  const { overlays, overlaySelections, setOverlaySelections } = useOverlays();
  const {
    timelineMode,
    years,
    selectedYear,
    setSelectedYear,
    showVisitedOnly,
  } = useTimeline();
  const { trips } = useTrips();

  // Filter states
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedSubregion, setSelectedSubregion] = useState<string>("");
  const [selectedSovereignty, setSelectedSovereignty] = useState<SovereigntyType | "">("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 250);

  // Visit count filters
  const [minVisitCount, setMinVisitCount] = useState<number>(1);
  const [maxVisitCount, setMaxVisitCount] = useState<number | undefined>(
    undefined
  );

  // Core filter parameters
  const filterParams: CountryFilterOptions = useMemo(
    () => ({
      search: debouncedSearch,
      selectedRegion,
      selectedSubregion,
      selectedSovereignty,
    }),
    [debouncedSearch, selectedRegion, selectedSubregion, selectedSovereignty]
  );

  // With overlays applied
  const filteredIsoCodes = useMemo(
    () => getFilteredIsoCodes(countries, overlays, overlaySelections),
    [countries, overlays, overlaySelections]
  );
  const filteredCountries = useMemo(
    () =>
      filterCountries(countries, {
        ...(filterParams ?? {}),
        overlayCountries: filteredIsoCodes,
      }),
    [countries, filterParams, filteredIsoCodes]
  );

  // Without overlays for counts
  const filteredCountriesNoOverlay = useMemo(
    () =>
      filterCountries(countries, {
        ...(filterParams ?? {}),
        overlayCountries: undefined,
      }),
    [countries, filterParams]
  );

  // Counts
  const allCount = filteredCountriesNoOverlay.length;
  const {
    map: visitedMap,
    min: absoluteMin,
    max: absoluteMax,
  } = getVisitCountStats(trips, selectedYear);
  const visitedIsoCodes = Object.keys(visitedMap);

  // Filter visited countries with the same core filters (no overlays)
  const visitedCountriesFiltered = filteredCountriesNoOverlay.filter((c) =>
    visitedIsoCodes.includes(c.isoCode)
  );
  const visitedCount = visitedCountriesFiltered.length;

  // Apply visit count filtering
  const finalFilteredCountries = useMemo(() => {
    if (showVisitedOnly) {
      return filterByVisitCount(
        filteredCountries,
        visitedMap,
        minVisitCount,
        maxVisitCount
      );
    }
    return filteredCountries;
  }, [
    showVisitedOnly,
    filteredCountries,
    visitedMap,
    minVisitCount,
    maxVisitCount,
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
    setOverlaySelections(getDefaultOverlaySelections(overlays));
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
    visitedCount,
    minVisitCount,
    setMinVisitCount,
    maxVisitCount,
    setMaxVisitCount,
    resetFilters,
  };
}
