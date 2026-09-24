import { describe, expect, it } from "vitest";
import { mockCountries } from "@test-utils/mockCountries";
import type { VisitContext } from "@features/visits/types";
import {
  applyQualifierSearch,
  filterCountriesByQualifier,
} from "./countrySearchExpression";
import type { CountryFilterOptions, CountryQualifierOptions } from "../types";

describe("countrySearchExpression utils", () => {
  const countries = mockCountries;

  const fq = (
    qualifier: string,
    value: string,
    visitContext?: VisitContext,
    modifiers?: CountryQualifierOptions,
  ) =>
    filterCountriesByQualifier(
      countries,
      qualifier,
      value,
      visitContext,
      modifiers,
    );

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

  describe("filterCountriesByQualifier", () => {
    it.each([
      ["currency", "EUR", [countries[0], countries[1], countries[2]]],
      ["language", "french", [countries[0], countries[1]]],
      ["region", "europe", [countries[0], countries[2]]],
      ["capital", "paris", [countries[0]]],
      ["subregion", "caribbean", [countries[1]]],
      ["sovereignty", "dependency", [countries[1]]],
      ["isocode", "FR", [countries[0]]],
      ["callingcode", "+1", [countries[3], countries[4]]],
    ] as const)("filters by %s", (qualifier, value, expected) => {
      expect(fq(qualifier, value)).toEqual(expected);
    });

    it("returns no results for unknown qualifiers", () => {
      expect(fq("unknown", "value")).toEqual([]);
    });

    it("handles transcontinental options", () => {
      expect(fq("tc", "all")).toEqual([countries[4]]);
      expect(fq("tc", "overseas")).toEqual([countries[4]]);
      expect(fq("tc", "contiguous")).toEqual([]);

      expect(
        fq("region", "europe", undefined, {
          tcOption: { scope: "all", mode: "include" },
        }),
      ).toEqual([countries[0], countries[2]]);
    });

    it("filters numeric qualifiers", () => {
      expect(
        filterCountriesByQualifier(
          [countries[1], countries[2], countries[5]],
          "population",
          ">10000",
        ),
      ).toEqual([countries[5]]);

      expect(
        filterCountriesByQualifier(
          [countries[1], countries[2], countries[5]],
          "population",
          "=8300",
        ),
      ).toEqual([countries[2]]);

      expect(
        filterCountriesByQualifier(
          [countries[1], countries[2], countries[5]],
          "population",
          "<2000",
        ),
      ).toEqual([countries[1]]);

      expect(
        filterCountriesByQualifier(
          [countries[1], countries[2], countries[5]],
          "population",
          "~12600",
        ),
      ).toEqual([countries[5]]);

      expect(
        filterCountriesByQualifier(
          [countries[0], countries[2], countries[4]],
          "area",
          "~357000",
        ),
      ).toEqual([countries[2]]);
    });

    it("rejects invalid and missing numeric values", () => {
      expect(fq("population", "invalid")).toEqual([]);

      expect(
        filterCountriesByQualifier(
          [{ ...countries[0], population: undefined as unknown as number }],
          "population",
          ">1000",
        ),
      ).toEqual([]);

      expect(
        filterCountriesByQualifier(
          [{ ...countries[0], population: null as unknown as number }],
          "population",
          ">1000",
        ),
      ).toEqual([]);

      expect(
        filterCountriesByQualifier(
          [{ ...countries[0], population: "invalid" as unknown as number }],
          "population",
          ">1000",
        ),
      ).toEqual([]);
    });

    it("handles sovereignty values", () => {
      expect(fq("sovereignty", "DEPENDENCY")).toEqual([countries[1]]);
      expect(fq("sovereignty", "unknown")).toEqual([]);

      expect(
        filterCountriesByQualifier(
          [{ ...countries[0], sovereigntyStatus: undefined }],
          "sovereignty",
          "sovereign",
        ),
      ).toEqual([]);
    });

    it("uses match and timezone options", () => {
      expect(fq("capital", "par", undefined, { match: "prefix" })).toEqual([
        countries[0],
      ]);

      expect(
        fq("region", "europe", undefined, {
          tcOption: { scope: "contiguous", mode: "only" },
        }),
      ).toEqual([countries[0], countries[2]]);

      expect(fq("timezone", "UTC+1", undefined, { dst: true })).toEqual(
        expect.any(Array),
      );
    });

    it("uses visit context for tracking qualifiers", () => {
      const context: VisitContext = {
        visitedMap: { FR: 2, DE: 1 },
        visitedYearMap: {
          FR: new Set([2019, 2020]),
          DE: new Set([2018]),
          GP: new Set(),
        },
        visitedIsoCodes: ["FR"],
        wantToVisitIsoCodes: ["DE"],
      };

      expect(fq("visited", "true", context)).toEqual([countries[0]]);
      expect(fq("wanttovisit", "true", context)).toEqual([countries[2]]);
    });
  });

  describe("applyQualifierSearch", () => {
    it("applies qualifiers and implicit AND", () => {
      expect(applySearch("currency:EUR")).toEqual([
        countries[0],
        countries[1],
        countries[2],
      ]);

      expect(applySearch("region:europe subregion:Western")).toEqual([
        countries[0],
        countries[2],
      ]);
    });

    it("applies Boolean expressions", () => {
      expect(applySearch("region:europe OR region:asia")).toEqual([
        countries[0],
        countries[2],
        countries[5],
      ]);

      expect(applySearch("NOT visited:true", {}, undefined, { FR: 1 })).toEqual(
        countries.filter(({ isoCode }) => isoCode !== "FR"),
      );

      expect(
        applySearch("(region:europe OR region:asia) AND currency:EUR"),
      ).toEqual([countries[0], countries[2]]);

      // Exercises OR de-duplication.
      expect(applySearch("region:europe OR currency:EUR")).toEqual([
        countries[0],
        countries[2],
        countries[1],
      ]);
    });

    it("applies and merges modifiers", () => {
      expect(applySearch("region:europe match:substring")).toEqual([
        countries[0],
        countries[2],
      ]);

      expect(
        applySearch("region:europe", {
          modifiers: { match: "substring" },
        }),
      ).toEqual([countries[0], countries[2]]);

      expect(applySearch("visited:true", {}, undefined, { FR: 1 })).toEqual([
        countries[0],
      ]);
    });

    it("applies transcontinental options", () => {
      expect(applySearch("tc:all")).toEqual([countries[4]]);
      expect(applySearch("tc:overseas")).toEqual([countries[4]]);
      expect(applySearch("tc:overseas:exclude")).toEqual(
        countries.filter(({ isoCode }) => isoCode !== countries[4].isoCode),
      );

      expect(applySearch("region:europe tc:all:include")).toEqual([
        countries[0],
        countries[2],
      ]);
    });

    it("builds visit context from all sources", () => {
      expect(
        applySearch("region:europe", {}, undefined, undefined, {
          FR: new Set([2020]),
        }),
      ).toEqual([countries[0], countries[2]]);

      expect(
        applySearch("region:europe", {}, undefined, undefined, undefined, [
          "FR",
        ]),
      ).toEqual([countries[0], countries[2]]);

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

    it("handles empty and colon-containing values", () => {
      expect(applySearch("isocode:", {}, ["FR", "DE"])).toEqual([
        countries[0],
        countries[2],
      ]);

      expect(applySearch("isocode:")).toEqual(countries);

      expect(
        applySearch("sovereignty:Dependency of:FR").map(
          ({ isoCode }) => isoCode,
        ),
      ).toContain("GP");
    });

    it("ignores unknown qualifiers", () => {
      expect(applySearch("region:europe foobar:xyz")).toEqual([
        countries[0],
        countries[2],
      ]);

      expect(applySearch("foobar:xyz")).toEqual([]);
    });

    it("falls back to normal search", () => {
      expect(applySearch("germany")).toEqual([countries[2]]);
      expect(applySearch("germany:test")).toEqual([]);
      expect(applySearch("germany", {}, ["DE"])).toEqual([countries[2]]);
      expect(applySearch("germany", {}, ["FR"])).toEqual([]);
    });
  });
});
