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

vi.mock("@utils/timezone", () => ({
  timezoneOffsets: (tz: string) => {
    switch (tz) {
      case "Europe/Paris":
      case "Europe/Berlin":
        return ["UTC+01:00", "UTC+02:00 (summer)"];
      case "America/Guadeloupe":
      case "America/Toronto":
      case "America/New_York":
        return ["UTC-05:00", "UTC-04:00 (summer)"];
      case "Asia/Tokyo":
        return ["UTC+09:00"];
      default:
        return ["UTC+00:00"];
    }
  },
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

  it("builds a search string containing name and aliases", () => {
    const s = buildSearchString(countries[4]);
    expect(s).toContain(countries[4].name);
    expect(s).toContain(countries[4].aliases?.[0]);
  });

  describe("getQualifierTokens", () => {
    it("returns isoCode and iso3Code for code qualifier", () => {
      const isocodes = getQualifierTokens(countries[0], "isoCode");
      expect(isocodes).toContain(countries[0].isoCode);
      const iso3Codes = getQualifierTokens(countries[0], "iso3Code");
      expect(iso3Codes).toContain(countries[0].iso3Code);
    });

    it("returns region tokens and includes transcontinental when requested", () => {
      const r = getQualifierTokens(countries[0], "region");
      expect(r).toContain("Europe");
      const ca = {
        ...countries[3],
        transcontinental: {
          scope: "contiguous",
          additionalRegion: "Europe",
          additionalSubregion: "Northern Europe",
        },
      } as any;
      const caTokens = getQualifierTokens(ca, "region", {
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
      const ca = {
        ...countries[3],
        transcontinental: {
          scope: "contiguous",
          additionalRegion: "Europe",
          additionalSubregion: "Northern Europe",
        },
      } as any;
      const caRegion = getQualifierTokens(ca, "region", {
        tcOption: { scope: "all", mode: "include" },
      });
      expect(caRegion).toContain("Americas");
      expect(caRegion).toContain("Europe");

      // includeTC as object form for subregion
      const caSubregion = getQualifierTokens(ca, "subregion", {
        tcOption: { scope: "contiguous", mode: "include" },
      });
      expect(caSubregion).toContain("Northern America");
      expect(caSubregion).toContain("Northern Europe");

      // tc as qualifier
      const caTc = getQualifierTokens(ca, "tc");
      expect(caTc).toEqual(["true", "contiguous"]);
      const nonTc = getQualifierTokens(countries[0], "tc");
      expect(nonTc).toEqual(["false"]);

      // visited flag via visitContext object
      const visited = getQualifierTokens(countries[0], "visited", {
        visitContext: vc,
      });
      expect(visited).toEqual(["true"]);
    });

    it("emits winter offsets by default and summer-only when dst:true using mockCountries", () => {
      const fr = countries[0];
      const gp = countries[1];
      const de = countries[2];
      const jp = countries[5];

      const frWinter = getQualifierTokens(fr, "timezones");
      expect(frWinter).toContain("UTC+01:00");
      expect(frWinter).not.toContain("UTC+02:00");
      const frSummer = getQualifierTokens(fr, "timezones", { dst: true });
      expect(frSummer).toContain("UTC+02:00");

      const deWinter = getQualifierTokens(de, "timezones");
      expect(deWinter).toContain("UTC+01:00");
      const deSummer = getQualifierTokens(de, "timezones", { dst: true });
      expect(deSummer).toContain("UTC+02:00");

      const gpWinter = getQualifierTokens(gp, "timezones");
      expect(gpWinter).toContain("UTC-05:00");
      const gpSummer = getQualifierTokens(gp, "timezones", { dst: true });
      expect(gpSummer).toContain("UTC-04:00");

      const jpTokens = getQualifierTokens(jp, "timezones");
      expect(jpTokens).toContain("UTC+09:00");
      const jpDst = getQualifierTokens(jp, "timezones", { dst: true });
      expect(jpDst).toContain("UTC+09:00");
    });
  });

  it("provides qualifier suggestions based on prefix", () => {
    const suggestions = qualifierSuggestionProvider("re");
    expect(suggestions).toContain("region");
    expect(qualifierSuggestionProvider("$invalid")).toEqual([]);
  });
});
