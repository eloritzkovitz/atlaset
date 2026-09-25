import { describe, expect, it } from "vitest";
import {
  parseSearchQuery,
  tokenizeSearchInput,
  unquoteSearchValue,
} from "./searchParser";

describe("search parser", () => {
  describe("tokenizeSearchInput", () => {
    it("tokenizes whitespace, parentheses and quoted values", () => {
      expect(
        tokenizeSearchInput(
          'region:europe (capital:"New York" OR capital:Paris)',
        ),
      ).toEqual([
        "region:europe",
        "(",
        'capital:"New York"',
        "OR",
        "capital:Paris",
        ")",
      ]);
    });

    it("returns an empty array for unterminated quotes", () => {
      expect(tokenizeSearchInput('capital:"New York')).toEqual([]);
    });
  });

  describe("unquoteSearchValue", () => {
    it("removes matching surrounding quotes", () => {
      expect(unquoteSearchValue('"New York"')).toBe("New York");
    });

    it("keeps unquoted values unchanged", () => {
      expect(unquoteSearchValue("Paris")).toBe("Paris");
      expect(unquoteSearchValue('"Paris')).toBe('"Paris');
    });
  });

  describe("parseSearchQuery", () => {
    it.each([
      [
        "prop:VALUE",
        {
          type: "condition",
          entry: { key: "prop", value: "VALUE" },
        },
      ],
      [
        "prop:alpha opt:true",
        {
          type: "and",
          left: {
            type: "condition",
            entry: { key: "prop", value: "alpha" },
          },
          right: {
            type: "condition",
            entry: { key: "opt", value: true },
          },
        },
      ],
      [
        "prop:alpha opt:no",
        {
          type: "and",
          left: {
            type: "condition",
            entry: { key: "prop", value: "alpha" },
          },
          right: {
            type: "condition",
            entry: { key: "opt", value: false },
          },
        },
      ],
      [
        "tc:contiguous:include",
        {
          type: "condition",
          entry: { key: "tc", value: "contiguous:include" },
        },
      ],
      [
        'capital:"New York"',
        {
          type: "condition",
          entry: { key: "capital", value: "New York" },
        },
      ],
      [
        'capital:"San José" region:europe',
        {
          type: "and",
          left: {
            type: "condition",
            entry: { key: "capital", value: "San José" },
          },
          right: {
            type: "condition",
            entry: { key: "region", value: "europe" },
          },
        },
      ],
    ])("parses %s", (input, expected) => {
      expect(parseSearchQuery(input)).toEqual(expected);
    });

    it("parses explicit AND", () => {
      expect(parseSearchQuery("region:europe AND language:french")).toEqual({
        type: "and",
        left: {
          type: "condition",
          entry: { key: "region", value: "europe" },
        },
        right: {
          type: "condition",
          entry: { key: "language", value: "french" },
        },
      });
    });

    it("parses OR", () => {
      expect(parseSearchQuery("region:europe OR region:asia")).toEqual({
        type: "or",
        left: {
          type: "condition",
          entry: { key: "region", value: "europe" },
        },
        right: {
          type: "condition",
          entry: { key: "region", value: "asia" },
        },
      });
    });

    it("parses NOT", () => {
      expect(parseSearchQuery("NOT visited:true")).toEqual({
        type: "not",
        expression: {
          type: "condition",
          entry: { key: "visited", value: true },
        },
      });
    });

    it("parses chained NOT expressions", () => {
      expect(parseSearchQuery("NOT NOT visited:true")).toEqual({
        type: "not",
        expression: {
          type: "not",
          expression: {
            type: "condition",
            entry: { key: "visited", value: true },
          },
        },
      });
    });

    it("uses NOT before implicit AND", () => {
      expect(parseSearchQuery("region:europe NOT visited:true")).toEqual({
        type: "and",
        left: {
          type: "condition",
          entry: { key: "region", value: "europe" },
        },
        right: {
          type: "not",
          expression: {
            type: "condition",
            entry: { key: "visited", value: true },
          },
        },
      });
    });

    it("uses AND before OR", () => {
      expect(
        parseSearchQuery("region:europe OR region:asia language:french"),
      ).toEqual({
        type: "or",
        left: {
          type: "condition",
          entry: { key: "region", value: "europe" },
        },
        right: {
          type: "and",
          left: {
            type: "condition",
            entry: { key: "region", value: "asia" },
          },
          right: {
            type: "condition",
            entry: { key: "language", value: "french" },
          },
        },
      });
    });

    it("parses parenthesized expressions", () => {
      expect(
        parseSearchQuery("(region:europe OR region:asia) AND language:french"),
      ).toEqual({
        type: "and",
        left: {
          type: "or",
          left: {
            type: "condition",
            entry: { key: "region", value: "europe" },
          },
          right: {
            type: "condition",
            entry: { key: "region", value: "asia" },
          },
        },
        right: {
          type: "condition",
          entry: { key: "language", value: "french" },
        },
      });
    });

    it("handles nested parentheses", () => {
      expect(
        parseSearchQuery(
          "(region:europe OR (region:asia AND language:french))",
        ),
      ).toEqual({
        type: "or",
        left: {
          type: "condition",
          entry: { key: "region", value: "europe" },
        },
        right: {
          type: "and",
          left: {
            type: "condition",
            entry: { key: "region", value: "asia" },
          },
          right: {
            type: "condition",
            entry: { key: "language", value: "french" },
          },
        },
      });
    });

    it.each([
      "",
      "   ",
      "justtext",
      "prop:",
      "prop: alpha beta",
      'capital:"New York',
      "region:europe AND",
      "region:europe OR",
      "NOT",
      "(region:europe",
      "region:europe)",
      "()",
      "region:europe AND )",
      "region:europe OR )",
    ])("returns null for invalid query %s", (input) => {
      expect(parseSearchQuery(input)).toBeNull();
    });

    it("normalizes qualifier keys", () => {
      expect(parseSearchQuery("REGION:Europe")).toEqual({
        type: "condition",
        entry: { key: "region", value: "Europe" },
      });
    });

    it("coerces boolean values", () => {
      expect(parseSearchQuery("visited:yes")).toEqual({
        type: "condition",
        entry: { key: "visited", value: true },
      });

      expect(parseSearchQuery("visited:false")).toEqual({
        type: "condition",
        entry: { key: "visited", value: false },
      });
    });

    it("preserves non-boolean values", () => {
      expect(parseSearchQuery("capital:Paris")).toEqual({
        type: "condition",
        entry: { key: "capital", value: "Paris" },
      });
    });

    it("handles nullish input", () => {
      expect(parseSearchQuery(null as unknown as string)).toBeNull();
      expect(parseSearchQuery(undefined as unknown as string)).toBeNull();
    });
  });
});
