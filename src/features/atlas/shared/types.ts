import type { ColorRoles } from "@types";

/** Represents the current mode of the map. */
export type MapMode = "view" | "readonly" | "edit" | "timeline";

/** Modes for coloring countries on the map. */
export type ColorMode = "standard" | "atlas" | "cumulative" | "yearly";

/** Represents the structure for visit colors. */
export interface VisitColorStructure {
  base: string;
  home: string;
  visitCounts: string[];
  yearly: {
    new: string;
    revisit: string;
    previous: string;
    upcoming: string;
    upcomingRevisit: string;
  };
}

/** Represents visit colors. */
export type VisitColors = ColorRoles<VisitColorStructure>;
