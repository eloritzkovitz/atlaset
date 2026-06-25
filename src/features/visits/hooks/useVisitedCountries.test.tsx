import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useVisitedCountries } from "./useVisitedCountries";

const mockAddCountryCode = vi.fn().mockResolvedValue(undefined);
const mockRemoveCountryCode = vi.fn().mockResolvedValue(undefined);
let trackingCallback: (data: any) => void = () => {};

vi.mock("../services/countryTrackingService", () => ({
  countryTrackingService: {
    onTrackingDataChange: (_uid: string, cb: (data: any) => void) => {
      trackingCallback = cb;
      return () => {};
    },
    addCountryCode: (...args: any[]) => mockAddCountryCode(...args),
    removeCountryCode: (...args: any[]) => mockRemoveCountryCode(...args),
  },
}));

let mockUser: { uid: string } | null = { uid: "u1" };
vi.mock("@features/user", () => ({
  useAuth: () => ({ user: mockUser }),
}));

let mockTrips = [{ id: "t1", destination: "FR", startDate: "2026-01-01" }];
vi.mock("@contexts/TripsContext", () => ({
  useTrips: () => ({ trips: mockTrips }),
}));

vi.mock("../utils/visits", () => ({
  computeVisitedCountriesFromTrips: () => ["FR"],
  getUpcomingVisitCountries: () => ["IT", "FR"],
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
}));

describe("useVisitedCountries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = { uid: "u1" };
    mockTrips = [{ id: "t1", destination: "FR", startDate: "2026-01-01" }];
  });

  it("should initialize with values and handle real-time sync fallbacks", () => {
    const { result } = renderHook(() => useVisitedCountries());

    act(() => {
      trackingCallback({
        visitedCountryCodes: ["MX"],
        bucketListCountryCodes: ["JP"],
      });
    });

    expect(result.current.visitedCountryCodes).toEqual(["MX", "FR"]);
    expect(result.current.bucketListCodes).toEqual(["JP"]);
    expect(result.current.upcomingCountryCodes).toEqual(["IT"]);
    expect(result.current.isCountryVisited("MX")).toBe(true);
    expect(result.current.isTripBased("FR")).toBe(true);
    expect(result.current.isBucketListed("JP")).toBe(true);
  });

  it("should handle unauthenticated state cleanly", () => {
    mockUser = null;
    const { result } = renderHook(() => useVisitedCountries());

    expect(result.current.visitedCountryCodes).toEqual([]);
    expect(result.current.bucketListCodes).toEqual([]);
    expect(result.current.upcomingCountryCodes).toEqual([]);
  });

  it("should successfully trigger mutations if rules pass", async () => {
    const { result } = renderHook(() => useVisitedCountries());
    act(() => {
      trackingCallback({
        visitedCountryCodes: ["MX"],
        bucketListCountryCodes: ["JP"],
      });
    });

    await act(async () => {
      await result.current.addManualCountry("CA");
    });
    expect(mockAddCountryCode).toHaveBeenCalledWith(
      "u1",
      "CA",
      "visitedCountryCodes",
    );

    await act(async () => {
      await result.current.removeManualCountry("MX");
    });
    expect(mockRemoveCountryCode).toHaveBeenCalledWith(
      "u1",
      "MX",
      "visitedCountryCodes",
    );

    await act(async () => {
      await result.current.addBucketCountry("BR");
    });
    expect(mockAddCountryCode).toHaveBeenCalledWith(
      "u1",
      "BR",
      "bucketListCountryCodes",
    );

    await act(async () => {
      await result.current.removeBucketCountry("JP");
    });
    expect(mockRemoveCountryCode).toHaveBeenCalledWith(
      "u1",
      "JP",
      "bucketListCountryCodes",
    );
  });

  it("should block mutations based on user presence and domain safety guard rails", async () => {
    const { result } = renderHook(() => useVisitedCountries());
    act(() => {
      trackingCallback({
        visitedCountryCodes: ["MX"],
        bucketListCountryCodes: ["JP"],
      });
    });

    await act(async () => {
      await result.current.addManualCountry("MX");
    });
    await act(async () => {
      await result.current.addBucketCountry("JP");
    });

    await act(async () => {
      await result.current.addBucketCountry("MX");
    });

    await act(async () => {
      await result.current.removeManualCountry("FR");
    });

    expect(mockAddCountryCode).not.toHaveBeenCalled();
    expect(mockRemoveCountryCode).not.toHaveBeenCalled();

    mockUser = null;
    const { result: unauthResult } = renderHook(() => useVisitedCountries());
    await act(async () => {
      await unauthResult.current.addManualCountry("US");
      await unauthResult.current.removeManualCountry("US");
      await unauthResult.current.addBucketCountry("US");
      await unauthResult.current.removeBucketCountry("US");
    });
    expect(mockAddCountryCode).not.toHaveBeenCalled();
    expect(mockRemoveCountryCode).not.toHaveBeenCalled();
  });

  it("should extract and correctly categorize structured visit metrics", () => {
    vi.useFakeTimers().setSystemTime(new Date("2026-06-01"));

    const { result } = renderHook(() => useVisitedCountries());

    expect(result.current.getCountryVisits("FR")).toHaveLength(3);

    const categorized = result.current.getCountryVisitsCategorized("FR");
    expect(categorized.past).toHaveLength(1);
    expect(categorized.upcoming).toHaveLength(1);
    expect(categorized.tentative).toHaveLength(1);

    vi.useRealTimers();
  });
});
