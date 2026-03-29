import type { TranscontinentalScope } from "../types";

/** Represents an entry for a transcontinental country. */
export type TranscontinentalCountry = {
  /** The ISO 3166-1 alpha-2 code for the country */
  isoCode: string;
  /** Additional continent/region */
  additionalRegion: string;
  /** Additional subregion */
  additionalSubregion?: string;
  /** The scope of the transcontinental nature, if specified. */
  scope?: TranscontinentalScope;
};

export const TRANSCONTINENTAL: TranscontinentalCountry[] = [
  {
    isoCode: "AM",
    additionalRegion: "Europe",
    additionalSubregion: "Eastern Europe",
    scope: "other",
  },
  {
    isoCode: "AZ",
    additionalRegion: "Europe",
    additionalSubregion: "Eastern Europe",
    scope: "contiguous",
  },
  {
    isoCode: "CY",
    additionalRegion: "Europe",
    additionalSubregion: "Southeast Europe",
    scope: "other",
  },
  {
    isoCode: "EG",
    additionalRegion: "Asia",
    additionalSubregion: "Western Asia",
    scope: "contiguous",
  },
  {
    isoCode: "ES",
    additionalRegion: "Africa",
    additionalSubregion: "Northern Africa",
    scope: "overseas",
  },
  {
    isoCode: "GE",
    additionalRegion: "Europe",
    additionalSubregion: "Eastern Europe",
    scope: "contiguous",
  },
  {
    isoCode: "ID",
    additionalRegion: "Oceania",
    additionalSubregion: "Melanesia",
    scope: "overseas",
  },
  {
    isoCode: "KZ",
    additionalRegion: "Europe",
    additionalSubregion: "Eastern Europe",
    scope: "contiguous",
  },
  {
    isoCode: "RU",
    additionalRegion: "Asia",
    additionalSubregion: "North Asia",
    scope: "contiguous",
  },
  {
    isoCode: "TR",
    additionalRegion: "Europe",
    additionalSubregion: "Southeast Europe",
    scope: "contiguous",
  },
  {
    isoCode: "US",
    additionalRegion: "Oceania",
    additionalSubregion: "Polynesia",
    scope: "overseas",
  },
];

export const TRANSCONTINENTAL_MAP: Map<string, TranscontinentalCountry> =
  new Map(TRANSCONTINENTAL.map((e) => [e.isoCode.toUpperCase(), e]));
