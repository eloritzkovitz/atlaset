import { describe, it, expect } from "vitest";
import {
  normalizeModifiers,
  ensureModifiers,
  parseTCOption,
  matchesTranscontinental,
  matchesSovereigntyOf,
  applyModifiersToCountry,
} from "./countryModifiers";

describe("countryModifiers", () => {
  it("parses count/year/first/last comparators", () => {
    const out = normalizeModifiers({
      count: ">2",
      year: ">=2020",
      first: "=1990",
      last: "<=2010",
    });
    expect(out.count).toEqual({ op: ">", value: 2 });
    expect(out.year).toEqual({ op: ">=", year: 2020 });
    expect(out.first).toEqual({ op: "=", year: 1990 });
    expect(out.last).toEqual({ op: "<=", year: 2010 });
  });

  it("normalizes match and of modifiers correctly", () => {
    const m1 = normalizeModifiers({ match: " exact " });
    expect(m1.match).toBe("exact");

    const m2 = normalizeModifiers({ match: "" });
    expect(m2.match).toBeUndefined();

    const of = normalizeModifiers({ of: "fr" });
    expect(of.of).toBe("FR");
  });

  it("ensureModifiers returns the object fast-path when comparator objects are present", () => {
    const obj = { count: { op: ">", value: 1 } } as unknown;
    const res = ensureModifiers(obj);
    expect(res).toBe(obj);
  });

  it("ensureModifiers handles undefined by returning an empty object", () => {
    expect(ensureModifiers(undefined)).toEqual({});
  });

  it("preserves tc values (string or boolean)", () => {
    const a = normalizeModifiers({ tc: "europe" });
    expect(a.tc).toBe("europe");

    const b = normalizeModifiers({ tc: true as unknown as string });
    expect(b.tc).toBe(true);
  });

  it("parses transcontinental scope strings and matches transcontinental entries", () => {
    const tcCases: Array<[string | undefined, any]> = [
      ["true", { mode: "default" }],
      ["false", { mode: "default" }],
      ["contiguous", { scope: "contiguous", mode: "default" }],
      ["overseas", { scope: "overseas", mode: "default" }],
      ["other", { scope: "other", mode: "default" }],
      ["all", { scope: "all", mode: "default" }],
      ["bogus", { mode: "default" }],
      ["only", { scope: "all", mode: "only" }],
      ["include", { scope: "all", mode: "include" }],
    ];
    tcCases.forEach(([input, expected]) => {
      expect(parseTCOption(input as any)).toEqual(expected);
    });

    const countryUS = { isoCode: "US" } as any;
    const countryAZ = { isoCode: "AZ" } as any;
    const countryXX = { isoCode: "XX" } as any;

    expect(matchesTranscontinental(countryUS, "overseas")).toBe(true);
    expect(matchesTranscontinental(countryAZ, "contiguous")).toBe(true);
    expect(matchesTranscontinental(countryXX, "all")).toBe(false);
  });

  it("matches sovereignty dependencies/regions correctly", () => {
    const gp = { isoCode: "GP" } as any;
    expect(matchesSovereigntyOf(gp, "FR")).toBe(true);
    const nw = { isoCode: "NW" } as any;
    expect(matchesSovereigntyOf(nw, "ZZ")).toBe(false);
  });

  it("applyModifiersToCountry respects of, visited, count, year, first, and last", () => {
    const countryA = { isoCode: "NW" } as any;
    expect(applyModifiersToCountry(countryA, { of: "ZZ" } as any)).toBe(false);

    const countryC = { isoCode: "BB" } as any;
    const ctx1 = { visitedIsoCodes: ["BB"] } as any;
    expect(
      applyModifiersToCountry(countryC, { visited: false } as any, ctx1),
    ).toBe(true);

    const countCases: Array<{
      country: any;
      ctx: any;
      mod: any;
      expected: boolean;
    }> = [
      {
        country: { isoCode: "CC" },
        ctx: { visitedMap: { CC: 2 } },
        mod: { count: { op: ">", value: 1 } },
        expected: true,
      },
      {
        country: { isoCode: "CC" },
        ctx: { visitedMap: { CC: 2 } },
        mod: { count: { op: ">=", value: 3 } },
        expected: false,
      },
      {
        country: { isoCode: "CD" },
        ctx: { visitedIsoCodes: ["CD"] },
        mod: { count: { op: ">=", value: 1 } },
        expected: true,
      },
      {
        country: { isoCode: "CD" },
        ctx: { visitedIsoCodes: ["CD"] },
        mod: { count: { op: ">", value: 1 } },
        expected: false,
      },
    ];
    countCases.forEach(({ country, ctx, mod, expected }) => {
      expect(
        applyModifiersToCountry(country as any, mod as any, ctx as any),
      ).toBe(expected);
    });

    const countryE = { isoCode: "YY" } as any;
    const ctx3 = { visitedYearMap: { YY: new Set([2020]) } } as any;
    expect(
      applyModifiersToCountry(
        countryE,
        { year: { op: "=", year: 2020 } } as any,
        ctx3,
      ),
    ).toBe(true);

    const countryF = { isoCode: "ZZ" } as any;
    expect(
      applyModifiersToCountry(
        countryF,
        { year: { op: ">", year: 2000 } } as any,
        {} as any,
      ),
    ).toBe(false);

    const countryG = { isoCode: "FG" } as any;
    const ctx4 = {
      firstVisitMap: { FG: new Date("1990-01-01") },
      lastVisitMap: { FG: new Date("2010-01-01") },
    } as any;
    expect(
      applyModifiersToCountry(
        countryG,
        { first: { op: "=", year: 1990 } } as any,
        ctx4,
      ),
    ).toBe(true);
    expect(
      applyModifiersToCountry(
        countryG,
        { last: { op: "=", year: 2010 } } as any,
        ctx4,
      ),
    ).toBe(true);

    const sov = { isoCode: "S1", sovereigntyType: "Sovereign" } as any;
    expect(applyModifiersToCountry(sov, { sovereign: false } as any)).toBe(
      true,
    );

    const noIso = {} as any as any;
    const noIsoMods = [
      { count: { op: ">", value: 0 } },
      { year: { op: ">", year: 2000 } },
      { first: { op: "=", year: 1990 } },
      { last: { op: "=", year: 2010 } },
    ];
    noIsoMods.forEach((m) => {
      expect(applyModifiersToCountry(noIso as any, m as any, {} as any)).toBe(
        false,
      );
    });
  });

  it("additional parseTCOption and matchesTranscontinental cases", () => {
    expect(parseTCOption(undefined as any)).toEqual({ mode: "default" });
    expect(parseTCOption("")).toEqual({ mode: "default" });
    expect(parseTCOption("include:contiguous")).toEqual({
      scope: "contiguous",
      mode: "include",
    });
    expect(parseTCOption("contiguous:include")).toEqual({
      scope: "contiguous",
      mode: "include",
    });
    expect(parseTCOption("only:overseas")).toEqual({
      scope: "overseas",
      mode: "only",
    });

    const countryUS = { isoCode: "US" } as any;
    expect(matchesTranscontinental(countryUS, undefined as any)).toBe(false);
  });

  it("applyModifiersToCountry positive of and visited cases", () => {
    const gp = { isoCode: "GP" } as any;
    expect(applyModifiersToCountry(gp, { of: "FR" } as any)).toBe(true);

    const z = { isoCode: "Z1" } as any;
    const ctx = { visitedIsoCodes: ["Z1"] } as any;
    expect(applyModifiersToCountry(z, { visited: true } as any, ctx)).toBe(
      true,
    );
  });
});
