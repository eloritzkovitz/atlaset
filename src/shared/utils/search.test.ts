import { describe, it, expect } from "vitest";
import {
  parseQualifierSearch,
  parsePropertyParts,
  suggestByPrefix,
  computeSuffix,
  formatCommittedValue,
  defaultOnSelect,
  isValidQualifier,
} from "@utils/search";

describe("search utils", () => {
  describe("parseQualifierSearch modifiers and queries", () => {
    it("parses simple qualifier:query", () => {
      expect(parseQualifierSearch("currency:EUR")).toEqual({
        qualifier: "currency",
        query: "EUR",
        modifiers: {},
      });
    });

    it("parses multi-word query and trailing boolean modifier", () => {
      expect(parseQualifierSearch("currency:gold euro tc:true")).toEqual({
        qualifier: "currency",
        query: "gold euro",
        modifiers: { tc: true },
      });
    });

    it("parses explicit false modifier", () => {
      expect(parseQualifierSearch("region:europe tc:false")).toEqual({
        qualifier: "region",
        query: "europe",
        modifiers: { tc: false },
      });
    });

    it("treats bare token as part of query (no modifier)", () => {
      expect(parseQualifierSearch("region:europe tc")).toEqual({
        qualifier: "region",
        query: "europe tc",
        modifiers: {},
      });
    });

    it("parses non-boolean modifier value as string", () => {
      expect(parseQualifierSearch("prop:val x:123")).toEqual({
        qualifier: "prop",
        query: "val",
        modifiers: { x: "123" },
      });
    });
  });

  describe("parsePropertyParts", () => {
    it("splits prop and afterColon correctly", () => {
      expect(parsePropertyParts("iso:es")).toEqual({
        propCandidate: "iso",
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
      const list = ["region", "currency", "callingcode"];
      expect(suggestByPrefix(list, "re")).toEqual(["region"]);
      expect(suggestByPrefix(list, "C")).toEqual(["currency", "callingcode"]);
      expect(suggestByPrefix(list, "$invalid")).toEqual([]);
    });

    it("isValidQualifier does exact case-insensitive match", () => {
      const list = ["region", "currency"];
      expect(isValidQualifier("region", list)).toBe(true);
      expect(isValidQualifier("Region", list)).toBe(true);
      expect(isValidQualifier("reg", list)).toBe(false);
    });
  });

  describe("formatting helpers", () => {
    it("computeSuffix behavior", () => {
      expect(computeSuffix(undefined, "iso")).toBeNull();
      expect(computeSuffix("isocode", "")).toBeNull();
      expect(computeSuffix("iso", "iso")).toBeNull();
      expect(computeSuffix("isocode", "iso")).toBe("code:");
    });

    it("formatCommittedValue and defaultOnSelect", () => {
      expect(formatCommittedValue("iso", "es")).toBe("iso:es");
      expect(defaultOnSelect("iso", "iso:es")).toBe("iso:es");
      expect(defaultOnSelect("code", "co:  123")).toBe("code:  123");
    });
  });
});
