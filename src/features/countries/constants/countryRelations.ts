/** Represents a country's relations with other geopolitical entities. */
export type CountryRelations = {
  countries?: string[];
  dependencies?: string[];
  regions?: string[];
  municipalities?: string[];
  disputes?: string[];
};

type CountryRelationsKey = keyof CountryRelations;

interface CountryRelationsSection {
  key: string;
  label: string;
  prop: CountryRelationsKey;
}

export const COUNTRY_RELATION_SECTIONS: CountryRelationsSection[] = [
  { key: "countries", label: "Countries", prop: "countries" },
  { key: "dependencies", label: "Dependencies", prop: "dependencies" },
  { key: "regions", label: "Overseas Regions", prop: "regions" },
  { key: "disputes", label: "Disputes", prop: "disputes" },
  { key: "municipalities", label: "Municipalities", prop: "municipalities" },
];

/** Represents the relations of a country with other geopolitical entities. */
export const COUNTRY_RELATIONS: Record<string, CountryRelations> = {
  AR: {
    disputes: ["FK", "GS"],
  },
  AU: {
    dependencies: ["AU-ACI", "AU-CSI", "CC", "CX", "HM", "NF"],
  },
  BQ: {
    municipalities: ["BQ-BO", "BQ-SA", "BQ-SE"],
  },
  CN: {
    disputes: ["TW"],
    dependencies: ["HK", "MO"],
  },
  CY: {
    disputes: ["UK", "XC"],
  },
  DK: {
    dependencies: ["FO", "GL"],
  },
  FI: {
    dependencies: ["AX"],
  },
  FR: {
    dependencies: ["BL", "CP", "MF", "NC", "PF", "PM", "TF", "WF"],
    regions: ["GF", "GP", "MQ", "RE", "YT"],
  },
  GB: {
    countries: ["GB-ENG", "GB-NIR", "GB-SCT", "GB-WLS"],
    dependencies: [
      "AI",
      "BM",
      "FK",
      "GB-AKR",
      "GG",
      "GI",
      "GS",
      "IM",
      "IO",
      "JE",
      "KY",
      "MS",
      "PN",
      "SH",
      "TC",
      "VG",
    ],
  },
  GE: {
    disputes: ["XA", "XO"],
  },
  KM: {
    disputes: ["YT"],
  },
  KP: {
    disputes: ["KR"],
  },
  KR: {
    disputes: ["KP"],
  },
  MA: {
    disputes: ["EH"],
  },
  MU: {
    disputes: ["IO"],
  },
  MV: {
    disputes: ["IO"],
  },
  NL: {
    dependencies: ["AW", "CW", "SX"],
    regions: ["BQ"],
  },
  NO: {
    dependencies: ["BV", "SJ"],
  },
  NZ: {
    dependencies: ["CK", "NU", "TK"],
  },
  RS: {
    disputes: ["XK"],
  },
  SH: {
    dependencies: ["SH-AC", "SH-HL", "SH-TA"],
  },
  SO: {
    disputes: ["XS"],
  },
  US: {
    dependencies: ["AS", "GU", "MP", "PR", "UM", "VI"],
  },
};

/** Represents special countries that have no official ISO 3166 code, entries or universally recognized status. */
export const SPECIAL_COUNTRIES: Record<string, { name: string }> = {
  "AU-ACI": { name: "Ashmore and Cartier Islands" },
  "AU-CSI": { name: "Coral Sea Islands" },
  "BQ-BO": { name: "Bonaire" },
  "BQ-SA": { name: "Saba" },
  "BQ-SE": { name: "Sint Eustatius" },
  "GB-AKR": { name: "Akrotiri and Dhekelia" },
  "GB-ENG": { name: "England" },
  "GB-NIR": { name: "Northern Ireland" },
  "GB-SCT": { name: "Scotland" },
  "GB-WLS": { name: "Wales" },
  "SH-AC": { name: "Ascension Island" },
  "SH-HL": { name: "Saint Helena" },
  "SH-TA": { name: "Tristan da Cunha" },
  XA: { name: "Abkhazia" },
  XO: { name: "South Ossetia" },
  XC: { name: "Northern Cyprus" },
};
