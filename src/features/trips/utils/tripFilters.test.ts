import { mockTrips } from "@test-utils/mockTrips";
import type { TripCategory, TripTag } from "@types";
import { filterTrips } from "./tripFilters";

describe("tripFilters utils", () => {
  describe("filterTrips", () => {
    it("filters by name substring (case-insensitive)", () => {
      const filtered = filterTrips(mockTrips, {
        name: "local",
        rating: -1,
        country: [],
        year: [],
        categories: [],
        status: "",
        tags: [],
      });
      expect(filtered).toEqual([mockTrips[0]]);
    });

    it("filters by rating", () => {
      const trips = [
        { ...mockTrips[0], rating: 5 },
        { ...mockTrips[1], rating: 3 },
        { ...mockTrips[2], rating: undefined },
      ];
      const filtered = filterTrips(trips, {
        rating: 5,
        year: [],
        country: [],
        categories: [],
        tags: [],
        name: "",
        status: "",
      });
      expect(filtered).toEqual([trips[0]]);
    });

    it("filters by country code", () => {
      const filtered = filterTrips(mockTrips, {
        country: ["FR"],
        rating: -1,
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
        rating: -1,
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
        rating: -1,
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
        rating: -1,
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
        rating: -1,
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
        rating: -1,
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
