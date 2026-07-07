import { describe, it, expect } from "vitest";
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
  it.each([
    ["hello", "Hello"],
    ["h", "H"],
    ["", ""],
  ])("capitalize('%s') -> '%s'", (input, expected) => {
    expect(capitalize(input)).toBe(expected);
  });

  it.each([
    ["hello world", "Hello World"],
    ["foo bar baz", "Foo Bar Baz"],
    ["a", "A"],
    ["", ""],
  ])("capitalizeWords('%s') -> '%s'", (input, expected) => {
    expect(capitalizeWords(input)).toBe(expected);
  });

  it.each([
    ["apple", "an"],
    ["banana", "a"],
    ["", "a"],
  ])("getArticle('%s') -> '%s'", (input, expected) => {
    expect(getArticle(input)).toBe(expected);
  });

  it.each([
    ["item", 1, "item"],
    ["item", 0, "items"],
    ["item", 2, "items"],
  ])("pluralize('%s', %d) -> '%s'", (label, count, expected) => {
    expect(pluralize(label, count)).toBe(expected);
  });

  it.each([
    ["hello world", 5, "hello…"],
    ["short", 10, "short"],
    ["", 2, ""],
  ])("truncate('%s', %d) -> '%s'", (str, max, expected) => {
    expect(truncate(str, max)).toBe(expected);
  });

  it.each([
    ["Élégant", "elegant"],
    ["Café", "cafe"],
    ["HELLO", "hello"],
    ["", ""],
  ])("normalizeString('%s') -> '%s'", (input, expected) => {
    expect(normalizeString(input)).toBe(expected);
  });

  it.each([
    ["Hello World!", "hello-world"],
    ["Café au lait", "cafe-au-lait"],
    ["  Multiple   Spaces  ", "multiple-spaces"],
    ["", ""],
  ])("slugify('%s') -> '%s'", (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });

  it.each([
    ["123", true],
    ["-99", true],
    ["GB-ENG", false],
    ["ABC", false],
    ["", false],
    [null, false],
    [undefined, false],
  ])("isNumericString(%p) -> %p", (input, expected) => {
    expect(isNumericString(input)).toBe(expected);
  });

  it.each([
    [{ children: "hello" }, true],
    [{ children: 123 }, false],
    [{}, false],
    [{ children: null }, false],
    [null, false],
  ])("hasStringChildren(%p) -> %p", (input, expected) => {
    expect(hasStringChildren(input)).toBe(expected);
  });

  describe("formatShortcut", () => {
    it.each([
      [null, ""],
      [undefined, ""],
      ["nonexistent.id" as any, ""],
      ["shortcuts.show", "Shift+?"],
    ])("formatShortcut(%p) -> '%s'", (id, expected) => {
      expect(formatShortcut(id)).toBe(expected);
    });
  });

  describe("formatKeyCommand", () => {
    const defaultCmd = {
      id: "test-id" as any,
      category: "General",
      labelKey: "test",
    };

    it.each([
      [
        { ...defaultCmd, key: "a", modifiers: ["Meta", "Shift"] },
        "Cmd+Shift+A",
      ],
      [{ ...defaultCmd, key: "k", modifiers: ["Option" as any] }, "Option+K"],
      [{ ...defaultCmd, key: " ", modifiers: [] }, "Space"],
      [{ ...defaultCmd, key: "ArrowUp", modifiers: [] }, "Up"],
      [{ ...defaultCmd, key: "ArrowDown", modifiers: [] }, "Down"],
      [{ ...defaultCmd, key: "ArrowLeft", modifiers: [] }, "Left"],
      [{ ...defaultCmd, key: "ArrowRight", modifiers: [] }, "Right"],
      [{ ...defaultCmd, key: "Esc", modifiers: [] }, "Esc"],
      [
        { ...defaultCmd, key: "z", modifiers: ["Ctrl", "Shift"] },
        "Ctrl+Shift+Z",
      ],
    ])("formats command correctly", (cmd, expected) => {
      expect(formatKeyCommand(cmd as KeyCommand)).toBe(expected);
    });
  });
});
