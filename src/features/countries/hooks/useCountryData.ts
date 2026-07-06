import i18next from "i18next";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@app/store";
import type { Language } from "@types";
import { fetchCountryData } from "../slices/countryDataSlice";
import type { Country, CountryTerritories, Currency } from "../types";

type CountryTranslation = Partial<Country>;

// Constants for empty arrays and objects to avoid unnecessary allocations
const EMPTY_ARRAY: string[] = [];
const EMPTY_TERRITORIES: CountryTerritories = {} as CountryTerritories;

/**
 * Accesses country data from the Redux store and auto-fetches if needed.
 * Provides a refreshData function to manually reload.
 */
export function useCountryData() {
  const dispatch: AppDispatch = useDispatch();
  const data = useSelector((state: RootState) => state.countryData);
  const { i18n } = useTranslation("countries");

  const currentLanguage = i18n.language || i18next.language || "en";

  // Fetch data on first use if not already loading or loaded
  useEffect(() => {
    if (!data.loading && data.countries.length === 0 && !data.error) {
      dispatch(fetchCountryData());
    }
  }, [dispatch, data.loading, data.countries.length, data.error]);

  // Refresh function to re-fetch data on demand
  const refreshData = () => {
    dispatch(fetchCountryData());
  };

  const countries = data.countries;

  return useMemo(() => {
    const loc: Country[] = [];
    const currencyMap = new Map<string, number>();
    const regionSet = new Set<string>();
    const tmpSub: Record<string, Set<string>> = {};
    const langSet = new Set<string>();

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

    for (const [region, subSet] of Object.entries(tmpSub)) {
      const sortedSubs = Array.from(subSet).sort();
      subregionsByRegion[region] = sortedSubs;
      for (let s = 0; s < sortedSubs.length; s++) {
        subregionToRegion.set(sortedSubs[s], region);
      }
    }

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
      ...data,
      countries: loc,
      allRegions,
      subregionsByRegion,
      subregionToRegion,
      currencies,
      languages,
      refreshData,
    };
  }, [countries, currentLanguage, data, i18n]);
}
