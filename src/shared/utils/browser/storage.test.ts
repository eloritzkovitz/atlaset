import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getCachedValue, removeCachedValue, setCachedValue } from "./storage";

describe("storage utilities", () => {
  const TEST_KEY = "test_key";

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getCachedValue", () => {
    it("returns parsed value when key exists in localStorage", () => {
      localStorage.setItem(TEST_KEY, JSON.stringify({ theme: "dark" }));
      const result = getCachedValue(TEST_KEY, { theme: "light" });
      expect(result).toEqual({ theme: "dark" });
    });

    it("returns fallback value when key does not exist", () => {
      const result = getCachedValue(TEST_KEY, "fallback_value");
      expect(result).toBe("fallback_value");
    });

    it("correctly handles falsy JSON values (false, 0, empty string)", () => {
      localStorage.setItem(TEST_KEY, JSON.stringify(false));
      const result = getCachedValue(TEST_KEY, true);
      expect(result).toBe(false);
    });

    it("returns fallback and logs warning when JSON parsing fails", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      localStorage.setItem(TEST_KEY, "{ invalid_json ");
      const result = getCachedValue(TEST_KEY, "fallback");
      expect(result).toBe("fallback");
      expect(consoleSpy).toHaveBeenCalledWith(
        `Failed to retrieve cache for key "${TEST_KEY}":`,
        expect.any(SyntaxError),
      );
    });
  });

  describe("setCachedValue", () => {
    it("serializes and stores value in localStorage", () => {
      const data = { accent: "blue", enabled: true };
      setCachedValue(TEST_KEY, data);
      const stored = localStorage.getItem(TEST_KEY);
      expect(stored).toBe(JSON.stringify(data));
    });

    it("logs warning gracefully when localStorage.setItem throws an error", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });
      setCachedValue(TEST_KEY, "data");
      expect(consoleSpy).toHaveBeenCalledWith(
        `Failed to update cache for key "${TEST_KEY}":`,
        expect.any(Error),
      );
    });
  });

  describe("removeCachedValue", () => {
    it("removes the specified key from localStorage", () => {
      localStorage.setItem(TEST_KEY, "to_be_removed");
      removeCachedValue(TEST_KEY);
      expect(localStorage.getItem(TEST_KEY)).toBeNull();
    });

    it("logs warning gracefully when localStorage.removeItem throws an error", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });
      removeCachedValue(TEST_KEY);
      expect(consoleSpy).toHaveBeenCalledWith(
        `Failed to remove cache for key "${TEST_KEY}":`,
        expect.any(Error),
      );
    });
  });

  describe("SSR environment (typeof window === 'undefined')", () => {
    const originalWindow = globalThis.window;

    beforeEach(() => {
      // @ts-expect-error simulating non-browser environment
      delete globalThis.window;
    });

    afterEach(() => {
      globalThis.window = originalWindow;
    });

    it("returns fallback in getCachedValue when window is undefined", () => {
      const result = getCachedValue(TEST_KEY, "ssr_fallback");
      expect(result).toBe("ssr_fallback");
    });

    it("returns early in setCachedValue without throwing when window is undefined", () => {
      expect(() => setCachedValue(TEST_KEY, "data")).not.toThrow();
    });

    it("returns early in removeCachedValue without throwing when window is undefined", () => {
      expect(() => removeCachedValue(TEST_KEY)).not.toThrow();
    });
  });
});
