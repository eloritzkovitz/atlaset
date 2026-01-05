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
    let countryDataUrl, currencyDataUrl;
    // istanbul ignore next
    if (process.env.NODE_ENV === "production") {
      countryDataUrl = import.meta.env.VITE_COUNTRY_DATA_URL;
      currencyDataUrl = import.meta.env.VITE_CURRENCY_DATA_URL;
    } else {
      countryDataUrl = "/data/countries.json";
      currencyDataUrl = "/data/currencies.json";
    }

    try {
      const fetchOpts: RequestInit | undefined =
        process.env.NODE_ENV === "development"
          ? { cache: "no-store" as RequestCache }
          : undefined;
      const [countryData, currencyData] = await Promise.all([
        fetch(countryDataUrl, fetchOpts).then((res) => {
          if (!res.ok) throw new Error("Failed to load country data");
          return res.json();
        }),
        fetch(currencyDataUrl, fetchOpts).then((res) => {
          if (!res.ok) throw new Error("Failed to load currency data");
          return res.json();
        }),
      ]);

      return {
        countries: countryData as Country[],
        currencies: currencyData as Record<string, string>,
        allRegions: getAllRegions(countryData as Country[]),
        allSubregions: getAllSubregions(countryData as Country[]),
        allSovereigntyTypes: getAllSovereigntyTypes(countryData as Country[]),
      };
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      } else {
        throw new Error("Failed to load data");
      }
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
