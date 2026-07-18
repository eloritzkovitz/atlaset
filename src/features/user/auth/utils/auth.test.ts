import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  isPasswordProvider,
  isUserDeactivated,
  type MinimalProviderData,
} from "./auth";

describe("auth utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("isPasswordProvider", () => {
    it("returns true if user contains a password provider profile", () => {
      const providerData: MinimalProviderData[] = [{ providerId: "password" }];
      expect(isPasswordProvider(providerData)).toBe(true);
    });

    it("returns false if user signed up with a different provider (e.g., Google)", () => {
      const providerData: MinimalProviderData[] = [
        { providerId: "google.com" },
      ];
      expect(isPasswordProvider(providerData)).toBe(false);
    });

    it("handles null or undefined safely", () => {
      expect(isPasswordProvider(null)).toBe(false);
      expect(isPasswordProvider(undefined)).toBe(false);
    });
  });

  describe("isUserDeactivated", () => {
    it("returns true if the status flag is exactly 'deactivated'", () => {
      expect(isUserDeactivated("deactivated")).toBe(true);
    });

    it("returns false if the status flag is 'active'", () => {
      expect(isUserDeactivated("active")).toBe(false);
    });

    it("handles an empty string safely", () => {
      expect(isUserDeactivated("")).toBe(false);
    });

    it("handles null or undefined status flags safely", () => {
      expect(isUserDeactivated(null)).toBe(false);
      expect(isUserDeactivated(undefined)).toBe(false);
    });
  });
});
