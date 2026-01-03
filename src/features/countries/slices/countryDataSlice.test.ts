import { mockCountries } from "@test-utils/mockCountries";
import countryDataReducer, { fetchCountryData } from "./countryDataSlice";
import type { SovereigntyType } from "../types";

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
          sovereigntyType: "independent" as SovereigntyType,
        },
      ],
      currencies: { EUR: "Euro" },
      allRegions: ["Europe"],
      allSubregions: ["Western Europe"],
      allSovereigntyTypes: [],
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
      currencies: {},
      allRegions: [],
      allSubregions: [],
      allSovereigntyTypes: [],
      loading: false,
      error: null,
    });
  });

  it("should handle fetchCountryData.pending", () => {
    const action = { type: fetchCountryData.pending.type };
    const state = countryDataReducer(undefined, action);
    expect(state).toEqual({
      countries: [],
      currencies: {},
      allRegions: [],
      allSubregions: [],
      allSovereigntyTypes: [],
      loading: true,
      error: null,
    });
  });

  it("should handle fetchCountryData.fulfilled", () => {
    const action = {
      type: fetchCountryData.fulfilled.type,
      payload: {
        countries: mockCountries,
        currencies: { USD: "United States Dollar", CAD: "Canadian Dollar" },
        allRegions: ["Americas"],
        allSubregions: ["Northern America"],
        allSovereigntyTypes: [],
      },
    };
    const state = countryDataReducer(undefined, action);
    expect(state).toEqual({
      countries: mockCountries,
      currencies: { USD: "United States Dollar", CAD: "Canadian Dollar" },
      allRegions: ["Americas"],
      allSubregions: ["Northern America"],
      allSovereigntyTypes: [],
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
      currencies: {},
      allRegions: [],
      allSubregions: [],
      allSovereigntyTypes: [],
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
      currencies: {},
      allRegions: [],
      allSubregions: [],
      allSovereigntyTypes: [],
      loading: false,
      error: "Failed to load country data",
    });
  });
});
