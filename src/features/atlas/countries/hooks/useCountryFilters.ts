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

  const { trips } = useTrips();

  // Counts
  const allCount = filteredCountriesNoOverlay.length;
  const { selectedYear } = useTimeline();
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
