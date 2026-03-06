/** Represents a visit to a country. */
export type Visit = {
  yearRange: string;
  tripName?: string;
};

/** Represents the visited status filter for countries. */
export type VisitedStatus = "visited" | "not_visited" | "any";
