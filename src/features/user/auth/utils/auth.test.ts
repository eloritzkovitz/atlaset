import type { User } from "firebase/auth";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { auth } from "@lib/firebase/config";
import {
  isPasswordProvider,
  requireCurrentUser,
  toSerializableUser,
  type MinimalProviderData,
} from "./auth";

vi.mock("@lib/firebase/config", () => ({
  auth: {
    currentUser: null,
  },
}));

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

  describe("requireCurrentUser", () => {
    const mockUser = {
      uid: "user_123",
      email: "test@example.com",
    } as User;

    const mockSerializableUser = {
      uid: "user_123",
      email: "test@example.com",
      displayName: null,
      photoURL: null,
      emailVerified: true,
      phoneNumber: null,
      providerId: "password",
      createdAt: null,
      lastSignInTime: null,
    };

    it("returns the SDK user when authenticated and no userState is provided", () => {
      (auth as { currentUser: User | null }).currentUser = mockUser;

      const result = requireCurrentUser();
      expect(result).toBe(mockUser);
    });

    it("returns the SDK user when both SDK user and valid userState exist", () => {
      (auth as { currentUser: User | null }).currentUser = mockUser;

      const result = requireCurrentUser(mockSerializableUser);
      expect(result).toBe(mockUser);
    });

    it("throws an error if SDK currentUser is missing", () => {
      (auth as { currentUser: User | null }).currentUser = null;

      expect(() => requireCurrentUser(mockSerializableUser)).toThrow(
        "No authenticated user found.",
      );
    });

    it("throws an error if userState is explicitly null despite SDK user existing", () => {
      (auth as { currentUser: User | null }).currentUser = mockUser;

      expect(() => requireCurrentUser(null)).toThrow(
        "No authenticated user found.",
      );
    });
  });
});
