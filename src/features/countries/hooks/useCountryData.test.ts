import { vi, describe, it, expect, beforeEach } from "vitest";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import { renderHook, act } from "@testing-library/react";
import { useCountryData } from "./useCountryData";
import * as countrySlice from "../slices/countryDataSlice";
import type { Country, CountryTerritories } from "../types";

const mockStore = configureStore([thunk as unknown as any]);
let shouldCrashBundle = false;

vi.mock("react-i18next", () => {
  const mockI18n = {
    t: (k: string, opts?: { defaultValue?: string }) =>
      k === "currencies:EUR" ? "Euro" : (opts?.defaultValue ?? k),
    language: "en",
    getResourceBundle: () => {
      if (shouldCrashBundle) throw new Error("Bundle error");
      return {
        US: {
          name: "United States Localized",
          territories: {
            special: { type: "special_territory", codes: ["PR"] },
          } as unknown as CountryTerritories,
        },
      };
    },
    exists: (k: string) => k === "languages:eng",
  };
  return { useTranslation: () => ({ t: mockI18n.t, i18n: mockI18n }) };
});

vi.mock("i18next", () => ({
  default: {
    language: "en",
    getResourceBundle: () => {
      if (shouldCrashBundle) throw new Error();
      return {};
    },
  },
}));

describe("useCountryData", () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    vi.restoreAllMocks();
    shouldCrashBundle = false;
    store = mockStore({
      countryData: { countries: [], loading: false, error: null },
    });
  });

  const wrapper =
    (s = store) =>
    ({ children }: { children: any }) =>
      Provider({ store: s, children });

  it("dispatches fetch on mount when empty, skips when loaded, handles refresh", () => {
    const spy = vi
      .spyOn(countrySlice, "fetchCountryData")
      .mockReturnValue({ type: "fetch" } as any);

    const { result } = renderHook(() => useCountryData(), {
      wrapper: wrapper(),
    });
    expect(spy).toHaveBeenCalled();

    const loadedStore = mockStore({
      countryData: { countries: [{ isoCode: "US" }], loading: false },
    });
    renderHook(() => useCountryData(), { wrapper: wrapper(loadedStore) });
    expect(loadedStore.getActions()).toEqual([]);

    act(() => result.current.refreshData());
    expect(store.getActions().length).toBeGreaterThan(0);
  });

  it("handles translation crashes and maps languages", () => {
    shouldCrashBundle = true;
    const crashStore = mockStore({
      countryData: {
        loading: true,
        countries: [
          { isoCode: "US", languages: ["eng", "fra"], region: "Americas" },
        ],
      },
    });

    const { result } = renderHook(() => useCountryData(), {
      wrapper: wrapper(crashStore),
    });
    expect(result.current.countries[0].capital).toBe("");
    expect(result.current.languages["eng"]).toEqual({
      code: "eng",
      name: "eng",
    });
  });

  it("maps country areas, integral regions, sovereigns, subregions, and currencies", () => {
    const populatedStore = mockStore({
      countryData: {
        loading: false,
        countries: [
          {
            isoCode: "US",
            area: 9833520,
            region: "Americas",
            subregion: "Northern America",
            currency: "EUR",
            territories: {
              regions: { type: "overseas_region", codes: ["PR"] },
            } as unknown as CountryTerritories,
          },
        ] as Partial<Country>[],
      },
    });

    const { result } = renderHook(() => useCountryData(), {
      wrapper: wrapper(populatedStore),
    });

    expect(result.current.countryAreaMap.get("US")).toBe(9833520);
    expect(result.current.integralRegionsLookup.get("US")).toEqual(["PR"]);
    expect(result.current.sovereignLookup.get("PR")).toBe("US");
    expect(result.current.subregionToRegion.get("Northern America")).toBe(
      "Americas",
    );
    expect(result.current.currencies).toEqual([{ code: "EUR", name: "Euro" }]);
  });
});
