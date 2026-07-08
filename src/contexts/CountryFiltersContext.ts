import { createContext, useContext } from "react";
import type { Country, GeoType, SovereigntyStatus } from "@features/countries";
import type { VisitedStatus } from "@features/visits";

export interface CountryFiltersContextType {
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
  selectedRegion: string;
  selectedSubregion: string;
  selectedGeoType: GeoType | "";
  setSelectedRegion: (region: string) => void;
  setSelectedSubregion: (subregion: string) => void;
  setSelectedGeoType: (type: GeoType | "") => void;
  selectedSovereignty: SovereigntyStatus | "";
  sovereignOnly: boolean;
  setSelectedSovereignty: (status: SovereigntyStatus | "") => void;
  setSovereignOnly: (only: boolean) => void;
  selectedVisited: VisitedStatus;
  setSelectedVisited: (status: VisitedStatus) => void;
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
