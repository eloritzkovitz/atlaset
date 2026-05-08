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

  // Compute currency counts
  const currencyCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of countries) {
      if (!c?.currency) continue;
      map.set(c.currency, (map.get(c.currency) ?? 0) + 1);
    }
    return map;
  }, [countries]);

  // Provide localized countries with fallbacks to special countries and original names
  const localizedCountries = useMemo(() => {
    if (!countries || countries.length === 0) return [] as typeof countries;

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

    return countries.map((c) => {
      const iso = (c.isoCode || "").toUpperCase();
      const trans = bundle[iso] ?? {};

      return {
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
    });
  }, [countries, i18n]);

  // Build localized allRegions from localizedCountries
  const allRegionsLocalized = useMemo(() => {
    const set = new Set<string>();
    for (const c of localizedCountries) {
      if (c?.region) set.add(String(c.region));
    }
    return Array.from(set).sort();
  }, [localizedCountries]);

  // Build a map of region -> subregions for translation and other lookups
  const subregionsByRegion = useMemo(() => {
    const tmp: Record<string, Set<string>> = {};
    for (const c of localizedCountries) {
      const rk = c.region as string;
      const sk = c.subregion as string;
      if (!rk || !sk) continue;
      if (!tmp[rk]) tmp[rk] = new Set<string>();
      tmp[rk].add(sk);
    }
    const out: Record<string, string[]> = {};
    for (const [k, set] of Object.entries(tmp)) out[k] = Array.from(set).sort();
    return out;
  }, [localizedCountries]);

  // Map subregionKey -> regionKey for quick reverse lookups
  const subregionToRegion = useMemo(() => {
    const m = new Map<string, string>();
    for (const [rk, subs] of Object.entries(subregionsByRegion)) {
      for (const s of subs) m.set(s, rk);
    }
    return m;
  }, [subregionsByRegion]);

  // Build localized currencies list from country currency codes + translations
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

  // Build a set of language codes/names used across countries
  const languageCodes = useMemo(() => {
    const set = new Set<string>();
    for (const c of localizedCountries) {
      if (!c || !Array.isArray(c.languages)) continue;
      for (const l of c.languages) set.add(String(l));
    }
    return Array.from(set).sort();
  }, [localizedCountries]);

  // Map language code -> Language object (use i18n translations only)
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
