// ColorPalette type definition
export type ColorPalette = {
  name: string;
  colors: string[];
};

// Generic ColorRoles type definition
export type ColorRoles<T> = {
  [K in keyof T]: T[K];
};

// VisitColorRoles interface definition
export interface VisitRoleStructure {
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

// VisitColorRoles type definition
export type VisitColorRoles = ColorRoles<VisitRoleStructure>;
