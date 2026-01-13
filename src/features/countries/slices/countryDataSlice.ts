import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Country, SovereigntyType } from "../types";
import {
  getAllRegions,
  getAllSubregions,
  getAllSovereigntyTypes,
} from "../utils/countryData";

export interface CountryDataState {
  countries: Country[];
  currencies: Record<string, string>;
  allRegions: string[];
  allSubregions: string[];
  allSovereigntyTypes: SovereigntyType[];
  loading: boolean;
  error: string | null;
}

const initialState: CountryDataState = {
  countries: [],
  currencies: {},
  allRegions: [],
  allSubregions: [],
  allSovereigntyTypes: [],
  loading: false,
  error: null,
};

export const fetchCountryData = createAsyncThunk(
  "countryData/fetchCountryData",
  async () => {
    // Try static files first
    const staticCountryUrl = "/data/countries.json";
    const staticCurrencyUrl = "/data/currencies.json";
    const backendCountryUrl = import.meta.env.VITE_COUNTRY_DATA_URL;
    const backendCurrencyUrl = import.meta.env.VITE_CURRENCY_DATA_URL;

    // Fetch options to avoid caching in development
    const fetchOpts: RequestInit | undefined =
      process.env.NODE_ENV === "development"
        ? { cache: "no-store" as RequestCache }
        : undefined;

    async function fetchWithFallback(
      staticUrl: string,
      backendUrl?: string,
      label?: string
    ) {
      // Try static first
      try {
        const res = await fetch(staticUrl, fetchOpts);
        if (res && res.ok) return await res.json();
        // If 404 or error, fall through
      } catch (e) {
        // If fetch throws, ignore and try backend
      }
      // Try backend if provided
      if (backendUrl) {
        let res;
        try {
          res = await fetch(backendUrl, fetchOpts);
        } catch (e) {
          // Always propagate backend fetch errors as-is (string, Error, etc)
          throw e;
        }
        if (res && res.ok) return await res.json();
        throw new Error(`Failed to load ${label || "data"} from backend`);
      }
      throw new Error(`Failed to load ${label || "data"}`);
    }

    try {
      const [countryData, currencyData] = await Promise.all([
        fetchWithFallback(
          staticCountryUrl,
          backendCountryUrl,
          "country data"
        ),
        fetchWithFallback(
          staticCurrencyUrl,
          backendCurrencyUrl,
          "currency data"
        ),
      ]);
      return {
        countries: countryData as Country[],
        currencies: currencyData as Record<string, string>,
        allRegions: getAllRegions(countryData as Country[]),
        allSubregions: getAllSubregions(countryData as Country[]),
        allSovereigntyTypes: getAllSovereigntyTypes(countryData as Country[]),
      };
    } catch (err) {
      throw err;
    }
  }
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
        state.allSovereigntyTypes = action.payload.allSovereigntyTypes;
        state.loading = false;
      })
      .addCase(fetchCountryData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load country data";
      });
  },
});

export default countryDataSlice.reducer;
