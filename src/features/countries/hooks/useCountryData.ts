import i18next from "i18next";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@app/store";
import type { Language } from "@types";
import { fetchCountryData } from "../slices/countryDataSlice";
import type { Country, CountryTerritories, Currency } from "../types";

type CountryTranslation = Partial<Country>;

/**
 * Accesses country data from the Redux store and auto-fetches if needed.
 * Provides a refreshData function to manually reload.
 */
export function useCountryData() {
  const dispatch: AppDispatch = useDispatch();
  const data = useSelector((state: RootState) => state.countryData);
  const { i18n } = useTranslation("countries");

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
  const {
    localizedCountries,
    currencyCounts,
    allRegionsLocalized,
    subregionsByRegion,
    subregionToRegion,
    languageCodes,
  } = useMemo(() => {
    const loc: Country[] = [];
    const currencyMap = new Map<string, number>();
    const regionSet = new Set<string>();
    const tmpSub: Record<string, Set<string>> = {};
    const langSet = new Set<string>();

    const lng = i18n.language || i18next.language || "en";
    let bundle: Record<string, CountryTranslation> = {};
    try {
      bundle =
        i18n.getResourceBundle?.(lng, "countries") ||
        i18next.getResourceBundle(lng, "countries") ||
        {};
    } catch {
      bundle = {};
    }

    // Map country data with translations and build auxiliary data structures for filters
    for (const c of countries) {
      const iso = (c.isoCode || "").toUpperCase();
      const trans = bundle[iso] ?? {};

      const localized = {
        ...c,
        name: trans.name ?? c.name,
        capital: trans.capital ?? c.capital ?? "",
        altNames: trans.altNames ?? c.altNames ?? [],
        region: (trans.region as string) ?? c.region,
        subregion: (trans.subregion as string) ?? c.subregion,
        territories: (trans.territories ??
          c.territories ??
          ({} as CountryTerritories)) as CountryTerritories,
      } as Country;

      loc.push(localized);

      if (localized?.region) regionSet.add(String(localized.region));
      const sk = localized.subregion as string;
      if (localized.region && sk) {
        if (!tmpSub[localized.region])
          tmpSub[localized.region] = new Set<string>();
        tmpSub[localized.region].add(sk);
      }
      if (localized?.currency)
        currencyMap.set(
          localized.currency,
          (currencyMap.get(localized.currency) ?? 0) + 1,
        );
      if (Array.isArray(localized.languages))
        for (const l of localized.languages) langSet.add(String(l));
    }

    const allRegions = Array.from(regionSet).sort();
    const subregionsOut: Record<string, string[]> = {};
    for (const [k, set] of Object.entries(tmpSub))
      subregionsOut[k] = Array.from(set).sort();
    const subToRegion = new Map<string, string>();
    for (const [rk, subs] of Object.entries(subregionsOut))
      for (const s of subs) subToRegion.set(s, rk);
    const languageCodesArr = Array.from(langSet).sort();

    return {
      localizedCountries: loc,
      currencyCounts: currencyMap,
      allRegionsLocalized: allRegions,
      subregionsByRegion: subregionsOut,
      subregionToRegion: subToRegion,
      languageCodes: languageCodesArr,
    } as const;
  }, [countries, i18n]);

  // Map currency codes to localized names and user counts
  const currenciesWithUsers = useMemo(() => {
    const codes = Array.from(currencyCounts.keys());
    if (codes.length === 0) return [] as Currency[];
    return codes.map((code) => {
      const translated = i18n.t(`currencies:${code}`, { defaultValue: code });
      return {
        code,
        name: typeof translated === "string" ? translated : String(translated),
      } as Currency;
    });
  }, [currencyCounts, i18n]);

  // Map language codes to localized names
  const languagesMap = useMemo(() => {
    const out: Record<string, Language> = {};
    for (const code of languageCodes) {
      const name = i18n.exists(`languages:${code}`)
        ? String(i18n.t(`languages:${code}`, { defaultValue: code }))
        : code;
      out[code] = { code, name } as Language;
    }
    return out;
  }, [languageCodes, i18n]);

  return {
    ...data,
    countries: localizedCountries,
    allRegions: allRegionsLocalized,
    subregionsByRegion,
    subregionToRegion,
    currencies: currenciesWithUsers,
    languages: languagesMap,
    refreshData,
  };
}
