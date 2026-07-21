import { describe, it, expect, vi, beforeEach } from "vitest";
import countryDataReducer, { fetchCountryData } from "./countryDataSlice";
import { fetchWithFallback } from "@lib/api-client";
import { mockCountries } from "@test-utils/mockCountries";
import type { SovereigntyStatus } from "../types";

vi.mock("@lib/api-client", () => ({
  fetchWithFallback: vi.fn(),
}));

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
      allRegions: ["Europe"],
      allSubregions: ["Western Europe"],
      allSovereigntyStatuses: [],
      loading: false,
      error: null,
    };
    const action = { type: "unknown/action" };
    const state = countryDataReducer(prevState, action as any);
    expect(state).toBe(prevState);
  });

  it("should return the initial state", () => {
    expect(countryDataReducer(undefined, { type: "" })).toEqual({
      countries: [],
      allRegions: [],
      allSubregions: [],
      allSovereigntyStatuses: [],
      loading: false,
      error: null,
    });
  });

  it("should handle fetchCountryData.pending", () => {
    const action = { type: fetchCountryData.pending.type };
    const state = countryDataReducer(undefined, action as any);
    expect(state).toEqual({
      countries: [],
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
        allRegions: ["Americas"],
        allSubregions: ["Northern America"],
        allSovereigntyStatuses: [],
      },
    };
    const state = countryDataReducer(undefined, action as any);
    expect(state).toEqual({
      countries: mockCountries,
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
    const state = countryDataReducer(undefined, action as any);
    expect(state).toEqual({
      countries: [],
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
    const state = countryDataReducer(undefined, action as any);
    expect(state).toEqual({
      countries: [],
      allRegions: [],
      allSubregions: [],
      allSovereigntyStatuses: [],
      loading: false,
      error: "Failed to load country data",
    });
  });
});

describe("fetchCountryData thunk execution & condition logic (lines 32–60 coverage)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const invokeThunk = (state: any, arg?: { force?: boolean }) => {
    const dispatch = vi.fn();
    const getState = () => ({ countryData: state });
    return fetchCountryData(arg)(dispatch, getState, undefined);
  };

  it("executes payload creator successfully when data is valid array", async () => {
    vi.mocked(fetchWithFallback).mockResolvedValueOnce(mockCountries);

    const initialState = {
      loading: false,
      countries: [],
      allRegions: [],
      allSubregions: [],
      allSovereigntyStatuses: [],
      error: null,
    };

    const result = await invokeThunk(initialState);

    expect(result.type).toBe("countryData/fetchCountryData/fulfilled");
    expect(fetchWithFallback).toHaveBeenCalledWith(
      "/data/countries.json",
      { envVar: "VITE_COUNTRY_DATA_URL" },
      "country data",
    );
  });

  it("throws error when fetched data is not an array", async () => {
    vi.mocked(fetchWithFallback).mockResolvedValueOnce({ invalid: "data" });

    const initialState = {
      loading: false,
      countries: [],
      allRegions: [],
      allSubregions: [],
      allSovereigntyStatuses: [],
      error: null,
    };

    const result = await invokeThunk(initialState);

    expect(result.type).toBe("countryData/fetchCountryData/rejected");
    if (fetchCountryData.rejected.match(result)) {
      expect(result.error.message).toBe("Failed to load country data");
    }
  });

  it("skips execution if already loading", async () => {
    const state = {
      loading: true,
      countries: [],
      allRegions: [],
      allSubregions: [],
      allSovereigntyStatuses: [],
      error: null,
    };

    const result = await invokeThunk(state);

    expect(result.type).toBe("countryData/fetchCountryData/rejected");
    if (fetchCountryData.rejected.match(result)) {
      expect(result.meta.condition).toBe(true);
    }
    expect(fetchWithFallback).not.toHaveBeenCalled();
  });

  it("skips execution if countries are already present", async () => {
    const state = {
      loading: false,
      countries: mockCountries,
      allRegions: [],
      allSubregions: [],
      allSovereigntyStatuses: [],
      error: null,
    };

    const result = await invokeThunk(state);

    expect(result.type).toBe("countryData/fetchCountryData/rejected");
    if (fetchCountryData.rejected.match(result)) {
      expect(result.meta.condition).toBe(true);
    }
    expect(fetchWithFallback).not.toHaveBeenCalled();
  });

  it("forces execution when force is true, even if data is already present", async () => {
    vi.mocked(fetchWithFallback).mockResolvedValueOnce(mockCountries);

    const state = {
      loading: false,
      countries: mockCountries,
      allRegions: [],
      allSubregions: [],
      allSovereigntyStatuses: [],
      error: null,
    };

    const result = await invokeThunk(state, { force: true });

    expect(result.type).toBe("countryData/fetchCountryData/fulfilled");
    expect(fetchWithFallback).toHaveBeenCalledTimes(1);
  });
});
