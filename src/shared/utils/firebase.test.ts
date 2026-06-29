import { describe, it, expect, beforeEach, vi } from "vitest";
import { authState, createMockUser } from "@test-utils/authMocks";
import * as firebaseUtils from "./firebase";

const mockUser = createMockUser();

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({
    get currentUser() {
      return authState.currentUser;
    },
  })),
}));

const mockCollection = vi.fn();
vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(() => ({})),
  collection: (...args: any[]) => mockCollection(...args),
}));

vi.mock("@app/firebase", () => ({
  auth: {},
  db: {},
}));

describe("firebase utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCollection.mockReset();
  });

  describe("isAuthenticated", () => {
    it("returns true when user is present", () => {
      authState.currentUser = mockUser;
      expect(firebaseUtils.isAuthenticated()).toBe(true);
    });

    it("returns false when user is absent", () => {
      authState.currentUser = null;
      expect(firebaseUtils.isAuthenticated()).toBe(false);
    });
  });

  describe("getCurrentUser", () => {
    it("returns the current user object", () => {
      authState.currentUser = mockUser;
      expect(firebaseUtils.getCurrentUser()).toEqual(mockUser);
    });
  });

  describe("getUserCollection", () => {
    it("throws if not authenticated", () => {
      authState.currentUser = null;
      expect(() => firebaseUtils.getUserCollection("markers")).toThrow(
        "Not authenticated",
      );
    });

    it("returns a collection if authenticated", () => {
      authState.currentUser = mockUser;
      mockCollection.mockReturnValue({ id: "mockCollection" });

      const result = firebaseUtils.getUserCollection("markers");

      expect(result).toEqual({ id: "mockCollection" });
      expect(mockCollection).toHaveBeenCalledWith(
        expect.any(Object),
        "users",
        "test-user",
        "markers",
      );
    });
  });
});
