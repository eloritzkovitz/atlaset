/** Represents a color palette. */
export type ColorPalette = {
  name: string;
  colors: string[];
};

/** Represents a set of color roles. */
export type ColorRoles<T> = {
  [K in keyof T]: T[K];
};
