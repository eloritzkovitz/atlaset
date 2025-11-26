import { useState } from "react";
import { useTimeline } from "@contexts/TimelineContext";
import { useTrips } from "@contexts/TripsContext";
import {
  filterCountries,
  getFilteredIsoCodes,
} from "@features/countries/utils/countryFilters";
import { getLatestYear, getVisitedCountriesUpToYear } from "@features/visits";
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
  const { years, selectedYear, setSelectedYear, showVisitedOnly } =
    useTimeline();
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
  const visitedMap = getVisitedCountriesUpToYear(
    trips,
    selectedYear,
    undefined
  );
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
    finalFilteredCountries = filteredCountries.filter((c) =>
      visitedIsoCodesForFilter.includes(c.isoCode)
    );
  }

  // Apply min/max visit count filters
  if (minVisitCount > 1) {
    finalFilteredCountries = finalFilteredCountries.filter(
      (c) => (visitedMap[c.isoCode] || 0) >= minVisitCount
    );
  }
  if (typeof maxVisitCount === "number") {
    finalFilteredCountries = finalFilteredCountries.filter(
      (c) => (visitedMap[c.isoCode] || 0) <= maxVisitCount
    );
  }

  // Reset filters
  function resetFilters() {
    setSelectedRegion("");
    setSelectedSubregion("");
    setSelectedSovereignty("");
    setOverlaySelections(
      overlays.reduce((acc, overlay) => {
        acc[overlay.id] = "all";
        return acc;
      }, {} as Record<string, string>)
    );
    setSelectedYear(getLatestYear(years));
    setMinVisitCount(1);
    setMaxVisitCount(undefined);
  }

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
