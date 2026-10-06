import type { SovereigntyStatus } from "@features/countries/types";
import type { VisitedStatus } from "@features/visits/types";

/** Represents a list of countries. */
export type CountryList = {
  id: string;
  name: string;
  countryCodes: string[];
  layerId?: string | null;
};

/** Filter keys for countries. */
export type CountryFilterKey =
  | "region"
  | "subregion"
  | "landlocked"
  | "sovereignty"
  | "visited";

/** State and setters used by the core country filter configuration. */
export interface CountryCoreFilterState {
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedSubregion: string;
  setSelectedSubregion: (subregion: string) => void;
  selectedLandlocked: boolean | "";
  setSelectedLandlocked: (landlocked: boolean | "") => void;
  selectedSovereignty: SovereigntyStatus | "";
  setSelectedSovereignty: (sovereignty: SovereigntyStatus | "") => void;
  selectedVisited: VisitedStatus;
  setSelectedVisited: (visited: VisitedStatus) => void;
}
