import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { createMockUser, authState } from "@test-utils/authMocks";
import { mockCountries } from "@test-utils/mockCountries";
import { useCountryTracking } from "./useCountryTracking";

const mockAddCountryCode = vi.fn().mockResolvedValue(undefined);
const mockRemoveCountryCode = vi.fn().mockResolvedValue(undefined);

let trackingCallback: (data: Record<string, unknown>) => void = () => {};

vi.mock("../services/countryTrackingService", () => ({
  countryTrackingService: {
    onTrackingDataChange: (
      _uid: string,
      cb: (data: Record<string, unknown>) => void,
    ) => {
      trackingCallback = cb;
      return () => {};
    },
    addCountryCode: (...args: unknown[]) => mockAddCountryCode(...args),
    removeCountryCode: (...args: unknown[]) => mockRemoveCountryCode(...args),
  },
}));

vi.mock("@features/user/auth", () => ({
  useAuth: () => ({ user: authState.currentUser }),
}));

vi.mock("@features/countries", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@features/countries")>();

  return {
    ...actual,
    useCountryData: () => ({
      countries: mockCountries,
    }),
    getCountryName: (code: string, countries: typeof mockCountries) => {
      const country = countries.find((country) => country.isoCode === code);

      return country?.name ?? code;
    },
  };
});

let mockTrips = [
  {
    id: "t1",
    destination: "FR",
    startDate: "2026-01-01",
  },
];

vi.mock("@features/trips/context/TripsContext", () => ({
  useTrips: () => ({ trips: mockTrips }),
}));

vi.mock("../utils/visits", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../utils/visits")>();

  return {
    ...actual,
    computeVisitedCountriesFromTrips: () => ["FR"],
    getFutureVisitCountries: () => ["IT", "FR"],
    getVisitsForCountry: () => [
      {
        tripId: "t1",
        tripName: "Trip",
        yearRange: "2026",
        startDate: "2026-01-01",
        endDate: "2026-01-10",
      },
      {
        tripId: "t2",
        tripName: "Future",
        yearRange: "2027",
        startDate: "2027-01-01",
        endDate: "2027-01-10",
      },
      {
        tripId: "t3",
        tripName: "Draft",
        yearRange: "None",
        startDate: null,
        endDate: null,
      },
    ],
  };
});

describe("useCountryTracking", () => {
  beforeEach(() => {
    authState.currentUser = createMockUser({
      uid: "u1",
      displayName: "Sarah",
    });

    mockTrips = [
      {
        id: "t1",
        destination: "FR",
        startDate: "2026-01-01",
      },
    ];
  });

  it("should initialize with values and handle real-time sync fallbacks", () => {
    const { result } = renderHook(() => useCountryTracking());

    act(() => {
      trackingCallback({
        manualVisitedCountryCodes: ["MX"],
        wantToVisitCountryCodes: ["JP"],
      });
    });

    expect(result.current.visitedCountryCodes).toEqual(["MX", "FR"]);
    expect(result.current.wantToVisitCountryCodes).toEqual(["JP"]);
    expect(result.current.futureCountryCodes).toEqual(["IT"]);

    expect(result.current.isVisitedCountry("MX")).toBe(true);
    expect(result.current.isFutureVisitCountry("IT")).toBe(true);
    expect(result.current.isFutureVisitCountry("MX")).toBe(false);
    expect(result.current.isWantToVisitCountry("JP")).toBe(true);
    expect(result.current.isTripBased("FR")).toBe(true);
  });

  it("should handle unauthenticated state cleanly", () => {
    authState.currentUser = null;
    mockTrips = [];

    const { result } = renderHook(() => useCountryTracking());

    expect(result.current.visitedCountryCodes).toEqual([]);
    expect(result.current.wantToVisitCountryCodes).toEqual([]);
    expect(result.current.futureCountryCodes).toEqual([]);
  });

  it("should successfully trigger mutations if rules pass", async () => {
    const { result } = renderHook(() => useCountryTracking());

    act(() => {
      trackingCallback({
        manualVisitedCountryCodes: ["MX"],
        wantToVisitCountryCodes: ["JP"],
      });
    });

    await act(async () => {
      await result.current.addManualCountry("CA");
    });

    expect(mockAddCountryCode).toHaveBeenCalledWith(
      "u1",
      "CA",
      "manualVisitedCountryCodes",
    );

    await act(async () => {
      await result.current.removeManualCountry("MX");
    });

    expect(mockRemoveCountryCode).toHaveBeenCalledWith(
      "u1",
      "MX",
      "manualVisitedCountryCodes",
    );

    await act(async () => {
      await result.current.addWantToVisitCountry("BR");
    });

    expect(mockAddCountryCode).toHaveBeenCalledWith(
      "u1",
      "BR",
      "wantToVisitCountryCodes",
    );

    await act(async () => {
      await result.current.removeWantToVisitCountry("JP");
    });

    expect(mockRemoveCountryCode).toHaveBeenCalledWith(
      "u1",
      "JP",
      "wantToVisitCountryCodes",
    );
  });

  it("should block mutations based on user presence and domain safety guard rails", async () => {
    const { result } = renderHook(() => useCountryTracking());

    act(() => {
      trackingCallback({
        manualVisitedCountryCodes: ["MX"],
        wantToVisitCountryCodes: ["JP"],
      });
    });

    await act(async () => {
      await result.current.addManualCountry("MX");
    });

    await act(async () => {
      await result.current.addWantToVisitCountry("JP");
    });

    await act(async () => {
      await result.current.addWantToVisitCountry("MX");
    });

    await act(async () => {
      await result.current.removeManualCountry("FR");
    });

    expect(mockAddCountryCode).not.toHaveBeenCalled();
    expect(mockRemoveCountryCode).not.toHaveBeenCalled();

    authState.currentUser = null;

    const { result: unauthResult } = renderHook(() => useCountryTracking());

    await act(async () => {
      await unauthResult.current.addManualCountry("US");
      await unauthResult.current.removeManualCountry("US");
      await unauthResult.current.addWantToVisitCountry("US");
      await unauthResult.current.removeWantToVisitCountry("US");
    });

    expect(mockAddCountryCode).not.toHaveBeenCalled();
    expect(mockRemoveCountryCode).not.toHaveBeenCalled();
  });

  it("should extract and correctly categorize structured visit metrics", () => {
    vi.useFakeTimers().setSystemTime(new Date("2026-06-01"));

    const { result } = renderHook(() => useCountryTracking());

    expect(result.current.getCountryVisits("FR")).toHaveLength(3);

    const categorized = result.current.getCountryVisitsCategorized("FR");

    expect(categorized.past).toHaveLength(1);
    expect(categorized.upcoming).toHaveLength(1);
    expect(categorized.tentative).toHaveLength(1);

    vi.useRealTimers();
  });
});
