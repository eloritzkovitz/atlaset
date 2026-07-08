import { createContext, useContext } from "react";
import { useCountryFilters as useCountryFiltersLogic } from "@features/atlas/countries/hooks/useCountryFilters";

type CountryFiltersContextType = ReturnType<typeof useCountryFiltersLogic>;

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
