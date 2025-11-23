import { useState } from "react";
import { getVisitedCountries } from "@features/countries/utils/countryData";
import {
  filterCountries,
  getFilteredIsoCodes,
} from "@features/countries/utils/countryFilters";
import { useDebounce } from "@hooks/useDebounce";
import type { Country, Overlay } from "@types";

type OverlaySelections = Record<string, string>;

interface UseCountryFiltersProps {
  countries: Country[];
  overlays: Overlay[];
  overlaySelections: OverlaySelections;
  showVisitedOnly: boolean;
}

export function useCountryFilters({
  countries,
  overlays,
  overlaySelections,
  showVisitedOnly,
}: UseCountryFiltersProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedSubregion, setSelectedSubregion] = useState<string>("");
  const [selectedSovereignty, setSelectedSovereignty] = useState<string>("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 250);

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
  const visitedCountries = getVisitedCountries(
    filteredCountriesNoOverlay,
    overlays
  );
  const visitedCount = visitedCountries.length;

  let finalFilteredCountries = filteredCountries;
  if (showVisitedOnly) {
    finalFilteredCountries = getVisitedCountries(filteredCountries, overlays);
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
  };
}
