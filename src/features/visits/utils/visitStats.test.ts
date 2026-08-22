import { mockTrips } from "@test-utils/mockTrips";
import { describe, expect, it } from "vitest";
import { getMostVisitedCountries, getVisitCountStats } from "./visitStats";

describe("visitStats utilities", () => {
  describe("getVisitCountStats", () => {
    it("returns visit map and min/max counts", () => {
      const trips = [
        { ...mockTrips[0], countryCodes: ["US", "CA"] },
        { ...mockTrips[1], countryCodes: ["US"] },
        { ...mockTrips[3], countryCodes: ["FR"] },
      ];

      expect(getVisitCountStats(trips, 2023)).toEqual({
        map: { US: 2, CA: 1, FR: 1 },
        min: 1,
        max: 2,
      });
    });

    it("defaults min and max to 1 when there are no visits", () => {
      expect(getVisitCountStats([], 2022)).toEqual({
        map: {},
        min: 1,
        max: 1,
      });
    });
  });

  describe("getMostVisitedCountries", () => {
    it("returns the most visited countries excluding the home country", () => {
      const trips = [
        { ...mockTrips[0], countryCodes: ["IL"] },
        { ...mockTrips[1], countryCodes: ["US"] },
        { ...mockTrips[3], countryCodes: ["US"] },
      ];

      expect(getMostVisitedCountries(trips, "IL")).toEqual({
        codes: ["US"],
        maxCount: 2,
      });
    });

    it("returns all countries when there is a tie", () => {
      const trips = [
        { ...mockTrips[0], countryCodes: ["US"] },
        { ...mockTrips[3], countryCodes: ["US"] },
        { ...mockTrips[1], countryCodes: ["FR"] },
        { ...mockTrips[3], countryCodes: ["FR"] },
      ];

      expect(getMostVisitedCountries(trips, "IL")).toEqual({
        codes: ["US", "FR"],
        maxCount: 2,
      });
    });

    it("returns no countries when there are no visits", () => {
      expect(getMostVisitedCountries([], "IL")).toEqual({
        codes: [],
        maxCount: 0,
      });
    });
  });
});
