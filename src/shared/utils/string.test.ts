import type { KeyCommand } from "@types";
import {
  capitalize,
  capitalizeWords,
  getArticle,
  pluralize,
  truncate,
  normalizeString,
  slugify,
  isNumericString,
  hasStringChildren,
  formatShortcut,
  formatKeyCommand,
} from "./string";

describe("string utils", () => {
  it("capitalize capitalizes the first letter", () => {
    expect(capitalize("hello")).toBe("Hello");
    expect(capitalize("h")).toBe("H");
    expect(capitalize("")).toBe("");
  });

  it("capitalizeWords capitalizes each word", () => {
    expect(capitalizeWords("hello world")).toBe("Hello World");
    expect(capitalizeWords("foo bar baz")).toBe("Foo Bar Baz");
    expect(capitalizeWords("a")).toBe("A");
    expect(capitalizeWords("")).toBe("");
  });

  it("getArticle returns correct article", () => {
    expect(getArticle("apple")).toBe("an");
    expect(getArticle("banana")).toBe("a");
    expect(getArticle("")).toBe("a");
  });

  it("pluralize adds 's' for counts not equal to 1", () => {
    expect(pluralize("item", 1)).toBe("item");
    expect(pluralize("item", 0)).toBe("items");
    expect(pluralize("item", 2)).toBe("items");
  });

  it("truncate adds ellipsis if needed", () => {
    expect(truncate("hello world", 5)).toBe("hello…");
    expect(truncate("short", 10)).toBe("short");
    expect(truncate("", 2)).toBe("");
  });

  it("normalizeString removes diacritics and lowercases", () => {
    expect(normalizeString("Élégant")).toBe("elegant");
    expect(normalizeString("Café")).toBe("cafe");
    expect(normalizeString("HELLO")).toBe("hello");
    expect(normalizeString("")).toBe("");
  });

  it("slugify creates a URL-friendly slug", () => {
    expect(slugify("Hello World!")).toBe("hello-world");
    expect(slugify("Café au lait")).toBe("cafe-au-lait");
    expect(slugify("  Multiple   Spaces  ")).toBe("multiple-spaces");
    expect(slugify("")).toBe("");
  });

  it("isNumericString detects numeric strings", () => {
    expect(isNumericString("123")).toBe(true);
    expect(isNumericString("-99")).toBe(true);
    expect(isNumericString("GB-ENG")).toBe(false);
    expect(isNumericString("ABC")).toBe(false);
    expect(isNumericString("")).toBe(false);
    expect(isNumericString(null)).toBe(false);
  });

  it("hasStringChildren detects string children", () => {
    expect(hasStringChildren({ children: "hello" })).toBe(true);
    expect(hasStringChildren({ children: 123 })).toBe(false);
    expect(hasStringChildren({})).toBe(false);
    expect(hasStringChildren({ children: null })).toBe(false);
  });

  describe("formatShortcut", () => {
    it("returns an empty string if commandId is null or undefined", () => {
      expect(formatShortcut(null)).toBe("");
      expect(formatShortcut(undefined)).toBe("");
    });

    it("returns an empty string if the commandId does not exist in keyCommands", () => {
      expect(formatShortcut("nonexistent.id" as any)).toBe("");
    });

    it("successfully passes a matched commandId configuration to the formatter", () => {
      expect(formatShortcut("shortcuts.show")).toBe("Shift+?");
    });
  });

  describe("formatKeyCommand", () => {
    it("formats standard string modifiers and capitalizes single letters with + separators", () => {
      const cmd: KeyCommand = {
        id: "test.show" as any,
        key: "a",
        modifiers: ["Meta", "Shift"],
        category: "General",
        labelKey: "test",
      };
      expect(formatKeyCommand(cmd)).toBe("Cmd+Shift+A");
    });

    it("falls back to the modifier string itself if it is missing from modifierMap", () => {
      const cmd: KeyCommand = {
        id: "test.unknown" as any,
        key: "k",
        modifiers: ["Option" as any],
        category: "General",
        labelKey: "test",
      };
      expect(formatKeyCommand(cmd)).toBe("Option+K");
    });

    it("converts a literal single space character to the string 'Space'", () => {
      const cmd: KeyCommand = {
        id: "test.space" as any,
        key: " ",
        modifiers: [],
        category: "General",
        labelKey: "test",
      };
      expect(formatKeyCommand(cmd)).toBe("Space");
    });

    it("maps arrow keys to their respective directional text descriptors", () => {
      const arrows: Array<[KeyCommand["key"], string]> = [
        ["ArrowUp", "Up"],
        ["ArrowDown", "Down"],
        ["ArrowLeft", "Left"],
        ["ArrowRight", "Right"],
      ];

      arrows.forEach(([arrowKey, expectedText]) => {
        const cmd: KeyCommand = {
          id: "test.arrow" as any,
          key: arrowKey,
          modifiers: [],
          category: "General",
          labelKey: "test",
        };
        expect(formatKeyCommand(cmd)).toBe(expectedText);
      });
    });

    it("does not change capitalization for multi-character keys like 'Esc' or 'Enter'", () => {
      const cmd: KeyCommand = {
        id: "test.multi" as any,
        key: "Esc",
        modifiers: [],
        category: "General",
        labelKey: "test",
      };
      expect(formatKeyCommand(cmd)).toBe("Esc");
    });

    it("handles standard combinations accurately with cross-platform conventions", () => {
      const cmd: KeyCommand = {
        id: "test.ctrl" as any,
        key: "z",
        modifiers: ["Ctrl", "Shift"],
        category: "General",
        labelKey: "test",
      };
      expect(formatKeyCommand(cmd)).toBe("Ctrl+Shift+Z");
    });
  });
});
