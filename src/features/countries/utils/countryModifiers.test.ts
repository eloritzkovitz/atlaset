import { describe, it, expect } from "vitest";
import {
  normalizeModifiers,
  ensureModifiers,
  parseTCOption,
  matchesTranscontinental,
  matchesSovereigntyOf,
} from "./countryModifiers";

describe("modifierUtils", () => {
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
});
