export type CountryRelationsGroup = {
  codes: string[];
  label?: string;
};

export type CountryRelations = Record<string, CountryRelationsGroup>;

/** Represents the relations of a country with other geopolitical entities. */
export const COUNTRY_RELATIONS: Record<string, CountryRelations> = {
  AR: {
    disputes: { codes: ["FK", "GS"] },
  },
  AU: {
    dependencies: {
      codes: ["CC", "CX", "HM", "NF", "XL", "XM"],
      label: "External Territories",
    },
  },
  BQ: {
    subdivisions: {
      codes: ["BQ-BO", "BQ-SA", "BQ-SE"],
      label: "Special Municipalities",
    },
  },
  CN: {
    disputes: { codes: ["TW"] },
    dependencies: {
      codes: ["HK", "MO"],
      label: "Special Administrative Regions",
    },
  },
  CY: {
    disputes: { codes: ["XC", "XQ"] },
  },
  DK: {
    dependencies: { codes: ["FO", "GL"], label: "Autonomous Territories" },
  },
  FI: {
    dependencies: { codes: ["AX"], label: "Autonomous Regions" },
  },
  FR: {
    overseas_regions: {
      codes: ["GF", "GP", "MQ", "RE", "YT"],
    },
    dependencies: {
      codes: ["BL", "CP", "MF", "NC", "PF", "PM", "TF", "WF"],
      label: "Overseas Territories",
    },
  },
  GB: {
    subdivisions: {
      codes: ["GB-ENG", "GB-NIR", "GB-SCT", "GB-WLS"],
      label: "Constituent Countries",
    },
    crown_dependencies: {
      codes: ["GG", "IM", "JE"],
    },
    dependencies: {
      codes: [
        "AI",
        "BM",
        "FK",
        "GI",
        "GS",
        "IO",
        "KY",
        "MS",
        "PN",
        "SH",
        "TC",
        "VG",
        "XQ",
      ],
      label: "Overseas Territories",
    },
  },
  GE: {
    disputes: { codes: ["XA", "XO"] },
  },
  GG: {
    subdivisions: { codes: ["CQ"] },
  },
  KM: {
    disputes: { codes: ["YT"] },
  },
  KP: {
    disputes: { codes: ["KR"] },
  },
  KR: {
    disputes: { codes: ["KP"] },
  },
  MA: {
    disputes: { codes: ["EH"] },
  },
  MU: {
    disputes: { codes: ["IO"] },
  },
  MV: {
    disputes: { codes: ["IO"] },
  },
  NL: {
    dependencies: { codes: ["AW", "CW", "SX"] },
    regions: { codes: ["BQ"], label: "Overseas Regions" },
  },
  NO: {
    dependencies: { codes: ["BV", "SJ"] },
  },
  NZ: {
    associated_states: { codes: ["CK", "NU"] },
    dependencies: { codes: ["TK"] },
  },
  RS: {
    disputes: { codes: ["XK"] },
  },
  SH: {
    subdivisions: {
      codes: ["SH-AC", "SH-HL", "SH-TA"],
      label: "Constituent Parts",
    },
  },
  SO: {
    disputes: { codes: ["XS"] },
  },
  UM: {
    subdivisions: {
      codes: [
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
  },
  US: {
    dependencies: {
      codes: ["AS", "GU", "MP", "PR", "UM", "VI"],
      label: "Territories",
    },
  },
};

/** Represents flag overrides for territories that use their sovereign state's flag. */
export const FLAG_OVERRIDES: string[] = [
  "BQ", // Caribbean Netherlands
  "BV", // Bouvet Island
  "CP", // Clipperton Island
  "HM", // Heard Island and McDonald Islands
  "MF", // Saint Martin
  "SH", // Saint Helena, Ascension and Tristan da Cunha
  "SJ", // Svalbard and Jan Mayen
  "UM", // United States Minor Outlying Islands
  "XL", // Coral Sea Islands
  "XM", // Ashmore and Cartier Islands
  "XQ", // Akrotiri and Dhekelia
].sort();
