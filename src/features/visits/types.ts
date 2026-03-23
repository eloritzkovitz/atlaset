/** Represents a visit to a country. */
export type Visit = {
  yearRange: string;
  tripName?: string;
  tripId?: string;
};

/** Represents the visited status filter for countries. */
export type VisitedStatus = "visited" | "not_visited" | "any";

/** Type alias for the visited-year presence map: country ISO -> set of years visited. */
export type VisitedYearMap = Record<string, Set<number>>;
