import { useState } from "react";
import { useTimeline } from "@contexts/TimelineContext";
import { useTrips } from "@contexts/TripsContext";
import {
  filterCountries,
  getFilteredIsoCodes,
} from "@features/countries/utils/countryFilters";
import { getVisitedCountriesUpToYear } from "@features/visits";
import { useDebounce } from "@hooks/useDebounce";
import type { Country, Overlay } from "@types";

interface UseCountryFiltersProps {
  countries: Country[];
  overlays: Overlay[];
  overlaySelections: Record<string, string>;
}

/**
 * Manages and applies country filters.
 * @param countries - List of all countries.
 * @param overlays - List of all overlays.
 * @param overlaySelections - Current overlay selections.
 * @returns Various filter states and the filtered list of countries.
 */
export function useCountryFilters({
  countries,
  overlays,
  overlaySelections,
}: UseCountryFiltersProps) {
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

  const { trips } = useTrips();

  // Counts
  const allCount = filteredCountriesNoOverlay.length;
  const { selectedYear, showVisitedOnly } = useTimeline();
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
  };
}
