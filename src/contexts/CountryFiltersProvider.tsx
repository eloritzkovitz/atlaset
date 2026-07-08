import type { ReactNode } from "react";
import { useCountryFilters as useCountryFiltersLogic } from "@features/atlas/countries/hooks/useCountryFilters";
import { CountryFiltersContext } from "./CountryFiltersContext";

interface CountryFiltersProviderProps {
  children: ReactNode;
}

export function CountryFiltersProvider({
  children,
}: CountryFiltersProviderProps) {
  const filters = useCountryFiltersLogic();

  return (
    <CountryFiltersContext.Provider value={filters}>
      {children}
    </CountryFiltersContext.Provider>
  );
}
