import { useCallback, useEffect, useState, useMemo } from "react";
import { CACHE_TTL } from "@config/cache";
import { appDb } from "@utils/db";
import type { Country } from "../types";
import {
  getAllRegions,
  getAllSubregions,
  getAllSovereigntyTypes,
} from "../utils/countryData";

/**
 * Fetches country and currency data with caching in IndexedDB.
 * @returns Country and currency data along with loading state and error
 */
export function useCountryDataSource() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [currencies, setCurrencies] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch country and currency data with caching
  const fetchData = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    const now = Date.now();

    // Only use caching in production
    if (process.env.NODE_ENV === "production") {
      const cachedCountry = await appDb.countryData.get("main");
      const cachedCurrency = await appDb.currencyData.get("main");
      const isCountryCacheValid =
        cachedCountry &&
        typeof cachedCountry.ts === "number" &&
        now - cachedCountry.ts < CACHE_TTL;
      const isCurrencyCacheValid =
        cachedCurrency &&
        typeof cachedCurrency.ts === "number" &&
        now - cachedCurrency.ts < CACHE_TTL;
      if (!forceRefresh && isCountryCacheValid && isCurrencyCacheValid) {
        setCountries(cachedCountry.data as Country[]);
        setCurrencies(cachedCurrency.data as Record<string, string>);
        setLoading(false);
        return;
      }
    }

    // Always fetch fresh in dev, or if cache is invalid in prod
    const countryDataUrl = import.meta.env.VITE_COUNTRY_DATA_URL?.startsWith(
      "http"
    )
      ? import.meta.env.VITE_COUNTRY_DATA_URL
      : import.meta.env.VITE_COUNTRY_DATA_URL
      ? import.meta.env.VITE_COUNTRY_DATA_URL
      : "/data/countries.json";

    const currencyDataUrl = import.meta.env.VITE_CURRENCY_DATA_URL?.startsWith(
      "http"
    )
      ? import.meta.env.VITE_CURRENCY_DATA_URL
      : import.meta.env.VITE_CURRENCY_DATA_URL
      ? import.meta.env.VITE_CURRENCY_DATA_URL
      : "/data/currencies.json";

    try {
      const fetchOpts =
        process.env.NODE_ENV === "development"
          ? { cache: "no-store" as RequestCache }
          : undefined;
      const [countryData, currencyData] = await Promise.all([
        fetch(countryDataUrl, fetchOpts).then((res) => {
          if (!res.ok) throw new Error("Failed to load country data");
          return res.json();
        }),
        fetch(currencyDataUrl, fetchOpts).then((res) => {
          if (!res.ok) throw new Error("Failed to load currency data");
          return res.json();
        }),
      ]);

      setCountries(countryData as Country[]);
      setCurrencies(currencyData);
      setLoading(false);

      // Save to Dexie only in production
      if (process.env.NODE_ENV === "production") {
        await appDb.countryData.put({
          id: "main",
          data: countryData,
          ts: Date.now(),
        });
        await appDb.currencyData.put({
          id: "main",
          data: currencyData,
          ts: Date.now(),
        });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      setLoading(false);
    }
  }, []);

  // Memoized derived data
  const allRegions = useMemo(() => getAllRegions(countries), [countries]);
  const allSubregions = useMemo(() => getAllSubregions(countries), [countries]);
  const allSovereigntyTypes = useMemo(
    () => getAllSovereigntyTypes(countries),
    [countries]
  );

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh data
  const refreshData = () => fetchData(true);

  return {
    countries,
    currencies,
    allRegions,
    allSubregions,
    allSovereigntyTypes,
    loading,
    error,
    refreshData,
  };
}
