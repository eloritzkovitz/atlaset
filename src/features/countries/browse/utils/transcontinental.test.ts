import { describe, expect, it } from "vitest";
import { mockCountries } from "@test-utils/mockCountries";
import type { Country } from "@features/countries/types";
import { matchesTranscontinental, parseTCOption } from "./transcontinental";

describe("transcontinental", () => {
  const country = mockCountries[0];

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

    const withoutScope: Country = {
      ...country,
      isoCode: "YY",
      transcontinental: {
        additionalRegion: "Asia",
      },
    };

    const nonTranscontinental: Country = {
      ...country,
      isoCode: "XX",
      transcontinental: undefined,
    };

    it("returns false without a scope or transcontinental data", () => {
      expect(matchesTranscontinental(overseas)).toBe(false);
      expect(matchesTranscontinental(nonTranscontinental, "all")).toBe(false);
    });

    it("matches all transcontinental countries", () => {
      expect(matchesTranscontinental(overseas, "all")).toBe(true);
      expect(matchesTranscontinental(contiguous, "all")).toBe(true);
    });

    it("matches the requested scope", () => {
      expect(matchesTranscontinental(overseas, "overseas")).toBe(true);
      expect(matchesTranscontinental(contiguous, "contiguous")).toBe(true);
    });

    it("rejects a different scope", () => {
      expect(matchesTranscontinental(overseas, "contiguous")).toBe(false);
      expect(matchesTranscontinental(contiguous, "overseas")).toBe(false);
    });

    it("rejects transcontinental data without a scope", () => {
      expect(matchesTranscontinental(withoutScope, "contiguous")).toBe(false);
      expect(matchesTranscontinental(withoutScope, "overseas")).toBe(false);
      expect(matchesTranscontinental(withoutScope, "all")).toBe(false);
    });
  });

  describe("parseTCOption", () => {
    it.each([
      [undefined, { scope: "all", mode: "only" }],
      ["", { scope: "all", mode: "only" }],
      ["true", { scope: "all", mode: "only" }],
      ["false", { scope: "all", mode: "only" }],
      ["bogus", { scope: "all", mode: "only" }],
      ["contiguous", { scope: "contiguous", mode: "only" }],
      ["overseas", { scope: "overseas", mode: "only" }],
      ["cultural", { scope: "cultural", mode: "only" }],
      ["other", { scope: "other", mode: "only" }],
      ["all", { scope: "all", mode: "only" }],
      ["only", { scope: "all", mode: "only" }],
      ["include", { scope: "all", mode: "include" }],
      ["exclude", { scope: "all", mode: "exclude" }],
      ["include:contiguous", { scope: "contiguous", mode: "include" }],
      ["contiguous:include", { scope: "contiguous", mode: "include" }],
      ["exclude:contiguous", { scope: "contiguous", mode: "exclude" }],
      ["contiguous:exclude", { scope: "contiguous", mode: "exclude" }],
      ["only:overseas", { scope: "overseas", mode: "only" }],
      ["overseas:only", { scope: "overseas", mode: "only" }],
    ] as const)("parses %s", (input, expected) => {
      expect(parseTCOption(input)).toEqual(expected);
    });

    it("normalizes case, whitespace, and empty tokens", () => {
      expect(parseTCOption(" INCLUDE :: CONTIGUOUS ")).toEqual({
        scope: "contiguous",
        mode: "include",
      });
    });

    it("ignores unknown tokens while preserving valid options", () => {
      expect(parseTCOption("bogus:contiguous:include:unknown")).toEqual({
        scope: "contiguous",
        mode: "include",
      });
    });

    it("uses the last recognized scope and mode", () => {
      expect(parseTCOption("overseas:contiguous:include:only")).toEqual({
        scope: "contiguous",
        mode: "only",
      });
    });
  });
});
