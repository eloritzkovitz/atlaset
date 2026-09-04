import { createApi } from "@reduxjs/toolkit/query/react";
import type { Country, SovereigntyStatus } from "../../types";

export interface TransformedCountryData {
  countries: Country[];
  allRegions: string[];
  allSubregions: string[];
  allSovereigntyStatuses: SovereigntyStatus[];
}

/** API for fetching country data. */
export const countriesApi = createApi({
  reducerPath: "countriesApi",
  baseQuery: async () => ({ data: undefined }),
  endpoints: (builder) => ({
    getRawCountries: builder.query<Country[], void>({
      queryFn: async () => {
        try {
          const response = await fetch("/data/countries.json");

          if (!response.ok) {
            throw new Error(`Failed to load country data (${response.status})`);
          }

          const countryData: unknown = await response.json();

          if (!Array.isArray(countryData)) {
            throw new Error("Invalid country data");
          }

          return { data: countryData as Country[] };
        } catch (err) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error:
                err instanceof Error
                  ? err.message
                  : "Failed to load country data",
            },
          };
        }
      },
    }),
  }),
});

export const { useGetRawCountriesQuery } = countriesApi;
