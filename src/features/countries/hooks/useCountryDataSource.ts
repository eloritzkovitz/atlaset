import { useCallback, useEffect, useState, useMemo } from "react";
import { CACHE_TTL } from "@config/cache";
import { appDb } from "@utils/db";
import {
  getAllRegions,
  getAllSubregions,
  getAllSovereigntyTypes,
} from "../utils/countryData";
import type { Country } from "@types";

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

    // Check cache validity
    const now = Date.now();

    // Try to get from IndexedDB (Dexie)
    const cachedCountry = await appDb.countryData.get("main");
    const cachedCurrency = await appDb.currencyData.get("main");

    // Validate cache
    const isCountryCacheValid =
      cachedCountry &&
      typeof cachedCountry.ts === "number" &&
      now - cachedCountry.ts < CACHE_TTL;
    const isCurrencyCacheValid =
      cachedCurrency &&
      typeof cachedCurrency.ts === "number" &&
      now - cachedCurrency.ts < CACHE_TTL;

    // Use cached data if valid and not forcing refresh
    if (!forceRefresh && isCountryCacheValid && isCurrencyCacheValid) {
      setCountries(cachedCountry.data as Country[]);
      setCurrencies(cachedCurrency.data as Record<string, string>);
      setLoading(false);
      return;
    }

    // Fetch from network if not cached or forced
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
      const [countryData, currencyData] = await Promise.all([
        fetch(countryDataUrl).then((res) => {
          if (!res.ok) throw new Error("Failed to load country data");
          return res.json();
        }),
        fetch(currencyDataUrl).then((res) => {
          if (!res.ok) throw new Error("Failed to load currency data");
          return res.json();
        }),
      ]);

      // Update state
      setCountries(countryData as Country[]);
      setCurrencies(currencyData);
      setLoading(false);

      // Save to Dexie
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      setLoading(false);
    }
  }, []);

  // Memoized derived data
  const allRegions = useMemo(() => getAllRegions(countries), [countries]);
  const allSubregions = useMemo(() => getAllSubregions(countries), [countries]);
  const allSovereigntyTypes = useMemo(() => getAllSovereigntyTypes(countries), [countries]);

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
