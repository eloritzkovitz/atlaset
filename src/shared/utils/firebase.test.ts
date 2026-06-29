import { describe, it, expect, beforeEach, vi } from "vitest";
import { authState, mockUser } from "@test-utils/mockUser";

const mocks = vi.hoisted(() => ({
  collection: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({
    currentUser: authState.currentUser,
    app: {} as any,
    name: "",
    config: {},
    setPersistence: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn(),
  })),
  onAuthStateChanged: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(() => ({})),
  collection: mocks.collection,
}));

import * as firebaseUtils from "./firebase";

describe("firebase utils", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mocks.collection.mockReset();
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
      const user = firebaseUtils.getCurrentUser();
      expect(user).toEqual(mockUser);
    });
  });

  describe("getUserCollection", () => {
    it("throws if not authenticated", () => {
      authState.currentUser = null;
      expect(() => firebaseUtils.getUserCollection("markers")).toThrow();
    });

    it("returns a collection if authenticated", () => {
      authState.currentUser = mockUser;
      mocks.collection.mockReturnValue({ id: "mockCollection" });

      const result = firebaseUtils.getUserCollection("markers");

      expect(result).toEqual({ id: "mockCollection" });
      expect(mocks.collection).toHaveBeenCalled();
    });
  });
});
