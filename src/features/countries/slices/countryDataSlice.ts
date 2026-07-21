import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithFallback } from "@lib/api-client";
import type { Country, SovereigntyStatus } from "../types";
import {
  getAllRegions,
  getAllSubregions,
  getAllSovereigntyStatuses,
} from "../utils/countryData";

interface CountryDataState {
  countries: Country[];
  allRegions: string[];
  allSubregions: string[];
  allSovereigntyStatuses: SovereigntyStatus[];
  loading: boolean;
  error: string | null;
}

const initialState: CountryDataState = {
  countries: [],
  allRegions: [],
  allSubregions: [],
  allSovereigntyStatuses: [],
  loading: false,
  error: null,
};

/** Fetches country data asynchronously. */
export const fetchCountryData = createAsyncThunk(
  "countryData/fetchCountryData",
  async () => {
    const staticCountryUrl = "/data/countries.json";
    const countryData = await fetchWithFallback(
      staticCountryUrl,
      { envVar: "VITE_COUNTRY_DATA_URL" },
      "country data",
    );

    // Validate that the fetched data is an array of countries
    if (!Array.isArray(countryData)) {
      throw new Error("Failed to load country data");
    }

    // Type assertion to ensure the data is treated as an array of Country objects
    const countries = countryData as Country[];

    return {
      countries: countries,
      allRegions: getAllRegions(countries),
      allSubregions: getAllSubregions(countries),
      allSovereigntyStatuses: getAllSovereigntyStatuses(countries),
    };
  },
  {
    // Prevent execution if already loading or already fetched
    condition: (arg: { force?: boolean } | undefined, { getState }) => {
      if (arg?.force) return true;

      const { countryData } = getState() as { countryData: CountryDataState };
      if (countryData.loading || countryData.countries.length > 0) {
        return false;
      }
    },
  },
);

const countryDataSlice = createSlice({
  name: "countryData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountryData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountryData.fulfilled, (state, action) => {
        state.countries = action.payload.countries;
        state.allRegions = action.payload.allRegions;
        state.allSubregions = action.payload.allSubregions;
        state.allSovereigntyStatuses = action.payload.allSovereigntyStatuses;
        state.loading = false;
      })
      .addCase(fetchCountryData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load country data";
      });
  },
});

export default countryDataSlice.reducer;
