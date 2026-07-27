import { vi, describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCountryData } from "./useCountryData";
import * as countriesApiModule from "../api/countriesApi";
import type { Country, CountryTerritories } from "../types";

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

vi.mock("../api/countriesApi", () => ({
  useGetRawCountriesQuery: vi.fn(),
}));

describe("useCountryData", () => {
  const mockRefetch = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    shouldCrashBundle = false;
    mockRefetch.mockReset();
  });

  it("returns query states and handles refresh correctly", () => {
    vi.spyOn(countriesApiModule, "useGetRawCountriesQuery").mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: false,
      error: undefined,
      refetch: mockRefetch,
    } as any);

    const { result } = renderHook(() => useCountryData());

    expect(result.current.loading).toBe(true);

    act(() => result.current.refreshData());
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("handles translation crashes and maps languages", () => {
    shouldCrashBundle = true;

    vi.spyOn(countriesApiModule, "useGetRawCountriesQuery").mockReturnValue({
      data: [
        { isoCode: "US", languages: ["eng", "fra"], region: "Americas" },
      ] as Country[],
      isLoading: false,
      isFetching: false,
      error: undefined,
      refetch: mockRefetch,
    } as any);

    const { result } = renderHook(() => useCountryData());

    expect(result.current.countries[0].capital).toBe("");
    expect(result.current.languages["eng"]).toEqual({
      code: "eng",
      name: "eng",
    });
  });

  it("maps country areas, integral regions, sovereigns, subregions, and currencies", () => {
    vi.spyOn(countriesApiModule, "useGetRawCountriesQuery").mockReturnValue({
      data: [
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
      ] as Country[],
      isLoading: false,
      isFetching: false,
      error: undefined,
      refetch: mockRefetch,
    } as any);

    const { result } = renderHook(() => useCountryData());

    expect(result.current.countryAreaMap.get("US")).toBe(9833520);
    expect(result.current.integralRegionsLookup.get("US")).toEqual(["PR"]);
    expect(result.current.sovereignLookup.get("PR")).toBe("US");
    expect(result.current.subregionToRegion.get("Northern America")).toBe(
      "Americas",
    );
    expect(result.current.currencies).toEqual([{ code: "EUR", name: "Euro" }]);
  });
});
