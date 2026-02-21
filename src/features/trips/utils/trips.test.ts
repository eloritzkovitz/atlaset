import { mockTrips } from "@test-utils/mockTrips";
import {
  isLocalTrip,
  isAbroadTrip,
  isCompletedTrip,
  isUpcomingTrip,
  isPlannedTrip,
  getLocalTrips,
  getAbroadTrips,
  getUpcomingTrips,
  getPlannedTrips,
  getCompletedTrips,
  getAutoTripStatus,
  getTripDays,
} from "./trips";
import type { Trip } from "../types";

const now = new Date();
const yesterday = new Date(now.getTime() - 86400000);
const tomorrow = new Date(now.getTime() + 86400000);

describe("trips utils", () => {
  describe("isLocalTrip", () => {
    it("returns true if all codes match home country", () => {
      expect(isLocalTrip(mockTrips[0], "US")).toBe(true);
    });

    it("returns false if any code does not match", () => {
      expect(isLocalTrip(mockTrips[1], "US")).toBe(false);
    });

    it("returns false if countryCodes is empty", () => {
      const trip: Trip = { ...mockTrips[0], countryCodes: [] };
      expect(isLocalTrip(trip, "US")).toBe(false);
    });
  });

  describe("isAbroadTrip", () => {
    it("returns true if any code does not match home country", () => {
      expect(isAbroadTrip(mockTrips[1], "US")).toBe(true);
    });

    it("returns false if all codes match home country", () => {
      expect(isAbroadTrip(mockTrips[0], "US")).toBe(false);
    });

    it("returns false if countryCodes is empty", () => {
      const trip: Trip = { ...mockTrips[0], countryCodes: [] };
      expect(isAbroadTrip(trip, "US")).toBe(false);
    });
  });

  describe("isCompletedTrip", () => {
    it("returns true if status is completed", () => {
      expect(isCompletedTrip(mockTrips[0])).toBe(true);
    });

    it("returns false otherwise", () => {
      expect(isCompletedTrip(mockTrips[1])).toBe(false);
    });
  });

  describe("isUpcomingTrip", () => {
    it("returns true if startDate is in the future", () => {
      const trip: Trip = { ...mockTrips[0], startDate: tomorrow.toISOString() };
      expect(isUpcomingTrip(trip)).toBe(true);
    });

    it("returns false if startDate is in the past", () => {
      const trip: Trip = {
        ...mockTrips[0],
        startDate: yesterday.toISOString(),
      };
      expect(isUpcomingTrip(trip)).toBe(false);
    });

    it("returns false if startDate is missing (should be planned)", () => {
      const trip: Trip = { ...mockTrips[0], startDate: undefined };
      expect(isUpcomingTrip(trip)).toBe(false);
    });

    it("returns false if startDate is empty string (should be planned)", () => {
      const trip: Trip = { ...mockTrips[0], startDate: "" };
      expect(isUpcomingTrip(trip)).toBe(false);
    });

    it("returns false if startDate is invalid (should be planned)", () => {
      const trip: Trip = { ...mockTrips[0], startDate: "not-a-date" };
      expect(isUpcomingTrip(trip)).toBe(false);
    });
  });

  describe("isPlannedTrip", () => {
    it("returns true if startDate is missing", () => {
      const trip: Trip = { ...mockTrips[0], startDate: undefined };
      expect(isPlannedTrip(trip)).toBe(true);
    });

    it("returns true if startDate is empty string", () => {
      const trip: Trip = { ...mockTrips[0], startDate: "" };
      expect(isPlannedTrip(trip)).toBe(true);
    });

    it("returns true if startDate is invalid", () => {
      const trip: Trip = { ...mockTrips[0], startDate: "not-a-date" };
      expect(isPlannedTrip(trip)).toBe(true);
    });

    it("returns false if startDate is in the future (should be upcoming)", () => {
      const trip: Trip = { ...mockTrips[0], startDate: tomorrow.toISOString() };
      expect(isPlannedTrip(trip)).toBe(false);
    });

    it("returns false if startDate is in the past (should be neither planned nor upcoming)", () => {
      const trip: Trip = {
        ...mockTrips[0],
        startDate: yesterday.toISOString(),
      };
      expect(isPlannedTrip(trip)).toBe(false);
    });
  });

  describe("getLocalTrips", () => {
    it("filters only local trips", () => {
      const result = getLocalTrips(mockTrips, "US");
      expect(result).toEqual([mockTrips[0]]);
    });
  });

  describe("getAbroadTrips", () => {
    it("filters only abroad trips", () => {
      const result = getAbroadTrips(mockTrips, "US");
      expect(result).toEqual([
        mockTrips[1],
        mockTrips[2],
        mockTrips[3],
        mockTrips[4],
      ]);
    });
  });

  describe("getUpcomingTrips", () => {
    it("filters only upcoming trips (with valid future startDate)", () => {
      const futureTrip: Trip = {
        ...mockTrips[0],
        startDate: tomorrow.toISOString(),
      };
      const result = getUpcomingTrips([...mockTrips, futureTrip]);
      expect(result).toContain(futureTrip);
      // Should not include trips with missing/invalid startDate
      const tentativeTrip: Trip = { ...mockTrips[0], startDate: undefined };
      expect(result).not.toContain(tentativeTrip);
    });
  });

  describe("getPlannedTrips", () => {
    it("filters only planned trips (missing or invalid startDate)", () => {
      const tentativeTrip: Trip = { ...mockTrips[0], startDate: undefined };
      const invalidTrip: Trip = { ...mockTrips[0], startDate: "not-a-date" };
      const result = getPlannedTrips([
        tentativeTrip,
        invalidTrip,
        mockTrips[0],
      ]);
      expect(result).toContain(tentativeTrip);
      expect(result).toContain(invalidTrip);
      // Should not include trips with valid future or past startDate
      const futureTrip: Trip = {
        ...mockTrips[0],
        startDate: tomorrow.toISOString(),
      };
      const pastTrip: Trip = {
        ...mockTrips[0],
        startDate: yesterday.toISOString(),
      };
      expect(result).not.toContain(futureTrip);
      expect(result).not.toContain(pastTrip);
    });
  });

  describe("getCompletedTrips", () => {
    it("filters only completed trips", () => {
      const result = getCompletedTrips(mockTrips);
      expect(result).toEqual([mockTrips[0], mockTrips[3]]);
    });
  });

  describe("getAutoTripStatus", () => {
    it("returns planned if now < start", () => {
      const trip = {
        ...mockTrips[2],
        startDate: tomorrow.toISOString(),
        endDate: tomorrow.toISOString(),
      };
      expect(getAutoTripStatus(trip)).toBe("planned");
    });

    it("returns in-progress if now between start and end", () => {
      const trip = {
        ...mockTrips[0],
        startDate: yesterday.toISOString(),
        endDate: tomorrow.toISOString(),
      };
      expect(getAutoTripStatus(trip)).toBe("in-progress");
    });

    it("returns completed if now > end", () => {
      const trip = {
        ...mockTrips[0],
        startDate: yesterday.toISOString(),
        endDate: yesterday.toISOString(),
      };
      expect(getAutoTripStatus(trip)).toBe("completed");
    });

    it("returns trip.status if startDate and endDate are missing (tentative trip)", () => {
      expect(getAutoTripStatus(mockTrips[4])).toBe("planned");
    });
  });

  describe("getTripDays", () => {
    it("returns correct number of days (inclusive)", () => {
      const trip = {
        ...mockTrips[0],
        startDate: "2023-01-01",
        endDate: "2023-01-03",
      };
      expect(getTripDays(trip)).toBe(3);
    });
  });
});
