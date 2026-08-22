import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { mockTrips } from "@test-utils/mockTrips";
import { useVisitStats } from "./useVisitStats";

vi.mock("../utils/visits", () => ({
  buildVisitedYearMap: vi.fn(),
  computeVisitCountsFromYearMap: vi.fn(),
}));
vi.mock("../utils/visitStats", () => ({
  getVisitCountStats: vi.fn(),
}));

import {
  buildVisitedYearMap,
  computeVisitCountsFromYearMap,
} from "../utils/visits";
import { getVisitCountStats } from "../utils/visitStats";

describe("useVisitStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getVisitCountStats).mockReturnValue({
      map: { US: 1, FR: 1, DE: 1, CA: 1 },
      min: 1,
      max: 1,
    });

    vi.mocked(buildVisitedYearMap).mockReturnValue({
      US: new Set([2023]),
      FR: new Set([2023]),
      DE: new Set([2023]),
      CA: new Set([2022]),
      JP: new Set([2099]),
    });

    vi.mocked(computeVisitCountsFromYearMap).mockReturnValue({
      US: 1,
      FR: 1,
      DE: 1,
      CA: 1,
    });
  });

  it("builds the visited map and count statistics based on mock trips", () => {
    const { result } = renderHook(() =>
      useVisitStats(mockTrips, 2023, [2022, 2023, 2099]),
    );

    expect(result.current.visitedMap).toEqual({ US: 1, FR: 1, DE: 1, CA: 1 });
    expect(result.current.absoluteMin).toBe(1);
    expect(result.current.absoluteMax).toBe(1);
  });

  describe("previouslyVisitedIsoCodes computation", () => {
    it("identifies countries visited in years prior to selectedYear (2023)", () => {
      const { result } = renderHook(() =>
        useVisitStats(mockTrips, 2023, [2022, 2023, 2099]),
      );

      const previouslyVisited = result.current.previouslyVisitedIsoCodes;

      expect(previouslyVisited.has("CA")).toBe(true);
      expect(previouslyVisited.has("US")).toBe(false);
      expect(previouslyVisited.has("FR")).toBe(false);
      expect(previouslyVisited.has("DE")).toBe(false);
    });

    it("handles fallback when years array is omitted", () => {
      const { result } = renderHook(() => useVisitStats(mockTrips, 2023));

      const previouslyVisited = result.current.previouslyVisitedIsoCodes;

      expect(previouslyVisited.has("CA")).toBe(true);
      expect(previouslyVisited.has("US")).toBe(false);
    });
  });

  describe("visitedIsoCodes merging & modes", () => {
    it("merges trip-based ISO codes with manualVisitedCountryCodes uniquely", () => {
      const manualCodes = ["MX", "CA"];

      const { result } = renderHook(() =>
        useVisitStats(
          mockTrips,
          2023,
          [2022, 2023],
          false,
          undefined,
          manualCodes,
        ),
      );

      expect(result.current.visitedIsoCodes).toContain("MX");
      expect(result.current.visitedIsoCodes).toContain("CA");

      const caCount = result.current.visitedIsoCodes.filter(
        (code) => code === "CA",
      ).length;
      expect(caCount).toBe(1);
    });

    it("returns sharedVisitedIsoCodes directly when isReadonly is true", () => {
      const sharedCodes = ["GB", "ES"];

      const { result } = renderHook(() =>
        useVisitStats(mockTrips, 2023, [2022, 2023], true, sharedCodes, ["MX"]),
      );

      expect(result.current.visitedIsoCodes).toEqual(["GB", "ES"]);
    });

    it("falls back to normal behavior when isReadonly is true but sharedVisitedIsoCodes is undefined", () => {
      const { result } = renderHook(() =>
        useVisitStats(mockTrips, 2023, [2022, 2023], true, undefined, ["MX"]),
      );

      expect(result.current.visitedIsoCodes).toContain("MX");
    });
  });

  describe("memoization stability", () => {
    it("preserves referential stability across re-renders with identical props", () => {
      const { result, rerender } = renderHook(
        ({ year }) => useVisitStats(mockTrips, year, [2022, 2023]),
        { initialProps: { year: 2023 } },
      );

      const initialMap = result.current.visitedMap;
      const initialVisitedIsoCodes = result.current.visitedIsoCodes;

      rerender({ year: 2023 });

      expect(result.current.visitedMap).toBe(initialMap);
      expect(result.current.visitedIsoCodes).toBe(initialVisitedIsoCodes);
    });
  });
});
