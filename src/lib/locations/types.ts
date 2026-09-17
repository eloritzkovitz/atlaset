/** Represents a location. */
export type Location = {
  id: number;
  name: string;
  countryCode: string;
  countryName: string;
  admin1?: {
    name: string;
    code: string;
  };
  latitude: number;
  longitude: number;
  featureCode: string;
  featureName: string;
};
