import i18next from "i18next";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@app/store";
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
  const { i18n } = useTranslation();

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
        territories: (trans.territories ??
          c.territories ??
          ({} as CountryTerritories)) as CountryTerritories,
      } as Country;
    });
  }, [countries, i18n]);

  // Return only currencies that have at least one country using them
  const { currencies } = data;
  const currenciesWithUsers = useMemo(() => {
    if (!currencies) return [] as Currency[];
    return currencies
      .filter((cur: Currency) => (currencyCounts.get(cur.code) ?? 0) > 0)
      .map((cur: Currency) => {
        const translated = i18n.t(`currencies:${cur.code}`, {
          defaultValue: cur.name,
        });
        return {
          ...cur,
          name:
            typeof translated === "string" ? translated : String(translated),
        } as Currency;
      });
  }, [currencies, currencyCounts, i18n]);

  return {
    ...data,
    countries: localizedCountries,
    refreshData,
    currencies: currenciesWithUsers,
  };
}
