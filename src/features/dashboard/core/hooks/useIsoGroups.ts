import { useMemo } from "react";
import type { Country } from "@features/countries/types";

/**
 * Splits countries into sovereign and dependency groups based on a matching function.
 * @param countries - List of countries to group.
 * @param matches - Function that determines if a country belongs to the group based on criteria.
 * @returns Object containing arrays of ISO codes for sovereign and dependency countries that match the criteria.
 */
export function useIsoGroups(
  countries: Country[],
  matches: (c: Country) => boolean,
) {
  return useMemo(() => {
    const sov: string[] = [];
    const dep: string[] = [];
    for (const c of countries) {
      if (!matches(c)) continue;
      if (
        c.sovereigntyStatus === "sovereign" ||
        c.sovereigntyStatus === "partially_recognized"
      ) {
        sov.push(c.isoCode);
      } else {
        dep.push(c.isoCode);
      }
    }
    return { sovereignIsoCodes: sov, dependencyIsoCodes: dep };
  }, [countries, matches]);
}
