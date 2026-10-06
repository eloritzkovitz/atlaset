import { createContext, useContext } from "react";
import type { Country } from "@features/countries";
import type { CountryCoreFilterState } from "../types";

export interface CountryFiltersContextType extends CountryCoreFilterState {
  search: string;
  setSearch: (value: string) => void;
  debouncedSearch: string;
  filteredIsoCodes: string[];
  filteredCountries: Country[];
  searchedCountries: Country[];
  visitedIsoCodes: string[];
  wantToVisitCountryCodes: string[];
  allCount: number;
  sovereignCount: number;
  visitedCount: number;
  wantToVisitCount: number;
  sovereignOnly: boolean;
  setSovereignOnly: (only: boolean) => void;
  visitedOnly: boolean;
  setVisitedOnly: (only: boolean) => void;
  wantToVisitOnly: boolean;
  setWantToVisitOnly: (only: boolean) => void;
  minVisitCount: number;
  maxVisitCount: number | undefined;
  setMinVisitCount: React.Dispatch<React.SetStateAction<number>>;
  setMaxVisitCount: React.Dispatch<React.SetStateAction<number | undefined>>;
  resetFilters: () => void;
}

export const CountryFiltersContext = createContext<
  CountryFiltersContextType | undefined
>(undefined);

export function useCountryFilters() {
  const context = useContext(CountryFiltersContext);
  if (!context) {
    throw new Error(
      "useCountryFilters must be used within a CountryFiltersProvider",
    );
  }
  return context;
}
