import { describe, expect, it } from "vitest";
import type { VisitContext } from "@features/visits/types";
import { mockCountries } from "@test-utils/mockCountries";
import type { CountryModifiers, CountryVisitModifiers } from "../types";
import {
  applyVisitModifiersToCountry,
  ensureModifiers,
  normalizeModifiers,
} from "./countryModifiers";

describe("countryModifiers", () => {
  describe("normalizeModifiers", () => {
    it("normalizes comparator modifiers", () => {
      expect(
        normalizeModifiers({
          count: ">2",
          year: ">=2020",
          first: "=1990",
          last: "<=2010",
          match: " exact ",
          dst: "yes",
        }),
      ).toEqual({
        count: { op: ">", value: 2 },
        year: { op: ">=", year: 2020 },
        first: { op: "=", year: 1990 },
        last: { op: "<=", year: 2010 },
        match: "exact",
        dst: true,
      });
    });

    it("normalizes DST values", () => {
      const cases = [
        [true, true],
        [false, false],
        ["true", true],
        ["yes", true],
        ["1", true],
        ["false", false],
        ["no", false],
        ["0", false],
        ["maybe", "maybe"],
      ] as const;

      for (const [input, expected] of cases) {
        expect(normalizeModifiers({ dst: input }).dst).toBe(expected);
      }
    });

    it("handles missing, invalid, and empty values", () => {
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
          match: "",
        }),
      ).toEqual({
        count: undefined,
        year: undefined,
        first: undefined,
        last: undefined,
        match: undefined,
      });
    });
  });

  describe("ensureModifiers", () => {
    it("handles missing, structured, and raw modifiers", () => {
      expect(ensureModifiers()).toEqual({});

      const structured: CountryModifiers = {
        count: { op: ">", value: 1 },
      };

      expect(ensureModifiers(structured)).toBe(structured);

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

  describe("applyVisitModifiersToCountry", () => {
    const country = {
      ...mockCountries[0],
      isoCode: "FR",
    };

    const context: VisitContext = {
      visitedIsoCodes: ["FR"],
      visitedMap: { FR: 2 },
      visitedYearMap: {
        FR: new Set([2019, 2020]),
      },
      firstVisitMap: {
        FR: new Date("2019-06-01"),
      },
      lastVisitMap: {
        FR: new Date("2020-08-01"),
      },
    };

    const emptyContext: VisitContext = {
      visitedIsoCodes: [],
      visitedMap: {},
      visitedYearMap: {},
    };

    const cases: Array<{
      name: string;
      modifiers: CountryVisitModifiers;
      context?: VisitContext;
      expected: boolean;
    }> = [
      {
        name: "matches visit count",
        modifiers: { count: { op: ">", value: 1 } },
        expected: true,
      },
      {
        name: "rejects visit count",
        modifiers: { count: { op: ">", value: 2 } },
        expected: false,
      },
      {
        name: "matches exact visit year",
        modifiers: { year: { op: "=", year: 2020 } },
        expected: true,
      },
      {
        name: "rejects unmatched exact visit year",
        modifiers: { year: { op: "=", year: 2021 } },
        expected: false,
      },
      {
        name: "matches comparative first visit year",
        modifiers: { year: { op: ">", year: 2018 } },
        expected: true,
      },
      {
        name: "rejects comparative first visit year",
        modifiers: { year: { op: "<", year: 2018 } },
        expected: false,
      },
      {
        name: "rejects comparative year without a visit",
        modifiers: { year: { op: ">", year: 2018 } },
        context: emptyContext,
        expected: false,
      },
      {
        name: "matches first visit year",
        modifiers: { first: { op: "=", year: 2019 } },
        expected: true,
      },
      {
        name: "rejects unmatched first visit year",
        modifiers: { first: { op: ">", year: 2020 } },
        expected: false,
      },
      {
        name: "rejects first visit without a visit",
        modifiers: { first: { op: "=", year: 2019 } },
        context: emptyContext,
        expected: false,
      },
      {
        name: "matches last visit year",
        modifiers: { last: { op: "=", year: 2020 } },
        expected: true,
      },
      {
        name: "rejects unmatched last visit year",
        modifiers: { last: { op: "<", year: 2020 } },
        expected: false,
      },
      {
        name: "rejects last visit without a visit",
        modifiers: { last: { op: "=", year: 2020 } },
        context: emptyContext,
        expected: false,
      },
    ];

    it.each(cases)("$name", ({ modifiers, context: testContext, expected }) => {
      expect(
        applyVisitModifiersToCountry(
          country,
          modifiers,
          testContext ?? context,
        ),
      ).toBe(expected);
    });

    it("returns true when modifiers are empty", () => {
      expect(applyVisitModifiersToCountry(country, {}, context)).toBe(true);
    });
  });
});
