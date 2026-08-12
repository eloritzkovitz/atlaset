/**
 * Utility functions for handling country localization.
 */

import i18next from "i18next";
import type { i18n as I18nInstance } from "i18next";
import type { Country, CountryTerritories } from "../types";
import { getTerritoryCodesByType } from "../utils/countryData";

const EMPTY_ARRAY: string[] = [];
const EMPTY_TERRITORIES: CountryTerritories = {} as CountryTerritories;
const INTEGRAL_TERRITORY_TYPES = new Set([
  "overseas_region",
  "special_territory",
]);

export interface LocalizedCountriesResult {
  localizedCountries: Country[];
  parentToRegions: Map<string, string[]>;
  childToParent: Map<string, string>;
  areaLookup: Map<string, number>;
  currencyMap: Map<string, number>;
  regionSet: Set<string>;
  tmpSub: Record<string, Set<string>>;
  langSet: Set<string>;
}

/**
 * Fetches the resource bundle for countries based on the provided language and i18n instance.
 * @param language - The language code for which to fetch the resource bundle.
 * @param i18nInstance - Optional i18n instance to use for fetching the resource bundle.
 * @returns A record containing country translations, or an empty object if not found.
 */
export function getCountryResourceBundle(
  language?: string,
  i18nInstance?: I18nInstance,
): Record<string, Partial<Country>> {
  const lng = language || i18nInstance?.language || i18next.language || "en";

  try {
    return (
      i18nInstance?.getResourceBundle?.(lng, "countries") ??
      i18next.getResourceBundle(lng, "countries") ??
      {}
    );
  } catch {
    return {};
  }
}

/**
 * Processes and localizes country data based on the current language and i18n instance.
 * @param countries - The array of country objects to process.
 * @param currentLanguage - The current language code.
 * @param i18n - The i18n instance.
 * @returns An object containing localized countries and various mappings for regions, currencies, and languages.
 */
export function processLocalizedCountries(
  countries: Country[],
  currentLanguage: string,
  i18n: I18nInstance,
): LocalizedCountriesResult {
  const localizedCountries: Country[] = [];
  const currencyMap = new Map<string, number>();
  const regionSet = new Set<string>();
  const tmpSub: Record<string, Set<string>> = {};
  const langSet = new Set<string>();

  const parentToRegions = new Map<string, string[]>();
  const childToParent = new Map<string, string>();
  const areaLookup = new Map<string, number>();

  const bundle = getCountryResourceBundle(currentLanguage, i18n);

  for (let i = 0; i < countries.length; i++) {
    const c = countries[i];
    const iso = (c.isoCode || "").toUpperCase();
    const trans = bundle[iso] ?? {};

    const localized: Country = {
      ...c,
      name: trans.name ?? c.name,
      capital: trans.capital ?? c.capital ?? "",
      altNames: trans.altNames ?? c.altNames ?? EMPTY_ARRAY,
      region: (trans.region as string) ?? c.region,
      subregion: (trans.subregion as string) ?? c.subregion,
      territories: (trans.territories ??
        c.territories ??
        EMPTY_TERRITORIES) as CountryTerritories,
    };

    localizedCountries.push(localized);

    // Extract territory lookups & area mapping
    if (iso) {
      areaLookup.set(iso, localized.area || 0);

      const uniqueTerritoryCodes = getTerritoryCodesByType(
        localized,
        INTEGRAL_TERRITORY_TYPES,
      );

      if (uniqueTerritoryCodes.length > 0) {
        parentToRegions.set(iso, uniqueTerritoryCodes);
        uniqueTerritoryCodes.forEach((code) => childToParent.set(code, iso));
      }
    }

    // Update region and subregion sets
    if (localized.region) {
      regionSet.add(localized.region);
      if (localized.subregion) {
        if (!tmpSub[localized.region]) {
          tmpSub[localized.region] = new Set<string>();
        }
        tmpSub[localized.region].add(localized.subregion);
      }
    }

    // Update currency map
    if (localized.currency) {
      currencyMap.set(
        localized.currency,
        (currencyMap.get(localized.currency) ?? 0) + 1,
      );
    }

    // Update language set
    if (Array.isArray(localized.languages)) {
      for (let j = 0; j < localized.languages.length; j++) {
        langSet.add(String(localized.languages[j]));
      }
    }
  }

  return {
    localizedCountries,
    parentToRegions,
    childToParent,
    areaLookup,
    currencyMap,
    regionSet,
    tmpSub,
    langSet,
  };
}
