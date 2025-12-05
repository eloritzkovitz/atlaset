// Flag type definition
export type Flag = {
  isoCode: string;
  source: FlagSource;
  style: FlagStyle;
  size?: FlagSize;
};

// Flag property types
export type FlagSource = "flagcdn" | "flagsapi" | "svg";
export type FlagStyle = "flat" | "shiny";
export type FlagSize = "16" | "24" | "32" | "48" | "64" | "128";