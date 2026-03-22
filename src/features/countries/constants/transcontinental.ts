import type { TranscontinentalEntry } from "../types";

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
