import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCountryData } from "./useCountryData";
import * as countriesApiModule from "../api/countriesApi";
import { processLocalizedCountries } from "../utils/countryLocalization";
import { buildTimezonesFromCountries } from "../utils/timezoneData";
import type { Country, Timezone } from "../../types";

let mockLanguage: string | undefined = "en";
let mockI18nextLanguage: string | undefined = "fr";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: {
      get language() {
        return mockLanguage;
      },
      t: (key: string, opts?: { defaultValue?: string }) => {
        if (key === "currencies:EUR") return "Euro";
        if (key === "currencies:NUM") return 100 as unknown as string;
        if (key === "languages:eng") return "English";
        return opts?.defaultValue ?? key;
      },
      exists: (key: string) => key === "languages:eng",
    },
  }),
}));

vi.mock("i18next", () => ({
  default: {
    get language() {
      return mockI18nextLanguage;
    },
  },
}));

vi.mock("../utils/countryLocalization", () => ({
  processLocalizedCountries: vi.fn(),
}));

vi.mock("../utils/timezoneData", () => ({
  buildTimezonesFromCountries: vi.fn(),
}));

vi.mock("../api/countriesApi", () => ({
  useGetRawCountriesQuery: vi.fn(),
}));

describe("useCountryData", () => {
  const mockRefetch = vi.fn();
  const mockLocalizedCountries = [{ isoCode: "US" }] as Country[];
  const mockTimezones = [] as Timezone[];

  const mockProcessResult = {
    localizedCountries: mockLocalizedCountries,
    parentToRegions: new Map([["US", ["PR"]]]),
    childToParent: new Map([["PR", "US"]]),
    areaLookup: new Map([["US", 9833520]]),
    currencyMap: new Map([
      ["EUR", {}],
      ["NUM", {}],
    ]),
    regionSet: new Set(["Americas", "Europe"]),
    tmpSub: {
      Americas: new Set(["Northern America"]),
      Europe: new Set(["Western Europe"]),
    },
    langSet: new Set(["eng", "fra"]),
  };

  const setupQueryMock = (data: Country[] | undefined, isLoading = false) => {
    vi.spyOn(countriesApiModule, "useGetRawCountriesQuery").mockReturnValue({
      data,
      isLoading,
      isFetching: isLoading,
      error: isLoading ? { message: "Error" } : undefined,
      refetch: mockRefetch,
    } as any);
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    mockLanguage = "en";
    mockI18nextLanguage = "fr";
    vi.mocked(processLocalizedCountries).mockReturnValue(
      mockProcessResult as any,
    );
    vi.mocked(buildTimezonesFromCountries).mockReturnValue(mockTimezones);
  });

  it("handles query states and refetch delegation", () => {
    setupQueryMock(undefined, true);
    const { result } = renderHook(() => useCountryData());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toEqual({ message: "Error" });

    act(() => result.current.refreshData());
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("processes countries, maps subregions/currencies/languages, and delegates timezones", () => {
    const rawCountries = [{ isoCode: "US" }] as Country[];
    setupQueryMock(rawCountries);

    const { result } = renderHook(() => useCountryData());

    expect(result.current.allRegions).toEqual(["Americas", "Europe"]);
    expect(result.current.allSubregions).toEqual([
      "Northern America",
      "Western Europe",
    ]);
    expect(result.current.subregionsByRegion).toEqual({
      Americas: ["Northern America"],
      Europe: ["Western Europe"],
    });
    expect(result.current.subregionToRegion.get("Northern America")).toBe(
      "Americas",
    );

    expect(result.current.currencies).toEqual([
      { code: "EUR", name: "Euro" },
      { code: "NUM", name: "100" },
    ]);
    expect(result.current.languages).toEqual({
      eng: { code: "eng", name: "English" },
      fra: { code: "fra", name: "fra" },
    });

    expect(processLocalizedCountries).toHaveBeenCalledWith(
      rawCountries,
      "en",
      expect.anything(),
    );
    expect(buildTimezonesFromCountries).toHaveBeenCalledWith(
      mockLocalizedCountries,
    );
    expect(result.current.timezones).toBe(mockTimezones);
  });

  it("handles fallback language order (i18n.language -> i18next -> 'en') and empty data", () => {
    setupQueryMock(undefined);

    mockLanguage = undefined;
    const { rerender } = renderHook(() => useCountryData());
    expect(processLocalizedCountries).toHaveBeenCalledWith(
      [],
      "fr",
      expect.anything(),
    );

    mockI18nextLanguage = undefined;
    rerender();
    expect(processLocalizedCountries).toHaveBeenCalledWith(
      [],
      "en",
      expect.anything(),
    );
  });
});
