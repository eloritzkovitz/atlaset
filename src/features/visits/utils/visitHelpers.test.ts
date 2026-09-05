import { describe, expect, it } from "vitest";
import {
  getFirstYearFor,
  getLastYearFor,
  hasVisitInYearFor,
  getVisitCountFor,
} from "./visitHelpers";

describe("visitHelpers", () => {
  describe("getFirstYearFor", () => {
    it("gets the year from firstVisitMap", () => {
      expect(
        getFirstYearFor(
          "US",
          { US: new Date("2020-06-01") },
          { US: new Set([2018, 2019]) },
        ),
      ).toBe(2020);
    });

    it("falls back to the earliest visited year", () => {
      expect(
        getFirstYearFor("US", undefined, {
          US: new Set([2020, 2018, 2019]),
        }),
      ).toBe(2018);
    });

    it("returns null without visit data", () => {
      expect(getFirstYearFor("US", undefined, {})).toBeNull();
    });

    it("returns null without an ISO code", () => {
      expect(getFirstYearFor()).toBeNull();
    });
  });

  describe("getLastYearFor", () => {
    it("gets the year from lastVisitMap", () => {
      expect(
        getLastYearFor(
          "US",
          { US: new Date("2020-06-01") },
          { US: new Set([2018, 2019]) },
        ),
      ).toBe(2020);
    });

    it("falls back to the latest visited year", () => {
      expect(
        getLastYearFor("US", undefined, {
          US: new Set([2020, 2018, 2019]),
        }),
      ).toBe(2020);
    });

    it("returns null without visit data", () => {
      expect(getLastYearFor("US", undefined, {})).toBeNull();
    });

    it("returns null without an ISO code", () => {
      expect(getLastYearFor()).toBeNull();
    });
  });

  describe("hasVisitInYearFor", () => {
    const visitedYearMap = {
      US: new Set([2020, 2022]),
    };

    it("returns whether the country was visited in the year", () => {
      expect(hasVisitInYearFor("US", 2020, visitedYearMap)).toBe(true);
      expect(hasVisitInYearFor("US", 2021, visitedYearMap)).toBe(false);
      expect(hasVisitInYearFor("CA", 2020, visitedYearMap)).toBe(false);
      expect(hasVisitInYearFor(undefined, 2020, visitedYearMap)).toBe(false);
    });
  });

  describe("getVisitCountFor", () => {
    it("gets the count from visitedMap", () => {
      expect(getVisitCountFor("US", { US: 3 })).toBe(3);
      expect(getVisitCountFor("CA", { US: 3 })).toBe(0);
      expect(getVisitCountFor("US", { US: 0 })).toBe(0);
    });

    it("falls back to visitedIsoCodes", () => {
      expect(getVisitCountFor("US", undefined, ["US"])).toBe(1);
      expect(getVisitCountFor("CA", undefined, ["US"])).toBe(0);
    });

    it("returns zero without an ISO code", () => {
      expect(getVisitCountFor(undefined, { US: 3 }, ["US"])).toBe(0);
    });
  });
});
