/** Represents the usage of a timezone by a country. */
export interface CountryTimezoneUsage {
  isoCode: string;
  countryName: string;
  isDst: boolean;
}

/** Represents a timezone. */
export interface Timezone {
  code: string;
  offsetMinutes: number;
  countriesCount: number;
  countries: CountryTimezoneUsage[];
}
