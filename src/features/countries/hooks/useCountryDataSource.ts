import { useCallback, useEffect, useState, useMemo } from "react";
import type { Country } from "../types";
import {
  getAllRegions,
  getAllSubregions,
  getAllSovereigntyTypes,
} from "../utils/countryData";

/**
 * Manages fetching and state of country and currency data.
 * @returns Country and currency data along with loading state and error
 */
export function useCountryDataSource() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [currencies, setCurrencies] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch country and currency data from static file in dev, backend in prod
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    let countryDataUrl, currencyDataUrl;
    if (process.env.NODE_ENV === "production") {
      countryDataUrl = import.meta.env.VITE_COUNTRY_DATA_URL;
      currencyDataUrl = import.meta.env.VITE_CURRENCY_DATA_URL;
    } else {
      countryDataUrl = "/data/countries.json";
      currencyDataUrl = "/data/currencies.json";
    }

    try {
      const fetchOpts: RequestInit | undefined =
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
  const refreshData = () => fetchData();

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
