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
  CQ: { name: "Sark" },
  "GB-AKR": { name: "Akrotiri and Dhekelia", sovereign: "GB" },
  "GB-ENG": { name: "England", flag: "GBENG", sovereign: "GB" },
  "GB-NIR": { name: "Northern Ireland", flag: "GBNIR", sovereign: "GB" },
  "GB-SCT": { name: "Scotland", flag: "GBSCT", sovereign: "GB" },
  "GB-WLS": { name: "Wales", flag: "GBWLS", sovereign: "GB" },
  "SH-AC": { name: "Ascension Island", flag: "AC", sovereign: "SH" },
  "SH-HL": { name: "Saint Helena", flag: "SH", sovereign: "SH" },
  "SH-TA": { name: "Tristan da Cunha", flag: "TA", sovereign: "SH" },
  XA: { name: "Abkhazia" },
  XO: { name: "South Ossetia" },
  XC: { name: "Northern Cyprus" },
};
