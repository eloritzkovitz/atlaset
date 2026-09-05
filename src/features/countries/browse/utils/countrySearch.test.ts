import { describe, it, expect, vi } from "vitest";
import type { VisitContext } from "@features/visits/types";
import { mockCountries } from "@test-utils/mockCountries";
import * as timezoneUtils from "@utils/date/timezone";
import {
  resolveQualifierConfig,
  buildSearchString,
  getQualifierTokens,
  qualifierSuggestionProvider,
} from "./countrySearch";
import { SUPPORTED_QUALIFIERS } from "../constants/qualifierConfig";
import type { Country } from "../../types";

describe("countrySearch utils", () => {
  const countries = mockCountries;

  it("resolves qualifiers and provides suggestions", () => {
    expect(resolveQualifierConfig("currency")?.key).toBe("currency");
    expect(resolveQualifierConfig("CURRENCY")?.key).toBe("currency");
    expect(resolveQualifierConfig("invalid")).toBeUndefined();

    expect(qualifierSuggestionProvider("re")).toContain("region");
    expect(qualifierSuggestionProvider("$invalid")).toEqual([]);
    expect(SUPPORTED_QUALIFIERS).toContain("currency");
  });

  it("builds a search string", () => {
    const country = countries[4];
    expect(buildSearchString(country)).toBe(
      [country.name, ...(country.altNames ?? [])].join(" "),
    );
  });

  describe("getQualifierTokens", () => {
    it("handles basic country properties", () => {
      expect(getQualifierTokens(countries[0], "isoCode")).toEqual([
        countries[0].isoCode,
      ]);
      expect(getQualifierTokens(countries[0], "iso3Code")).toEqual([
        countries[0].iso3Code,
      ]);
      expect(getQualifierTokens(countries[0], "capital")).toEqual(["Paris"]);
      expect(getQualifierTokens(countries[0], "unMember")).toEqual(["true"]);
      expect(getQualifierTokens(countries[1], "unMember")).toEqual(["false"]);
    });

    it("handles region and subregion transcontinental options", () => {
      const country = {
        ...countries[3],
        transcontinental: {
          scope: "contiguous",
          additionalRegion: "Europe",
          additionalSubregion: "Northern Europe",
        },
      } as Country;

      expect(
        getQualifierTokens(country, "region", {
          tcOption: { scope: "overseas" },
        }),
      ).toEqual(["Americas"]);

      expect(
        getQualifierTokens(country, "region", {
          tcOption: { scope: "contiguous" },
        }),
      ).toEqual(["Americas", "Europe"]);

      expect(
        getQualifierTokens(country, "region", {
          tcOption: { scope: "all" },
        }),
      ).toEqual(["Americas", "Europe"]);

      expect(
        getQualifierTokens(country, "subregion", {
          tcOption: { scope: "contiguous" },
        }),
      ).toEqual(["Northern America", "Northern Europe"]);
    });

    it("handles transcontinental qualifier", () => {
      const tc = {
        ...countries[3],
        transcontinental: { scope: "CONTIGUOUS" },
      } as unknown as Country;

      expect(getQualifierTokens(tc, "tc")).toEqual(["true", "contiguous"]);
      expect(getQualifierTokens(countries[0], "tc")).toEqual(["false"]);
    });

    it("handles language codes, names, duplicates and invalid values", () => {
      expect(
        getQualifierTokens({ ...countries[0], languages: ["fr"] }, "languages"),
      ).toEqual(["French"]);

      expect(
        getQualifierTokens(
          {
            ...countries[0],
            languages: ["de", "German", "", null],
          } as unknown as Country,
          "languages",
        ),
      ).toEqual(["German"]);

      expect(
        getQualifierTokens(
          { ...countries[0], languages: ["en-US", "fr-CA"] },
          "languages",
        ),
      ).toEqual(["English", "French"]);

      expect(
        getQualifierTokens(
          { ...countries[0], languages: null } as unknown as Country,
          "languages",
        ),
      ).toEqual([]);

      expect(
        getQualifierTokens({ ...countries[0], languages: ["  "] }, "languages"),
      ).toEqual([]);
    });

    it("handles timezone offsets and DST", () => {
      const fr = countries[0];
      const de = countries[2];
      const gp = countries[1];
      const jp = countries[5];

      expect(getQualifierTokens(fr, "timezones")).toContain("UTC+01:00");
      expect(getQualifierTokens(fr, "timezones")).not.toContain("UTC+02:00");
      expect(getQualifierTokens(fr, "timezones", { dst: true })).toContain(
        "UTC+02:00",
      );

      expect(getQualifierTokens(de, "timezones")).toContain("UTC+01:00");
      expect(getQualifierTokens(de, "timezones", { dst: true })).toContain(
        "UTC+02:00",
      );

      expect(getQualifierTokens(gp, "timezones", { dst: true })).toContain(
        "UTC-04:00",
      );
      expect(getQualifierTokens(jp, "timezones", { dst: true })).toContain(
        "UTC+09:00",
      );
    });

    it("handles invalid and missing timezone data", () => {
      expect(
        getQualifierTokens(
          { ...countries[0], timezones: null } as unknown as Country,
          "timezones",
        ),
      ).toEqual([]);

      const timezoneSpy = vi
        .spyOn(timezoneUtils, "timezoneOffsets")
        .mockImplementation(() => {
          throw new Error("invalid timezone");
        });

      expect(
        getQualifierTokens(
          { ...countries[0], timezones: ["Invalid/Timezone"] },
          "timezones",
        ),
      ).toEqual([]);

      timezoneSpy.mockRestore();
    });

    it("handles sovereign status and sovereign state", () => {
      expect(getQualifierTokens(countries[0], "sovereign")).toEqual(["true"]);

      expect(
        getQualifierTokens(
          {
            ...countries[0],
            sovereigntyStatus: "dependency",
            sovereignState: "fr",
          },
          "sovereign",
        ),
      ).toEqual(["false", "FR"]);

      expect(
        getQualifierTokens(
          {
            ...countries[0],
            sovereigntyStatus: "dependency",
            sovereignState: "",
          },
          "sovereign",
        ),
      ).toEqual(["false"]);
    });

    it("handles visit context", () => {
      const vc: VisitContext = {
        visitedIsoCodes: [countries[0].isoCode],
        visitedMap: {},
        visitedYearMap: {},
        firstVisitMap: {},
        lastVisitMap: {},
      };

      expect(
        getQualifierTokens(countries[0], "visited", { visitContext: vc }),
      ).toEqual(["true"]);

      expect(
        getQualifierTokens(countries[1], "visited", { visitContext: vc }),
      ).toEqual(["false"]);

      expect(
        getQualifierTokens(countries[0], "wantToVisit", {
          visitContext: {
            wantToVisitIsoCodes: [countries[0].isoCode],
            visitedIsoCodes: [],
            visitedMap: {},
            visitedYearMap: {},
          },
        }),
      ).toEqual(["true"]);

      expect(getQualifierTokens(countries[0], "wantToVisit")).toEqual([]);
      expect(getQualifierTokens(countries[0], "visited")).toEqual([]);
    });

    it("handles array, string, boolean and unsupported properties", () => {
      const country = {
        ...countries[0],
        memberOf: ["UN", "", null],
        capital: "Paris",
        unMember: true,
      } as unknown as Country;

      expect(getQualifierTokens(country, "memberOf")).toEqual(["UN"]);
      expect(getQualifierTokens(country, "capital")).toEqual(["Paris"]);
      expect(getQualifierTokens(country, "unMember")).toEqual(["true"]);

      expect(
        getQualifierTokens({ ...country, unMember: false }, "unMember"),
      ).toEqual(["false"]);

      expect(
        getQualifierTokens({ ...country, capital: undefined }, "capital"),
      ).toEqual([]);

      expect(
        getQualifierTokens({ ...country, population: 123 }, "population"),
      ).toEqual([]);
    });

    it("handles empty region values", () => {
      expect(
        getQualifierTokens({ ...countries[0], region: "" }, "region"),
      ).toEqual([]);
    });
  });
});
