import { useEffect, useMemo } from "react";

/**
 * Manages logic for region and subregion selection.
 * @param allSubregions - List of all available subregions
 * @param subregionsByRegion - Mapping of regions to their corresponding subregions
 * @param selectedRegion - The currently selected region
 * @param selectedSubregion - The currently selected subregion
 * @param setSelectedRegion - Function to set the selected region
 */
export function useRegionSubregionSelection(
  allSubregions: string[],
  subregionsByRegion: Record<string, string[]>,
  selectedRegion: string,
  selectedSubregion: string,
  setSelectedRegion: (region: string) => void,
) {
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
