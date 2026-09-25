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

/** Options that affect how a country qualifier is evaluated. */
export type CountryQualifierOptions = {
  match?: "prefix" | "substring" | "exact" | "regex";
  tcOption?: {
    scope?: TranscontinentalScope;
    mode?: TranscontinentalMode;
  };
  dst?: boolean | string;
};

/** Modifiers that filter countries by visit history. */
export type CountryVisitModifiers = {
  count?: { op: Operator; value: number };
  year?: { op: Operator; year: number };
  first?: { op: Operator; year: number };
  last?: { op: Operator; year: number };
};

/** All supported country search modifiers. */
export type CountryModifiers = CountryQualifierOptions & CountryVisitModifiers;

/** Options for filtering countries. */
export type CountryFilterOptions = {
  search?: string;
  selectedRegion?: string;
  selectedSubregion?: string;
  selectedGeoType?: GeoType | "";
  selectedSovereignty?: SovereigntyStatus | "";
  selectedVisited?: VisitedStatus;
  layerCountries?: string[];
  tcOption?: {
    scope: TranscontinentalScope;
    mode: TranscontinentalMode;
  };
  modifiers?: CountryModifiers;
};
