/** Represents special countries that have no official ISO 3166 code, entries or universally recognized status. */
export type SpecialCountry = {
  name: string;
  flag?: string;
  sovereign?: string;
};

export const SPECIAL_COUNTRIES: Record<string, SpecialCountry> = {
  "AU-ACI": { name: "Ashmore and Cartier Islands", sovereign: "AU" },
  "AU-CSI": { name: "Coral Sea Islands", sovereign: "AU" },
  "BQ-BO": { name: "Bonaire", flag: "BQBO", sovereign: "BQ" },
  "BQ-SA": { name: "Saba", flag: "BQSA", sovereign: "BQ" },
  "BQ-SE": { name: "Sint Eustatius", flag: "BQSE", sovereign: "BQ" },
  CP: { name: "Clipperton Island", sovereign: "FR" },
  CQ: { name: "Sark" },
  "GB-ENG": { name: "England", flag: "GBENG", sovereign: "GB" },
  "GB-NIR": { name: "Northern Ireland", flag: "GBNIR", sovereign: "GB" },
  "GB-SCT": { name: "Scotland", flag: "GBSCT", sovereign: "GB" },
  "GB-WLS": { name: "Wales", flag: "GBWLS", sovereign: "GB" },
  "SH-AC": { name: "Ascension Island", flag: "AC", sovereign: "SH" },
  "SH-HL": { name: "Saint Helena", flag: "SH", sovereign: "SH" },
  "SH-TA": { name: "Tristan da Cunha", flag: "TA", sovereign: "SH" },
  "UM-81": { name: "Baker Island", sovereign: "UM" },
  "UM-84": { name: "Howland Island", sovereign: "UM" },
  "UM-86": { name: "Jarvis Island", sovereign: "UM" },
  "UM-87": { name: "Johnston Atoll", sovereign: "UM" },
  "UM-89": { name: "Kingman Reef", sovereign: "UM" },
  "UM-71": { name: "Midway Atoll", sovereign: "UM" },
  "UM-76": { name: "Navassa Island", sovereign: "UM" },
  "UM-95": { name: "Palmyra Atoll", sovereign: "UM" },
  "UM-79": { name: "Wake Island", sovereign: "UM" },
  XA: { name: "Abkhazia" },
  XO: { name: "South Ossetia" },
  XC: { name: "Northern Cyprus" },
};
