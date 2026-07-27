import i18next from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Language } from "@types";
import { useGetRawCountriesQuery } from "../api/countriesApi";
import type { Country, CountryTerritories, Currency } from "../types";
import { getTerritoryCodesByType } from "../utils/countryData";

type CountryTranslation = Partial<Country>;

const EMPTY_ARRAY: string[] = [];
const EMPTY_TERRITORIES: CountryTerritories = {} as CountryTerritories;
const INTEGRAL_TERRITORY_TYPES = new Set([
  "overseas_region",
  "special_territory",
]);

/**
 * Fetches and processes country data, applying translations and extracting metadata.
 */
export function useCountryData() {
  const {
    data: rawCountries,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetRawCountriesQuery();
  const { i18n } = useTranslation("countries");

  const currentLanguage = i18n.language || i18next.language || "en";

  const countries = useMemo(() => rawCountries || [], [rawCountries]);

  const processedData = useMemo(() => {
    const loc: Country[] = [];
    const currencyMap = new Map<string, number>();
    const regionSet = new Set<string>();
    const tmpSub: Record<string, Set<string>> = {};
    const langSet = new Set<string>();

    const parentToRegions = new Map<string, string[]>();
    const childToParent = new Map<string, string>();
    const areaLookup = new Map<string, number>();

    let bundle: Record<string, CountryTranslation> = {};
    try {
      bundle =
        i18n.getResourceBundle?.(currentLanguage, "countries") ||
        i18next.getResourceBundle(currentLanguage, "countries") ||
        {};
    } catch {
      bundle = {};
    }

    // Process each country, applying translations and collecting metadata
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

      loc.push(localized);

      // Extract territory lookups & area mapping in the same loop
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

      if (localized.region) {
        regionSet.add(localized.region);
        if (localized.subregion) {
          if (!tmpSub[localized.region]) {
            tmpSub[localized.region] = new Set<string>();
          }
          tmpSub[localized.region].add(localized.subregion);
        }
      }

      if (localized.currency) {
        currencyMap.set(
          localized.currency,
          (currencyMap.get(localized.currency) ?? 0) + 1,
        );
      }

      if (Array.isArray(localized.languages)) {
        for (let j = 0; j < localized.languages.length; j++) {
          langSet.add(String(localized.languages[j]));
        }
      }
    }

    // Sort regions and subregions for consistent ordering
    const allRegions = Array.from(regionSet).sort();
    const subregionsByRegion: Record<string, string[]> = {};
    const subregionToRegion = new Map<string, string>();
    const allSubregionsSet = new Set<string>(); // 1. Collect all subregions

    for (const [region, subSet] of Object.entries(tmpSub)) {
      const sortedSubs = Array.from(subSet).sort();
      subregionsByRegion[region] = sortedSubs;
      for (let s = 0; s < sortedSubs.length; s++) {
        subregionToRegion.set(sortedSubs[s], region);
        allSubregionsSet.add(sortedSubs[s]);
      }
    }

    const allSubregions = Array.from(allSubregionsSet).sort();

    // Map currency codes to localized names and user counts
    const currencies: Currency[] = Array.from(currencyMap.keys()).map(
      (code) => {
        const translated = i18n.t(`currencies:${code}`, { defaultValue: code });
        return {
          code,
          name:
            typeof translated === "string" ? translated : String(translated),
        };
      },
    );

    // Map language codes to localized names
    const languages: Record<string, Language> = {};
    const sortedLangs = Array.from(langSet).sort();
    for (let i = 0; i < sortedLangs.length; i++) {
      const code = sortedLangs[i];
      const name = i18n.exists(`languages:${code}`)
        ? String(i18n.t(`languages:${code}`, { defaultValue: code }))
        : code;
      languages[code] = { code, name };
    }

    return {
      countries: loc,
      allRegions,
      allSubregions,
      subregionsByRegion,
      subregionToRegion,
      currencies,
      languages,
      integralRegionsLookup: parentToRegions,
      sovereignLookup: childToParent,
      countryAreaMap: areaLookup,
    };
  }, [countries, currentLanguage, i18n]);

  return {
    loading: isLoading,
    isFetching,
    error,
    ...processedData,
    refreshData: refetch,
  };
}
