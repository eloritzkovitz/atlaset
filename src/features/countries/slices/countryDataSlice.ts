import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithFallback } from "@utils/fetch";
import type { Country, Currency, SovereigntyStatus } from "../types";
import {
  getAllRegions,
  getAllSubregions,
  getAllSovereigntyStatuses,
} from "../utils/countryData";

interface CountryDataState {
  countries: Country[];
  currencies: Currency[];
  allRegions: string[];
  allSubregions: string[];
  allSovereigntyStatuses: SovereigntyStatus[];
  loading: boolean;
  error: string | null;
}

const initialState: CountryDataState = {
  countries: [],
  currencies: [],
  allRegions: [],
  allSubregions: [],
  allSovereigntyStatuses: [],
  loading: false,
  error: null,
};

export const fetchCountryData = createAsyncThunk(
  "countryData/fetchCountryData",
  async () => {
    const staticCountryUrl = "/data/countries.json";
    const countryData = await fetchWithFallback(
      staticCountryUrl,
      { envVar: "VITE_COUNTRY_DATA_URL" },
      "country data",
    );

    // Validate shape: expect an array of countries
    if (!Array.isArray(countryData)) {
      throw new Error("Failed to load country data");
    }
    const currenciesArr: Currency[] = [];

    return {
      countries: countryData as Country[],
      currencies: currenciesArr,
      allRegions: getAllRegions(countryData as Country[]),
      allSubregions: getAllSubregions(countryData as Country[]),
      allSovereigntyStatuses: getAllSovereigntyStatuses(
        countryData as Country[],
      ),
    };
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
        state.currencies = action.payload.currencies;
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
