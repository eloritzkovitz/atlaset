/**
 * Utility functions for working with country flags.
 */

import { FLAG_OVERRIDES } from "../constants/flagOverrides";
import { SPECIAL_COUNTRIES } from "../../core/constants/specialCountries";
import type { Country, Flag } from "../../types";

/**
 * Returns countries whose flag matches their own ISO code and is not empty.
 * @param countries - Array of country objects to filter.
 * @returns Array of countries that have their own flag.
 */
export function getCountriesWithOwnFlag(countries: Country[]): Country[] {
  return countries.filter(
    (country) => !FLAG_OVERRIDES.includes(country.isoCode),
  );
}

/**
 * Resolves the correct ISO code for a flag, taking into account special cases and overrides.
 * @param flag - The flag object to resolve the ISO code for.
 * @returns The resolved ISO code for the flag, considering special cases and overrides.
 */
export function resolveFlagIsoCode(flag: Flag): string {
  const special = SPECIAL_COUNTRIES[flag.isoCode];
  const isOverridden = FLAG_OVERRIDES.includes(flag.isoCode);

  return (
    special?.flag ||
    special?.sovereign ||
    (isOverridden
      ? (flag.sovereignState?.toUpperCase() ?? flag.isoCode)
      : flag.isoCode)
  );
}
