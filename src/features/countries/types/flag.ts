// Flag type definition
export type Flag = {
  isoCode: string;
  ratio: FlagRatio;
  size?: FlagSize;
};

// Flag property types
export type FlagRatio = "original" | "3x2" | "4x3";
export type FlagSize = "16" | "24" | "32" | "48" | "64" | "128";