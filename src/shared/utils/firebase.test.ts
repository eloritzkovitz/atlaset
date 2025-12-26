import { describe, it, expect, beforeEach, vi } from "vitest";
import { authState, mockUser } from "@test-utils/mockUser";
import {
  firestoreMocks,
  authMocks,
  resetAllMocks,
} from "@test-utils/mockDbAndFirestore";

// Mock Firebase Auth module
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
  ...firestoreMocks,
  getFirestore: vi.fn(() => ({})),
}));

// Mock the firebase utility module itself
vi.mock("./firebase", async () => {
  // Import the actual module so you can override its exports
  const actual = await vi.importActual<typeof import("./firebase")>(
    "./firebase"
  );
  return {
    ...actual,
    getCurrentUser: vi.fn(() => mockUser),
  };
});

// Import the firebase utils after mocking
import * as firebaseUtils from "./firebase";

describe("firebase utils", () => {
  beforeEach(() => {
    resetAllMocks(firestoreMocks, authMocks);
    vi.restoreAllMocks();
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
      (firebaseUtils.getCurrentUser as any).mockReturnValue(mockUser);
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
      firestoreMocks.collection.mockReturnValue({ id: "mockCollection" });

      const result = firebaseUtils.getUserCollection("markers");
      expect(result).toEqual({ id: "mockCollection" });
      expect(firestoreMocks.collection).toHaveBeenCalled();
    });

    it("returns a collection if authenticated", () => {
      (firebaseUtils.getCurrentUser as any).mockReturnValue(mockUser);
      firestoreMocks.collection.mockReturnValue({ id: "mockCollection" });

      const result = firebaseUtils.getUserCollection("markers");
      expect(result).toEqual({ id: "mockCollection" });
      expect(firestoreMocks.collection).toHaveBeenCalled();
    });
  });  
});
