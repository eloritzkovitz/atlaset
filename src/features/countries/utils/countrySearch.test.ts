import { describe, it, expect, vi } from "vitest";
import { mockCountries } from "@test-utils/mockCountries";
import {
  resolvePropertyConfig,
  getSupportedProperties,
  parsePropertySearch,
  buildSearchString,
  getPropertyTokens,
  propertySuggestionProvider,
} from "./countrySearch";

vi.mock("../constants/transcontinental", () => ({
  TRANSCONTINENTAL_MAP: new Map([
    [
      "CA",
      {
        additionalRegion: "Europe",
        additionalSubregion: "Northern Europe",
      },
    ],
  ]),
}));

describe("countrySearch utils", () => {
  const countries = mockCountries;

  it("resolves property config and supported properties", () => {
    const cfg = resolvePropertyConfig("currency");
    expect(cfg).toBeDefined();
    expect(cfg?.key).toBe("currency");
    const supported = getSupportedProperties();
    expect(Array.isArray(supported)).toBe(true);
    expect(supported).toContain("currency");
    expect(supported).toContain("firstvisit");
  });

  it("parses property:query strings correctly", () => {
    expect(parsePropertySearch("currency:EUR")).toEqual({
      property: "currency",
      query: "EUR",
    });
    expect(parsePropertySearch("  Language: french  ")).toEqual({
      property: "language",
      query: "french",
    });
    expect(parsePropertySearch("no-colon-here")).toBeNull();
  });

  it("builds a search string containing name and isoCode", () => {
    const s = buildSearchString(countries[0]);
    expect(s).toContain(countries[0].name);
    expect(s).toContain(countries[0].isoCode);
  });

  describe("getPropertyTokens", () => {
    it("returns region tokens and includes transcontinental when requested", () => {
      const r = getPropertyTokens(countries[0], "region", false);
      expect(r).toContain("Europe");
      const caTokens = getPropertyTokens(countries[3], "region", true);
      expect(caTokens).toContain("Americas");
      expect(caTokens).toContain("Europe");
    });

    it("handles sovereign and visited flags", () => {
      const sov = getPropertyTokens(countries[0], "sovereign");
      expect(sov).toEqual(["true"]);
      const visitedTrue = getPropertyTokens(
        countries[0],
        "visited",
        undefined,
        [countries[0].isoCode],
      );
      expect(visitedTrue).toEqual(["true"]);
      const visitedFalse = getPropertyTokens(
        countries[1],
        "visited",
        undefined,
        [countries[0].isoCode],
      );
      expect(visitedFalse).toEqual(["false"]);
    });

    it("returns visit counts from visitedMap", () => {
      const vmap = { FR: 2 } as Record<string, number>;
      expect(
        getPropertyTokens(countries[0], "visits", undefined, undefined, vmap),
      ).toEqual(["2"]);
      expect(
        getPropertyTokens(countries[1], "visits", undefined, undefined, vmap),
      ).toEqual(["0"]);
    });

    it("returns visityear and firstvisit tokens from visitedYearMap", () => {
      const ymap: Record<string, Set<number>> = {
        FR: new Set([2019, 2020]),
        GP: new Set(),
      };
      const years = getPropertyTokens(
        countries[0],
        "visitYear",
        undefined,
        undefined,
        undefined,
        ymap,
      );
      expect(years).toEqual(expect.arrayContaining(["2019", "2020"]));
      const first = getPropertyTokens(
        countries[0],
        "firstVisit",
        undefined,
        undefined,
        undefined,
        ymap,
      );
      expect(first).toEqual(["2019"]);
      const last = getPropertyTokens(
        countries[0],
        "lastVisit",
        undefined,
        undefined,
        undefined,
        ymap,
      );
      expect(last).toEqual(["2020"]);

      const noneFirst = getPropertyTokens(
        countries[1],
        "firstVisit",
        undefined,
        undefined,
        undefined,
        ymap,
      );
      expect(noneFirst).toEqual([]);
      const noneLast = getPropertyTokens(
        countries[1],
        "lastVisit",
        undefined,
        undefined,
        undefined,
        ymap,
      );
      expect(noneLast).toEqual([]);
    });

    it("returns empty arrays when visit-related auxiliary data is missing", () => {
      expect(getPropertyTokens(countries[0], "visited")).toEqual([]);
      expect(getPropertyTokens(countries[0], "visits")).toEqual([]);
      expect(getPropertyTokens(countries[0], "visitYear")).toEqual([]);
      expect(getPropertyTokens(countries[0], "firstVisit")).toEqual([]);
      expect(getPropertyTokens(countries[0], "lastVisit")).toEqual([]);
    });

    it("returns array/string properties correctly", () => {
      const langs = getPropertyTokens(countries[0], "languages");
      expect(langs).toEqual(["French"]);
      const capital = getPropertyTokens(countries[0], "capital");
      expect(capital).toEqual(["Paris"]);
    });
  });

  it("provides property suggestions based on prefix", () => {
    const suggestions = propertySuggestionProvider("re");
    expect(suggestions).toContain("region");
    expect(suggestions).toContain("region_tc");
    expect(propertySuggestionProvider("$invalid")).toEqual([]);
  });
});
