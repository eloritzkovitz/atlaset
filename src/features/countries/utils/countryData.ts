/**
 * @file Utility functions for handling country data.
 */

import { VISITED_OVERLAY_ID, type Overlay } from "@features/atlas/overlays";
import { extractUniqueSorted } from "@utils/array";
import { SOVEREIGN_DEPENDENCIES } from "../constants/sovereignDependencies";
import { EXCLUDED_ISO_CODES } from "../constants/sovereignty";
import type { Country, SovereigntyType } from "../types";

/**
 * Extracts the ISO country code from various possible property names.
 * @param properties - The properties object from a geographical feature.
 * @returns The ISO country code in uppercase, or undefined if not found.
 */
export function getCountryIsoCode(
  properties: Record<string, unknown>
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
  countryData: { countries: Country[] }
): Country | null {
  if (!code || !countryData?.countries) return null;
  return (
    countryData.countries.find(
      (c) => c.isoCode?.toLowerCase() === code.toLowerCase()
    ) || null
  );
}

/**
 * Creates a map of country ISO codes to values derived from the countries array.
 * @param countries - Array of country objects.
 * @param valueFn - Function that takes a country and returns the desired value.
 * @returns A record mapping ISO codes to the values returned by valueFn.
 */
export function createCountryMap<T>(
  countries: Country[],
  valueFn: (c: Country) => T
): Record<string, T> {
  return Object.fromEntries(
    countries.map((c) => [c.isoCode.toLowerCase(), valueFn(c)])
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
  selectedRegion: string
) {
  return extractUniqueSorted(
    countries.filter((c) => c.region === selectedRegion),
    (c) => c.subregion
  );
}

/**
 * Returns all unique sovereignty types from the countries list.
 * @param countries - Array of country objects with sovereigntyType property.
 * @returns Sorted array of unique sovereignty type strings.
 */
export function getAllSovereigntyTypes(
  countries: { sovereigntyType?: SovereigntyType }[]
): SovereigntyType[] {
  return extractUniqueSorted(
    countries,
    (c) => c.sovereigntyType as SovereigntyType | undefined
  );
}

/**
 * Finds the sovereign country for a terrritory's ISO code.
 * @param territoryIsoCode - The ISO code of the territory.
 * @returns The sovereign's name and ISO code, or undefined if not found.
 */
export function getSovereigntyInfoForTerritory(territoryIsoCode: string): {
  type?: SovereigntyType;
  sovereign?: { name: string; isoCode: string };
} {
  if (!territoryIsoCode) return { type: undefined };
  if (dependencyMap[territoryIsoCode]) return dependencyMap[territoryIsoCode];
  if (regionMap[territoryIsoCode]) return regionMap[territoryIsoCode];
  if (disputeMap[territoryIsoCode]) return disputeMap[territoryIsoCode];
  return { type: "Sovereign" };
}

/**
 * Returns countries whose flag matches their own ISO code and is not empty.
 * If you add a flagIsoCode property for borrowed flags, this will skip those.
 */
export function getCountriesWithOwnFlag(countries: Country[]): Country[] {
  return countries.filter(
    (country) => !EXCLUDED_ISO_CODES.includes(country.isoCode)
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
 * Gets a formatted string of languages.
 * @param languages - An array of language names.
 * @returns A comma-separated string of languages or "None" if empty.
 */
export function getLanguagesDisplay(languages?: string[]) {
  if (!languages || languages.length === 0) return "None";
  return languages.join(", ");
}

// Precompute lookup maps
const dependencyMap: Record<
  string,
  { type: SovereigntyType; sovereign: { name: string; isoCode: string } }
> = {};
const regionMap: Record<
  string,
  { type: SovereigntyType; sovereign: { name: string; isoCode: string } }
> = {};
const disputeMap: Record<
  string,
  { type: SovereigntyType; sovereign: { name: string; isoCode: string } }
> = {};

for (const [sovereignIso, sovereignObj] of Object.entries(
  SOVEREIGN_DEPENDENCIES
)) {
  sovereignObj.dependencies?.forEach((dep) => {
    dependencyMap[dep.isoCode] = {
      type: "Dependency",
      sovereign: { name: sovereignObj.name, isoCode: sovereignIso },
    };
  });
  sovereignObj.regions?.forEach((region) => {
    regionMap[region.isoCode] = {
      type: "Overseas Region",
      sovereign: { name: sovereignObj.name, isoCode: sovereignIso },
    };
  });
  sovereignObj.disputes?.forEach((dep) => {
    disputeMap[dep.isoCode] = {
      type: "Disputed",
      sovereign: { name: sovereignObj.name, isoCode: sovereignIso },
    };
  });
}

/** Filters and returns the list of visited countries based on overlays.
 * @param countries - Array of country objects.
 * @param overlays - Array of overlay objects containing visited countries data.
 * @returns Array of visited country objects.
 */
export function getVisitedCountries(
  countries: Country[],
  overlays: Overlay[]
): Country[] {
  const visitedOverlay = overlays.find((o) => o.id === VISITED_OVERLAY_ID);
  const visitedIsoCodes =
    (visitedOverlay as { countries?: string[] } | undefined)?.countries ?? [];
  return countries.filter((c) => visitedIsoCodes.includes(c.isoCode));
}
