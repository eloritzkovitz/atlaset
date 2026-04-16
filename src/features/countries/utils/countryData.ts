/**
 * Utility functions for handling country data.
 */

import { extractUniqueSorted } from "@utils/array";
import { capitalizeWords } from "@utils/string";
import type { CountryRelations } from "../constants/countryRelations";
import {
  COUNTRY_RELATIONS,
  EXCLUDED_ISO_CODES,
  type CountryRelationsGroup,
} from "../constants/countryRelations";
import { SPECIAL_COUNTRIES } from "../constants/specialCountries";
import type { Country, SovereigntyType } from "../types";

/**
 * Extracts the ISO country code from various possible property names.
 * @param properties - The properties object from a geographical feature.
 * @returns The ISO country code in uppercase, or undefined if not found.
 */
export function getCountryIsoCode(
  properties: Record<string, unknown>,
): string | undefined {
  return (
    (properties.ISO_A2 as string)?.toUpperCase?.() ||
    (properties["ISO3166-1-Alpha-2"] as string)?.toUpperCase?.()
  );
}

/** Finds a country by its ISO code from the provided country data.
 * @param code - The ISO code of the country to find.
 * @param countryData - An object containing an array of countries.
 * @returns The country object if found, otherwise null.
 */
export function getCountryByIsoCode(
  code: string,
  countryData: { countries: Country[] },
): Country | null {
  if (!code || !countryData?.countries) return null;
  return (
    countryData.countries.find(
      (c) => c.isoCode?.toLowerCase() === code.toLowerCase(),
    ) || null
  );
}

/** Returns the name of a country based on its ISO code.
 * @param isoCode - The ISO code of the country.
 * @param countryData - An object containing an array of countries.
 * @returns The name of the country if found, otherwise returns the ISO code.
 */
export function getCountryName(isoCode: string, countries: Country[]) {
  // Check SPECIAL_COUNTRIES first
  if (SPECIAL_COUNTRIES[isoCode]?.name) {
    return SPECIAL_COUNTRIES[isoCode].name;
  }

  // Then find in the main countries list
  const country = countries.find((c) => c.isoCode === isoCode);
  return country ? country.name : isoCode;
}

/**
 * Creates a map of country ISO codes to values derived from the countries array.
 * @param countries - Array of country objects.
 * @param valueFn - Function that takes a country and returns the desired value.
 * @returns A record mapping ISO codes to the values returned by valueFn.
 */
export function createCountryMap<T>(
  countries: Country[],
  valueFn: (c: Country) => T,
): Record<string, T> {
  return Object.fromEntries(
    countries.map((c) => [c.isoCode.toLowerCase(), valueFn(c)]),
  );
}

/**
 * Returns all unique regions from the countries list, excluding undefined values.
 * @param countries - Array of country objects with optional region property.
 * @returns Sorted array of unique region strings.
 */
export function getAllRegions(countries: { region?: string }[]) {
  return extractUniqueSorted(countries, (c) => c.region);
}

/**
 * Returns all unique subregions from the countries list, excluding undefined values.
 * @param countries - Array of country objects with optional subregion property.
 * @returns Sorted array of unique subregion strings.
 */
export function getAllSubregions(countries: { subregion?: string }[]) {
  return extractUniqueSorted(countries, (c) => c.subregion);
}

/**
 * Returns all unique subregions for a given region from the countries list.
 * @param countries - Array of country objects with region and subregion properties.
 * @param selectedRegion - The region to filter subregions by.
 * @returns Sorted array of unique subregion strings for the selected region.
 */
export function getSubregionsForRegion(
  countries: { region?: string; subregion?: string }[],
  selectedRegion: string,
) {
  return extractUniqueSorted(
    countries.filter((c) => c.region === selectedRegion),
    (c) => c.subregion,
  );
}

/**
 * Returns all unique sovereignty types from the countries list.
 * @param countries - Array of country objects with sovereigntyType property.
 * @returns Sorted array of unique sovereignty type strings.
 */
export function getAllSovereigntyTypes(
  countries: { sovereigntyType?: SovereigntyType }[],
): SovereigntyType[] {
  return extractUniqueSorted(
    countries,
    (c) => c.sovereigntyType as SovereigntyType | undefined,
  );
}

/**
 * Finds the sovereign country or relations for a country's ISO code.
 * @param isoCode - The ISO code of the country or territory.
 * @returns Relation info: dependencyOf, disputeOf, sovereign, or all relations if sovereign.
 */
