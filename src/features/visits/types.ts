/** Represents a visit to a country. */
export type Visit = {
  yearRange: string | null;
  tripName?: string;
  tripId: string;
  startDate?: string;
  endDate?: string;
};

/** Represents the visited status filter for countries. */
export type VisitedStatus = "visited" | "not_visited" | "want_to_visit" | "any";

/** Aggregates visit-derived data for quick access in UI components and utilities. */
export type VisitContext = {
  visitedIsoCodes: string[];
  visitedMap: Record<string, number>;
  visitedYearMap: Record<string, Set<number>>;
  firstVisitMap?: Record<string, Date>;
  lastVisitMap?: Record<string, Date>;
  wantToVisitIsoCodes?: string[];
};

/** Represents a categorized list of visits. */
export type CategorizedVisits = {
  past: Visit[];
  upcoming: Visit[];
  tentative: Visit[];
};

/** Represents a country tracking field. */
export type CountryTrackingField =
  | "manualVisitedCountryCodes"
  | "wantToVisitCountryCodes";

/** Represents persisted country tracking data. */
export type CountryTrackingData = {
  manualVisitedCountryCodes: string[];
  wantToVisitCountryCodes: string[];
};
