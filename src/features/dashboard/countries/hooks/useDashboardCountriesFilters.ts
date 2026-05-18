import { useState } from "react";

/**
 * Manages filter state for the dashboard countries pages.
 */
export function useDashboardCountriesFilters() {
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedSubregion, setSelectedSubregion] = useState("");
  const [selectedSovereignOnly, setSelectedSovereignOnly] = useState(false);
  const [includeTranscontinental, setIncludeTranscontinental] = useState(false);

  // Reset all filters
  function resetFilters() {
    setSelectedRegion("");
    setSelectedSubregion("");
    setSearch("");
    setIncludeTranscontinental(false);
    setSelectedSovereignOnly(false);
  }

  return {
    selectedRegion,
    setSelectedRegion,
    selectedSubregion,
    setSelectedSubregion,
    search,
    setSearch,
    selectedSovereignOnly,
    setSelectedSovereignOnly,
    includeTranscontinental,
    setIncludeTranscontinental,
    resetFilters,
  };
}
