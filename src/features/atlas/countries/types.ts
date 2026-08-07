/** Represents a list of countries. */
export type CountryList = {
  id: string;
  name: string;
  countryCodes: string[];
  layerId?: string | null;
};
