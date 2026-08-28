import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { CountryFact } from "../../types";

/** API for fetching country fact data. */
export const countryFactsApi = createApi({
  reducerPath: "countryFactsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    getCountryFacts: builder.query<CountryFact[], void>({
      query: () => "data/countryFacts.json",
    }),
  }),
});

export const { useGetCountryFactsQuery } = countryFactsApi;
