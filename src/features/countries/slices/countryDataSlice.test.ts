import { mockCountries } from "@test-utils/mockCountries";
import countryDataReducer, { fetchCountryData } from "./countryDataSlice";
import type { SovereigntyStatus } from "../types";

describe("countryDataSlice reducer", () => {
  it("should return the same state for unknown action", () => {
    const prevState = {
      countries: [
        {
          code: "FR",
          name: "France",
          callingCode: "33",
          isoCode: "FR",
          iso3Code: "FRA",
          region: "Europe",
          subregion: "Western Europe",
          sovereigntyStatus: "independent" as SovereigntyStatus,
        },
      ],
      currencies: [{ code: "EUR", name: "Euro" }],
      allRegions: ["Europe"],
      allSubregions: ["Western Europe"],
      allSovereigntyStatuses: [],
      loading: false,
      error: null,
    };
    const action = { type: "unknown/action" };
    const state = countryDataReducer(prevState, action);
    expect(state).toBe(prevState);
  });

  it("should return the initial state", () => {
    expect(countryDataReducer(undefined, { type: "" })).toEqual({
      countries: [],
      currencies: [],
      allRegions: [],
      allSubregions: [],
      allSovereigntyStatuses: [],
      loading: false,
      error: null,
    });
  });

  it("should handle fetchCountryData.pending", () => {
    const action = { type: fetchCountryData.pending.type };
    const state = countryDataReducer(undefined, action);
    expect(state).toEqual({
      countries: [],
      currencies: [],
      allRegions: [],
      allSubregions: [],
      allSovereigntyStatuses: [],
      loading: true,
      error: null,
    });
  });

  it("should handle fetchCountryData.fulfilled", () => {
    const action = {
      type: fetchCountryData.fulfilled.type,
      payload: {
        countries: mockCountries,
        currencies: [
          { code: "USD", name: "United States Dollar" },
          { code: "CAD", name: "Canadian Dollar" },
        ],
        allRegions: ["Americas"],
        allSubregions: ["Northern America"],
        allSovereigntyStatuses: [],
      },
    };
    const state = countryDataReducer(undefined, action);
    expect(state).toEqual({
      countries: mockCountries,
      currencies: [
        { code: "USD", name: "United States Dollar" },
        { code: "CAD", name: "Canadian Dollar" },
      ],
      allRegions: ["Americas"],
      allSubregions: ["Northern America"],
      allSovereigntyStatuses: [],
      loading: false,
      error: null,
    });
  });

  it("should handle fetchCountryData.rejected", () => {
    const action = {
      type: fetchCountryData.rejected.type,
      error: { message: "Failed to fetch" },
    };
    const state = countryDataReducer(undefined, action);
    expect(state).toEqual({
      countries: [],
      currencies: [],
      allRegions: [],
      allSubregions: [],
      allSovereigntyStatuses: [],
      loading: false,
      error: "Failed to fetch",
    });
  });

  it("should handle fetchCountryData.rejected with no error message", () => {
    const action = {
      type: fetchCountryData.rejected.type,
      error: {},
    };
    const state = countryDataReducer(undefined, action);
    expect(state).toEqual({
      countries: [],
      currencies: [],
      allRegions: [],
      allSubregions: [],
      allSovereigntyStatuses: [],
      loading: false,
      error: "Failed to load country data",
    });
  });
});

describe("currency mapping logic", () => {
  // Helper to simulate the mapping logic
  function mapCurrencyData(currencyData: any) {
    return currencyData && typeof currencyData === "object"
      ? Object.entries(currencyData).map(([code, name]) => ({
          code,
          name: String(name),
        }))
      : [];
  }

  it("maps valid object to array of code/name", () => {
    const input = { USD: "United States Dollar", EUR: "Euro" };
    const result = mapCurrencyData(input);
    expect(result).toEqual([
      { code: "USD", name: "United States Dollar" },
      { code: "EUR", name: "Euro" },
    ]);
  });

  it("casts all names to string", () => {
    const input = { BTC: 123, ETH: null };
    const result = mapCurrencyData(input);
    expect(result).toEqual([
      { code: "BTC", name: "123" },
      { code: "ETH", name: "null" },
    ]);
  });

  it("returns empty array for empty object", () => {
    const input = {};
    const result = mapCurrencyData(input);
    expect(result).toEqual([]);
  });

  it("returns empty array for non-object input", () => {
    expect(mapCurrencyData(undefined)).toEqual([]);
    expect(mapCurrencyData(null)).toEqual([]);
    expect(mapCurrencyData(42)).toEqual([]);
    expect(mapCurrencyData("string")).toEqual([]);
  });
});
