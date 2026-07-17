import { describe, it, expect, beforeEach, vi } from "vitest";
import * as authModule from "firebase/auth";
import { createMockUser } from "@test-utils/authMocks";
import { isAuthenticated, getCurrentUser, getUserCollection } from "./firebase";
import { mockFirestoreControls } from "@test-utils/firebaseMockRegistry";

vi.unmock("@utils/firebase");
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

    expect(() => getUserCollection("markers")).toThrow("Not authenticated");
  });

  describe("getUserCollection", () => {
    it("returns a collection if authenticated", () => {
      vi.mocked(authModule.getAuth).mockReturnValue({
        currentUser: mockUser,
      } as any);
      mockFirestoreControls.collection.mockReturnValue({
        id: "mockCollection",
      });

      const result = getUserCollection("markers");

      expect(result).toEqual({ id: "mockCollection" });
    });
  });
});
