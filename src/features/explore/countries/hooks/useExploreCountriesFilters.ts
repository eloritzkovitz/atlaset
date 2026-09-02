import { useState } from "react";
import type { ExploreCountryViewControls } from "../../core/types";

/**
 * Manages filter state for the Explore Countries page.
 */
export function useExploreCountriesFilters(): ExploreCountryViewControls {
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedSubregion, setSelectedSubregion] = useState("");
  const [selectedSovereignOnly, setSelectedSovereignOnly] = useState(false);
  const [showVisitedOnly, setShowVisitedOnly] = useState(false);
  const [showTranscontinental, setShowTranscontinental] = useState(false);

  // Reset all filters
  function resetFilters() {
    setSelectedRegion("");
    setSelectedSubregion("");
    setSearch("");
    setSelectedSovereignOnly(false);
    setShowVisitedOnly(false);
    setShowTranscontinental(false);
  }

  return {
    search,
    setSearch,
    selectedRegion,
    setSelectedRegion,
    selectedSubregion,
    setSelectedSubregion,
    selectedSovereignOnly,
    setSelectedSovereignOnly,
    showVisitedOnly,
    setShowVisitedOnly,
    showTranscontinental,
    setShowTranscontinental,
    resetFilters,
  };
}
