import { describe, it, expect, vi } from "vitest";
import type { VisitContext } from "@features/visits";
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
      const r = getPropertyTokens(countries[0], "region");
      expect(r).toContain("Europe");
      const caTokens = getPropertyTokens(countries[3], "region", { includeTC: true });
      expect(caTokens).toContain("Americas");
      expect(caTokens).toContain("Europe");
    });

    it("handles sovereign and visited flags", () => {
      const sov = getPropertyTokens(countries[0], "sovereign");
      expect(sov).toEqual(["true"]);
      const visitedTrue = getPropertyTokens(
        countries[0],
        "visited",
        { visitContext: { visitedIsoCodes: [countries[0].isoCode] } as VisitContext },
      );
      expect(visitedTrue).toEqual(["true"]);
      const visitedFalse = getPropertyTokens(
        countries[1],
        "visited",
        { visitContext: { visitedIsoCodes: [countries[0].isoCode] } as VisitContext },
      );
      expect(visitedFalse).toEqual(["false"]);
    });

    it("returns visit counts from visitedMap", () => {
      const vmap = { FR: 2 } as Record<string, number>;
      expect(
        getPropertyTokens(countries[0], "visits", { visitContext: { visitedMap: vmap } as VisitContext }),
      ).toEqual(["2"]);
      expect(
        getPropertyTokens(countries[1], "visits", { visitContext: { visitedMap: vmap } as VisitContext }),
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
        { visitContext: { visitedYearMap: ymap } as VisitContext },
      );
      expect(years).toEqual(expect.arrayContaining(["2019", "2020"]));
      const first = getPropertyTokens(
        countries[0],
        "firstVisit",
        { visitContext: { visitedYearMap: ymap } as VisitContext },
      );
      expect(first).toEqual(["2019"]);
      const last = getPropertyTokens(
        countries[0],
        "lastVisit",
        { visitContext: { visitedYearMap: ymap } as VisitContext },
      );
      expect(last).toEqual(["2020"]);

      const noneFirst = getPropertyTokens(
        countries[1],
        "firstVisit",
        { visitContext: { visitedYearMap: ymap } as VisitContext },
      );
      expect(noneFirst).toEqual([]);
      const noneLast = getPropertyTokens(
        countries[1],
        "lastVisit",
        { visitContext: { visitedYearMap: ymap } as VisitContext },
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

    it("supports options object with visitContext and includeTC in object form", () => {
      const vc: VisitContext = {
        visitedIsoCodes: [countries[0].isoCode],
        visitedMap: { [countries[0].isoCode]: 2 },
        visitedYearMap: { [countries[0].isoCode]: new Set([2019, 2020]) },
        firstVisitMap: { [countries[0].isoCode]: new Date("2019-05-01") },
        lastVisitMap: { [countries[0].isoCode]: new Date("2020-10-01") },
      };

      // includeTC as object form for region
      const caRegion = getPropertyTokens(countries[3], "region", { includeTC: true });
      expect(caRegion).toContain("Americas");
      expect(caRegion).toContain("Europe");

      // visited flag via visitContext object
      const visited = getPropertyTokens(countries[0], "visited", { visitContext: vc });
      expect(visited).toEqual(["true"]);

      // visits count via visitContext
      const visits = getPropertyTokens(countries[0], "visits", { visitContext: vc });
      expect(visits).toEqual(["2"]);

      // visitYear via visitContext
      const years = getPropertyTokens(countries[0], "visitYear", { visitContext: vc });
      expect(years).toEqual(expect.arrayContaining(["2019", "2020"]));

      // firstVisit/lastVisit should prefer date maps when provided
      const first = getPropertyTokens(countries[0], "firstVisit", { visitContext: vc });
      expect(first).toEqual(["2019"]);
      const last = getPropertyTokens(countries[0], "lastVisit", { visitContext: vc });
      expect(last).toEqual(["2020"]);
    });
  });

  it("provides property suggestions based on prefix", () => {
    const suggestions = propertySuggestionProvider("re");
    expect(suggestions).toContain("region");
    expect(suggestions).toContain("region_tc");
    expect(propertySuggestionProvider("$invalid")).toEqual([]);
  });
});
