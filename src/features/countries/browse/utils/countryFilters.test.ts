import { describe, expect, it } from "vitest";
import { mockCountries } from "@test-utils/mockCountries";
import type { VisitContext } from "@features/visits/types";
import {
  createSovereigntyFilter,
  filterCountries,
  getCountryCounts,
} from "./countryFilters";

describe("countryFilters utils", () => {
  const countries = mockCountries;

  const mkVC = ({
    iso = [],
    map = {},
    ymap = {},
    firstMap,
    lastMap,
    wantToVisitIsoCodes,
  }: {
    iso?: string[];
    map?: Record<string, number>;
    ymap?: Record<string, Set<number>>;
    firstMap?: Record<string, Date>;
    lastMap?: Record<string, Date>;
    wantToVisitIsoCodes?: string[];
  } = {}): VisitContext => ({
    visitedIsoCodes: iso,
    visitedMap: map,
    visitedYearMap: ymap,
    firstVisitMap: firstMap,
    lastVisitMap: lastMap,
    wantToVisitIsoCodes,
  });

  describe("filterCountries", () => {
    it("filters by region", () => {
      expect(
        filterCountries(countries, {
          selectedRegion: "Europe",
        }),
      ).toEqual([countries[0], countries[2]]);
    });

    it("filters by subregion", () => {
      expect(
        filterCountries(countries, {
          selectedSubregion: "Caribbean",
        }),
      ).toEqual([countries[1]]);
    });

    it("filters by sovereignty", () => {
      expect(
        filterCountries(countries, {
          selectedSovereignty: "dependency",
        }),
      ).toEqual([countries[1]]);
    });

    it("filters by geo type", () => {
      expect(
        filterCountries(countries, {
          selectedGeoType: "Island",
        }),
      ).toEqual([countries[1], countries[5]]);

      expect(
        filterCountries(countries, {
          selectedGeoType: "Landlocked",
        }),
      ).toEqual([countries[2]]);
    });

    it("filters by layer countries", () => {
      expect(
        filterCountries(countries, {
          layerCountries: ["FR", "DE"],
        }),
      ).toEqual([countries[0], countries[2]]);
    });

    it("combines text search with filters", () => {
      expect(
        filterCountries(countries, {
          search: "germany",
          selectedRegion: "Europe",
        }),
      ).toEqual([countries[2]]);
    });

    it("searches alternative names", () => {
      const withAltNames = [
        { ...countries[0], altNames: ["Testland"] },
        ...countries.slice(1),
      ];

      expect(filterCountries(withAltNames, { search: "Testland" })).toEqual([
        withAltNames[0],
      ]);
    });

    it("matches region and subregion through qualifier tokens", () => {
      const regionFallback = {
        ...countries[0],
        regionKey: "other",
      };

      const subregionFallback = {
        ...countries[1],
        subregionKey: "other",
      };

      expect(
        filterCountries([regionFallback], {
          selectedRegion: "Europe",
        }),
      ).toEqual([regionFallback]);

      expect(
        filterCountries([subregionFallback], {
          selectedSubregion: "Caribbean",
        }),
      ).toEqual([subregionFallback]);
    });

    it("filters by visit modifiers", () => {
      expect(
        filterCountries(
          countries,
          {
            modifiers: {
              count: { op: ">", value: 1 },
            },
          },
          mkVC({ iso: ["FR"], map: { FR: 2 } }),
        ),
      ).toEqual([countries[0]]);
    });

    it("returns no results for unmatched filters", () => {
      expect(
        filterCountries(countries, {
          selectedRegion: "Oceania",
        }),
      ).toEqual([]);

      expect(
        filterCountries(countries, {
          selectedSubregion: "Unknown",
        }),
      ).toEqual([]);
    });
  });

  describe("getCountryCounts", () => {
    it("returns category counts", () => {
      expect(
        getCountryCounts({
          filteredCountries: countries,
          visitedIsoCodes: ["FR", "GP"],
          wantToVisitIsoCodes: ["DE", "GP"],
        }),
      ).toEqual({
        allCount: countries.length,
        sovereignCount: countries.filter(
          (country) => country.sovereigntyStatus === "sovereign",
        ).length,
        visitedCount: countries.filter((country) =>
          ["FR", "GP"].includes(country.isoCode),
        ).length,
        wantToVisitCount: countries.filter((country) =>
          ["DE", "GP"].includes(country.isoCode),
        ).length,
      });
    });

    it("returns zero counts for empty arrays", () => {
      expect(
        getCountryCounts({
          filteredCountries: [],
          visitedIsoCodes: [],
          wantToVisitIsoCodes: [],
        }),
      ).toEqual({
        allCount: 0,
        sovereignCount: 0,
        visitedCount: 0,
        wantToVisitCount: 0,
      });
    });
  });

  describe("createSovereigntyFilter", () => {
    it.each([
      [undefined, countries],
      [false, countries],
      [
        true,
        countries.filter(
          (country) => country.sovereigntyStatus === "sovereign",
        ),
      ],
    ])("filters with sovereignOnly=%s", (sovereignOnly, expected) => {
      expect(countries.filter(createSovereigntyFilter(sovereignOnly))).toEqual(
        expected,
      );
    });
  });

  describe("visit modifiers", () => {
    const visitedMap = { FR: 2, DE: 1 };
    const visitedYearMap = {
      FR: new Set([2019, 2020]),
      DE: new Set([2018]),
      GP: new Set<number>(),
    };

    it("filters by visit count and year", () => {
      const context = mkVC({
        iso: Object.keys(visitedMap),
        map: visitedMap,
        ymap: visitedYearMap,
      });

      expect(
        filterCountries(
          countries,
          {
            modifiers: {
              count: { op: ">", value: 1 },
            },
          },
          context,
        ),
      ).toEqual([countries[0]]);

      expect(
        filterCountries(
          countries,
          {
            modifiers: {
              year: { op: "=", year: 2020 },
            },
          },
          context,
        ),
      ).toEqual([countries[0]]);
    });

    it("filters by first and last visit year", () => {
      const context = mkVC({
        ymap: visitedYearMap,
      });

      expect(
        filterCountries(
          countries,
          {
            modifiers: {
              first: { op: "=", year: 2018 },
            },
          },
          context,
        ),
      ).toEqual([countries[2]]);

      expect(
        filterCountries(
          countries,
          {
            modifiers: {
              last: { op: "=", year: 2020 },
            },
          },
          context,
        ),
      ).toEqual([countries[0]]);
    });

    it("uses explicit first and last visit maps", () => {
      const context = mkVC({
        ymap: visitedYearMap,
        firstMap: { FR: new Date("2022-05-01") },
        lastMap: { FR: new Date("2023-05-01") },
      });

      expect(
        filterCountries(
          countries,
          {
            modifiers: {
              first: { op: "=", year: 2022 },
            },
          },
          context,
        ),
      ).toEqual([countries[0]]);

      expect(
        filterCountries(
          countries,
          {
            modifiers: {
              last: { op: "=", year: 2023 },
            },
          },
          context,
        ),
      ).toEqual([countries[0]]);
    });
  });
});
