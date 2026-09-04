import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockCountries } from "@test-utils/mockCountries";
import { createMockCountryTracking } from "@test-utils/mockCountryTracking";
import { useCountryCoverage } from "./useCountryCoverage";
import { useCountryTracking } from "./useCountryTracking";

vi.mock("./useCountryTracking", () => ({
  useCountryTracking: vi.fn(),
}));

describe("useCountryCoverage", () => {
  beforeEach(() => {
    vi.mocked(useCountryTracking).mockReturnValue(
      createMockCountryTracking({
        visitedCountryCodes: ["FR", "GP"],
      }),
    );
  });

  it("returns total and visited country counts", () => {
    const { result } = renderHook(() => useCountryCoverage(mockCountries));

    expect(result.current).toEqual({
      totalCountries: mockCountries.length,
      visitedCountries: 2,
    });
  });

  it("counts only sovereign countries when sovereignOnly is true", () => {
    const { result } = renderHook(() =>
      useCountryCoverage(mockCountries, true),
    );

    expect(result.current).toEqual({
      totalCountries: 5,
      visitedCountries: 1,
    });
  });

  it("ignores visited country codes that are not in the country list", () => {
    vi.mocked(useCountryTracking).mockReturnValue(
      createMockCountryTracking({
        visitedCountryCodes: ["FR", "JP", "ZZ"],
      }),
    );

    const { result } = renderHook(() => useCountryCoverage(mockCountries));

    expect(result.current.visitedCountries).toBe(2);
  });

  it("returns zero visited countries when none have been visited", () => {
    vi.mocked(useCountryTracking).mockReturnValue(
      createMockCountryTracking({
        visitedCountryCodes: [],
      }),
    );

    const { result } = renderHook(() => useCountryCoverage(mockCountries));

    expect(result.current).toEqual({
      totalCountries: mockCountries.length,
      visitedCountries: 0,
    });
  });
});
