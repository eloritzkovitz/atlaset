import { createContext, useContext } from "react";
import { useCountryDataSource } from "../features/countries/hooks/useCountryDataSource";

interface CountryDataContextType {
  countries: any[];
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

// Custom hook for easy context access
export function useCountryData() {
  return useContext(CountryDataContext);
}

// Provider component to wrap the app and provide country data context
export function CountryDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useCountryDataSource();

  return (
    <CountryDataContext.Provider value={value}>
      {children}
    </CountryDataContext.Provider>
  );
}
