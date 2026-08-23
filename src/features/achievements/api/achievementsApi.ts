import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Achievement } from "../types";

/** API for fetching achievement data. */
export const achievementsApi = createApi({
  reducerPath: "achievementsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    getAchievements: builder.query<Achievement[], void>({
      query: () => "data/achievements.json",
    }),
  }),
});

export const { useGetAchievementsQuery } = achievementsApi;
