import { useCountryDataSource } from "@features/countries/hooks/useCountryDataSource";
import { CountryDataContext } from "./CountryDataContext";

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
