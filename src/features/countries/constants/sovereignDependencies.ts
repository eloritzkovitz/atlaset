type SovereigntyGroup = {
  name: string;
  countries?: { name: string; isoCode: string }[];
  dependencies?: { name: string; isoCode: string }[];
  regions?: { name: string; isoCode: string }[];
  territories?: { name: string; isoCode: string }[];
  disputes?: { name: string; isoCode: string }[];
};

// List of sovereign states with their dependent territories, regions, and disputes
export const SOVEREIGN_DEPENDENCIES: Record<string, SovereigntyGroup> = {
  AU: {
    name: "Australia",
    dependencies: [
      { name: "Cocos (Keeling) Islands", isoCode: "CC" },
      { name: "Christmas Island", isoCode: "CX" },
      { name: "Heard Island and McDonald Islands", isoCode: "HM" },
      { name: "Norfolk Island", isoCode: "NF" },
    ],
  },
  CN: {
    name: "China",
    disputes: [{ name: "Taiwan", isoCode: "TW" }],
    dependencies: [
      { name: "Hong Kong", isoCode: "HK" },
      { name: "Macao", isoCode: "MO" },
    ],
  },
  DK: {
    name: "Denmark",
    dependencies: [
      { name: "Faroe Islands", isoCode: "FO" },
      { name: "Greenland", isoCode: "GL" },
    ],
  },
  FI: {
    name: "Finland",
    dependencies: [{ name: "Åland Islands", isoCode: "AX" }],
  },
  FR: {
    name: "France",
    dependencies: [
      { name: "Saint Barthélemy", isoCode: "BL" },
      { name: "Clipperton Island", isoCode: "CP" },
      { name: "Saint Martin", isoCode: "MF" },
      { name: "New Caledonia", isoCode: "NC" },
      { name: "French Polynesia", isoCode: "PF" },
      { name: "Saint Pierre and Miquelon", isoCode: "PM" },
      { name: "French Southern and Antarctic Lands", isoCode: "TF" },
      { name: "Wallis and Futuna", isoCode: "WF" },
    ],
    regions: [
      { name: "French Guiana", isoCode: "GF" },
      { name: "Guadeloupe", isoCode: "GP" },
      { name: "Martinique", isoCode: "MQ" },
      { name: "Réunion", isoCode: "RE" },
      { name: "Mayotte", isoCode: "YT" },
    ],
  },
  GB: {
    name: "United Kingdom",
    countries: [
      { name: "England", isoCode: "ENG" },
      { name: "Northern Ireland", isoCode: "NIR" },
      { name: "Scotland", isoCode: "SCT" },
      { name: "Wales", isoCode: "WLS" },
    ],
    dependencies: [
      { name: "Anguilla", isoCode: "AI" },
      { name: "Akrotiri and Dhekelia", isoCode: "UK" },
      { name: "Bermuda", isoCode: "BM" },
      { name: "Falkland Islands (Malvinas)", isoCode: "FK" },
      { name: "Guernsey", isoCode: "GG" },
      { name: "Gibraltar", isoCode: "GI" },
      { name: "South Georgia", isoCode: "GS" },
      { name: "Isle of Man", isoCode: "IM" },
      { name: "British Indian Ocean Territory", isoCode: "IO" },
      { name: "Jersey", isoCode: "JE" },
      { name: "Cayman Islands", isoCode: "KY" },
      { name: "Montserrat", isoCode: "MS" },
      { name: "Pitcairn", isoCode: "PN" },
      { name: "Saint Helena, Ascension and Tristan da Cunha", isoCode: "SH" },
      { name: "Turks and Caicos Islands", isoCode: "TC" },
    ],
  },
  MA: {
    name: "Morocco",
    disputes: [{ name: "Western Sahara", isoCode: "EH" }],
  },
  NL: {
    name: "Netherlands",
    dependencies: [
      { name: "Aruba", isoCode: "AW" },
      { name: "Curaçao", isoCode: "CW" },
      { name: "Sint Maarten", isoCode: "SX" },
    ],
    regions: [{ name: "Caribbean Netherlands", isoCode: "BQ" }],
  },
  NO: {
    name: "Norway",
    dependencies: [
      { name: "Bouvet Island", isoCode: "BV" },
      { name: "Svalbard and Jan Mayen", isoCode: "SJ" },
    ],
  },
  NZ: {
    name: "New Zealand",
    dependencies: [
      { name: "Cook Islands", isoCode: "CK" },
      { name: "Niue", isoCode: "NU" },
      { name: "Tokelau", isoCode: "TK" },
    ],
  },
  RS: {
    name: "Serbia",
    disputes: [{ name: "Kosovo", isoCode: "XK" }],
  },
  SO: {
    name: "Somalia",
    disputes: [{ name: "Somaliland", isoCode: "JS" }],
  },
  US: {
    name: "United States",
    dependencies: [
      { name: "American Samoa", isoCode: "AS" },
      { name: "Guam", isoCode: "GU" },
      { name: "Northern Mariana Islands", isoCode: "MP" },
      { name: "Puerto Rico", isoCode: "PR" },
      { name: "United States Minor Outlying Islands", isoCode: "UM" },
      { name: "U.S. Virgin Islands", isoCode: "VI" },
    ],
  },
};
