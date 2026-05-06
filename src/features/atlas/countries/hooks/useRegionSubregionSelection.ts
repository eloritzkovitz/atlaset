import { useEffect, useMemo } from "react";
import { useCountryData } from "@features/countries";

/**
 * Manages logic for region and subregion selection.
 *
 * @param selectedRegion The currently selected region
 * @param selectedSubregion The currently selected subregion
 * @param setSelectedRegion Function to set the selected region
 */
export function useRegionSubregionSelection(
  selectedRegion: string,
  selectedSubregion: string,
  setSelectedRegion: (region: string) => void,
) {
  const { allSubregions, subregionsByRegion } = useCountryData();

  // Dynamic subregion options based on selected region
  const subregionOptions = useMemo(() => {
    if (selectedRegion && selectedRegion !== "") {
      return subregionsByRegion?.[selectedRegion] ?? [];
    }
    return allSubregions;
  }, [selectedRegion, subregionsByRegion, allSubregions]);

  // Auto-select region if subregion is set but region is not
  useEffect(() => {
    if (selectedSubregion && !selectedRegion) {
      if (subregionsByRegion) {
        for (const [rk, subs] of Object.entries(subregionsByRegion)) {
          if (subs.includes(selectedSubregion)) {
            setSelectedRegion(rk);
            return;
          }
        }
      }
    }
  }, [
    selectedSubregion,
    selectedRegion,
    subregionsByRegion,
    setSelectedRegion,
  ]);

  return { subregionOptions };
}
