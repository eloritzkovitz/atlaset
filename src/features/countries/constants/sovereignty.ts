import type { SovereigntyType } from "../types";

// List of country codes that do not have their own flags
export const EXCLUDED_ISO_CODES = [
  "BV", // Bouvet Island
  "CP", // Clipperton Island
  "HM", // Heard Island and McDonald Islands
  "MF", // Saint Martin
  "SJ", // Svalbard and Jan Mayen
  "UK", // Akrotiri and Dhekelia
  "UM", // United States Minor Outlying Islands
];

// Mapping of dependencies that use the flag of their sovereign state and special cases
export const SOVEREIGN_FLAG_MAP: Record<string, string> = {
  BV: "NO", // Bouvet Island → Norway
  CP: "FR", // Clipperton Island → France
  HM: "AU", // Heard Island and McDonald Islands → Australia
  MF: "FR", // Saint Martin → France
  SJ: "NO", // Svalbard and Jan Mayen → Norway
  UK: "GB", // Akrotiri and Dhekelia → United Kingdom
  UM: "US", // United States Minor Outlying Islands → United States,
  "AU-ACI": "AU", // Ashmore and Cartier Islands → Australia
  "AU-CSI": "AU", // Coral Sea Islands → Australia
  "BQ-BO": "BQBO", // Bonaire
  "BQ-SA": "BQSA", // Saba
  "BQ-SE": "BQSE", // Sint Eustatius
  "GB-ENG": "GBENG", // England
  "GB-NIR": "GBNIR", // Scotland
  "GB-SCT": "GBSCT", // Northern Ireland
  "GB-WLS": "GBWLS", // Wales
};

// Predefined sovereignty order for consistent dropdown ordering
export const SOVEREIGNTY_ORDER: SovereigntyType[] = [
  "Sovereign",
  "Dependency",
  "Overseas Region",
  "Disputed",
  "Unrecognized",
];
