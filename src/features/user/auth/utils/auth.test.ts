import type { User } from "firebase/auth";
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  isPasswordProvider,
  isUserDeactivated,
  toSerializableUser,
  type MinimalProviderData,
} from "./auth";

describe("auth utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("toSerializableUser", () => {
    it("transforms a complex Firebase User into a clean serializable object", () => {
      const mockFirebaseUser = {
        uid: "user_123",
        email: "test@example.com",
        displayName: "Alex Developer",
        photoURL: "https://example.com/avatar.png",
        emailVerified: true,
        phoneNumber: null,
        providerId: "password",
        metadata: {
          creationTime: "2024-01-01T00:00:00Z",
          lastSignInTime: "2024-01-02T00:00:00Z",
        },
        getIdToken: () => Promise.resolve("token_abc"),
      } as unknown as User;

      const result = toSerializableUser(mockFirebaseUser);

      expect(result).toEqual({
        uid: "user_123",
        email: "test@example.com",
        displayName: "Alex Developer",
        photoURL: "https://example.com/avatar.png",
        emailVerified: true,
        phoneNumber: null,
        providerId: "password",
        createdAt: "2024-01-01T00:00:00Z",
        lastSignInTime: "2024-01-02T00:00:00Z",
      });
      expect(result).not.toHaveProperty("getIdToken");
    });

    it("handles missing user or optional metadata fallback cleanly", () => {
      expect(toSerializableUser(null)).toBeNull();

      const mockUserNoMeta = {
        uid: "123",
        email: null,
        displayName: null,
        photoURL: null,
        emailVerified: false,
        phoneNumber: null,
        providerId: null,
        metadata: {},
      } as unknown as User;

      expect(toSerializableUser(mockUserNoMeta)?.createdAt).toBeNull();
      expect(toSerializableUser(mockUserNoMeta)?.lastSignInTime).toBeNull();
    });
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
