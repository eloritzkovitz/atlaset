import { mockTrips } from "@test-utils/mockTrips";
import {
  getYearsFromTrips,
  getLatestYear,
  computeVisitedCountriesFromTrips,
  getVisitedCountriesForYear,
  getVisitedCountriesUpToYear,
  getNextUpcomingTripYearByCountry,
  getVisitCountStats,
} from "./visits";

describe("visits utils", () => {
  const homeCountry = "GB";

  describe("getYearsFromTrips", () => {
    it("returns unique sorted years from trips", () => {
      const years = getYearsFromTrips(mockTrips);
      // Update expected years to match endDate years in mockTrips
      expect(years).toEqual([2022, 2023, 2099]);
    });

    it("returns an empty array if no trips", () => {
      expect(getYearsFromTrips([])).toEqual([]);
    });

    it("ignores trips without a valid endDate", () => {
      const trips = [
        { ...mockTrips[0], endDate: undefined } as any,
        { ...mockTrips[1], endDate: undefined } as any,
      ];
      expect(getYearsFromTrips(trips)).toEqual([]);
    });
  });

  describe("getLatestYear", () => {
    it("returns the latest year from a non-empty array", () => {
      expect(
        getLatestYear([2000, 1999, 2020, 2021].sort((a, b) => a - b))
      ).toBe(2021);
      expect(getLatestYear([2022, 2023, 2021].sort((a, b) => a - b))).toBe(
        2023
      );
    });
  });

  describe("computeVisitedCountriesFromTrips", () => {
    it("returns unique visited country codes for past and current trips", () => {
      const visited = computeVisitedCountriesFromTrips(mockTrips);
      expect(visited).toEqual(expect.arrayContaining(["US", "CA", "FR", "DE"]));
      expect(visited).not.toContain("JP");
    });

    it("includes home country if provided and not already present", () => {
      const visited = computeVisitedCountriesFromTrips(mockTrips, homeCountry);
      expect(visited).toContain(homeCountry);
    });

    it("returns empty array for empty trips", () => {
      expect(computeVisitedCountriesFromTrips([])).toEqual([]);
    });

    it("returns only home country if no trips and homeCountry is set", () => {
      expect(computeVisitedCountriesFromTrips([], homeCountry)).toEqual([
        homeCountry,
      ]);
    });
  });

  describe("getVisitedCountriesForYear", () => {
    it("returns all countries visited in a specific year", () => {
      const result = getVisitedCountriesForYear(mockTrips, 2023);
      expect(result).toEqual(expect.arrayContaining(["US", "FR", "DE"]));
      expect(result).not.toContain("CA");
      expect(result).not.toContain("JP");
    });

    it("includes home country if provided and not already present", () => {
      const result = getVisitedCountriesForYear(mockTrips, 2023, homeCountry);
      expect(result).toContain(homeCountry);
    });

    it("returns all countries visited in a year with overlapping trips", () => {
      const result = getVisitedCountriesForYear(mockTrips, 2022);
      expect(result).toEqual(expect.arrayContaining(["CA"]));
      expect(result).not.toContain("US");
      expect(result).not.toContain("FR");
      expect(result).not.toContain("DE");
      expect(result).not.toContain("JP");
    });

    it("returns only home country if no trips in the year and homeCountry is set", () => {
      expect(getVisitedCountriesForYear(mockTrips, 1999, homeCountry)).toEqual([
        homeCountry,
      ]);
    });

    it("returns an empty array if no trips in the year", () => {
      expect(getVisitedCountriesForYear(mockTrips, 1999)).toEqual([]);
    });

    it("ignores trips with no countryCodes", () => {
      const trips = [
        { ...mockTrips[0], countryCodes: [] } as any,
        { ...mockTrips[1], countryCodes: undefined } as any,
      ];
      expect(getVisitedCountriesForYear(trips, 2023)).toEqual([]);
    });
  });

  describe("getVisitedCountriesUpToYear", () => {
    it("returns all countries visited up to and including a year (excluding future trips)", () => {
      const thisYear = new Date().getFullYear();
      const result = getVisitedCountriesUpToYear(mockTrips, thisYear);
      if (thisYear >= 2023) {
        expect(result).toEqual({
          US: 1,
          FR: 1,
          DE: 1,
          CA: 1,
        });
        expect(result).not.toHaveProperty("JP");
      } else if (thisYear === 2022) {
        expect(result).toEqual({
          CA: 1,
        });
        expect(result).not.toHaveProperty("US");
        expect(result).not.toHaveProperty("FR");
        expect(result).not.toHaveProperty("DE");
        expect(result).not.toHaveProperty("JP");
      } else {
        expect(result).toEqual({});
      }
    });

    it("includes home country if provided and not already present", () => {
      const thisYear = new Date().getFullYear();
      const result = getVisitedCountriesUpToYear(
        mockTrips,
        thisYear,
        homeCountry
      );
      expect(result).toHaveProperty(homeCountry);
    });

    it("returns only countries visited up to a specific past year", () => {
      const result = getVisitedCountriesUpToYear(mockTrips, 2022);
      expect(result).toEqual({
        CA: 1,
      });
      expect(result).not.toHaveProperty("US");
      expect(result).not.toHaveProperty("FR");
      expect(result).not.toHaveProperty("DE");
      expect(result).not.toHaveProperty("JP");
    });

    it("returns only home country if no trips up to the year and homeCountry is set", () => {
      expect(getVisitedCountriesUpToYear(mockTrips, 1999, homeCountry)).toEqual(
        {
          [homeCountry]: 1,
        }
      );
    });

    it("returns an empty object if no trips up to the year", () => {
      expect(getVisitedCountriesUpToYear(mockTrips, 1999)).toEqual({});
    });

    it("ignores trips with no countryCodes or invalid endDate", () => {
      const trips = [
        { ...mockTrips[0], endDate: undefined, countryCodes: ["US"] } as any,
        { ...mockTrips[1], endDate: "2023-01-01", countryCodes: [] } as any,
      ];
      expect(getVisitedCountriesUpToYear(trips, 2023)).toEqual({});
    });
  });

  describe("getNextUpcomingTripYearByCountry", () => {
    it("returns an empty object if there are no upcoming trips", () => {
      const trips = mockTrips.map((trip) => ({
        ...trip,
        endDate: "2000-01-01",
      }));
      expect(getNextUpcomingTripYearByCountry(trips)).toEqual({});
    });

    it("returns the next upcoming year for each country with a future trip", () => {
      const now = new Date();
      const nextYear = now.getFullYear() + 1;
      const futureTrips = [
        {
          ...mockTrips[0],
          endDate: `${nextYear}-05-01`,
          countryCodes: ["US", "CA"],
        },
        {
          ...mockTrips[1],
          endDate: `${nextYear + 1}-06-01`,
          countryCodes: ["FR"],
        },
        {
          ...mockTrips[2],
          endDate: `${nextYear}-07-01`,
          countryCodes: ["JP", "US"],
        },
      ];
      const result = getNextUpcomingTripYearByCountry(futureTrips);
      expect(result).toEqual({
        US: nextYear,
        CA: nextYear,
        FR: nextYear + 1,
        JP: nextYear,
      });
    });

    it("returns the earliest upcoming year if multiple future trips exist for a country", () => {
      const now = new Date();
      const nextYear = now.getFullYear() + 1;
      const futureTrips = [
        {
          ...mockTrips[0],
          endDate: `${nextYear + 2}-05-01`,
          countryCodes: ["US"],
        },
        {
          ...mockTrips[1],
          endDate: `${nextYear}-06-01`,
          countryCodes: ["US"],
        },
      ];
      const result = getNextUpcomingTripYearByCountry(futureTrips);
      expect(result).toEqual({
        US: nextYear,
      });
    });

    it("ignores trips with invalid or missing endDate", () => {
      const now = new Date();
      const nextYear = now.getFullYear() + 1;
      const trips = [
        { ...mockTrips[0], endDate: undefined } as any,
        { ...mockTrips[1], endDate: "invalid-date" } as any,
        { ...mockTrips[2], endDate: `${nextYear}-07-01` } as any,
      ];
      const result = getNextUpcomingTripYearByCountry(trips);
      expect(result).toEqual({
        JP: nextYear,
      });
    });
  });

  describe("getVisitCountStats", () => {
    it("returns correct map, min, and max for normal trips", () => {
      const trips = [
        { endDate: "2022-01-01", countryCodes: ["US", "CA"] },
        { endDate: "2022-06-01", countryCodes: ["US"] },
        { endDate: "2023-01-01", countryCodes: ["FR"] },
      ] as any[];
      const { map, min, max } = getVisitCountStats(trips, 2022);
      expect(map).toEqual({ US: 2, CA: 1 });
      expect(min).toBe(1);
      expect(max).toBe(2);
    });

    it("returns min and max as 1 if no visits", () => {
      const trips = [] as any[];
      const { map, min, max } = getVisitCountStats(trips, 2022);
      expect(map).toEqual({});
      expect(min).toBe(1);
      expect(max).toBe(1);
    });

    it("ignores trips after the given year", () => {
      const trips = [
        { endDate: "2024-01-01", countryCodes: ["JP"] },
        { endDate: "2022-01-01", countryCodes: ["US"] },
      ] as any[];
      const { map, min, max } = getVisitCountStats(trips, 2022);
      expect(map).toEqual({ US: 1 });
      expect(min).toBe(1);
      expect(max).toBe(1);
    });

    it("handles multiple countries with same visit count", () => {
      const trips = [
        { endDate: "2022-01-01", countryCodes: ["US"] },
        { endDate: "2022-01-01", countryCodes: ["CA"] },
      ] as any[];
      const { map, min, max } = getVisitCountStats(trips, 2022);
      expect(map).toEqual({ US: 1, CA: 1 });
      expect(min).toBe(1);
      expect(max).toBe(1);
    });
  });
});
