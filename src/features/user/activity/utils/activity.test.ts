import { describe, it, expect, vi } from "vitest";
import { authState, mockUser } from "@test-utils/mockUser";
import { firestoreMocks } from "@test-utils/mockDbAndFirestore";
import * as firebaseUtils from "@utils/firebase";
import * as activityUtils from "./activity";
import type { CollectionReference, DocumentData } from "firebase/firestore";

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
  const actual = await vi.importActual<typeof import("../../../../firebase")>(
    "./firebase"
  );
  return {
    ...actual,
    getCurrentUser: vi.fn(() => mockUser),
  };
});

describe("getActivityDescription", () => {
  it("renders a template with details", () => {
    const desc = activityUtils.getActivityDescription(101, {
      userName: "Alice",
    });
    expect(desc).toContain("Alice");
  });
  it("uses default for missing userName", () => {
    const desc = activityUtils.getActivityDescription(101, {});
    expect(desc).toContain("You");
  });
  it("returns fallback for unknown event", () => {
    const desc = activityUtils.getActivityDescription(999, { userName: "Bob" });
    expect(desc).toContain("Bob did something");
  });
});

describe("logUserActivity", () => {
  it("calls addDoc with correct params", async () => {
    const mockAddDoc = firestoreMocks.addDoc as unknown as jest.Mock;
    if (mockAddDoc.mockClear) mockAddDoc.mockClear();
    // Properly declare mockCollection and mock getUserCollection
    const mockCollection = {} as unknown as CollectionReference<DocumentData>;
    const getUserCollection = vi.spyOn(firebaseUtils, "getUserCollection");
    getUserCollection.mockReturnValue(mockCollection);
    await activityUtils.logUserActivity(101, { foo: "bar" }, "uid123");
    expect(firestoreMocks.addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        event: 101,
        data: { foo: "bar" },
        uid: "uid123",
        timestamp: expect.any(Number),
      })
    );
    getUserCollection.mockRestore();
  });
});
