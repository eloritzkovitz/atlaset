import type { User } from "firebase/auth";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMockUser } from "@test-utils/authMocks";
import { isAuthenticated, getCurrentUser } from "./auth";

const mockAuth = vi.hoisted<{ currentUser: User | null }>(() => ({
  currentUser: null,
}));

vi.mock("./config", () => ({
  auth: mockAuth,
}));

const mockUser = createMockUser({ uid: "test-user" });

beforeEach(() => {
  mockAuth.currentUser = null;
});

describe("firebase utils", () => {
  describe("isAuthenticated / getCurrentUser", () => {
    it("returns correctly when user is present", () => {
      mockAuth.currentUser = mockUser;

      expect(isAuthenticated()).toBe(true);
      expect(getCurrentUser()).toEqual(mockUser);
    });

    it("returns correctly when no user is present", () => {
      expect(isAuthenticated()).toBe(false);
      expect(getCurrentUser()).toBeNull();
    });
  });
});
