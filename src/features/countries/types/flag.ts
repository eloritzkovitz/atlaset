/** Represents a flag. */
export type Flag = {
  isoCode: string;
  sovereignState?: string;
  ratio: FlagRatio;
  size?: FlagSize;
};

/** Represents the aspect ratio of the flag. */
export type FlagRatio = "original" | "3x2";

/** Represents the size of the flag in pixels. */
export type FlagSize = "16" | "24" | "32" | "48" | "64" | "128" | "256" | "512";
