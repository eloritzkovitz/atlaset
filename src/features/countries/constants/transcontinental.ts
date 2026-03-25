/** Represents an entry for a transcontinental country. */
export type TranscontinentalEntry = {
  /** The ISO 3166-1 alpha-2 code for the country */
  isoCode: string;
  /** Additional continent/region */
  additionalRegion: string;
  /** Additional subregion */
  additionalSubregion?: string;
};

export const TRANSCONTINENTAL: TranscontinentalEntry[] = [
  {
    isoCode: "AZ",
    additionalRegion: "Europe",
    additionalSubregion: "Eastern Europe",
  },
  {
    isoCode: "EG",
    additionalRegion: "Asia",
    additionalSubregion: "Western Asia",
  },
  {
    isoCode: "GE",
    additionalRegion: "Europe",
    additionalSubregion: "Eastern Europe",
  },
  {
    isoCode: "KZ",
    additionalRegion: "Europe",
    additionalSubregion: "Eastern Europe",
  },
  {
    isoCode: "TR",
    additionalRegion: "Europe",
    additionalSubregion: "Southeast Europe",
  },
  {
    isoCode: "RU",
    additionalRegion: "Asia",
    additionalSubregion: "North Asia",
  },
];

export const TRANSCONTINENTAL_MAP: Map<string, TranscontinentalEntry> = new Map(
  TRANSCONTINENTAL.map((e) => [e.isoCode.toUpperCase(), e]),
);

export default TRANSCONTINENTAL;
