import { vi, describe, it, expect, beforeEach } from "vitest";
import { resolveTheme, applyTheme } from "./theme";
import type { DisplaySettings } from "../types";

describe("resolveTheme", () => {
  it("should return explicit 'dark' or 'light' preferences directly", () => {
    expect(resolveTheme("dark")).toBe("dark");
    expect(resolveTheme("light")).toBe("light");
  });

  it("should default to 'dark' if preference is missing or undefined", () => {
    expect(resolveTheme(undefined)).toBe("dark");
  });

  describe("when preference is 'system'", () => {
    const setMatchMedia = (matches: boolean) => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        configurable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query === "(prefers-color-scheme: dark)" ? matches : false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
    };

    it("should resolve to 'dark' when prefers-color-scheme is dark", () => {
      setMatchMedia(true);
      expect(resolveTheme("system")).toBe("dark");
    });

    it("should resolve to 'light' when prefers-color-scheme is not dark", () => {
      setMatchMedia(false);
      expect(resolveTheme("system")).toBe("light");
    });
  });
});

describe("applyTheme", () => {
  beforeEach(() => {
    document.documentElement.className = "";
    document.documentElement.removeAttribute("style");
  });

  it("should apply 'dark' class and default 'blue' accent correctly", () => {
    const settings: DisplaySettings = { theme: "dark", accent: "blue" };

    applyTheme(settings);

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(
      document.documentElement.style.getPropertyValue("--color-primary"),
    ).toBe("var(--color-primary-default)");
    expect(
      document.documentElement.style.getPropertyValue("--color-primary-hover"),
    ).toBe("var(--color-accent-blue-hover)");
    expect(
      document.documentElement.style.getPropertyValue("--color-primary-active"),
    ).toBe("var(--color-accent-blue-active)");
  });

  it("should remove 'dark' class for light mode and set custom accent colors", () => {
    document.documentElement.classList.add("dark");
    const settings: DisplaySettings = { theme: "light", accent: "indigo" };

    applyTheme(settings);

    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(
      document.documentElement.style.getPropertyValue("--color-primary"),
    ).toBe("var(--color-accent-indigo)");
    expect(
      document.documentElement.style.getPropertyValue("--color-primary-hover"),
    ).toBe("var(--color-accent-indigo-hover)");
    expect(
      document.documentElement.style.getPropertyValue("--color-primary-active"),
    ).toBe("var(--color-accent-indigo-active)");
  });

  it("should gracefully handle missing or empty settings object", () => {
    applyTheme(undefined);

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(
      document.documentElement.style.getPropertyValue("--color-primary"),
    ).toBe("var(--color-primary-default)");
    expect(
      document.documentElement.style.getPropertyValue("--color-primary-hover"),
    ).toBe("var(--color-accent-blue-hover)");
  });
});
