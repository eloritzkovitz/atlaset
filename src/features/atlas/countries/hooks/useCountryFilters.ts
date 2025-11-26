import { useEffect, useState } from "react";
import { useTimeline } from "@contexts/TimelineContext";
import { useTrips } from "@contexts/TripsContext";
import {
  filterCountries,
  getFilteredIsoCodes,
} from "@features/countries/utils/countryFilters";
import { getDefaultOverlaySelections } from "@features/atlas/overlays/utils/overlay";
import {
  getLatestYear,
  getVisitCountStats,
  getVisitedCountriesUpToYear,
} from "@features/visits";
import {
  filterByVisited,
  filterByVisitCount,
} from "@features/visits/utils/visitFilters";
import { useDebounce } from "@hooks/useDebounce";
import { useOverlays } from "@contexts/OverlayContext";
import { useCountryData } from "@contexts/CountryDataContext";

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
  const [selectedSovereignty, setSelectedSovereignty] = useState<string>("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 250);

  // Visit count filters
  const [minVisitCount, setMinVisitCount] = useState<number>(1);
  const [maxVisitCount, setMaxVisitCount] = useState<number | undefined>(
    undefined
  );

  // With overlays applied
  const filteredIsoCodes = getFilteredIsoCodes(
    countries,
    overlays,
    overlaySelections
  );
  const filteredCountries = filterCountries(countries, {
    search: debouncedSearch,
    selectedRegion,
    selectedSubregion,
    selectedSovereignty,
    overlayCountries: filteredIsoCodes,
  });

  // Without overlays for counts
  const filteredCountriesNoOverlay = filterCountries(countries, {
    search: debouncedSearch,
    selectedRegion,
    selectedSubregion,
    selectedSovereignty,
    overlayCountries: undefined,
  });

  // Counts
  const allCount = filteredCountriesNoOverlay.length;
  const {
    map: visitedMap,
    min: absoluteMin,
    max: absoluteMax,
  } = getVisitCountStats(trips, years[years.length - 1]);
  const visitedIsoCodes = Object.keys(visitedMap);
  const visitedCount = visitedIsoCodes.length;

  // If showing visited only, filter the countries accordingly
  let finalFilteredCountries = filteredCountries;
  if (showVisitedOnly) {
    const visitedMapForFilter = getVisitedCountriesUpToYear(
      trips,
      selectedYear,
      undefined
    );
    const visitedIsoCodesForFilter = Object.keys(visitedMapForFilter);
    finalFilteredCountries = filterByVisited(
      finalFilteredCountries,
      visitedIsoCodesForFilter
    );
  }

  // Apply visit count filtering
  if (showVisitedOnly) {
    finalFilteredCountries = filterByVisitCount(
      finalFilteredCountries,
      visitedMap,
      minVisitCount,
      maxVisitCount
    );
  }

  // Reset core filters
  function resetCoreFilters() {
    setSelectedRegion("");
    setSelectedSubregion("");
    setSelectedSovereignty("");
  }

  // Reset timeline-related filters
  function resetTimelineFilters() {
    setSelectedYear(getLatestYear(years));
    setMinVisitCount(absoluteMin);
    setMaxVisitCount(absoluteMax);
  }

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
  }, [timelineMode]);

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
