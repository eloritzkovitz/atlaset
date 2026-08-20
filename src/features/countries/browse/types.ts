import type { VisitedStatus } from "@features/visits/types";
import type { Operator } from "@types";
import type {
  Country,
  GeoType,
  SovereigntyStatus,
  TranscontinentalMode,
  TranscontinentalScope,
} from "../types";

/** Represents a key for a country qualifier search. */
export type CountryQualifierKey =
  | keyof Country
  | "sovereign"
  | "visited"
  | "wantToVisit"
  | "tc";

/** Configuration for a country qualifier search. */
export type CountryQualifierConfig = {
  key: CountryQualifierKey;
  label?: string;
  type?: "string" | "boolean" | "number" | "date";
};

/** Modifier configuration for country filtering. */
export type CountryModifiers = {
  match?: "prefix" | "substring" | "exact" | "regex";
  tc?: string;
  tcOption?: { scope?: TranscontinentalScope; mode?: TranscontinentalMode };
  dst?: boolean | string;
  count?: { op: Operator; value: number } | undefined;
  year?: { op: Operator; year: number } | undefined;
  first?: { op: Operator; year: number } | undefined;
  last?: { op: Operator; year: number } | undefined;
};

/** Options for filtering countries. */
export type CountryFilterOptions = {
  search?: string;
  selectedRegion?: string;
  selectedSubregion?: string;
  selectedGeoType?: GeoType | "";
  selectedSovereignty?: SovereigntyStatus | "";
  selectedVisited?: VisitedStatus;
  layerCountries?: string[];
  modifiers?: CountryModifiers;
};
