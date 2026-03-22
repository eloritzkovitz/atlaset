import { useState } from "react";

/**
 * Minimal filter state for region, subregion, and search.
 */
export function useRegionSubregionFilters() {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedSubregion, setSelectedSubregion] = useState("");
  const [search, setSearch] = useState("");
  const [includeTranscontinental, setIncludeTranscontinental] = useState(false);

  // Reset all filters
  function resetFilters() {
    setSelectedRegion("");
    setSelectedSubregion("");
    setSearch("");
    setIncludeTranscontinental(false);
  }

  return {
    selectedRegion,
    setSelectedRegion,
    selectedSubregion,
    setSelectedSubregion,
    search,
    setSearch,
    includeTranscontinental,
    setIncludeTranscontinental,
    resetFilters,
  };
}
