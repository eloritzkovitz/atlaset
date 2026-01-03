import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCountryData } from "../slices/countryDataSlice";
import type { RootState, AppDispatch } from "../../../store";

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
  const refreshData = () => {
    dispatch(fetchCountryData());
  };
  return { ...data, refreshData };
}
