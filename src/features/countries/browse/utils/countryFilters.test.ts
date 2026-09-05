import { describe, expect, it, vi } from "vitest";
import { mockCountries } from "@test-utils/mockCountries";
import type { VisitContext } from "@features/visits/types";
import * as searchUtils from "@utils";
import {
  applyQualifierSearch,
  createSovereigntyFilter,
  filterCountries,
  filterCountriesByQualifier,
  getCountryCounts,
} from "./countryFilters";
import type { CountryFilterOptions, CountryModifiers } from "../types";

describe("countryFilters utils", () => {
  const countries = mockCountries;

  const fq = (
    qualifier: string,
    value: string,
    visitContext?: VisitContext,
    modifiers?: CountryModifiers,
  ) =>
    filterCountriesByQualifier(
      countries,
      qualifier,
      value,
      visitContext,
      modifiers,
    );

  const mkVC = ({
    iso = [],
    map = {},
    ymap = {},
    firstMap,
    lastMap,
  }: {
    iso?: string[];
    map?: Record<string, number>;
    ymap?: Record<string, Set<number>>;
    firstMap?: Record<string, Date>;
    lastMap?: Record<string, Date>;
  } = {}): VisitContext => ({
    visitedIsoCodes: iso,
    visitedMap: map,
    visitedYearMap: ymap,
    firstVisitMap: firstMap,
    lastVisitMap: lastMap,
  });

  const baseOptions: CountryFilterOptions = {
    search: "",
    selectedRegion: "",
    selectedSubregion: "",
    selectedSovereignty: "",
    modifiers: {},
  };

  const applySearch = (
    search: string,
    options: Partial<CountryFilterOptions> = {},
    layerCountries?: string[],
    visitedMap?: Record<string, number>,
    visitedYearMap?: Record<string, Set<number>>,
    wantToVisitCodes?: string[],
  ) =>
    applyQualifierSearch(
      countries,
      search,
      undefined,
      { ...baseOptions, search, ...options },
      layerCountries,
      visitedMap,
      visitedYearMap,
      wantToVisitCodes,
    );

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

    it("filters by layer countries", () => {
      expect(
        filterCountries(countries, {
          layerCountries: ["FR", "DE"],
        }),
      ).toEqual([countries[0], countries[2]]);
    });

    it("filters by island geo type", () => {
      expect(
        filterCountries(countries, {
          selectedGeoType: "Island",
        }),
      ).toEqual([countries[1], countries[5]]);
    });

    it("filters by landlocked geo type", () => {
      expect(
        filterCountries(countries, {
          selectedGeoType: "Landlocked",
        }),
      ).toEqual([countries[2]]);
    });

    it("filters by search and region together", () => {
      expect(
        filterCountries(countries, {
          search: "germany",
          selectedRegion: "Europe",
        }),
      ).toEqual([countries[2]]);
    });

    it("filters by altNames in search", () => {
      const withAltNames = [
        { ...countries[0], altNames: ["Testland"] },
        ...countries.slice(1),
      ];

      expect(
        filterCountries(withAltNames, {
          search: "Testland",
        }),
      ).toEqual([withAltNames[0]]);
    });

    it("handles transcontinental include", () => {
      expect(
        filterCountries(countries, {
          selectedRegion: "Europe",
          modifiers: {
            tc: "include",
          },
        }),
      ).toEqual([countries[0], countries[2]]);
    });

    it("handles transcontinental default", () => {
      expect(
        filterCountries(countries, {
          selectedRegion: "Europe",
          modifiers: {
            tc: "default",
          },
        }),
      ).toEqual([countries[0], countries[2]]);
    });

    it("filters to transcontinental countries with only", () => {
      expect(
        filterCountries(countries, {
          modifiers: {
            tc: "only",
          },
        }),
      ).toEqual([countries[4]]);
    });

    it("filters to contiguous transcontinental countries", () => {
      expect(
        filterCountries(countries, {
          modifiers: {
            tc: "only:contiguous",
          },
        }),
      ).toEqual([]);
    });

    it("filters to overseas transcontinental countries", () => {
      expect(
        filterCountries(countries, {
          modifiers: {
            tc: "only:overseas",
          },
        }),
      ).toEqual([countries[4]]);
    });

    it("applies visit modifiers", () => {
      const visitContext = mkVC({
        iso: ["FR"],
        map: { FR: 2 },
      });

      expect(
        filterCountries(
          countries,
          {
            modifiers: {
              count: {
                op: ">",
                value: 1,
              },
            },
          },
          visitContext,
        ),
      ).toEqual([countries[0]]);
    });

    it("returns no countries for an unmatched region", () => {
      expect(
        filterCountries(countries, {
          selectedRegion: "Oceania",
        }),
      ).toEqual([]);
    });

    it("returns no countries for an unmatched subregion", () => {
      expect(
        filterCountries(countries, {
          selectedSubregion: "Unknown",
        }),
      ).toEqual([]);
    });
  });

  describe("filterCountriesByQualifier", () => {
    it("filters by currency", () => {
      expect(fq("currency", "EUR")).toEqual([
        countries[0],
        countries[1],
        countries[2],
      ]);
    });

    it("filters currency case-insensitively", () => {
      expect(fq("currency", "eur")).toEqual([
        countries[0],
        countries[1],
        countries[2],
      ]);
    });

    it("filters by language", () => {
      expect(fq("language", "french")).toEqual([countries[0], countries[1]]);
    });

    it("filters language partially and case-insensitively", () => {
      expect(fq("language", "fren")).toEqual([countries[0], countries[1]]);
    });

    it("filters by calling code", () => {
      expect(fq("callingcode", "+1")).toEqual([countries[3], countries[4]]);
    });

    it("filters by region", () => {
      expect(fq("region", "europe")).toEqual([countries[0], countries[2]]);
    });

    it("filters by capital", () => {
      expect(fq("capital", "paris")).toEqual([countries[0]]);
    });

    it("filters by subregion", () => {
      expect(fq("subregion", "caribbean")).toEqual([countries[1]]);
    });

    it("filters by sovereignty", () => {
      expect(fq("sovereignty", "dependency")).toEqual([countries[1]]);
    });

    it("filters by ISO code", () => {
      expect(fq("isocode", "FR")).toEqual([countries[0]]);
    });

    it("returns empty for an unknown qualifier", () => {
      expect(fq("unknown", "value")).toEqual([]);
    });

    it("applies transcontinental modifiers", () => {
      expect(fq("region", "europe", undefined, { tc: "include" })).toEqual([
        countries[0],
        countries[2],
      ]);

      expect(fq("region", "europe", undefined, { tc: "default" })).toEqual([
        countries[0],
        countries[2],
      ]);
    });

    it("applies visit count modifiers", () => {
      const visitContext = mkVC({
        iso: ["FR"],
        map: { FR: 2 },
      });

      expect(
        fq("region", "europe", visitContext, {
          count: {
            op: ">",
            value: 0,
          },
        }),
      ).toEqual([countries[0]]);
    });

    it("filters population with greater-than comparator", () => {
      const selected = [countries[1], countries[2], countries[5]];

      expect(
        filterCountriesByQualifier(selected, "population", ">10000"),
      ).toEqual([countries[5]]);
    });

    it("filters population with equality comparator", () => {
      const selected = [countries[1], countries[2], countries[5]];

      expect(
        filterCountriesByQualifier(selected, "population", "=8300"),
      ).toEqual([countries[2]]);
    });

    it("filters population with less-than comparator", () => {
      const selected = [countries[1], countries[2], countries[5]];

      expect(
        filterCountriesByQualifier(selected, "population", "<2000"),
      ).toEqual([countries[1]]);
    });

    it("filters population with approximate comparator", () => {
      const selected = [countries[1], countries[2], countries[5]];

      expect(
        filterCountriesByQualifier(selected, "population", "~12600"),
      ).toEqual([countries[5]]);
    });

    it("filters area with approximate comparator", () => {
      const selected = [countries[0], countries[2], countries[4]];

      expect(filterCountriesByQualifier(selected, "area", "~357000")).toEqual([
        countries[2],
      ]);
    });

    it("returns no results for an invalid numeric comparator", () => {
      expect(
        filterCountriesByQualifier(countries, "population", "invalid"),
      ).toEqual([]);
    });

    it("uses the configured match modifier", () => {
      expect(
        filterCountriesByQualifier(countries, "capital", "par", undefined, {
          match: "prefix",
        }),
      ).toEqual([countries[0]]);
    });
  });

  describe("applyQualifierSearch", () => {
    it("applies a qualifier query", () => {
      expect(applySearch("currency:EUR")).toEqual([
        countries[0],
        countries[1],
        countries[2],
      ]);
    });

    it("applies normal search with layer filtering", () => {
      expect(applySearch("germany", {}, ["DE"])).toEqual([countries[2]]);
    });

    it("handles a qualifier with an empty query", () => {
      expect(applySearch("isocode:", {}, ["FR", "DE"])).toEqual([
        countries[0],
        countries[2],
      ]);
    });

    it("applies additional qualifier filters", () => {
      expect(applySearch("region:europe subregion:Western")).toEqual([
        countries[0],
        countries[2],
      ]);
    });

    it("skips known modifier keys", () => {
      expect(applySearch("region:europe tc:include")).toEqual([
        countries[0],
        countries[2],
      ]);
    });

    it("applies additional qualifier filters such as sovereignty", () => {
      expect(
        applySearch("sovereignty:Dependency of:FR").map(
          (country) => country.isoCode,
        ),
      ).toContain("GP");
    });

    it("ignores unknown additional qualifiers", () => {
      expect(applySearch("region:europe foobar:xyz")).toEqual([
        countries[0],
        countries[2],
      ]);
    });

    it("ignores additional qualifiers with empty values", () => {
      const spy = vi
        .spyOn(searchUtils, "parseQualifierSearch")
        .mockReturnValue({
          qualifier: "region",
          query: "europe",
          modifiers: {
            subregion: "",
          },
        });

      try {
        expect(applySearch("ignored")).toEqual([countries[0], countries[2]]);
      } finally {
        spy.mockRestore();
      }
    });

    it("skips the primary qualifier when repeated as a modifier", () => {
      const spy = vi
        .spyOn(searchUtils, "parseQualifierSearch")
        .mockReturnValue({
          qualifier: "region",
          query: "europe",
          modifiers: {
            region: "europe",
          },
        });

      try {
        expect(applySearch("ignored")).toEqual([countries[0], countries[2]]);
      } finally {
        spy.mockRestore();
      }
    });

    it("handles boolean modifier values", () => {
      const spy = vi
        .spyOn(searchUtils, "parseQualifierSearch")
        .mockReturnValue({
          qualifier: "region",
          query: "europe",
          modifiers: {
            tc: true,
          },
        });

      try {
        expect(applySearch("ignored")).toEqual([countries[0], countries[2]]);
      } finally {
        spy.mockRestore();
      }
    });

    it("uses visitedMap when visitedIsoCodes is unavailable", () => {
      expect(applySearch("visited:true", {}, undefined, { FR: 1 })).toEqual([
        countries[0],
      ]);
    });

    it("accepts visitedYearMap", () => {
      expect(
        applySearch("region:europe", {}, undefined, undefined, {
          FR: new Set([2020]),
        }),
      ).toEqual([countries[0], countries[2]]);
    });

    it("accepts wantToVisitCodes", () => {
      expect(
        applySearch("region:europe", {}, undefined, undefined, undefined, [
          "FR",
        ]),
      ).toEqual([countries[0], countries[2]]);
    });

    it("uses explicitly supplied visitedIsoCodes", () => {
      expect(
        applyQualifierSearch(
          countries,
          "visited:true",
          ["FR"],
          baseOptions,
          undefined,
        ),
      ).toEqual([countries[0]]);
    });

    it("falls back when parsing returns null", () => {
      const spy = vi
        .spyOn(searchUtils, "parseQualifierSearch")
        .mockReturnValue(null);

      try {
        expect(applySearch("germany")).toEqual([countries[2]]);
      } finally {
        spy.mockRestore();
      }
    });

    it("handles a colon search with an empty trailing value", () => {
      const spy = vi
        .spyOn(searchUtils, "parseQualifierSearch")
        .mockReturnValue(null);

      try {
        expect(applySearch("isocode:")).toEqual(countries);
      } finally {
        spy.mockRestore();
      }
    });

    it("falls through for a colon search with a non-empty value", () => {
      const spy = vi
        .spyOn(searchUtils, "parseQualifierSearch")
        .mockReturnValue(null);

      try {
        expect(applySearch("germany:test")).toEqual([]);
      } finally {
        spy.mockRestore();
      }
    });

    it("merges parsed modifiers with existing filter modifiers", () => {
      expect(
        applySearch("region:europe tc:include", {
          modifiers: {
            match: "substring",
          },
        }),
      ).toEqual([countries[0], countries[2]]);
    });
  });

  describe("getCountryCounts", () => {
    it("returns all category counts", () => {
      const counts = getCountryCounts({
        filteredCountries: countries,
        visitedIsoCodes: ["FR", "GP"],
        wantToVisitIsoCodes: ["DE", "GP"],
      });

      expect(counts).toEqual({
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
    it("returns all countries when undefined", () => {
      expect(mockCountries.filter(createSovereigntyFilter())).toEqual(
        mockCountries,
      );
    });

    it("returns all countries when false", () => {
      expect(mockCountries.filter(createSovereigntyFilter(false))).toEqual(
        mockCountries,
      );
    });

    it("returns only sovereign countries when true", () => {
      expect(mockCountries.filter(createSovereigntyFilter(true))).toEqual(
        mockCountries.filter(
          (country) => country.sovereigntyStatus === "sovereign",
        ),
      );
    });
  });

  describe("visit modifiers", () => {
    const visitedMap: Record<string, number> = {
      FR: 2,
      DE: 1,
    };

    const visitedIsoCodes = Object.keys(visitedMap);

    const visitedYearMap: Record<string, Set<number>> = {
      FR: new Set([2019, 2020]),
      DE: new Set([2018]),
      GP: new Set(),
    };

    it("filters visits by count", () => {
      const context = mkVC({
        iso: visitedIsoCodes,
        map: visitedMap,
      });

      expect(
        fq("visited", "", context, {
          count: {
            op: ">",
            value: 1,
          },
        }),
      ).toEqual([countries[0]]);

      expect(
        fq("visited", "", context, {
          count: {
            op: "=",
            value: 0,
          },
        })
          .map((country) => country.isoCode)
          .sort(),
      ).toEqual(["CA", "GP", "JP", "US"]);
    });

    it("filters visits by year equality", () => {
      const context = mkVC({
        ymap: visitedYearMap,
      });

      expect(
        fq("visited", "", context, {
          year: {
            op: "=",
            year: 2020,
          },
        }),
      ).toEqual([countries[0]]);
    });

    it("filters visits by first year", () => {
      const context = mkVC({
        ymap: visitedYearMap,
      });

      expect(
        fq("visited", "", context, {
          first: {
            op: "=",
            year: 2018,
          },
        }),
      ).toEqual([countries[2]]);

      expect(
        fq("visited", "", context, {
          first: {
            op: "<",
            year: 2019,
          },
        }),
      ).toEqual([countries[2]]);
    });

    it("filters visits by last year", () => {
      const context = mkVC({
        ymap: visitedYearMap,
      });

      expect(
        fq("visited", "", context, {
          last: {
            op: "=",
            year: 2020,
          },
        }),
      ).toEqual([countries[0]]);

      expect(
        fq("visited", "", context, {
          last: {
            op: ">",
            year: 2019,
          },
        }),
      ).toEqual([countries[0]]);

      expect(
        fq("visited", "", context, {
          last: {
            op: "<",
            year: 2019,
          },
        }),
      ).toEqual([countries[2]]);
    });

    it("uses firstVisitMap when available", () => {
      const context = mkVC({
        ymap: visitedYearMap,
        firstMap: {
          FR: new Date("2022-05-01"),
        },
      });

      expect(
        fq("visited", "", context, {
          first: {
            op: "=",
            year: 2022,
          },
        }),
      ).toEqual([countries[0]]);
    });

    it("uses lastVisitMap when available", () => {
      const context = mkVC({
        ymap: visitedYearMap,
        lastMap: {
          FR: new Date("2023-05-01"),
        },
      });

      expect(
        fq("visited", "", context, {
          last: {
            op: "=",
            year: 2023,
          },
        }),
      ).toEqual([countries[0]]);
    });

    it("returns no matches when there is no first visit", () => {
      const context = mkVC({
        ymap: {},
      });

      expect(
        fq("visited", "", context, {
          first: {
            op: "=",
            year: 2020,
          },
        }),
      ).toEqual([]);
    });

    it("returns no matches when there is no last visit", () => {
      const context = mkVC({
        ymap: {},
      });

      expect(
        fq("visited", "", context, {
          last: {
            op: "=",
            year: 2020,
          },
        }),
      ).toEqual([]);
    });
  });
});
