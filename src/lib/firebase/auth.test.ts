import { describe, it, expect, beforeEach, vi } from "vitest";
import * as authModule from "firebase/auth";
import { createMockUser } from "@test-utils/authMocks";
import { isAuthenticated, getCurrentUser } from "./auth";

vi.unmock("./firebase");
vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
}));

const mockUser = createMockUser({ uid: "test-user" });

describe("firebase utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("isAuthenticated / getCurrentUser", () => {
    it("returns correctly when user is present", () => {
      vi.mocked(authModule.getAuth).mockReturnValue({
        currentUser: mockUser,
      } as any);

      expect(isAuthenticated()).toBe(true);
      expect(getCurrentUser()).toEqual(mockUser);
    });
  });

  it("throws if not authenticated", () => {
    vi.mocked(authModule.getAuth).mockReturnValue({
      currentUser: null,
    } as any);

    expect(isAuthenticated()).toBe(false);
  });
});
