import i18next from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Language } from "@types";
import { useGetRawCountriesQuery } from "../api/countriesApi";
import type { Currency, Timezone } from "../types";
import { processLocalizedCountries } from "../utils/countryLocalization";
import { buildTimezonesFromCountries } from "../utils/timezoneData";

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

  // Process and localize country data based on the current language and i18n instance
  const processedData = useMemo(() => {
    const {
      localizedCountries,
      parentToRegions,
      childToParent,
      areaLookup,
      currencyMap,
      regionSet,
      tmpSub,
      langSet,
    } = processLocalizedCountries(countries, currentLanguage, i18n);

    const allRegions = Array.from(regionSet).sort();
    const subregionsByRegion: Record<string, string[]> = {};
    const subregionToRegion = new Map<string, string>();
    const allSubregionsSet = new Set<string>();

    // Build subregion mappings
    for (const [region, subSet] of Object.entries(tmpSub)) {
      const sortedSubs = Array.from(subSet).sort();
      subregionsByRegion[region] = sortedSubs;
      for (let s = 0; s < sortedSubs.length; s++) {
        subregionToRegion.set(sortedSubs[s], region);
        allSubregionsSet.add(sortedSubs[s]);
      }
    }

    const allSubregions = Array.from(allSubregionsSet).sort();

    // Build currency list with translations
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

    // Build language list with translations
    const languages: Record<string, Language> = {};
    const sortedLangs = Array.from(langSet).sort();
    for (let i = 0; i < sortedLangs.length; i++) {
      const code = sortedLangs[i];
      const name = i18n.exists(`languages:${code}`)
        ? String(i18n.t(`languages:${code}`, { defaultValue: code }))
        : code;
      languages[code] = { code, name };
    }

    // Build timezones from localized countries
    const timezones: Timezone[] =
      buildTimezonesFromCountries(localizedCountries);

    return {
      countries: localizedCountries,
      allRegions,
      allSubregions,
      subregionsByRegion,
      subregionToRegion,
      currencies,
      languages,
      timezones,
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
