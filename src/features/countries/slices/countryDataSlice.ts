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
    // Try static files first
    const staticCountryUrl = "/data/countries.json";
    const staticCurrencyUrl = "/data/currencies.json";
    const [countryData, currencyData] = await Promise.all([
      fetchWithFallback(
        staticCountryUrl,
        { envVar: "VITE_COUNTRY_DATA_URL" },
        "country data",
      ),
      fetchWithFallback(
        staticCurrencyUrl,
        { envVar: "VITE_CURRENCY_DATA_URL" },
        "currency data",
      ),
    ]);

    // Map currency object to array
    const currenciesArr =
      currencyData && typeof currencyData === "object"
        ? Object.entries(currencyData).map(([code, name]) => ({
            code,
            name: String(name),
          }))
        : [];

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
