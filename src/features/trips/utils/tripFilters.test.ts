import { mockTrips } from "@test-utils/mockTrips";
import type { TripCategory, TripTag } from "@types";
import { filterTrips } from "./tripFilters";

describe("tripFilters utils", () => {
  describe("filterTrips", () => {
    it("filters by name substring (case-insensitive)", () => {
      const filtered = filterTrips(mockTrips, {
        name: "local",
        country: [],
        year: [],
        categories: [],
        status: "",
        tags: [],
      });
      expect(filtered).toEqual([mockTrips[0]]);
    });

    it("filters by country code", () => {
      const filtered = filterTrips(mockTrips, {
        country: ["FR"],
        year: [],
        categories: [],
        tags: [],
        name: "",
        status: "",
      });
      expect(filtered).toEqual([mockTrips[1]]);
    });

    it("filters by year", () => {
      const filtered = filterTrips(mockTrips, {
        year: ["2023"],
        country: [],
        categories: [],
        tags: [],
        name: "",
        status: "",
      });
      expect(
        filtered.map(
          (t) => t.startDate && new Date(t.startDate).getFullYear().toString()
        )
      ).toEqual(expect.arrayContaining(["2023"]));
    });

    it("filters by categories", () => {
      const trips = [
        {
          ...mockTrips[0],
          categories: ["adventure", "family"] as TripCategory[],
        },
        { ...mockTrips[1], categories: ["business"] as TripCategory[] },
      ];
      const filtered = filterTrips(trips, {
        categories: ["adventure"],
        year: [],
        country: [],
        tags: [],
        name: "",
        status: "",
      });
      expect(filtered).toEqual([trips[0]]);
    });

    it("filters by status", () => {
      const filtered = filterTrips(mockTrips, {
        status: "completed",
        year: [],
        country: [],
        categories: [],
        tags: [],
        name: "",
      });
      expect(filtered).toEqual([mockTrips[0], mockTrips[3]]);
    });

    it("filters by tags", () => {
      const trips = [
        { ...mockTrips[0], tags: ["family", "summer"] as TripTag[] },
        { ...mockTrips[1], tags: ["business"] as TripTag[] },
      ];
      const filtered = filterTrips(trips, {
        tags: ["family"],
        year: [],
        country: [],
        categories: [],
        name: "",
        status: "",
      });
      expect(filtered).toEqual([trips[0]]);
    });

    it("returns all trips if no filters", () => {
      const filtered = filterTrips(mockTrips, {
        year: [],
        country: [],
        categories: [],
        tags: [],
        name: "",
        status: "",
      });
      expect(filtered).toEqual(mockTrips);
    });
  });
});
