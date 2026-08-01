import { mockTrips } from "@test-utils/mockTrips";
import {
  hasValidStartDate,
  getTripDays,
  isLocalTrip,
  isAbroadTrip,
  isCompletedTrip,
  isUpcomingTrip,
  isPlannedTrip,
  isCancelledTrip,
  getLocalTrips,
  getAbroadTrips,
  getUpcomingTrips,
  getPlannedTrips,
  getCompletedTrips,
  getCancelledTrips,
  getAutoTripStatus,
  canMarkCompleted,
  canMarkCancelled,
  canRestore,
} from "./trips";
import type { Trip } from "../types";

const now = new Date();
const baseTrip = mockTrips[0];

describe("trips utils", () => {
  describe("hasValidStartDate", () => {
    test.each([
      ["missing", mockTrips[4], false],
      ["empty string", { ...baseTrip, startDate: "" }, false],
      ["invalid format", { ...baseTrip, startDate: "not-a-date" }, false],
      ["valid date", baseTrip, true],
    ])("returns %s for startDate (%p -> %p)", (_, trip, expected) => {
      expect(hasValidStartDate(trip as Trip)).toBe(expected);
    });
  });

  describe("getTripDays", () => {
    it("returns correct number of days (inclusive)", () => {
      expect(
        getTripDays({
          ...baseTrip,
          startDate: "2023-01-01",
          endDate: "2023-01-03",
        }),
      ).toBe(3);
    });

    test.each([
      ["invalid startDate", "not-a-date", "2023-01-03"],
      ["invalid endDate", "2023-01-01", "not-a-date"],
    ])("returns 0 for %s", (_, startDate, endDate) => {
      expect(getTripDays({ ...baseTrip, startDate, endDate })).toBe(0);
    });
  });

  describe("getAutoTripStatus", () => {
    it("returns cancelled if trip is explicitly marked as cancelled", () => {
      const cancelledTrip: Trip = {
        ...baseTrip,
        status: "cancelled",
        startDate: "2026-01-01",
      };
      expect(getAutoTripStatus(cancelledTrip)).toBe("cancelled");
    });

    it("returns upcoming if now < start", () => {
      expect(getAutoTripStatus(mockTrips[2])).toBe("upcoming");
    });

    it("returns in-progress if now between start and end", () => {
      const tomorrow = new Date(now.getTime() + 86400000);
      expect(
        getAutoTripStatus({
          ...baseTrip,
          startDate: now.toISOString(),
          endDate: tomorrow.toISOString(),
        }),
      ).toBe("in-progress");
    });

    it("returns planned if startDate is invalid", () => {
      expect(getAutoTripStatus(mockTrips[4])).toBe("planned");
    });

    it("returns planned as fallback when active trip has no endDate", () => {
      const yesterday = new Date(now.getTime() - 86400000).toISOString();
      expect(
        getAutoTripStatus({
          ...baseTrip,
          status: "in-progress",
          startDate: yesterday,
          endDate: undefined,
        }),
      ).toBe("planned");
    });
  });

  describe("isLocalTrip / isAbroadTrip", () => {
    test.each([
      [isLocalTrip, mockTrips[0], "US", true],
      [isLocalTrip, mockTrips[1], "US", false],
      [isLocalTrip, { ...baseTrip, countryCodes: [] }, "US", false],
      [isAbroadTrip, mockTrips[1], "US", true],
      [isAbroadTrip, mockTrips[0], "US", false],
      [isAbroadTrip, { ...baseTrip, countryCodes: [] }, "US", false],
    ])("%s returns %p", (fn, trip, country, expected) => {
      expect(fn(trip as Trip, country)).toBe(expected);
    });
  });

  describe("status predicate checks", () => {
    it("isCancelledTrip", () => {
      expect(isCancelledTrip({ ...baseTrip, status: "cancelled" })).toBe(true);
      expect(isCancelledTrip(baseTrip)).toBe(false);
    });

    it("isCompletedTrip", () => {
      expect(isCompletedTrip(mockTrips[0])).toBe(true);
      expect(isCompletedTrip(mockTrips[2])).toBe(false);
    });

    it("isUpcomingTrip", () => {
      expect(isUpcomingTrip(mockTrips[2])).toBe(true);
      expect(isUpcomingTrip(mockTrips[0])).toBe(false);
      expect(isUpcomingTrip(mockTrips[4])).toBe(false);
      expect(isUpcomingTrip({ ...mockTrips[2], status: "cancelled" })).toBe(
        false,
      );
    });

    it("isPlannedTrip", () => {
      expect(isPlannedTrip(mockTrips[4])).toBe(true);
      expect(isPlannedTrip(mockTrips[0])).toBe(false);
      expect(isPlannedTrip(mockTrips[2])).toBe(false);
      expect(isPlannedTrip({ ...mockTrips[4], status: "cancelled" })).toBe(
        false,
      );
    });
  });

  describe("filtered trips getters", () => {
    it("getLocalTrips", () => {
      expect(getLocalTrips(mockTrips, "US")).toEqual([mockTrips[0]]);
    });

    it("getAbroadTrips", () => {
      expect(getAbroadTrips(mockTrips, "US")).toEqual([
        mockTrips[1],
        mockTrips[2],
        mockTrips[3],
        mockTrips[4],
      ]);
    });

    it("getUpcomingTrips", () => {
      const result = getUpcomingTrips(mockTrips);
      expect(result).toContain(mockTrips[2]);
      expect(result).not.toContain(mockTrips[4]);
    });

    it("getPlannedTrips", () => {
      const result = getPlannedTrips(mockTrips);
      expect(result).toContain(mockTrips[4]);
      expect(result).not.toContain(mockTrips[2]);
    });

    it("getCompletedTrips", () => {
      expect(getCompletedTrips(mockTrips)).toEqual([
        mockTrips[0],
        mockTrips[1],
        mockTrips[3],
      ]);
    });

    it("getCancelledTrips", () => {
      const cancelledTrip: Trip = { ...baseTrip, status: "cancelled" };
      expect(getCancelledTrips([baseTrip, cancelledTrip])).toEqual([
        cancelledTrip,
      ]);
    });
  });

  describe("canMarkCompleted", () => {
    it("returns false if completed, cancelled, dateless, invalid, or future", () => {
      const futureDate = new Date(now.getTime() + 5 * 86400000).toISOString();
      expect(
        canMarkCompleted({
          ...baseTrip,
          status: "completed",
          startDate: "2023-01-01",
        }),
      ).toBe(false);
      expect(
        canMarkCompleted({
          ...baseTrip,
          status: "cancelled",
          startDate: "2023-01-01",
        }),
      ).toBe(false);
      expect(
        canMarkCompleted({ ...baseTrip, status: "planned", startDate: "" }),
      ).toBe(false);
      expect(
        canMarkCompleted({
          ...baseTrip,
          status: "planned",
          startDate: "not-a-date",
        }),
      ).toBe(false);
      expect(
        canMarkCompleted({
          ...baseTrip,
          status: "in-progress",
          startDate: futureDate,
        }),
      ).toBe(false);
    });

    it("returns true if started/past and not completed or cancelled", () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      expect(
        canMarkCompleted({
          ...baseTrip,
          status: "in-progress",
          startDate: "2023-01-01",
        }),
      ).toBe(true);
      expect(
        canMarkCompleted({
          ...baseTrip,
          status: "in-progress",
          startDate: today.toISOString(),
        }),
      ).toBe(true);
    });
  });

  describe("canMarkCancelled & canRestore", () => {
    test.each([
      ["completed", false],
      ["cancelled", false],
      ["in-progress", true],
      ["planned", true],
    ])("canMarkCancelled returns %p for status %s", (status, expected) => {
      expect(
        canMarkCancelled({ ...baseTrip, status: status as Trip["status"] }),
      ).toBe(expected);
    });

    test.each([
      ["completed", false],
      ["in-progress", false],
      ["cancelled", true],
    ])("canRestore returns %p for status %s", (status, expected) => {
      expect(
        canRestore({ ...baseTrip, status: status as Trip["status"] }),
      ).toBe(expected);
    });
  });
});
