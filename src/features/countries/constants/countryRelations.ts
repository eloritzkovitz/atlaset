import type { CountryRelations } from "../types";

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
];

export const COUNTRY_RELATIONS: Record<string, CountryRelations> = {
  AU: {
    dependencies: ["CC", "CX", "HM", "NF"],
  },
  CN: {
    disputes: ["TW"],
    dependencies: ["HK", "MO"],
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
      "UK",
      "BM",
      "FK",
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
  MA: {
    disputes: ["EH"],
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
  SO: {
    disputes: ["JS"],
  },
  US: {
    dependencies: ["AS", "GU", "MP", "PR", "UM", "VI"],
  },
};

export const SPECIAL_COUNTRIES: Record<string, { name: string }> = {
  "GB-ENG": { name: "England" },
  "GB-NIR": { name: "Northern Ireland" },
  "GB-SCT": { name: "Scotland" },
  "GB-WLS": { name: "Wales" },
  CP: { name: "Clipperton Island" },
};
