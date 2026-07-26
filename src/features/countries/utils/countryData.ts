/**
 * Utility functions for handling country data.
 */

import { extractUniqueSorted } from "@utils/array";
import { canonicalKey } from "@utils/string";
import { FLAG_OVERRIDES } from "../constants/flagOverrides";
import { SPECIAL_COUNTRIES } from "../constants/specialCountries";
import type {
  Country,
  CountryTerritoriesGroup,
  GeoType,
  SovereigntyStatus,
} from "../types";

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
  const target = code.toLowerCase();
  return (
    countryData.countries.find((c) => c.isoCode?.toLowerCase() === target) ??
    null
  );
}

/** Returns the name of a country based on its ISO code.
 * @param isoCode - The ISO code of the country.
 * @param countryData - An object containing an array of countries.
 * @returns The name of the country if found, otherwise returns the ISO code.
 */
export function getCountryName(isoCode: string, countries: Country[]): string {
  if (SPECIAL_COUNTRIES[isoCode]?.name) {
    return SPECIAL_COUNTRIES[isoCode].name;
  }
  const country = countries.find((c) => c.isoCode === isoCode);
  return country?.name ?? isoCode;
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
 * Returns all unique geo types from the countries list.
 * @param countries - Array of country objects with geoType property.
 * @returns Sorted array of unique geo type strings.
 */
export function getAllGeoTypes(countries: { geoType?: GeoType }[]): GeoType[] {
  return extractUniqueSorted(
    countries,
    (c) => c.geoType as GeoType | undefined,
  );
}

/**
 * Returns all unique sovereignty statuses from the countries list.
 * @param countries - Array of country objects with sovereigntyStatus property.
 * @returns Sorted array of unique sovereignty status strings.
 */
export function getAllSovereigntyStatuses(
  countries: { sovereigntyStatus?: SovereigntyStatus }[],
): SovereigntyStatus[] {
  return extractUniqueSorted(
    countries,
    (c) => c.sovereigntyStatus as SovereigntyStatus | undefined,
  );
}

/**
 * Finds the territories and claims for a country's ISO code.
 * @param country - The country object for which to find territories.
 * @returns Relation info: memberOf, groups, relatedIsoCodes and hasRelations.
 */
export function getCountryTerritoryRelations(country: Country): {
  memberOf?: Array<{
    prop: string;
    label?: string;
    sovereignIso: string;
  }>;
  groups?: Record<string, CountryTerritoriesGroup>;
  relatedIsoCodes?: string[];
  hasRelations?: boolean;
} {
  const rawGroups = country?.territories;
  if (!rawGroups) {
    return { groups: {}, relatedIsoCodes: [], hasRelations: false };
  }

  const groups: Record<string, CountryTerritoriesGroup> = {};
  const relatedCodesSet = new Set<string>();

  Object.entries(rawGroups).forEach(([prop, group]) => {
    const codes = group?.codes ?? [];
    groups[prop] = { codes, label: group?.label };
    codes.forEach((code) => relatedCodesSet.add(code));
  });

  const relatedIsoCodes = Array.from(relatedCodesSet);

  return {
    groups,
    relatedIsoCodes,
    hasRelations: relatedIsoCodes.length > 0,
  };
}

/**
 * Extracts unique, uppercase ISO codes for specific territory types.
 * @param country - The country object containing territories.
 * @param allowedTypes - A set of allowed territory types to filter by.
 * @returns An array of unique ISO codes for the specified territory types.
 */
export function getTerritoryCodesByType(
  country: Country,
  allowedTypes: Set<string>,
): string[] {
  if (!country?.territories) return [];

  const matchedCodes = Object.values(country.territories).flatMap((group) =>
    group?.type && allowedTypes.has(group.type)
      ? group.codes?.map((code) => code.toUpperCase()) || []
      : [],
  );

  return Array.from(new Set(matchedCodes));
}

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
 * @param subregionsByRegion - Optional mapping of regions to their subregions for additional context.
 * @returns The TranscontinentalInfo object if present, otherwise null.
 */
export function getTranscontinentalInfo(
  country: Country,
  subregionsByRegion?: Record<string, string[]>,
) {
  const raw = country?.transcontinental;
  if (!raw) return null;

  const additionalRegion = raw.additionalRegion ?? undefined;
  const additionalSubregion = raw.additionalSubregion ?? undefined;

  // Determine the canonical key for the additional region, if applicable
  const additionalRegionKey = additionalRegion
    ? canonicalKey(String(additionalRegion))
    : undefined;

  // Determine the canonical key for the additional subregion, if applicable
  const additionalSubregionKey = additionalSubregion
    ? canonicalKey(String(additionalSubregion))
    : undefined;

  // Determine the region of the additional subregion, if applicable
  let additionalSubregionRegion: string | undefined;
  if (additionalSubregionKey && subregionsByRegion) {
    for (const [regionKey, subArr] of Object.entries(subregionsByRegion)) {
      if (subArr.includes(additionalSubregionKey)) {
        additionalSubregionRegion = regionKey;
        break;
      }
    }
  }

  // If no subregion region was found, but an additional region key exists, use that as a fallback
  if (!additionalSubregionRegion && additionalRegionKey) {
    additionalSubregionRegion = additionalRegionKey;
  }

  return {
    ...raw,
    additionalRegion,
    additionalSubregion,
    additionalRegionKey,
    additionalSubregionKey,
    additionalSubregionRegion,
  };
}
