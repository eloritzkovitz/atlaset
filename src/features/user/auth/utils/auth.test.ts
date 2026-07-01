import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockUser } from "@test-utils/authMocks";
import { mockFirestoreControls as fs } from "@test-utils/firebaseMockRegistry";
import { isPasswordProvider, checkAndReactivateUser } from "./auth";

vi.mock("@app/firebase", () => ({
  db: {},
}));

describe("auth utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("isPasswordProvider", () => {
    it("returns true if user contains a password provider profile", () => {
      const user = createMockUser({
        providerData: [{ providerId: "password" } as any],
      });
      expect(isPasswordProvider(user)).toBe(true);
    });

    it("returns false if user signed up with a different provider (e.g., Google)", () => {
      const user = createMockUser({
        providerData: [{ providerId: "google.com" } as any],
      });
      expect(isPasswordProvider(user)).toBe(false);
    });

    it("handles null or undefined safely", () => {
      expect(isPasswordProvider(null)).toBe(false);
      expect(isPasswordProvider(undefined)).toBe(false);
    });
  });

  describe("checkAndReactivateUser", () => {
    const mockUser = createMockUser({ uid: "reactivate-test-uid" });

    it("reactivates a deactivated user profile and returns true", async () => {
      fs.getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ status: "deactivated" }),
      });

      const wasReactivated = await checkAndReactivateUser(mockUser);

      expect(wasReactivated).toBe(true);

      expect(fs.doc).toHaveBeenCalledWith(
        expect.any(Object),
        "users",
        "reactivate-test-uid",
      );

      expect(fs.setDoc).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({
          status: "active",
          reactivatedAt: expect.any(String),
        }),
        { merge: true },
      );
    });

    it("skips reactivation and returns false if user is already active", async () => {
      fs.getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ status: "active" }),
      });

      const wasReactivated = await checkAndReactivateUser(mockUser);

      expect(wasReactivated).toBe(false);
      expect(fs.setDoc).not.toHaveBeenCalled();
    });

    it("handles missing database profiles safely", async () => {
      fs.getDoc.mockResolvedValueOnce({
        exists: () => false,
      });

      const wasReactivated = await checkAndReactivateUser(mockUser);

      expect(wasReactivated).toBe(false);
      expect(fs.setDoc).not.toHaveBeenCalled();
    });
  });
});
