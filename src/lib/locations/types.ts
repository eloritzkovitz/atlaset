/** Represents a location. */
export type Location = {
  id: number;
  name: string;
  countryCode: string;
  countryName: string;
  admin1?: {
    id: number;
    name: string;
    code: string;
  };
  latitude: number;
  longitude: number;
};
