/** Represents a visit to a country with a year range and optional trip name. */
export type Visit = {
  yearRange: string;
  tripName?: string;
};

/** Represents the visited status filter for countries. */
export type VisitedStatus = "visited" | "not_visited" | "any";
