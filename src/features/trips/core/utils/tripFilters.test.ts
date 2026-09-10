import { mockTrips } from "@test-utils/mockTrips";
import { filterTrips } from "./tripFilters";
import { getAutoTripStatus } from "./trips";
import type { TripCategory, TripTag } from "../types";

// Create a version of mockTrips with auto-computed statuses for testing filterTrips
const mockTripsWithRuntimeStatuses = mockTrips.map((trip) => ({
  ...trip,
  status: getAutoTripStatus(trip),
}));

describe("tripFilters utils", () => {
  describe("filterTrips", () => {
    it("filters by name substring (case-insensitive)", () => {
      const filtered = filterTrips(mockTripsWithRuntimeStatuses, {
        name: "local",
        rating: -1,
        country: [],
        year: [],
        participants: [],
        categories: [],
        status: null,
        tags: [],
      });
      expect(filtered).toEqual([mockTripsWithRuntimeStatuses[0]]);
    });

    it("filters by rating", () => {
      const trips = [
        { ...mockTripsWithRuntimeStatuses[0], rating: 5 },
        { ...mockTripsWithRuntimeStatuses[1], rating: 3 },
        { ...mockTripsWithRuntimeStatuses[2], rating: undefined },
      ];
      const filtered = filterTrips(trips, {
        rating: 5,
        year: [],
        participants: [],
        country: [],
        categories: [],
        tags: [],
        name: "",
        status: null,
      });
      expect(filtered).toEqual([trips[0]]);
    });

    it("filters by country code", () => {
      const filtered = filterTrips(mockTripsWithRuntimeStatuses, {
        country: ["FR"],
        rating: -1,
        year: [],
        participants: [],
        categories: [],
        tags: [],
        name: "",
        status: null,
      });
      expect(filtered).toEqual([mockTripsWithRuntimeStatuses[1]]);
    });

    it("filters by year", () => {
      const filtered = filterTrips(mockTripsWithRuntimeStatuses, {
        year: ["2023"],
        participants: [],
        rating: -1,
        country: [],
        categories: [],
        tags: [],
        name: "",
        status: null,
      });
      expect(
        filtered.map(
          (t) => t.startDate && new Date(t.startDate).getFullYear().toString(),
        ),
      ).toEqual(expect.arrayContaining(["2023"]));
    });

    it("filters by categories", () => {
      const trips = [
        {
          ...mockTripsWithRuntimeStatuses[0],
          categories: ["adventure", "family"] as TripCategory[],
        },
        {
          ...mockTripsWithRuntimeStatuses[1],
          categories: ["business"] as TripCategory[],
        },
      ];
      const filtered = filterTrips(trips, {
        categories: ["adventure"],
        rating: -1,
        year: [],
        participants: [],
        country: [],
        tags: [],
        name: "",
        status: null,
      });
      expect(filtered).toEqual([trips[0]]);
    });

    it("filters by status", () => {
      const filtered = filterTrips(mockTripsWithRuntimeStatuses, {
        status: "completed",
        rating: -1,
        year: [],
        participants: [],
        country: [],
        categories: [],
        tags: [],
        name: "",
      });

      expect(filtered).toEqual([
        mockTripsWithRuntimeStatuses[0],
        mockTripsWithRuntimeStatuses[1],
        mockTripsWithRuntimeStatuses[3],
      ]);
    });

    it("filters by tags", () => {
      const trips = [
        {
          ...mockTripsWithRuntimeStatuses[0],
          tags: ["family", "summer"] as TripTag[],
        },
        { ...mockTripsWithRuntimeStatuses[1], tags: ["business"] as TripTag[] },
      ];
      const filtered = filterTrips(trips, {
        tags: ["family"],
        rating: -1,
        year: [],
        participants: [],
        country: [],
        categories: [],
        name: "",
        status: null,
      });
      expect(filtered).toEqual([trips[0]]);
    });

    it("filters by a single participant UID", () => {
      const trips = [
        {
          ...mockTripsWithRuntimeStatuses[0],
          participants: ["user1", "user2"],
        },
        { ...mockTripsWithRuntimeStatuses[1], participants: ["user3"] },
        { ...mockTripsWithRuntimeStatuses[2], participants: [] },
        { ...mockTripsWithRuntimeStatuses[3], participants: undefined },
      ];
      const filtered = filterTrips(trips, {
        participants: ["user1"],
        rating: -1,
        year: [],
        country: [],
        categories: [],
        tags: [],
        name: "",
        status: null,
      });
      expect(filtered).toEqual([trips[0]]);
    });

    it("filters by multiple participant UIDs", () => {
      const trips = [
        {
          ...mockTripsWithRuntimeStatuses[0],
          participants: ["user1", "user2"],
        },
        { ...mockTripsWithRuntimeStatuses[1], participants: ["user3"] },
        { ...mockTripsWithRuntimeStatuses[2], participants: ["user2"] },
      ];
      const filtered = filterTrips(trips, {
        participants: ["user2", "user3"],
        rating: -1,
        year: [],
        country: [],
        categories: [],
        tags: [],
        name: "",
        status: null,
      });
      expect(filtered).toEqual([trips[0], trips[1], trips[2]]);
    });

    it("returns no trips if no participants match", () => {
      const trips = [
        { ...mockTripsWithRuntimeStatuses[0], participants: ["user1"] },
        { ...mockTripsWithRuntimeStatuses[1], participants: ["user2"] },
      ];
      const filtered = filterTrips(trips, {
        participants: ["userX"],
        rating: -1,
        year: [],
        country: [],
        categories: [],
        tags: [],
        name: "",
        status: null,
      });
      expect(filtered).toEqual([]);
    });

    it("handles trips with no participants field", () => {
      const trips = [
        { ...mockTripsWithRuntimeStatuses[0], participants: undefined },
        { ...mockTripsWithRuntimeStatuses[1], participants: [] },
      ];
      const filtered = filterTrips(trips, {
        participants: ["user1"],
        rating: -1,
        year: [],
        country: [],
        categories: [],
        tags: [],
        name: "",
        status: null,
      });
      expect(filtered).toEqual([]);
    });

    it("returns all trips if no filters", () => {
      const filtered = filterTrips(mockTripsWithRuntimeStatuses, {
        year: [],
        participants: [],
        rating: -1,
        country: [],
        categories: [],
        tags: [],
        name: "",
        status: null,
      });
      expect(filtered).toEqual(mockTripsWithRuntimeStatuses);
    });
  });
});
