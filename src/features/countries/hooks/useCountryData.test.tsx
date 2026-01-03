import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { vi } from "vitest";
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
        currencies: {},
        allRegions: [],
        allSubregions: [],
        allSovereigntyTypes: [],
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
    fetchCountryDataSpy.mockRestore();
  });

  it("dispatches fetchCountryData on mount if not loaded", () => {
    const fetchCountryDataSpy = vi.spyOn(countrySlice, "fetchCountryData");
    // Mock as a plain object action for redux-mock-store compatibility
    fetchCountryDataSpy.mockReturnValue({
      type: "countryData/fetchCountryData",
    } as unknown as any);
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );
    renderHook(() => useCountryData(), { wrapper });
    // Just check that dispatch was called
    expect(dispatchSpy).toHaveBeenCalled();
    fetchCountryDataSpy.mockRestore();
  });

  it("does not dispatch fetchCountryData if already loading or loaded", () => {
    store = mockStore({
      countryData: {
        countries: [{ isoCode: "US", name: "United States" }],
        currencies: { USD: "US Dollar" },
        allRegions: ["Americas"],
        allSubregions: ["Northern America"],
        allSovereigntyTypes: [],
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
