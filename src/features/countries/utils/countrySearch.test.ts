import { describe, it, expect, vi } from "vitest";
import type { VisitContext } from "@features/visits";
import { mockCountries } from "@test-utils/mockCountries";
import {
  resolveQualifierConfig,
  buildSearchString,
  getQualifierTokens,
  qualifierSuggestionProvider,
} from "./countrySearch";
import { SUPPORTED_QUALIFIERS } from "../constants/qualifierConfig";

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

  it("resolves qualifier config and supported qualifiers", () => {
    const cfg = resolveQualifierConfig("currency");
    expect(cfg).toBeDefined();
    expect(cfg?.key).toBe("currency");
    const supported = SUPPORTED_QUALIFIERS;
    expect(Array.isArray(supported)).toBe(true);
    expect(supported).toContain("currency");
  });

  it("builds a search string containing name and isoCode", () => {
    const s = buildSearchString(countries[0]);
    expect(s).toContain(countries[0].name);
    expect(s).toContain(countries[0].isoCode);
  });

  describe("getQualifierTokens", () => {
    it("returns region tokens and includes transcontinental when requested", () => {
      const r = getQualifierTokens(countries[0], "region");
      expect(r).toContain("Europe");
      const caTokens = getQualifierTokens(countries[3], "region", {
        tcOption: { scope: "all", mode: "include" },
      });
      expect(caTokens).toContain("Americas");
      expect(caTokens).toContain("Europe");
    });

    it("handles sovereign and visited flags", () => {
      const sov = getQualifierTokens(countries[0], "sovereign");
      expect(sov).toEqual(["true"]);
      const visitedTrue = getQualifierTokens(countries[0], "visited", {
        visitContext: {
          visitedIsoCodes: [countries[0].isoCode],
        } as VisitContext,
      });
      expect(visitedTrue).toEqual(["true"]);
      const visitedFalse = getQualifierTokens(countries[1], "visited", {
        visitContext: {
          visitedIsoCodes: [countries[0].isoCode],
        } as VisitContext,
      });
      expect(visitedFalse).toEqual(["false"]);
    });

    it("returns empty arrays when visit-related auxiliary data is missing", () => {
      expect(getQualifierTokens(countries[0], "visited")).toEqual([]);
    });

    it("returns array/string properties correctly", () => {
      const langs = getQualifierTokens(countries[0], "languages");
      expect(langs).toEqual(["French"]);
      const capital = getQualifierTokens(countries[0], "capital");
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
      const caRegion = getQualifierTokens(countries[3], "region", {
        tcOption: { scope: "all", mode: "include" },
      });
      expect(caRegion).toContain("Americas");
      expect(caRegion).toContain("Europe");

      // includeTC as object form for subregion
      const caSubregion = getQualifierTokens(countries[3], "subregion", {
        tcOption: { scope: "contiguous", mode: "include" },
      });
      expect(caSubregion).toContain("Northern America");
      expect(caSubregion).toContain("Northern Europe");

      // tc as qualifier
      const caTc = getQualifierTokens(countries[3], "tc");
      expect(caTc).toEqual(["true", "contiguous"]);
      const nonTc = getQualifierTokens(countries[0], "tc");
      expect(nonTc).toEqual(["false"]);

      // visited flag via visitContext object
      const visited = getQualifierTokens(countries[0], "visited", {
        visitContext: vc,
      });
      expect(visited).toEqual(["true"]);
    });
  });

  it("provides qualifier suggestions based on prefix", () => {
    const suggestions = qualifierSuggestionProvider("re");
    expect(suggestions).toContain("region");
    expect(qualifierSuggestionProvider("$invalid")).toEqual([]);
  });
});
