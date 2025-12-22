import { useState } from "react";

/**
 * Minimal filter state for region, subregion, and search.
 */
export function useRegionSubregionFilters() {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedSubregion, setSelectedSubregion] = useState("");
  const [search, setSearch] = useState("");

  // Reset all filters
  function resetFilters() {
    setSelectedRegion("");
    setSelectedSubregion("");
    setSearch("");
  }

  return {
    selectedRegion,
    setSelectedRegion,
    selectedSubregion,
    setSelectedSubregion,
    search,
    setSearch,
    resetFilters,
  };
}
