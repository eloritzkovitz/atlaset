import { describe, it, expect } from "vitest";
import {
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
} from "@utils/search";

describe("search utils", () => {
  describe("parseQualifierSearch modifiers and queries", () => {
    it("parses simple qualifier:query", () => {
      expect(parseQualifierSearch("prop:VALUE")).toEqual({
        qualifier: "prop",
        query: "VALUE",
        modifiers: {},
      });
    });

    it("parses multi-word query and trailing modifier", () => {
      expect(parseQualifierSearch("prop:alpha beta opt:true")).toEqual({
        qualifier: "prop",
        query: "alpha beta",
        modifiers: { opt: true },
      });
    });

    it("parses explicit false modifier", () => {
      expect(parseQualifierSearch("prop:alpha opt:false")).toEqual({
        qualifier: "prop",
        query: "alpha",
        modifiers: { opt: false },
      });
    });

    it("parses 'yes'/'no' boolean modifier variants for keys", () => {
      expect(parseQualifierSearch("prop:alpha opt:yes")).toEqual({
        qualifier: "prop",
        query: "alpha",
        modifiers: { opt: true },
      });
      expect(parseQualifierSearch("prop:alpha opt:no")).toEqual({
        qualifier: "prop",
        query: "alpha",
        modifiers: { opt: false },
      });
    });

    it("preserves non-boolean modifier values", () => {
      expect(parseQualifierSearch("prop:alpha opt:maybe")).toEqual({
        qualifier: "prop",
        query: "alpha",
        modifiers: { opt: "maybe" },
      });
    });

    it("treats bare token as part of query (no modifier)", () => {
      expect(parseQualifierSearch("prop:alpha opt")).toEqual({
        qualifier: "prop",
        query: "alpha opt",
        modifiers: {},
      });
    });

    it("coerceModifierValue recognizes booleans and preserves other strings", () => {
      expect(coerceModifierValue("true")).toBe(true);
      expect(coerceModifierValue("yes")).toBe(true);
      expect(coerceModifierValue("false")).toBe(false);
      expect(coerceModifierValue("no")).toBe(false);
      expect(coerceModifierValue("maybe")).toBe("maybe");
    });

    it("identifyModifierRange and parseModifiers work with trailing modifiers", () => {
      const tokens1 = ["one", "two", "opt:true"];
      expect(identifyModifierRange(tokens1)).toBe(2);
      const tokens2 = ["one", "two"];
      expect(identifyModifierRange(tokens2)).toBe(2);
      const tokens3 = ["opt:true", "one"];
      expect(identifyModifierRange(tokens3)).toBe(2);
      const tokens4 = ["one", "two", "opt:true", "flag:maybe"];
      const parsed = parseModifiers(tokens4, 2);
      expect(parsed).toEqual({ opt: true, flag: "maybe" });
    });

    it("identifyModifierRange handles empty arrays and multiple trailing modifiers", () => {
      expect(identifyModifierRange([])).toBe(0);
      const tokens = ["a:1", "b:2"];
      expect(identifyModifierRange(tokens)).toBe(0);
      expect(parseModifiers(["a:1"], 1)).toEqual({});
    });

    it("returns null for empty or non-qualifier inputs", () => {
      expect(parseQualifierSearch("")).toBeNull();
      expect(parseQualifierSearch("justtext")).toBeNull();
    });

    it("handles qualifier token followed by separate query tokens", () => {
      expect(parseQualifierSearch("prop: alpha beta")).toEqual({
        qualifier: "prop",
        query: "alpha beta",
        modifiers: {},
      });
    });

    it("handles qualifier with empty inline query (no trailing tokens)", () => {
      expect(parseQualifierSearch("prop:")).toEqual({
        qualifier: "prop",
        query: "",
        modifiers: {},
      });
    });
  });

  describe("parsePropertyParts", () => {
    it("splits prop and afterColon correctly", () => {
      expect(parsePropertyParts("prop:es")).toEqual({
        propCandidate: "prop",
        afterColon: "es",
        hasColon: true,
      });
      expect(parsePropertyParts("no-colon")).toEqual({
        propCandidate: "no-colon",
        afterColon: "",
        hasColon: false,
      });
    });
  });

  describe("suggestByPrefix and validation", () => {
    it("suggestByPrefix filters case-insensitively and validates input", () => {
      const list = ["prop", "field", "flag"];
      expect(suggestByPrefix(list, "pr")).toEqual(["prop"]);
      expect(suggestByPrefix(list, "F")).toEqual(["field", "flag"]);
      expect(suggestByPrefix(list, "$invalid")).toEqual([]);
    });

    it("isValidQualifier does exact case-insensitive match", () => {
      const list = ["prop", "field"];
      expect(isValidQualifier("prop", list)).toBe(true);
      expect(isValidQualifier("Prop", list)).toBe(true);
      expect(isValidQualifier("pr", list)).toBe(false);
    });
  });

  describe("formatting helpers", () => {
    it("computeSuffix behavior", () => {
      expect(computeSuffix(undefined, "prop")).toBeNull();
      expect(computeSuffix("propcode", "")).toBeNull();
      expect(computeSuffix("prop", "prop")).toBeNull();
      expect(computeSuffix("propcode", "prop")).toBe("code:");
      expect(computeSuffix("ab", "abc")).toBeNull();
    });

    it("formatCommittedValue and defaultOnSelect", () => {
      expect(formatCommittedValue("prop", "es")).toBe("prop:es");
      expect(defaultOnSelect("prop", "prop:es")).toBe("prop:es");
      expect(defaultOnSelect("key", "ke:  123")).toBe("key:  123");
      expect(defaultOnSelect("k", "no-colon")).toBe("k:-colon");
    });
  });

  describe("edge cases", () => {
    it("isValidQualifier returns false for empty prefix", () => {
      expect(isValidQualifier("", ["a"])).toBe(false);
    });

    it("coerceModifierValue is case-insensitive", () => {
      expect(coerceModifierValue("TrUe")).toBe(true);
      expect(coerceModifierValue("NO")).toBe(false);
    });
  });
});
