import { describe, it, expect } from "vitest";
import { mockCountries } from "@test-utils/mockCountries";
import {
  resolveQualifierConfig,
  buildSearchString,
  qualifierSuggestionProvider,
} from "./countrySearch";
import { SUPPORTED_QUALIFIERS } from "../constants/qualifierConfig";

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
});
