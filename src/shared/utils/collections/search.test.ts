import { describe, it, expect } from "vitest";
import {
  matchesToken,
  parseQualifierSearch,
  parsePropertyParts,
  suggestByPrefix,
  computeSuffix,
  formatCommittedValue,
  defaultOnSelect,
  isValidQualifier,
  coerceModifierValue,
  identifyModifierRange,
  parseModifiers,
} from "./search";

describe("search utils", () => {
  describe("matchesToken", () => {
    it.each([
      ["Hello World", "lo wo", { match: "substring" }, true],
      ["abcdef", "bcde", { match: "substring" }, true],
      ["abcdef", "xyz", { match: "substring" }, false],
      ["Paris", "paris", { match: "exact" }, true],
      ["Paris ", "paris", { match: "exact" }, false],
      ["Germany", "ger", { match: "prefix" }, true],
      ["United States", "states", { match: "substring" }, true],
      ["United States", "uni", { match: "substring" }, true],
      ["abc123", "\\d+$", { match: "regex" }, true],
      ["abc", "\\d+$", { match: "regex" }, false],
      ["abc", "(", { match: "regex" }, false],
      ["Germany", "ger", { match: "bogus" }, true],
      ["United States", "uni", { match: "bogus" }, true],
      ["abcdef", "bc", { match: "bogus" }, false],
      ["Germany", "ger", { caseSensitive: true }, false],
      ["Germany", "Ger", { caseSensitive: true }, true],
    ])(
      "evaluates matchesToken('%s', '%s', %j) -> %p",
      (token, query, options, expected) => {
        expect(matchesToken(token, query, options)).toBe(expected);
      },
    );
  });

  describe("parseQualifierSearch and modifiers pipeline", () => {
    it.each([
      ["prop:VALUE", { qualifier: "prop", query: "VALUE", modifiers: {} }],
      [
        "prop:alpha beta opt:true",
        { qualifier: "prop", query: "alpha beta", modifiers: { opt: true } },
      ],
      [
        "prop:alpha opt:false",
        { qualifier: "prop", query: "alpha", modifiers: { opt: false } },
      ],
      [
        "prop:alpha opt:yes",
        { qualifier: "prop", query: "alpha", modifiers: { opt: true } },
      ],
      [
        "prop:alpha opt:no",
        { qualifier: "prop", query: "alpha", modifiers: { opt: false } },
      ],
      [
        "prop:alpha opt:maybe",
        { qualifier: "prop", query: "alpha", modifiers: { opt: "maybe" } },
      ],
      [
        "prop:alpha opt",
        { qualifier: "prop", query: "alpha opt", modifiers: {} },
      ],
      ["", null],
      ["justtext", null],
      [
        "prop: alpha beta",
        { qualifier: "prop", query: "alpha beta", modifiers: {} },
      ],
      ["prop:", { qualifier: "prop", query: "", modifiers: {} }],
      [
        "prop: token key:",
        { qualifier: "prop", query: "token", modifiers: {} },
      ],
      [
        "prop: opt:true",
        { qualifier: "prop", query: "", modifiers: { opt: true } },
      ],
    ])("parses raw search pattern '%s'", (input, expected) => {
      expect(parseQualifierSearch(input)).toEqual(expected);
    });

    it.each([
      ["true", true],
      ["yes", true],
      ["false", false],
      ["no", false],
      ["maybe", "maybe"],
      ["TrUe", true],
      ["NO", false],
    ])("coerces modifier string token '%s' -> %p", (input, expected) => {
      expect(coerceModifierValue(input)).toBe(expected);
    });

    it("handles nullish input edge cases", () => {
      expect(parseQualifierSearch(null as unknown as string)).toBeNull();
      expect(parseQualifierSearch(undefined as unknown as string)).toBeNull();
      expect(parseQualifierSearch("   ")).toBeNull();
    });

    it("evaluates custom inner modifier token range splits", () => {
      expect(identifyModifierRange(["one", "two", "opt:true"])).toBe(2);
      expect(identifyModifierRange(["one", "two"])).toBe(2);
      expect(identifyModifierRange(["opt:true", "one"])).toBe(2);
      expect(identifyModifierRange([])).toBe(0);
      expect(identifyModifierRange(["a:1", "b:2"])).toBe(0);
      expect(
        parseModifiers(["one", "two", "opt:true", "flag:maybe"], 2),
      ).toEqual({ opt: true, flag: "maybe" });
      expect(parseModifiers(["a:1"], 1)).toEqual({});
    });
  });

  describe("parsePropertyParts & validation helpers", () => {
    it.each([
      ["prop:es", { propCandidate: "prop", afterColon: "es", hasColon: true }],
      [
        "no-colon",
        { propCandidate: "no-colon", afterColon: "", hasColon: false },
      ],
      ["", { propCandidate: "", afterColon: "", hasColon: false }],
      [":", { propCandidate: "", afterColon: "", hasColon: true }],
    ])("parses property layout parts for '%s'", (input, expected) => {
      expect(parsePropertyParts(input)).toEqual(expected);
    });

    it("filters suggestions using input prefix definitions", () => {
      const list = ["prop", "field", "flag"];
      expect(suggestByPrefix(list, "pr")).toEqual(["prop"]);
      expect(suggestByPrefix(list, "F")).toEqual(["field", "flag"]);
      expect(suggestByPrefix(list, "$invalid")).toEqual([]);
    });

    it.each([
      ["prop", ["prop", "field"], true],
      ["Prop", ["prop", "field"], true],
      ["pr", ["prop", "field"], false],
      ["", ["a"], false],
    ])(
      "validates qualifier candidate entry eligibility on isValidQualifier('%s')",
      (prefix, list, expected) => {
        expect(isValidQualifier(prefix, list)).toBe(expected);
      },
    );
  });

  describe("formatting and selection autocomplete helpers", () => {
    it.each([
      [undefined, "prop", null],
      ["propcode", "", null],
      ["prop", "prop", null],
      ["propcode", "prop", "code:"],
      ["ab", "abc", null],
      ["propcode", undefined, null],
      ["propcode", "", null],
    ])(
      "computes inline suffix composition rules computeSuffix('%s', '%s')",
      (topSuggestion, propCandidate, expected) => {
        expect(computeSuffix(topSuggestion, propCandidate)).toBe(expected);
      },
    );

    it.each([
      ["prop:es", "prop:es"],
      ["ke:  123", "key:  123"],
      ["no-colon", "k:-colon"],
      ["prop:", "prop:"],
    ])(
      "updates raw input string dynamically during defaultOnSelect",
      (input, expected) => {
        const suggestion = input.startsWith("ke")
          ? "key"
          : input.startsWith("no")
            ? "k"
            : "prop";
        expect(defaultOnSelect(suggestion, input)).toBe(expected);
      },
    );

    it("combines property structures using formatCommittedValue", () => {
      expect(formatCommittedValue("prop", "es")).toBe("prop:es");
    });
  });
});
