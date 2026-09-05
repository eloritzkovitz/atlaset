import { describe, expect, it } from "vitest";
import { mockCountries } from "@test-utils/mockCountries";
import type { Country } from "@features/countries/types";
import type { VisitContext } from "@features/visits/types";
import type { CountryModifiers } from "../types";
import {
  normalizeModifiers,
  ensureModifiers,
  parseTCOption,
  matchesTranscontinental,
  applyModifiersToCountry,
} from "./countryModifiers";

describe("countryModifiers", () => {
  const country = mockCountries[0];

  const vc = (overrides: Partial<VisitContext> = {}): VisitContext => ({
    visitedIsoCodes: [],
    visitedMap: {},
    visitedYearMap: {},
    ...overrides,
  });

  describe("normalizeModifiers", () => {
    it("normalizes comparator modifiers", () => {
      expect(
        normalizeModifiers({
          count: ">2",
          year: ">=2020",
          first: "=1990",
          last: "<=2010",
        }),
      ).toEqual({
        count: { op: ">", value: 2 },
        year: { op: ">=", year: 2020 },
        first: { op: "=", year: 1990 },
        last: { op: "<=", year: 2010 },
      });
    });

    it("handles missing and invalid modifiers", () => {
      expect(normalizeModifiers()).toEqual({});

      expect(normalizeModifiers({})).toEqual({
        count: undefined,
        year: undefined,
        first: undefined,
        last: undefined,
      });

      expect(
        normalizeModifiers({
          count: "invalid",
          year: "invalid",
          first: "invalid",
          last: "invalid",
        }),
      ).toEqual({
        count: undefined,
        year: undefined,
        first: undefined,
        last: undefined,
      });
    });

    it("normalizes match modifiers", () => {
      expect(normalizeModifiers({ match: " exact " }).match).toBe("exact");
      expect(normalizeModifiers({ match: "" }).match).toBeUndefined();
    });

    it("normalizes dst modifiers", () => {
      expect(normalizeModifiers({ dst: true }).dst).toBe(true);
      expect(normalizeModifiers({ dst: false }).dst).toBe(false);

      for (const value of ["true", "yes", "1"]) {
        expect(normalizeModifiers({ dst: value }).dst).toBe(true);
      }

      for (const value of ["false", "no", "0"]) {
        expect(normalizeModifiers({ dst: value }).dst).toBe(false);
      }

      expect(normalizeModifiers({ dst: "maybe" }).dst).toBe("maybe");
    });

    it("preserves tc values", () => {
      expect(normalizeModifiers({ tc: "europe" }).tc).toBe("europe");
    });
  });

  describe("ensureModifiers", () => {
    it("returns an empty object for undefined", () => {
      expect(ensureModifiers(undefined)).toEqual({});
    });

    it("returns structured modifiers unchanged", () => {
      const modifiers: CountryModifiers = {
        count: { op: ">", value: 1 },
      };

      expect(ensureModifiers(modifiers)).toBe(modifiers);
    });

    it("normalizes raw modifiers", () => {
      expect(
        ensureModifiers({
          count: ">1",
          year: ">=2020",
        }),
      ).toEqual({
        count: { op: ">", value: 1 },
        year: { op: ">=", year: 2020 },
        first: undefined,
        last: undefined,
      });
    });
  });

  describe("parseTCOption", () => {
    it.each([
      ["true", { mode: "default" }],
      ["false", { mode: "default" }],
      ["contiguous", { scope: "contiguous", mode: "default" }],
      ["overseas", { scope: "overseas", mode: "default" }],
      ["cultural", { scope: "cultural", mode: "default" }],
      ["other", { scope: "other", mode: "default" }],
      ["all", { scope: "all", mode: "default" }],
      ["bogus", { mode: "default" }],
      ["only", { scope: "all", mode: "only" }],
      ["include", { scope: "all", mode: "include" }],
      ["include:contiguous", { scope: "contiguous", mode: "include" }],
      ["contiguous:include", { scope: "contiguous", mode: "include" }],
      ["only:overseas", { scope: "overseas", mode: "only" }],
      ["", { mode: "default" }],
      [undefined, { mode: "default" }],
    ] as const)("parses %s", (input, expected) => {
      expect(parseTCOption(input)).toEqual(expected);
    });

    it("trims, lowercases, and ignores empty tokens", () => {
      expect(parseTCOption(" INCLUDE :: CONTIGUOUS ")).toEqual({
        scope: "contiguous",
        mode: "include",
      });
    });
  });

  describe("matchesTranscontinental", () => {
    const overseas: Country = {
      ...country,
      isoCode: "US",
      transcontinental: {
        scope: "overseas",
        additionalRegion: "Americas",
      },
    };

    const contiguous: Country = {
      ...country,
      isoCode: "AZ",
      transcontinental: {
        scope: "contiguous",
        additionalRegion: "Asia",
      },
    };

    const noEntry: Country = {
      ...country,
      isoCode: "XX",
      transcontinental: undefined,
    };

    it("returns false without a scope or transcontinental data", () => {
      expect(matchesTranscontinental(overseas, undefined)).toBe(false);
      expect(matchesTranscontinental(noEntry, "all")).toBe(false);
    });

    it("matches all transcontinental entries", () => {
      expect(matchesTranscontinental(overseas, "all")).toBe(true);
    });

    it("matches the requested scope", () => {
      expect(matchesTranscontinental(overseas, "overseas")).toBe(true);
      expect(matchesTranscontinental(contiguous, "contiguous")).toBe(true);
    });

    it("rejects a different scope", () => {
      expect(matchesTranscontinental(overseas, "contiguous")).toBe(false);
    });

    it("defaults a missing scope to contiguous", () => {
      const entryWithoutScope: Country = {
        ...country,
        isoCode: "YY",
        transcontinental: {
          additionalRegion: "Asia",
        },
      };

      expect(matchesTranscontinental(entryWithoutScope, "contiguous")).toBe(
        true,
      );
    });
  });

  describe("applyModifiersToCountry", () => {
    it("returns true without modifiers", () => {
      expect(applyModifiersToCountry(country, {})).toBe(true);
    });

    it.each([
      [{ count: { op: ">", value: 1 } }, { visitedMap: { CC: 2 } }, true],
      [{ count: { op: ">=", value: 3 } }, { visitedMap: { CC: 2 } }, false],
      [{ count: { op: ">=", value: 1 } }, { visitedMap: { CD: 1 } }, true],
      [{ count: { op: ">", value: 1 } }, { visitedMap: { CD: 1 } }, false],
    ] as const)("applies count modifier", (mod, context, expected) => {
      const isoCode = "CC" in context.visitedMap ? "CC" : "CD";

      expect(
        applyModifiersToCountry({ ...country, isoCode }, mod, vc(context)),
      ).toBe(expected);
    });

    it.each([
      [
        "matching year",
        { year: { op: "=", year: 2020 } },
        { visitedYearMap: { YY: new Set([2020]) } },
        true,
      ],
      [
        "non-matching year",
        { year: { op: "=", year: 2020 } },
        { visitedYearMap: { YY: new Set([2019]) } },
        false,
      ],
      [
        "successful year comparison",
        { year: { op: ">", year: 2019 } },
        { visitedYearMap: { YY: new Set([2020]) } },
        true,
      ],
      [
        "failed year comparison",
        { year: { op: ">", year: 2020 } },
        { visitedYearMap: { YY: new Set([2020]) } },
        false,
      ],
      [
        "year comparison without visit data",
        { year: { op: ">", year: 2000 } },
        {},
        false,
      ],
    ] as const)("handles %s", (_, mod, context, expected) => {
      expect(
        applyModifiersToCountry(
          { ...country, isoCode: "YY" },
          mod,
          vc(context),
        ),
      ).toBe(expected);
    });

    it.each([
      ["first", { op: "=", year: 1990 }, true],
      ["first", { op: "<", year: 2000 }, true],
      ["first", { op: ">", year: 1990 }, false],
      ["last", { op: "=", year: 2010 }, true],
      ["last", { op: "<", year: 2020 }, true],
      ["last", { op: ">", year: 2010 }, false],
    ] as const)("%s modifier comparison", (type, comparator, expected) => {
      const modifiers: CountryModifiers =
        type === "first" ? { first: comparator } : { last: comparator };

      expect(
        applyModifiersToCountry(
          { ...country, isoCode: "FG" },
          modifiers,
          vc({
            firstVisitMap: { FG: new Date("1990-01-01") },
            lastVisitMap: { FG: new Date("2010-01-01") },
          }),
        ),
      ).toBe(expected);
    });

    it.each([
      ["first", { first: { op: "=", year: 1990 } }],
      ["last", { last: { op: "=", year: 2010 } }],
    ] as const)("rejects %s without visit data", (_, modifiers) => {
      expect(
        applyModifiersToCountry({ ...country, isoCode: "FG" }, modifiers, vc()),
      ).toBe(false);
    });

    it("falls back to visitedYearMap for first and last", () => {
      const context = vc({
        visitedYearMap: { FG: new Set([1990, 2010]) },
      });

      expect(
        applyModifiersToCountry(
          { ...country, isoCode: "FG" },
          { first: { op: "=", year: 1990 } },
          context,
        ),
      ).toBe(true);

      expect(
        applyModifiersToCountry(
          { ...country, isoCode: "FG" },
          { last: { op: "=", year: 2010 } },
          context,
        ),
      ).toBe(true);
    });

    it("applies multiple modifiers together", () => {
      expect(
        applyModifiersToCountry(
          { ...country, isoCode: "FG" },
          {
            count: { op: ">=", value: 2 },
            first: { op: "=", year: 1990 },
            last: { op: "=", year: 2010 },
          },
          vc({
            visitedMap: { FG: 2 },
            firstVisitMap: { FG: new Date("1990-01-01") },
            lastVisitMap: { FG: new Date("2010-01-01") },
          }),
        ),
      ).toBe(true);
    });
  });
});
