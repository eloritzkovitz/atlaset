import { describe, it, expect, afterEach, vi } from "vitest";
import type { KeyCommand } from "@types";
import {
  formatKeyCommand,
  formatShortcut,
  isRestrictedSingleKey,
  isTextInputFocused,
  matchModifiers,
} from "./keyboard";

describe("keyboard utils", () => {
  describe("isRestrictedSingleKey", () => {
    describe("System Modifiers (Ctrl, Alt, Meta)", () => {
      it("should return false if 'Ctrl' is present", () => {
        const cmd = { key: "k", modifiers: ["Ctrl"] } as const;
        expect(isRestrictedSingleKey(cmd)).toBe(false);
      });

      it("should return false if 'Alt' is present", () => {
        const cmd = { key: "e", modifiers: ["Alt"] } as const;
        expect(isRestrictedSingleKey(cmd)).toBe(false);
      });

      it("should return false if 'Meta' is present", () => {
        const cmd = { key: "z", modifiers: ["Meta"] } as const;
        expect(isRestrictedSingleKey(cmd)).toBe(false);
      });

      it("should return false if a system modifier is combined with Shift", () => {
        const cmd = { key: "a", modifiers: ["Ctrl", "Shift"] } as const;
        expect(isRestrictedSingleKey(cmd)).toBe(false);
      });
    });

    describe("Explicit Shift Modifier", () => {
      it("should return false if only 'Shift' is explicitly declared in modifiers", () => {
        const cmd = { key: "ArrowLeft", modifiers: ["Shift"] } as const;
        expect(isRestrictedSingleKey(cmd)).toBe(false);
      });

      it("should return false if Shift is present on a standard character", () => {
        const cmd = { key: "a", modifiers: ["Shift"] } as const;
        expect(isRestrictedSingleKey(cmd)).toBe(false);
      });
    });

    describe("System and Navigation Keys (length > 1)", () => {
      const systemKeys = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Enter",
        "Escape",
        "Tab",
        "Backspace",
        "Delete",
        "Home",
        "End",
        "PageUp",
        "PageDown",
        "Space",
      ];

      systemKeys.forEach((sysKey) => {
        it(`should return false for system key: '${sysKey}' with no modifiers`, () => {
          const cmd = { key: sysKey, modifiers: [] } as any;
          expect(isRestrictedSingleKey(cmd)).toBe(false);
        });
      });
    });

    describe("Shift-Mutated Symbols", () => {
      const shiftSymbols = [
        "!",
        "@",
        "#",
        "$",
        "%",
        "^",
        "&",
        "*",
        "(",
        ")",
        "_",
        "+",
        "{",
        "}",
        "|",
        ":",
        '"',
        "<",
        ">",
        "?",
        "~",
      ];

      shiftSymbols.forEach((symbol) => {
        it(`should return false for shifted symbol: '${symbol}'`, () => {
          const cmd = { key: symbol, modifiers: [] } as any;
          expect(isRestrictedSingleKey(cmd)).toBe(false);
        });
      });
    });

    describe("Restricted Standalone Keys (True Single-Key Actions)", () => {
      const restrictedKeys = ["a", "z", "A", "Z", "0", "9", "-", "=", "/", ","];

      restrictedKeys.forEach((charKey) => {
        it(`should return true for restricted standalone key: '${charKey}'`, () => {
          const cmd = { key: charKey, modifiers: [] } as any;
          expect(isRestrictedSingleKey(cmd)).toBe(true);
        });
      });
    });
  });

  describe("isTextInputFocused", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should return false if no element is focused", () => {
      vi.spyOn(document, "activeElement", "get").mockReturnValue(null);
      expect(isTextInputFocused()).toBe(false);
    });

    it("should return false for a standard neutral element like a div", () => {
      const div = document.createElement("div");
      vi.spyOn(document, "activeElement", "get").mockReturnValue(div);
      expect(isTextInputFocused()).toBe(false);
    });

    it("should return true when an input element is focused", () => {
      const input = document.createElement("input");
      vi.spyOn(document, "activeElement", "get").mockReturnValue(input);
      expect(isTextInputFocused()).toBe(true);
    });

    it("should return true when a textarea element is focused", () => {
      const textarea = document.createElement("textarea");
      vi.spyOn(document, "activeElement", "get").mockReturnValue(textarea);
      expect(isTextInputFocused()).toBe(true);
    });

    it("should return true when an element with contentEditable is focused", () => {
      const editableDiv = document.createElement("div");

      Object.defineProperty(editableDiv, "isContentEditable", {
        value: true,
        configurable: true,
      });

      vi.spyOn(document, "activeElement", "get").mockReturnValue(editableDiv);
      expect(isTextInputFocused()).toBe(true);
    });
  });

  describe("matchModifiers", () => {
    const createMockEvent = (props: Partial<KeyboardEvent>) => {
      return {
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        ...props,
      } as KeyboardEvent;
    };

    it("should return true if no modifiers are required and none are pressed", () => {
      const event = createMockEvent({});
      expect(matchModifiers(event, [])).toBe(true);
    });

    it("should match required modifiers successfully", () => {
      const event = createMockEvent({ ctrlKey: true, shiftKey: true });
      expect(matchModifiers(event, ["Ctrl", "Shift"])).toBe(true);
    });

    it("should return false if a required modifier is missing", () => {
      const event = createMockEvent({ ctrlKey: true });
      expect(matchModifiers(event, ["Ctrl", "Alt"])).toBe(false);
    });

    it("should ignore unrequired modifiers being active", () => {
      const event = createMockEvent({ ctrlKey: true, shiftKey: true });
      expect(matchModifiers(event, ["Ctrl"])).toBe(true);
    });
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
