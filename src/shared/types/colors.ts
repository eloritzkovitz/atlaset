/** Represents a color palette. */
export type ColorPalette = {
  name: string;
  colors: string[];
};

/** Represents a set of color roles. */
export type ColorRoles<T> = {
  [K in keyof T]: T[K];
};

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
