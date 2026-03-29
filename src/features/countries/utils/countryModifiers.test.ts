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
  it("normalizes visited string values and uppercases 'of'", () => {
    const out1 = normalizeModifiers({ visited: "true", of: "fr" });
    expect(out1.visited).toBe(true);
    expect(out1.of).toBe("FR");

    const out2 = normalizeModifiers({ visited: "false" });
    expect(out2.visited).toBe(false);
  });

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
    expect(parseTCOption("true")).toEqual({ mode: "default" });
    expect(parseTCOption("false")).toEqual({ mode: "default" });
    expect(parseTCOption("contiguous")).toEqual({
      scope: "contiguous",
      mode: "default",
    });
    expect(parseTCOption("overseas")).toEqual({
      scope: "overseas",
      mode: "default",
    });
    expect(parseTCOption("other")).toEqual({ scope: "other", mode: "default" });
    expect(parseTCOption("all")).toEqual({ scope: "all", mode: "default" });
    expect(parseTCOption("bogus")).toEqual({ mode: "default" });
    expect(parseTCOption("only")).toEqual({ scope: "all", mode: "only" });
    expect(parseTCOption("include")).toEqual({ scope: "all", mode: "include" });

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
    // of modifier fails when no relation
    const countryA = { isoCode: "NW" } as any;
    expect(applyModifiersToCountry(countryA, { of: "ZZ" } as any)).toBe(false);

    // visited true with no visits -> false
    const countryB = { isoCode: "AA" } as any;
    expect(applyModifiersToCountry(countryB, { visited: true } as any)).toBe(
      false,
    );

    // visited false when visitedIsoCodes includes iso -> false
    const countryC = { isoCode: "BB" } as any;
    const ctx1 = { visitedIsoCodes: ["BB"] } as any;
    expect(
      applyModifiersToCountry(countryC, { visited: false } as any, ctx1),
    ).toBe(false);

    // count comparator passes and fails
    const countryD = { isoCode: "CC" } as any;
    const ctx2 = { visitedMap: { CC: 2 } } as any;
    expect(
      applyModifiersToCountry(
        countryD,
        { count: { op: ">", value: 1 } } as any,
        ctx2,
      ),
    ).toBe(true);
    expect(
      applyModifiersToCountry(
        countryD,
        { count: { op: ">=", value: 3 } } as any,
        ctx2,
      ),
    ).toBe(false);

    // year '=' uses hasVisitInYearFor
    const countryE = { isoCode: "YY" } as any;
    const ctx3 = { visitedYearMap: { YY: new Set([2020]) } } as any;
    expect(
      applyModifiersToCountry(
        countryE,
        { year: { op: "=", year: 2020 } } as any,
        ctx3,
      ),
    ).toBe(true);

    // year non '=' uses firstVisitMap; missing first -> false
    const countryF = { isoCode: "ZZ" } as any;
    expect(
      applyModifiersToCountry(
        countryF,
        { year: { op: ">", year: 2000 } } as any,
        {} as any,
      ),
    ).toBe(false);

    // first and last comparators
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
  });

  it("additional parseTCOption and matchesTranscontinental cases", () => {
    // undefined or empty returns default mode
    expect(parseTCOption(undefined as any)).toEqual({ mode: "default" });
    expect(parseTCOption("")).toEqual({ mode: "default" });

    // order-agnostic parsing where both scope and mode present
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
    // matchesTranscontinental returns false when option missing
    expect(matchesTranscontinental(countryUS, undefined as any)).toBe(false);
  });

  it("applyModifiersToCountry positive of and visited cases", () => {
    // 'GP' is a region of FR per COUNTRY_RELATIONS
    const gp = { isoCode: "GP" } as any;
    expect(applyModifiersToCountry(gp, { of: "FR" } as any)).toBe(true);

    // visited true when present
    const z = { isoCode: "Z1" } as any;
    const ctx = { visitedIsoCodes: ["Z1"] } as any;
    expect(applyModifiersToCountry(z, { visited: true } as any, ctx)).toBe(true);
  });
});
