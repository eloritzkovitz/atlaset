/**
 * Utility functions for filtering countries based on various criteria.
 */

import type { Overlay } from "@features/atlas/overlays";
import { filterBySearch } from "@utils/filter";
import type { Country, CountryFilterOptions } from "../types";

/**
 * Filters countries based on various criteria.
 * @param countries - The list of countries to filter.
 * @param options - Filtering options for countries.
 * @returns Filtered list of countries.
 * @see CountryFilterOptions
 */
export function filterCountries(
  countries: Country[],
  options: CountryFilterOptions
) {
  const {
    search = "",
    selectedRegion,
    selectedSubregion,
    selectedSovereignty,
    overlayCountries,
  } = options;

  // Apply filters
  return filterBySearch(countries, search, (c) => c.name).filter((country) => {
    if (selectedRegion && country.region !== selectedRegion) return false;
    if (selectedSubregion && country.subregion !== selectedSubregion)
      return false;
    if (selectedSovereignty && country.sovereigntyType !== selectedSovereignty)
      return false;
    if (
      overlayCountries &&
      overlayCountries.length &&
      !overlayCountries.includes(country.isoCode)
    )
      return false;
    return true;
  });
}

/**
 * Filters ISO codes based on overlay selections.
 * @param countries
 * @param overlays
 * @param overlaySelections
 * @returns Filtered list of ISO codes.
 */
export function getFilteredIsoCodes(
  countries: Country[],
  overlays: Overlay[],
  overlaySelections: Record<string, string>
) {
  const base = countries.map((c) => c.isoCode);

  return overlays.reduce((accIsoCodes, overlay) => {
    const selection = overlaySelections[overlay.id] || "all";
    if (selection === "only") {
      return accIsoCodes.filter((iso) => overlay.countries.includes(iso));
    }
    if (selection === "exclude") {
      return accIsoCodes.filter((iso) => !overlay.countries.includes(iso));
    }
    return accIsoCodes; // "all"
  }, base as string[]);
}
