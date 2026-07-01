import { vi, describe, it, expect, beforeEach } from "vitest";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import { renderHook, act } from "@testing-library/react";
import { useCountryData } from "./useCountryData";
import * as countrySlice from "../slices/countryDataSlice";

const mockStore = configureStore([thunk as any]);
let shouldCrashBundle = false;

vi.mock("react-i18next", () => {
  const mockI18n = {
    t: (k: string, opts?: any) => (opts && opts.defaultValue) || k,
    language: "en",
    getResourceBundle: () => {
      if (shouldCrashBundle) throw new Error();
      return { US: { name: "United States Localized" } };
    },
    exists: (k: string) => k === "languages:eng",
  };
  return {
    useTranslation: () => ({ t: mockI18n.t, i18n: mockI18n }),
  };
});

vi.mock("i18next", () => ({
  default: {
    language: "en",
    getResourceBundle: () => {
      if (shouldCrashBundle) throw new Error();
      return {};
    },
  },
  language: "en",
  getResourceBundle: () => {
    if (shouldCrashBundle) throw new Error();
    return {};
  },
}));

describe("useCountryData", () => {
  let store: ReturnType<typeof mockStore>;
  let dispatchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.restoreAllMocks();
    shouldCrashBundle = false;
    store = mockStore({
      countryData: { countries: [], loading: false, error: null },
    });
    dispatchSpy = vi.spyOn(store, "dispatch");
  });

  const getWrapper =
    (mockedStore = store) =>
    ({ children }: { children: React.ReactNode }) => (
      <Provider store={mockedStore}>{children}</Provider>
    );

  it("handles mounting states and data dispatching queries", () => {
    const spy = vi
      .spyOn(countrySlice, "fetchCountryData")
      .mockReturnValue({ type: "fetch" } as any);

    renderHook(() => useCountryData(), { wrapper: getWrapper() });
    expect(dispatchSpy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();

    const loadedStore = mockStore({
      countryData: {
        countries: [{ isoCode: "US" }],
        loading: false,
        error: null,
      },
    });
    renderHook(() => useCountryData(), { wrapper: getWrapper(loadedStore) });
    expect(loadedStore.getActions()).toEqual([]);
  });

  it("filters out unused currencies cleanly", () => {
    const customStore = mockStore({
      countryData: {
        countries: [{ isoCode: "US", name: "USA", currency: "USD" }],
        loading: false,
        error: null,
      },
    });
    const { result } = renderHook(() => useCountryData(), {
      wrapper: getWrapper(customStore),
    });
    expect(result.current.currencies.map((c: any) => c.code)).toEqual(["USD"]);
  });

  it("manages dynamic translation actions and manual reloads", () => {
    vi.spyOn(countrySlice, "fetchCountryData").mockReturnValue({
      type: "fetch",
    } as any);
    const { result } = renderHook(() => useCountryData(), {
      wrapper: getWrapper(),
    });

    act(() => {
      result.current.refreshData();
    });
    expect(store.getActions().length).toBeGreaterThan(0);
  });

  it("handles translation bundle crashes gracefully", () => {
    shouldCrashBundle = true;

    const targetedStore = mockStore({
      countryData: {
        loading: true,
        error: null,
        countries: [
          { isoCode: "FR", name: "France", region: "Europe" },
          {
            isoCode: "AX",
            name: "No Subregion",
            region: "Europe",
            subregion: "",
          },
        ],
      },
    });

    const { result } = renderHook(() => useCountryData(), {
      wrapper: getWrapper(targetedStore),
    });

    expect(result.current.countries[0].capital).toBe("");
    expect(result.current.countries[0].territories).toEqual({});
    expect(result.current.subregionsByRegion["Europe"]).toBeUndefined();
  });

  it("handles translations for application language profiles", () => {
    const languageStore = mockStore({
      countryData: {
        loading: true,
        error: null,
        countries: [{ isoCode: "US", name: "US", languages: ["eng", "fra"] }],
      },
    });

    const { result } = renderHook(() => useCountryData(), {
      wrapper: getWrapper(languageStore),
    });
    expect(result.current.languages["eng"]).toEqual({
      code: "eng",
      name: "eng",
    });
    expect(result.current.languages["fra"]).toEqual({
      code: "fra",
      name: "fra",
    });
  });
});
