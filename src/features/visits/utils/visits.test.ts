import { mockTrips } from "@test-utils/mockTrips";
import {
  getYearsFromTrips,
  getLatestYear,
  computeVisitedCountriesFromTrips,
  getUpcomingVisitCountries,
  getVisitedCountriesForYear,
  getVisitedCountriesUpToYear,
  getNextUpcomingTripYearByCountry,
  getVisitCountStats,
  getVisitsForCountry,
  getFirstVisitDateByCountry,
  getLastVisitDateByCountry,
  buildVisitedYearMap,
  computeVisitCountsFromYearMap,
} from "./visits";

describe("visits utils", () => {
  const homeCountry = "GB";

  describe("getYearsFromTrips", () => {
    it("returns unique sorted years from trips", () => {
      const years = getYearsFromTrips(mockTrips);
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
        getLatestYear([2000, 1999, 2020, 2021].sort((a, b) => a - b)),
      ).toBe(2021);
      expect(getLatestYear([2022, 2023, 2021].sort((a, b) => a - b))).toBe(
        2023,
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

  describe("getUpcomingVisitCountries", () => {
    it("returns country codes with future trips", () => {
      const upcoming = getUpcomingVisitCountries(mockTrips);
      expect(upcoming).toEqual(expect.arrayContaining(["JP"]));
    });
  });

  describe("getVisitsForCountry", () => {
    it("returns visits for a country sorted by startDate, tentative last", () => {
      const trips = [
        { ...mockTrips[0], countryCodes: ["US"], startDate: "2022-01-01" },
        { ...mockTrips[1], countryCodes: ["US"], startDate: "2023-01-01" },
        { ...mockTrips[2], countryCodes: ["US"], startDate: undefined },
      ];
      const visits = getVisitsForCountry(trips, "US");
      expect(visits[0].startDate).toBe("2022-01-01");
      expect(visits[1].startDate).toBe("2023-01-01");
      expect(visits[2].startDate).toBeUndefined();
    });

    it("handles pairs of trips with missing startDate (returns 0 branch)", () => {
      const trips = [
        {
          countryCodes: ["US"],
          startDate: undefined,
          endDate: "2022-01-05",
          name: "A",
          id: "a",
        },
        {
          countryCodes: ["US"],
          startDate: undefined,
          endDate: "2023-01-05",
          name: "B",
          id: "b",
        },
      ] as any[];
      const visits = getVisitsForCountry(trips, "US");
      expect(visits.length).toBe(2);
      expect(visits[0].startDate).toBeUndefined();
      expect(visits[1].startDate).toBeUndefined();
      expect(visits.map((v) => v.tripName)).toEqual(["A", "B"]);
    });

    it("returns empty array if no trips for the country", () => {
      const visits = getVisitsForCountry(mockTrips, "MX");
      expect(visits).toEqual([]);
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
        homeCountry,
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
        },
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

  describe("computeVisitCountsFromYearMap", () => {
    const ymap = buildVisitedYearMap(mockTrips);

    test.each([
      [
        "basic counts up to 2023",
        undefined,
        expect.objectContaining({ US: 1, FR: 1, DE: 1, CA: 1 }),
      ],
      ["filter to 2022 only", [2022], { CA: 1 }],
      ["out-of-range years", [2099], {}],
    ])("%s", (_desc, years, expected) => {
      const counts = computeVisitCountsFromYearMap(ymap, 2023, years as any);
      expect(counts).toEqual(expected);
    });
  });

  describe("first/last visit and year map utilities", () => {
    it("computes first and last visit dates by country", () => {
      const trips = [
        { endDate: "2020-01-01", countryCodes: ["US", "CA"] },
        { endDate: "2019-06-01", countryCodes: ["US"] },
        { endDate: "2021-03-01", countryCodes: ["FR"] },
      ] as any[];
      const first = getFirstVisitDateByCountry(trips);
      const last = getLastVisitDateByCountry(trips);
      expect(first.US.getFullYear()).toBe(2019);
      expect(last.US.getFullYear()).toBe(2020);
      expect(first.FR.getFullYear()).toBe(2021);
    });

    it("builds visited year map and returns first visit year", () => {
      const trips = [
        {
          startDate: "2018-12-31",
          endDate: "2019-01-02",
          countryCodes: ["US"],
        },
        {
          startDate: "2019-05-01",
          endDate: "2020-05-01",
          countryCodes: ["US", "FR"],
        },
      ] as any[];
      const ymap = buildVisitedYearMap(trips);
      expect(ymap.US.has(2018)).toBe(true);
      expect(ymap.US.has(2019)).toBe(true);
      expect(ymap.US.has(2020)).toBe(true);
      expect(ymap.FR.has(2019)).toBe(true);
      const firstUS = Math.min(...Array.from(ymap["US"]));
      expect(firstUS).toBe(2018);
      const lastUS = Math.max(...Array.from(ymap["US"]));
      expect(lastUS).toBe(2020);
    });

    it("formats yearRange when start and end span different years in getVisitsForCountry", () => {
      const trips = [
        {
          countryCodes: ["US"],
          startDate: "2019-12-31",
          endDate: "2020-01-02",
          name: "New Year",
          id: "t1",
        },
      ] as any[];
      const visits = getVisitsForCountry(trips, "US");
      expect(visits[0].yearRange).toContain("2019");
      expect(visits[0].yearRange).toContain("2020");
      expect(visits[0].tripName).toBe("New Year");
    });
  });
});
