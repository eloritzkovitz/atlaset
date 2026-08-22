import { vi } from "vitest";
import { useCountryTracking } from "@features/visits/hooks/useCountryTracking";

type CountryTracking = ReturnType<typeof useCountryTracking>;

export function createMockCountryTracking(
  overrides: Partial<CountryTracking> = {},
): CountryTracking {
  return {
    visitedCountryCodes: [],
    futureCountryCodes: [],
    wantToVisitCountryCodes: [],
    isVisitedCountry: vi.fn(),
    isFutureVisitCountry: vi.fn(),
    isWantToVisitCountry: vi.fn(),
    isTripBased: vi.fn(),
    addManualCountry: vi.fn(),
    removeManualCountry: vi.fn(),
    addWantToVisitCountry: vi.fn(),
    removeWantToVisitCountry: vi.fn(),
    getCountryVisits: vi.fn(),
    getCountryVisitsCategorized: vi.fn(),
    ...overrides,
  };
}
