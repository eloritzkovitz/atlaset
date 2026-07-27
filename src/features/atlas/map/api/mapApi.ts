import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchWithFallback } from "@lib/api-client";
import type { GeoData } from "../types";

/** API for fetching map-related data. */
export const mapApi = createApi({
  reducerPath: "mapApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    getGeoData: builder.query<GeoData, void>({
      queryFn: async () => {
        try {
          const staticGeoUrl = "/data/countries.geojson";
          const data = await fetchWithFallback(
            staticGeoUrl,
            { envVar: "VITE_MAP_GEO_URL" },
            "map data",
          );
          return { data };
        } catch (err) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error:
                err instanceof Error ? err.message : "Failed to load map data",
            },
          };
        }
      },
    }),
  }),
});

export const { useGetGeoDataQuery } = mapApi;
