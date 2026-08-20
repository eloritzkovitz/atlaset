import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchWithFallback } from "@lib/api-client";
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
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    getRawCountries: builder.query<Country[], void>({
      queryFn: async () => {
        try {
          const staticCountryUrl = "/data/countries.json";
          const countryData = await fetchWithFallback(
            staticCountryUrl,
            { envVar: "VITE_COUNTRY_DATA_URL" },
            "country data"
          );

          if (!Array.isArray(countryData)) {
            throw new Error("Failed to load country data");
          }

          return { data: countryData as Country[] };
        } catch (err) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: err instanceof Error ? err.message : "Failed to load country data",
            },
          };
        }
      },
    }),
  }),
});

export const { useGetRawCountriesQuery } = countriesApi;
