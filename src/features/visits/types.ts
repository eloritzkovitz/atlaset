/** Represents a visit to a country. */
export type Visit = {
  yearRange: string;
  tripName?: string;
  tripId?: string;
};

/** Represents the visited status filter for countries. */
export type VisitedStatus = "visited" | "not_visited" | "want_to_visit" | "any";

/**
 * Aggregates visit-derived data for quick access in UI components and utilities.
 */
export type VisitContext = {
  visitedIsoCodes: string[];
  visitedMap: Record<string, number>;
  visitedYearMap: Record<string, Set<number>>;
  firstVisitMap?: Record<string, Date>;
  lastVisitMap?: Record<string, Date>;
  wantToVisitIsoCodes?: string[];
};
