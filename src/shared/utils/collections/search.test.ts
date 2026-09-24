import { describe, expect, it } from "vitest";
import {
  matchesToken,
  parsePropertyParts,
  suggestByPrefix,
  computeSuffix,
  formatCommittedValue,
  defaultOnSelect,
  isValidQualifier,
} from "./search";

describe("search utils", () => {
  describe("matchesToken", () => {
    it.each([
      ["Hello World", "lo wo", { match: "substring" }, true],
      ["Paris", "paris", { match: "exact" }, true],
      ["Paris ", "paris", { match: "exact" }, false],
      ["Germany", "ger", { match: "prefix" }, true],
      ["United States", "states", { match: "substring" }, true],
      ["San José", "san jose", { match: "exact" }, true],
      ["São Paulo", "sao", { match: "prefix" }, true],
      ["abc123", "\\d+$", { match: "regex" }, true],
      ["abc", "(", { match: "regex" }, false],
      ["Germany", "ger", { match: "bogus" }, true],
      ["abcdef", "bc", { match: "bogus" }, false],
      ["Germany", "ger", { caseSensitive: true }, false],
      ["Germany", "Ger", { caseSensitive: true }, true],
    ])("%s / %s -> %p", (token, query, options, expected) => {
      expect(matchesToken(token, query, options)).toBe(expected);
    });
  });

  describe("search helpers", () => {
    it.each([
      ["prop:es", { propCandidate: "prop", afterColon: "es", hasColon: true }],
      [
        "no-colon",
        { propCandidate: "no-colon", afterColon: "", hasColon: false },
      ],
      [":", { propCandidate: "", afterColon: "", hasColon: true }],
      ["", { propCandidate: "", afterColon: "", hasColon: false }],
    ])("parses property %s", (input, expected) => {
      expect(parsePropertyParts(input)).toEqual(expected);
    });

    it("suggests and validates qualifiers", () => {
      const list = ["prop", "field", "flag"];

      expect(suggestByPrefix(list, "pr")).toEqual(["prop"]);
      expect(suggestByPrefix(list, "F")).toEqual(["field", "flag"]);
      expect(suggestByPrefix(list, "$")).toEqual([]);
      expect(isValidQualifier("Prop", list)).toBe(true);
      expect(isValidQualifier("pr", list)).toBe(false);
      expect(isValidQualifier("", list)).toBe(false);
    });

    it.each([
      [undefined, "prop", null],
      ["propcode", "", null],
      ["prop", "prop", null],
      ["propcode", "prop", "code:"],
      ["ab", "abc", null],
    ])("computes suffix", (suggestion, input, expected) => {
      expect(computeSuffix(suggestion, input)).toBe(expected);
    });

    it.each([
      ["prop:es", "prop:es"],
      ["ke:  123", "key:  123"],
      ["no-colon", "k:-colon"],
      ["prop:", "prop:"],
    ])("selects %s", (input, expected) => {
      const suggestion = input.startsWith("ke")
        ? "key"
        : input.startsWith("no")
          ? "k"
          : "prop";

      expect(defaultOnSelect(suggestion, input)).toBe(expected);
    });

    it("formats committed values", () => {
      expect(formatCommittedValue("prop", "es")).toBe("prop:es");
    });
  });
});
