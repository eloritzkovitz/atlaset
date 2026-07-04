import type { ColorRoles } from "@types";

/** Represents the structure for visit roles. */
export interface VisitRoleStructure {
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

/** Represents the structure for visit roles. */
export type VisitColorRoles = ColorRoles<VisitRoleStructure>;
