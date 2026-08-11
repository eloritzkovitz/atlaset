import { describe, it, expect } from "vitest";
import { isLocalhost, isWindowDefined } from "./env";

describe("env utils", () => {
  describe("isWindowDefined", () => {
    it("isWindowDefined returns a boolean", () => {
      expect(typeof isWindowDefined()).toBe("boolean");
    });
  });

  describe("isLocalhost", () => {
    const originalWindow = global.window;

    afterEach(() => {
      global.window = originalWindow;
      vi.restoreAllMocks();
    });

    it("returns false during SSR when no parameter is passed", () => {
      // @ts-expect-error - Testing SSR environment
      delete global.window;
      expect(isLocalhost()).toBe(false);
    });

    it.each([
      ["localhost", true],
      ["127.0.0.1", true],
      ["[::1]", true],
      ["::1", true],
      ["dev.local", true],
      ["192.168.1.15", true],
      ["10.0.0.1", true],
      ["example.com", false],
      ["local.com", false],
    ])("evaluates target '%s' correctly", (target, expected) => {
      vi.stubGlobal("window", { location: { hostname: target } });
      expect(isLocalhost()).toBe(expected);
      expect(isLocalhost(target)).toBe(expected);
    });
  });
});