export function getCountryRelations(isoCode: string): {
  memberOf?: Array<{
    prop: string;
    label?: string;
    sovereignIso: string;
  }>;
  groups?: Record<string, CountryRelationsGroup>;
  relatedIsoCodes?: string[];
  hasRelations?: boolean;
  sovereign?: { isoCode: string };
} {
  const relEntries = relationIndex[isoCode] || [];
  const memberOf = relEntries.map((e) => ({
    prop: e.prop,
    label: e.label,
    sovereignIso: e.sovereign.isoCode,
  }));

  // If this ISO is defined as a sovereign in COUNTRY_RELATIONS, build its groups
  const rawGroups = COUNTRY_RELATIONS[isoCode] as CountryRelations | undefined;
  const sovereignGroups: Record<string, CountryRelationsGroup> = rawGroups
    ? (Object.fromEntries(
        Object.entries(rawGroups).map(([prop, group]) => {
          const raw = group as CountryRelationsGroup | undefined;
          return [
            prop,
            {
              codes: raw?.codes ?? [],
              label: raw?.label as string | undefined,
            } as CountryRelationsGroup,
          ];
        }),
      ) as Record<string, CountryRelationsGroup>)
    : {};

  // All ISO codes that reference this ISO as their sovereign
  const referencedBy = Object.keys(relationIndex).filter((otherIso) =>
    (relationIndex[otherIso] || []).some(
      (e) => e.sovereign.isoCode === isoCode,
    ),
  );

  // Combine all related ISO codes from groups and references, ensuring uniqueness
  const relatedIsoCodes = Array.from(
    new Set([
      ...Object.values(sovereignGroups).flatMap((g) => g.codes),
      ...referencedBy,
    ]),
  );

  const hasRelations =
    Object.keys(sovereignGroups).length > 0 || relatedIsoCodes.length > 0;

  // If this ISO is a member of any sovereign's groups, return that sovereign and membership info
  if (memberOf.length > 0) {
    const primary =
      memberOf.find((m) => m.prop.toLowerCase().includes("depend")) ||
      memberOf[0];
    const result: {
      memberOf: typeof memberOf;
      sovereign: { isoCode: string };
      relatedIsoCodes: string[];
      hasRelations: boolean;
      groups?: Record<string, CountryRelationsGroup>;
    } = {
      memberOf,
      sovereign: { isoCode: primary.sovereignIso },
      relatedIsoCodes,
      hasRelations,
    };

    // If this ISO also defines its own groups, include them
    if (Object.keys(sovereignGroups).length > 0) {
      result.groups = sovereignGroups;
    }

    return result;
  }

  return { groups: sovereignGroups, relatedIsoCodes, hasRelations };
}

/**
 * Returns countries whose flag matches their own ISO code and is not empty.
 * If you add a flagIsoCode property for borrowed flags, this will skip those.
 */
export function getCountriesWithOwnFlag(countries: Country[]): Country[] {
  return countries.filter(
    (country) => !EXCLUDED_ISO_CODES.includes(country.isoCode),
  );
}

/**
 * Gets a random country from the provided list.
 * @param countries - Array of country objects.
 * @returns A random country object from the array.
 */
export function getRandomCountry(countries: Country[]) {
  return countries[Math.floor(Math.random() * countries.length)];
}

/**
 * Returns the transcontinental metadata object for a country, or null if not present.
 * @param country - The country object to check for transcontinental information.
 * @returns The TranscontinentalInfo object if present, otherwise null.
 */
export function getTranscontinentalInfo(country: Country) {
  return country?.transcontinental ?? null;
}

// Precompute a generic relation index for quick and flexible lookups.
type RelationEntry = {
  sovereign: { isoCode: string };
  prop: string;
  label?: string;
};

const relationIndex: Record<string, RelationEntry[]> = {};

// Helper function to add entries to the relation index for a given list of ISO codes and relation details.
function addRelationEntry(
  isoList: string[] | undefined,
  sovereignIso: string,
  prop: string,
  label?: string,
) {
  if (!isoList) return;
  isoList.forEach((iso) => {
    (relationIndex[iso] ??= []).push({
      sovereign: { isoCode: sovereignIso },
      prop,
      label,
    });
  });
}

// Build the relation index from COUNTRY_RELATIONS
for (const [sovereignIso, sovereignObj] of Object.entries(
  COUNTRY_RELATIONS as Record<string, CountryRelations>,
)) {
  for (const [prop, group] of Object.entries(
    sovereignObj as Record<string, CountryRelationsGroup | undefined>,
  )) {
    const { codes: isoList = [], label: overrideLabel } = group || {};
    const label = overrideLabel ?? capitalizeWords(prop.replace(/[_-]/g, " "));
    addRelationEntry(isoList, sovereignIso, prop, label);
  }
}
