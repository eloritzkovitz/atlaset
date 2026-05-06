import { vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (k: any, opts?: any) => (opts && opts.defaultValue) || k,
    i18n: {
      t: (k: any, opts?: any) => (opts && opts.defaultValue) || k,
      language: "en",
    },
  }),
}));

import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { renderHook, act } from "@testing-library/react";
import { useCountryData } from "./useCountryData";
import * as countrySlice from "../slices/countryDataSlice";

const mockStore = configureStore([]);

describe("useCountryData", () => {
  let store: ReturnType<typeof mockStore>;
  let dispatchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    store = mockStore({
      countryData: {
        countries: [],
        currencies: [],
        allRegions: [],
        allSubregions: [],
        allSovereigntyStatuses: [],
        loading: false,
        error: null,
      },
    });
    dispatchSpy = vi.spyOn(store, "dispatch");
  });

  it("returns country data from the store", () => {
    const fetchCountryDataSpy = vi.spyOn(countrySlice, "fetchCountryData");
    fetchCountryDataSpy.mockReturnValue({
      type: "countryData/fetchCountryData",
    } as unknown as any);
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );
    const { result } = renderHook(() => useCountryData(), { wrapper });
    expect(result.current.countries).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(Array.isArray(result.current.currencies)).toBe(true);
    fetchCountryDataSpy.mockRestore();
  });

  it("dispatches fetchCountryData on mount if not loaded", () => {
    const fetchCountryDataSpy = vi.spyOn(countrySlice, "fetchCountryData");
    fetchCountryDataSpy.mockReturnValue({
      type: "countryData/fetchCountryData",
    } as unknown as any);
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );
    renderHook(() => useCountryData(), { wrapper });
    expect(dispatchSpy).toHaveBeenCalled();
    expect(fetchCountryDataSpy).toHaveBeenCalled();
    fetchCountryDataSpy.mockRestore();
  });

  it("returns only currencies that have users", () => {
    store = mockStore({
      countryData: {
        countries: [{ isoCode: "US", name: "United States", currency: "USD" }],
        currencies: [
          { code: "USD", name: "US Dollar" },
          { code: "EUR", name: "Euro" },
        ],
        allRegions: [],
        allSubregions: [],
        allSovereigntyStatuses: [],
        loading: false,
        error: null,
      },
    });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );
    const { result } = renderHook(() => useCountryData(), { wrapper });
    expect(result.current.currencies.map((c: any) => c.code)).toEqual(["USD"]);
  });

  it("does not dispatch fetchCountryData if already loading or loaded", () => {
    store = mockStore({
      countryData: {
        countries: [{ isoCode: "US", name: "United States" }],
        currencies: [{ code: "USD", name: "US Dollar" }],
        allRegions: ["Americas"],
        allSubregions: ["Northern America"],
        allSovereigntyStatuses: [],
        loading: false,
        error: null,
      },
    });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );
    renderHook(() => useCountryData(), { wrapper });
    expect((store as any).getActions()).toEqual([]);
  });

  it("handles missing currencies field gracefully", () => {
    store = mockStore({
      countryData: {
        countries: [],
        allRegions: [],
        allSubregions: [],
        allSovereigntyStatuses: [],
        loading: true,
        error: null,
      } as any,
    });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );
    const { result } = renderHook(() => useCountryData(), { wrapper });
    expect(Array.isArray(result.current.currencies)).toBe(true);
    expect(result.current.currencies.length).toBe(0);
  });

  it("refreshData dispatches fetchCountryData", () => {
    const fetchCountryDataSpy = vi.spyOn(countrySlice, "fetchCountryData");
    fetchCountryDataSpy.mockReturnValue({
      type: "countryData/fetchCountryData",
    } as unknown as any);
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );
    const { result } = renderHook(() => useCountryData(), { wrapper });
    act(() => {
      result.current.refreshData();
    });
    expect((store as any).getActions().length).toBeGreaterThan(0);
    fetchCountryDataSpy.mockRestore();
  });
});
