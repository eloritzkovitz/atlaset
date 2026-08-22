import type { Country } from "@features/countries/types";
import { useCountryTracking } from "./useCountryTracking";

/**
 * Calculates country coverage based on the user's visited countries.
 * @param countries - List of countries to include.
 * @param sovereignOnly - Whether to include only sovereign states.
 * @returns Total countries and the number of visited countries.
 */
export function useCountryCoverage(
  countries: Country[],
  sovereignOnly = false,
) {
  const { visitedCountryCodes } = useCountryTracking();

  const effectiveCountries = sovereignOnly
    ? countries.filter((country) => country.sovereigntyStatus === "sovereign")
    : countries;

  const effectiveIsoCodes = new Set(
    effectiveCountries.map((country) => country.isoCode),
  );

  const visitedCountries = visitedCountryCodes.reduce(
    (count, isoCode) => count + (effectiveIsoCodes.has(isoCode) ? 1 : 0),
    0,
  );

  return {
    totalCountries: effectiveCountries.length,
    visitedCountries,
  };
}
