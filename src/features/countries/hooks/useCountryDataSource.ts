import { useCallback, useEffect, useState } from "react";
import {
  getAllRegions,
  getAllSubregions,
  getAllSovereigntyTypes,
} from "../utils/countryData";
import { appDb } from "@utils/db";

// Cache time-to-live: 1  week
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

/**
 * Fetches country and currency data with caching in IndexedDB.
 * @returns Country and currency data along with loading state and error
 */
export function useCountryDataSource() {
  const [countries, setCountries] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allRegions, setAllRegions] = useState<string[]>([]);
  const [allSubregions, setAllSubregions] = useState<string[]>([]);
  const [allSovereigntyTypes, setAllSovereigntyTypes] = useState<string[]>([]);

  // Fetch country and currency data with caching
  const fetchData = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    // Check cache validity
    const now = Date.now();

    // Try to get from IndexedDB (Dexie)
    let cachedCountry = await appDb.countryData.get("main");
    let cachedCurrency = await appDb.currencyData.get("main");

    // Validate cache
    const isCountryCacheValid =
      cachedCountry && cachedCountry.ts && now - cachedCountry.ts < CACHE_TTL;
    const isCurrencyCacheValid =
      cachedCurrency &&
      cachedCurrency.ts &&
      now - cachedCurrency.ts < CACHE_TTL;

    // Use cached data if valid and not forcing refresh
    if (!forceRefresh && isCountryCacheValid && isCurrencyCacheValid) {
      setCountries(cachedCountry.data);
      setAllRegions(getAllRegions(cachedCountry.data));
      setAllSubregions(getAllSubregions(cachedCountry.data));
      setAllSovereigntyTypes(getAllSovereigntyTypes(cachedCountry.data));
      setCurrencies(cachedCurrency.data);
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
      setCountries(countryData);
      setAllRegions(getAllRegions(countryData));
      setAllSubregions(getAllSubregions(countryData));
      setAllSovereigntyTypes(getAllSovereigntyTypes(countryData));
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
    } catch (err: any) {
      setError(err.message || "Failed to load data");
      setLoading(false);
    }
  }, []);

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
