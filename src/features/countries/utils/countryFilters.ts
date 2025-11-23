/**
 * Utility functions for filtering countries based on various criteria.
 */

import type { Country, FilterOption, Overlay } from "@types";
import { capitalizeWords, normalizeString } from "@utils/string";

/**
 * Maps an array of strings to FilterOption objects.
 * @param options Array of string options
 * @returns Array of FilterOption objects
 */
export function mapOptions(options: string[]): FilterOption[] {
  return options.map((r) => ({ value: r, label: capitalizeWords(r) }));
}

/**
 * Filters countries based on search, region, subregion, sovereignty, and overlay criteria.
 * @param countries - The list of countries to filter.
 * @param search - Search term to filter by country name.
 * @param selectedRegion - Selected region to filter by.
 * @param selectedSubregion - Selected subregion to filter by.
 * @param selectedSovereignty - Selected sovereignty type to filter by.
 * @param overlayCountries - List of country ISO codes to include based on overlay selection.
 * @returns Filtered list of countries.
 */
export function filterCountries(
  countries: Country[],
  {
    search,
    selectedRegion,
    selectedSubregion,
    selectedSovereignty,
    overlayCountries = [],
  }: {
    search?: string;
    selectedRegion?: string;
    selectedSubregion?: string;
    selectedSovereignty?: string;
    overlayCountries?: string[];
  }
) {
  // Filter by search first
  let filtered = filterCountriesBySearch(countries, search ?? "");

  // Apply other filters
  return filtered.filter((country) => {
    if (selectedRegion && country.region !== selectedRegion) return false;
    if (selectedSubregion && country.subregion !== selectedSubregion)
      return false;
    if (selectedSovereignty && country.sovereigntyType !== selectedSovereignty)
      return false;
    if (overlayCountries.length && !overlayCountries.includes(country.isoCode))
      return false;
    return true;
  });
}

/**
 * Filters a list of countries by search string (accent-insensitive).
 * @param countries - The list of countries to filter.
 * @param search - The search string to filter by.
 * @returns The filtered list of countries.
 */
export function filterCountriesBySearch(countries: Country[], search: string) {
  if (!search) return countries;
  const normalizedSearch = normalizeString(search);
  return countries.filter((country) =>
    normalizeString(country.name).includes(normalizedSearch)
  );
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
