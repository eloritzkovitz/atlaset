/**
 * Utility functions for handling country data.
 */

import { extractUniqueSorted } from "@utils/array";
import {
  COUNTRY_RELATIONS,
  SPECIAL_COUNTRIES,
} from "../constants/countryRelations";
import { EXCLUDED_ISO_CODES } from "../constants/sovereignty";
import type { Country, Currency, SovereigntyType } from "../types";

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
  dependencyOf?: { isoCode: string };
  regionOf?: { isoCode: string };
  disputeOf?: { isoCode: string };
  sovereign?: { isoCode: string };
  type: SovereigntyType | "Sovereign";
  dependencies?: string[];
  countries?: string[];
  regions?: string[];
  disputes?: string[];
  hasRelations?: boolean;
} {
  const dependency = dependencyMap[isoCode];
  const region = regionMap[isoCode];
  const dispute = disputeMap[isoCode];

  // If it's a dependency or disputed territory, return its sovereign/dispute info
  if (dependency || region || dispute) {
    const rel = dependency || region || dispute;
    return {
      dependencyOf: dependency ? { isoCode: rel.sovereign.isoCode } : undefined,
      regionOf: region ? { isoCode: rel.sovereign.isoCode } : undefined,
      disputeOf: dispute ? { isoCode: rel.sovereign.isoCode } : undefined,
      sovereign: { isoCode: rel.sovereign.isoCode },
      type: rel.type,
    };
  }

  // Otherwise, treat it as a sovereign and return its relations, if any
  const group = COUNTRY_RELATIONS[isoCode];
  const countries = group?.countries || [];
  const dependencies = group?.dependencies || [];
  const regions = group?.regions || [];
  const disputes = group?.disputes || [];
  const hasRelations =
    countries.length > 0 ||
    dependencies.length > 0 ||
    regions.length > 0 ||
    disputes.length > 0;

  return {
    type: "Sovereign",
    dependencies,
    countries,
    regions,
    disputes,
    hasRelations,
  };
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

/** Gets a formatted string for a currency based on its code.
 * @param code - The ISO code of the currency.
 * @param currencies - An array of currency objects with code and name.
 * @returns A string in the format "Currency Name (CODE)" or just the code if not found.
 */
export function getCurrencyDisplay(
  code: string | undefined,
  currencies: Currency[],
): string {
  if (!code) return "N/A";
  const currencyObj = currencies.find((c) => c.code === code);
  return currencyObj ? `${currencyObj.name} (${currencyObj.code})` : code;
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

/**
 * Gets a formatted string of aliases.
 * @param aliases - An array of aliases.
 * @returns A comma-separated string of aliases or "None" if empty.
 */
export function getAliasesDisplay(aliases?: string[]) {
  if (!aliases || aliases.length === 0) return "None";
  return aliases.join(", ");
}

// Precompute maps for quick lookups of country relations
type RelationMap = Record<
  string,
  { type: SovereigntyType; sovereign: { isoCode: string } }
>;

const dependencyMap: RelationMap = {};
const regionMap: RelationMap = {};
const disputeMap: RelationMap = {};

// Populate the maps based on COUNTRY_RELATIONS data
function addRelation(
  map: Record<
    string,
    { type: SovereigntyType; sovereign: { isoCode: string } }
  >,
  isoList: string[] | undefined,
  type: SovereigntyType,
  sovereignIso: string,
) {
  if (!isoList) return;
  isoList.forEach((iso) => {
    map[iso] = { type, sovereign: { isoCode: sovereignIso } };
  });
}

// Loop through COUNTRY_RELATIONS to fill the maps for dependencies, regions, and disputes
for (const [sovereignIso, sovereignObj] of Object.entries(COUNTRY_RELATIONS)) {
  addRelation(
    dependencyMap,
    sovereignObj.dependencies,
    "Dependency",
    sovereignIso,
  );
  addRelation(regionMap, sovereignObj.regions, "Overseas Region", sovereignIso);
  addRelation(disputeMap, sovereignObj.disputes, "Disputed", sovereignIso);
}
