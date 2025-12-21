import { createContext, useContext } from "react";
import type { Country } from "@types";

export interface CountryDataContextType {
  countries: Country[];
  currencies: Record<string, string>;
  allRegions: string[];
  allSubregions: string[];
  allSovereigntyTypes: string[];
  loading: boolean;
  error: string | null;
  refreshData?: () => void;
}

export const CountryDataContext = createContext<CountryDataContextType>({
  countries: [],
  currencies: {},
  allRegions: [],
  allSubregions: [],
  allSovereigntyTypes: [],
  loading: true,
  error: null,
  refreshData: undefined,
});

export function useCountryData() {
  return useContext(CountryDataContext);
}
