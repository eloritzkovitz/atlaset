import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@app/store";
import { fetchCountryData } from "../slices/countryDataSlice";
import type { Currency } from "../types";

/**
 * Accesses country data from the Redux store and auto-fetches if needed.
 * Provides a refreshData function to manually reload.
 */
export function useCountryData() {
  const dispatch: AppDispatch = useDispatch();
  const data = useSelector((state: RootState) => state.countryData);

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

  // Compute currency counts
  const currencyCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of data.countries) {
      if (!c.currency) continue;
      map.set(c.currency, (map.get(c.currency) ?? 0) + 1);
    }
    return map;
  }, [data.countries]);

  // Return only currencies that have at least one country using them
  const { currencies } = data;
  const currenciesWithUsers = useMemo(() => {
    if (!currencies) return [] as Currency[];
    return currencies.filter(
      (cur: Currency) => (currencyCounts.get(cur.code) ?? 0) > 0,
    );
  }, [currencies, currencyCounts]);
  return {
    ...data,
    refreshData,
    currencies: currenciesWithUsers,
  };
}
