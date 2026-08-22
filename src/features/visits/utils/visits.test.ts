import { mockTrips } from "@test-utils/mockTrips";
import {
  getYearsFromTrips,
  getLatestYear,
  computeVisitedCountriesFromTrips,
  getFutureVisitCountries,
  getVisitedCountriesForYear,
  getVisitCountsUpToYear,
  getVisitsForCountry,
  categorizeVisits,
  getFirstVisitDateByCountry,
  getLastVisitDateByCountry,
  getNextUpcomingTripYearByCountry,
  buildVisitedYearMap,
  computeVisitCountsFromYearMap,
  buildVisitContext,
} from "./visits";

describe("visits utils", () => {
  const homeCountry = "GB";

  describe("getYearsFromTrips", () => {
    it("returns unique sorted years", () => {
      expect(getYearsFromTrips(mockTrips)).toEqual([2022, 2023, 2099]);
    });

    it("ignores trips without endDate", () => {
      const trips = mockTrips.map((trip) => ({
        ...trip,
        endDate: undefined,
      }));

      expect(getYearsFromTrips(trips as any)).toEqual([]);
    });

    it("returns empty array for no trips", () => {
      expect(getYearsFromTrips([])).toEqual([]);
    });
  });

  describe("getLatestYear", () => {
    it.each([
      [[2000, 2020, 2021], 2021],
      [[2023, 2021, 2022], 2022],
      [[], new Date().getFullYear()],
    ])("returns %s -> %s", (years, expected) => {
      expect(getLatestYear(years as number[])).toBe(expected);
    });
  });

  describe("computeVisitedCountriesFromTrips", () => {
    it("returns completed trip countries", () => {
      expect(computeVisitedCountriesFromTrips(mockTrips)).toEqual(
        expect.arrayContaining(["US", "CA", "FR", "DE"]),
      );
      expect(computeVisitedCountriesFromTrips(mockTrips)).not.toContain("JP");
    });

    it("includes home country", () => {
      expect(computeVisitedCountriesFromTrips([], homeCountry)).toEqual([
        homeCountry,
      ]);
    });
  });

  describe("getFutureVisitCountries", () => {
    it("returns unique countries with future trips", () => {
      const result = getFutureVisitCountries(mockTrips);

      expect(result).toEqual(expect.arrayContaining(["JP"]));
      expect(new Set(result).size).toBe(result.length);
    });

    it("returns empty array when there are no future trips", () => {
      const trips = mockTrips.map((trip) => ({
        ...trip,
        startDate: "2000-01-01",
        endDate: "2000-01-05",
      }));

      expect(getFutureVisitCountries(trips)).toEqual([]);
    });
  });

  describe("getVisitedCountriesForYear", () => {
    it.each([
      [2023, ["US", "FR", "DE"], ["CA", "JP"]],
      [2022, ["CA"], ["US", "FR", "DE", "JP"]],
      [1999, [], ["US", "CA", "FR", "DE", "JP"]],
    ])("returns countries for %s", (year, included, excluded) => {
      const result = getVisitedCountriesForYear(mockTrips, year);

      expect(result).toEqual(expect.arrayContaining(included));
      excluded.forEach((code) => expect(result).not.toContain(code));
    });

    it("includes home country", () => {
      expect(getVisitedCountriesForYear(mockTrips, 1999, homeCountry)).toEqual([
        homeCountry,
      ]);
    });

    it("ignores trips without dates", () => {
      const trips = [
        { ...mockTrips[0], startDate: undefined, endDate: undefined },
      ];

      expect(getVisitedCountriesForYear(trips, 2023)).toEqual([]);
    });

    it("uses start year when endDate is missing", () => {
      const trips = [
        { ...mockTrips[0], startDate: "2023-01-01", endDate: undefined },
      ];

      expect(getVisitedCountriesForYear(trips, 2023)).toEqual(["US"]);
    });
  });

  describe("getVisitCountsUpToYear", () => {
    it("returns completed visit counts up to the selected year", () => {
      expect(getVisitCountsUpToYear(mockTrips, 2022)).toEqual({ CA: 1 });
      expect(getVisitCountsUpToYear(mockTrips, 2023)).toEqual({
        US: 1,
        FR: 1,
        DE: 1,
        CA: 1,
      });
    });

    it("excludes future trips", () => {
      const trips = [
        {
          ...mockTrips[0],
          endDate: "2099-01-01",
          countryCodes: ["JP"],
        },
      ];

      expect(getVisitCountsUpToYear(trips, 2099)).toEqual({});
    });

    it("includes home country", () => {
      expect(getVisitCountsUpToYear([], 2023, homeCountry)).toEqual({
        [homeCountry]: 1,
      });
    });

    it("ignores missing endDate and countryCodes", () => {
      const trips = [
        { ...mockTrips[0], endDate: undefined, countryCodes: ["US"] },
        { ...mockTrips[1], endDate: "2023-01-01", countryCodes: [] },
      ];

      expect(getVisitCountsUpToYear(trips as any, 2023)).toEqual({});
    });
  });

  describe("getVisitsForCountry", () => {
    it("returns matching visits sorted by startDate with tentative visits last", () => {
      const trips = [
        { ...mockTrips[0], countryCodes: ["US"], startDate: "2022-01-01" },
        { ...mockTrips[1], countryCodes: ["US"], startDate: "2023-01-01" },
        { ...mockTrips[4], countryCodes: ["US"] },
      ];

      const visits = getVisitsForCountry(trips, "US");

      expect(visits.map((v) => v.startDate)).toEqual([
        "2022-01-01",
        "2023-01-01",
        undefined,
      ]);
    });

    it("returns visit metadata and formats year ranges", () => {
      const trips = [
        {
          ...mockTrips[0],
          countryCodes: ["US"],
          startDate: "2019-12-31",
          endDate: "2020-01-02",
          name: "New Year",
          id: "t1",
        },
      ];

      expect(getVisitsForCountry(trips, "US")[0]).toEqual({
        yearRange: "2019 - 2020",
        tripName: "New Year",
        tripId: "t1",
        startDate: "2019-12-31",
        endDate: "2020-01-02",
      });
    });

    it("handles missing start dates and countries with no visits", () => {
      const trips = [
        {
          ...mockTrips[0],
          countryCodes: ["US"],
          startDate: undefined,
          endDate: "2022-01-05",
          name: "A",
          id: "a",
        },
        {
          ...mockTrips[1],
          countryCodes: ["US"],
          startDate: undefined,
          endDate: "2023-01-05",
          name: "B",
          id: "b",
        },
      ];

      expect(getVisitsForCountry(trips, "US")).toHaveLength(2);
      expect(getVisitsForCountry(trips, "MX")).toEqual([]);
    });
  });

  describe("categorizeVisits", () => {
    it("categorizes past, upcoming, and tentative visits", () => {
      const now = new Date();

      const visits = [
        {
          tripId: "past",
          tripName: "Past",
          yearRange: "2025",
          startDate: "2025-01-01",
          endDate: "2025-01-10",
        },
        {
          tripId: "upcoming",
          tripName: "Upcoming",
          yearRange: "2099",
          startDate: "2099-12-01",
          endDate: "2099-12-10",
        },
        {
          tripId: "tentative",
          tripName: "Tentative",
          yearRange: null,
          startDate: undefined,
          endDate: undefined,
        },
        {
          tripId: "ongoing",
          tripName: "Ongoing",
          yearRange: "2099",
          startDate: new Date(now.getTime() - 86400000)
            .toISOString()
            .slice(0, 10),
          endDate: new Date(now.getTime() + 86400000)
            .toISOString()
            .slice(0, 10),
        },
      ];

      const result = categorizeVisits(visits);

      expect(result.past).toHaveLength(1);
      expect(result.upcoming).toHaveLength(1);
      expect(result.tentative).toHaveLength(1);
    });
  });

  describe("getFirstVisitDateByCountry", () => {
    it("returns the earliest visit date per country", () => {
      const trips = [
        { ...mockTrips[0], endDate: "2020-01-01", countryCodes: ["US", "CA"] },
        { ...mockTrips[1], endDate: "2019-06-01", countryCodes: ["US"] },
        { ...mockTrips[1], endDate: "2021-03-01", countryCodes: ["FR"] },
      ];

      const result = getFirstVisitDateByCountry(trips);

      expect(result.US.getFullYear()).toBe(2019);
      expect(result.CA.getFullYear()).toBe(2020);
      expect(result.FR.getFullYear()).toBe(2021);
    });

    it("ignores trips without an endDate or countryCodes", () => {
      const trips = [
        { ...mockTrips[0], endDate: undefined },
        { ...mockTrips[1], countryCodes: [] },
      ];

      expect(getFirstVisitDateByCountry(trips)).toEqual({});
    });
  });

  describe("getLastVisitDateByCountry", () => {
    it("returns the latest completed visit date per country", () => {
      const trips = [
        {
          ...mockTrips[0],
          endDate: "2020-01-01",
          countryCodes: ["US"],
        },
        {
          ...mockTrips[1],
          endDate: "2021-01-01",
          countryCodes: ["US"],
        },
        {
          ...mockTrips[2],
          endDate: "2022-01-01",
          countryCodes: ["US"],
        },
      ];

      const result = getLastVisitDateByCountry(trips);

      expect(result.US.getFullYear()).toBe(2021);
    });

    it("ignores missing dates, countries, and incomplete trips", () => {
      const trips = [
        { ...mockTrips[0], endDate: undefined },
        { ...mockTrips[1], countryCodes: [] },
        { ...mockTrips[2], endDate: "2021-01-01" },
      ];

      expect(getLastVisitDateByCountry(trips)).toEqual({});
    });
  });

  describe("getNextUpcomingTripYearByCountry", () => {
    it("returns the earliest upcoming year per country", () => {
      const now = new Date();
      const nextYear = now.getFullYear() + 1;

      const trips = [
        {
          ...mockTrips[0],
          endDate: `${nextYear + 2}-05-01`,
          countryCodes: ["US"],
        },
        {
          ...mockTrips[1],
          endDate: `${nextYear}-06-01`,
          countryCodes: ["US", "CA"],
        },
        {
          ...mockTrips[2],
          endDate: `${nextYear + 1}-07-01`,
          countryCodes: ["FR"],
        },
      ];

      expect(getNextUpcomingTripYearByCountry(trips)).toEqual({
        US: nextYear,
        CA: nextYear,
        FR: nextYear + 1,
      });
    });

    it("returns empty object when there are no upcoming trips", () => {
      expect(
        getNextUpcomingTripYearByCountry([
          { ...mockTrips[0], endDate: "2000-01-01" },
          { ...mockTrips[1], endDate: undefined },
          { ...mockTrips[2], endDate: "invalid" },
        ]),
      ).toEqual({});
    });

    it("ignores countries missing from countryCodes", () => {
      const year = new Date().getFullYear() + 1;

      expect(
        getNextUpcomingTripYearByCountry([
          { ...mockTrips[0], endDate: `${year}-01-01`, countryCodes: [] },
        ]),
      ).toEqual({});
    });
  });

  describe("buildVisitedYearMap", () => {
    it("maps countries to each year they were visited", () => {
      const trips = [
        {
          ...mockTrips[0],
          startDate: "2018-12-31",
          endDate: "2019-01-02",
          countryCodes: ["US"],
        },
        {
          ...mockTrips[1],
          startDate: "2019-05-01",
          endDate: "2020-05-01",
          countryCodes: ["US", "FR"],
        },
      ];

      const result = buildVisitedYearMap(trips);

      expect([...result.US]).toEqual([2018, 2019, 2020]);
      expect([...result.FR]).toEqual([2019, 2020]);
    });

    it("ignores incomplete trips and trips without dates", () => {
      const trips = [
        {
          ...mockTrips[0],
          startDate: undefined,
          endDate: undefined,
        },
        {
          ...mockTrips[1],
          startDate: "2099-06-10",
          endDate: "2099-06-20",
        },
      ];

      expect(buildVisitedYearMap(trips)).toEqual({});
    });
  });

  describe("computeVisitCountsFromYearMap", () => {
    const map = {
      US: new Set([2020, 2022, 2023]),
      FR: new Set([2023]),
    };

    it.each([
      [2023, undefined, { US: 3, FR: 1 }],
      [2022, undefined, { US: 2 }],
      [2023, [2022], { US: 1 }],
      [2023, [2099], {}],
    ])("computes counts for year %s", (year, years, expected) => {
      expect(
        computeVisitCountsFromYearMap(map, year, years as number[]),
      ).toEqual(expected);
    });

    it("returns empty object for an empty map", () => {
      expect(computeVisitCountsFromYearMap({}, 2023)).toEqual({});
    });
  });

  describe("buildVisitContext", () => {
    it("builds visit context using the selected year", () => {
      const result = buildVisitContext(mockTrips, 2023, homeCountry);

      expect(result.visitedIsoCodes).toEqual(
        expect.arrayContaining(["US", "CA", "FR", "DE", homeCountry]),
      );
      expect(result.visitedMap).toHaveProperty(homeCountry, 1);
      expect(result.visitedYearMap).toBeDefined();
      expect(result.firstVisitMap).toBeDefined();
      expect(result.lastVisitMap).toBeDefined();
    });

    it("uses the latest detected year capped at the current year", () => {
      const result = buildVisitContext(mockTrips);

      expect(result.visitedMap).toEqual(
        expect.objectContaining({
          US: 1,
          FR: 1,
          DE: 1,
          CA: 1,
        }),
      );
    });

    it("uses current year when there are no trips", () => {
      const result = buildVisitContext([]);

      expect(result.visitedIsoCodes).toEqual([]);
      expect(result.visitedMap).toEqual({});
    });
  });
});
