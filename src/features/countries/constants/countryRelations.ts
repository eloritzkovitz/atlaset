/** Represents a country's relations with other geopolitical entities. */
export type CountryRelations = {
  countries?: string[];
  dependencies?: string[];
  regions?: string[];
  subdivisions?: string[];
  disputes?: string[];
};

/** Represents the relations of a country with other geopolitical entities. */
export const COUNTRY_RELATIONS: Record<string, CountryRelations> = {
  AR: {
    disputes: ["FK", "GS"],
  },
  AU: {
    dependencies: ["AU-ACI", "AU-CSI", "CC", "CX", "HM", "NF"],
  },
  BQ: {
    subdivisions: ["BQ-BO", "BQ-SA", "BQ-SE"],
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
      "GB-SBA",
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
  GG: {
    subdivisions: ["CQ"],
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
    subdivisions: ["SH-AC", "SH-HL", "SH-TA"],
  },
  SO: {
    disputes: ["XS"],
  },
  UM: {
    subdivisions: [
      "UM-81",
      "UM-84",
      "UM-86",
      "UM-87",
      "UM-89",
      "UM-71",
      "UM-76",
      "UM-95",
      "UM-79",
    ],
  },
  US: {
    dependencies: ["AS", "GU", "MP", "PR", "UM", "VI"],
  },
};

type CountryRelationsKey = keyof CountryRelations;

/** Represents a section for displaying country relations. */
interface CountryRelationsSection {
  key: string;
  label: string;
  prop: CountryRelationsKey;
}

/** Represents the sections for displaying country relations. */
export const COUNTRY_RELATION_SECTIONS: CountryRelationsSection[] = [
  { key: "countries", label: "Countries", prop: "countries" },
  { key: "dependencies", label: "Dependencies", prop: "dependencies" },
  { key: "regions", label: "Overseas Regions", prop: "regions" },
  { key: "subdivisions", label: "Subdivisions", prop: "subdivisions" },
  { key: "disputes", label: "Disputes", prop: "disputes" },
];

/** Represents flag overrides for territories that do not have their own flags. */
export const FLAG_OVERRIDES: Record<
  string,
  { sovereign?: string; flag?: string }
> = {
  "AU-ACI": { sovereign: "AU" }, // Ashmore and Cartier Islands
  "AU-CSI": { sovereign: "AU" }, // Coral Sea Islands
  BQ: { sovereign: "NL" }, // Caribbean Netherlands
  BV: { sovereign: "NO" }, // Bouvet Island
  CP: { sovereign: "FR" }, // Clipperton Island
  "GB-SBA": { sovereign: "GB" }, // Akrotiri and Dhekelia
  HM: { sovereign: "AU" }, // Heard Island and McDonald Islands
  MF: { sovereign: "FR" }, // Saint Martin
  SH: { sovereign: "GB" }, // Saint Helena, Ascension and Tristan da Cunha
  SJ: { sovereign: "NO" }, // Svalbard and Jan Mayen
  UM: { sovereign: "US" }, // United States Minor Outlying Islands
};

// List of country codes that do not have their own flags, derived from FLAG_OVERRIDES
export const EXCLUDED_ISO_CODES: string[] = Object.keys(FLAG_OVERRIDES).sort();
