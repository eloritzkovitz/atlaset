import { createContext, useContext } from "react";
import type { Country, SovereigntyType } from "@features/countries";

export interface CountryDataContextType {
  countries: Country[];
  currencies: Record<string, string>;
  allRegions: string[];
  allSubregions: string[];
  allSovereigntyTypes: SovereigntyType[];
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
