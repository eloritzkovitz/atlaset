import type { Country } from "@features/countries/types";
import type { Visit } from "@features/visits/types";

/** Represents a row in the visited countries ranking table. */
export interface VisitedCountryRankRow {
  rank: number;
  country: Country;
  visitCount: number;
  years: number[];
  tripsByYear: Record<number, Visit[]>;
}

/** Represents a row in the monthly statistics table. */
export type MonthRow = {
  monthIndex: number;
  name: string;
  local: number;
  abroad: number;
  total: number;
  percentage: number;
};

/** Represents a row in the yearly statistics table. */
export type YearRow = {
  year: number;
  local: number;
  abroad: number;
  total: number;
};
