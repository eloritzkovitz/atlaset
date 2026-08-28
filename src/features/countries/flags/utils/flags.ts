/**
 * Utility functions for working with country flags.
 */

import { FLAG_OVERRIDES } from "../constants/flagOverrides";
import type { Country } from "../../types";

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
