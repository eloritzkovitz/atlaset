import { useEffect, useMemo } from "react";
import {
  getSubregionsForRegion,
  useCountryData,
  type Country,
} from "@features/countries";

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
  setSelectedRegion: (region: string) => void
) {
  const { countries, allSubregions } = useCountryData();

  // Dynamic subregion options based on selected region
  const subregionOptions = useMemo(
    () =>
      selectedRegion && selectedRegion !== ""
        ? getSubregionsForRegion(countries, selectedRegion)
        : allSubregions,
    [selectedRegion, countries, allSubregions]
  );

  // Auto-select region if subregion is set but region is not
  useEffect(() => {
    if (selectedSubregion && !selectedRegion && countries.length > 0) {
      const match = countries.find(
        (c: Country) => c.subregion === selectedSubregion
      );
      if (match && match.region) {
        setSelectedRegion(match.region);
      }
    }
  }, [selectedSubregion, selectedRegion, countries, setSelectedRegion]);

  return { subregionOptions };
}
