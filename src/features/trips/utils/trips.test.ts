import { mockTrips } from "@test-utils/mockTrips";
import {
  hasValidStartDate,
  getTripDays,
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
  canMarkCompleted,
} from "./trips";
import type { Trip } from "../types";

const now = new Date();
const tomorrow = new Date(now.getTime() + 86400000);

describe("trips utils", () => {
  describe("hasValidStartDate", () => {
    it("returns false if startDate is missing", () => {
      expect(hasValidStartDate(mockTrips[4])).toBe(false);
    });

    it("returns false if startDate is empty string", () => {
      const trip: Trip = { ...mockTrips[0], startDate: "" };
      expect(hasValidStartDate(trip)).toBe(false);
    });

    it("returns false if startDate is invalid", () => {
      const trip: Trip = { ...mockTrips[0], startDate: "not-a-date" };
      expect(hasValidStartDate(trip)).toBe(false);
    });

    it("returns true if startDate is valid", () => {
      expect(hasValidStartDate(mockTrips[0])).toBe(true);
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

    it("returns 0 if startDate is invalid", () => {
      const trip = {
        ...mockTrips[0],
        startDate: "not-a-date",
        endDate: "2023-01-03",
      };
      expect(getTripDays(trip)).toBe(0);
    });

    it("returns 0 if endDate is invalid", () => {
      const trip = {
        ...mockTrips[0],
        startDate: "2023-01-01",
        endDate: "not-a-date",
      };
      expect(getTripDays(trip)).toBe(0);
    });
  });

  describe("getAutoTripStatus", () => {
    it("returns upcoming if now < start", () => {
      expect(getAutoTripStatus(mockTrips[2])).toBe("upcoming");
    });

    it("returns in-progress if now between start and end", () => {
      const trip = {
        ...mockTrips[0],
        startDate: now.toISOString(),
        endDate: tomorrow.toISOString(),
      };
      expect(getAutoTripStatus(trip)).toBe("in-progress");
    });

    it("returns planned if startDate is invalid", () => {
      expect(getAutoTripStatus(mockTrips[4])).toBe("planned");
    });

    it("returns planned as a fallback when a trip is active, has started, but has no end date", () => {
      const yesterday = new Date(now.getTime() - 86400000).toISOString();

      const tripWithoutEndDate: Trip = {
        ...mockTrips[0],
        status: "in-progress",
        startDate: yesterday,
        endDate: undefined,
      };
      expect(getAutoTripStatus(tripWithoutEndDate)).toBe("planned");
    });

    it("returns trip.status directly if it is explicitly provided", () => {
      const tripWithExplicitStatus = {
        ...mockTrips[0],
        startDate: "2026-01-01",
        status: "completed" as const,
      };
      expect(getAutoTripStatus(tripWithExplicitStatus)).toBe("completed");
    });
  });

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
      expect(isCompletedTrip(mockTrips[2])).toBe(false);
    });
  });

  describe("isUpcomingTrip", () => {
    it("returns true if status is auto-calculated as upcoming", () => {
      expect(isUpcomingTrip(mockTrips[2])).toBe(true);
    });

    it("returns false if startDate is in the past", () => {
      expect(isUpcomingTrip(mockTrips[0])).toBe(false);
    });

    it("returns false if startDate is invalid or missing", () => {
      expect(isUpcomingTrip(mockTrips[4])).toBe(false);
    });
  });

  describe("isPlannedTrip", () => {
    it("returns true if startDate is missing", () => {
      expect(isPlannedTrip(mockTrips[4])).toBe(true);
    });

    it("returns false if trip matches alternative temporal statuses (upcoming or past)", () => {
      expect(isPlannedTrip(mockTrips[0])).toBe(false);
      expect(isPlannedTrip(mockTrips[2])).toBe(false);
    });

    it("returns true if status is explicitly set to planned regardless of dates", () => {
      const trip = { ...mockTrips[0], status: "planned" as const };
      expect(isPlannedTrip(trip)).toBe(true);
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
    it("filters only upcoming trips", () => {
      const result = getUpcomingTrips(mockTrips);
      expect(result).toContain(mockTrips[2]);
      expect(result).not.toContain(mockTrips[4]);
    });
  });

  describe("getPlannedTrips", () => {
    it("filters only planned trips", () => {
      const result = getPlannedTrips(mockTrips);
      expect(result).toContain(mockTrips[4]);
      expect(result).not.toContain(mockTrips[2]);
    });
  });

  describe("getCompletedTrips", () => {
    it("filters only completed trips", () => {
      expect(getCompletedTrips(mockTrips)).toEqual([
        mockTrips[0],
        mockTrips[1],
        mockTrips[3],
      ]);
    });
  });

  describe("canMarkCompleted", () => {
    it("returns false if the trip status is already completed", () => {
      const trip: Trip = {
        ...mockTrips[0],
        status: "completed",
        startDate: "2023-01-01",
      };
      expect(canMarkCompleted(trip)).toBe(false);
    });

    it("returns false if the trip does not have a valid start date", () => {
      const datelessTrip: Trip = {
        ...mockTrips[0],
        status: "planned",
        startDate: "",
      };
      const invalidDateTrip: Trip = {
        ...mockTrips[0],
        status: "planned",
        startDate: "not-a-date",
      };

      expect(canMarkCompleted(datelessTrip)).toBe(false);
      expect(canMarkCompleted(invalidDateTrip)).toBe(false);
    });

    it("returns false if the trip start date is in the future", () => {
      const futureDate = new Date(now.getTime() + 5 * 86400000).toISOString();
      const futureTrip: Trip = {
        ...mockTrips[0],
        status: "in-progress",
        startDate: futureDate,
      };
      expect(canMarkCompleted(futureTrip)).toBe(false);
    });

    it("returns true if the trip has started or is in the past and is not completed yet", () => {
      const pastTrip: Trip = {
        ...mockTrips[0],
        status: "in-progress",
        startDate: "2023-01-01",
      };

      const todayMidnight = new Date();
      todayMidnight.setHours(0, 0, 0, 0);

      const currentTrip: Trip = {
        ...mockTrips[0],
        status: "in-progress",
        startDate: todayMidnight.toISOString(),
      };

      expect(canMarkCompleted(pastTrip)).toBe(true);
      expect(canMarkCompleted(currentTrip)).toBe(true);
    });
  });
});
