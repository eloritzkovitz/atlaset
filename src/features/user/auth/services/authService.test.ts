import { vi, describe, it, expect, beforeEach } from "vitest";
import { type User } from "firebase/auth";
import { getDocsData, getPaths } from "@lib/firebase";
import { migrationService } from "@services/migrationService";
import { activityMockTracker } from "@test-utils/activityMocks";
import { createMockUser } from "@test-utils/authMocks";
import {
  mockNativeAuthControls as auth,
  mockFirestoreControls as fs,
} from "@test-utils/firebaseMockRegistry";
import { createMockSnapshot } from "@test-utils/firestoreMocks";
import { authService } from "./authService";
import { sessionService } from "./sessionService";
import { friendService } from "../../friends/services/friendService";
import { isUserDeactivated } from "../utils/auth";

vi.mock("@app/db", () => ({
  appDb: {
    countryLists: { count: vi.fn() },
    layers: { count: vi.fn() },
    markers: { count: vi.fn() },
    settings: { count: vi.fn() },
  },
}));

vi.mock("@app/firebase", () => ({
  auth: auth.auth,
  db: {},
}));

vi.mock("@services/migrationService", () => ({
  migrationService: {
    hasGuestData: vi.fn(() => Promise.resolve(false)),
    migrateGuestDataToFirestore: vi.fn(() => Promise.resolve()),
  },
}));

vi.mock("./sessionService", () => ({
  sessionService: {
    logSession: vi.fn(() => Promise.resolve()),
    terminateSession: vi.fn(() => Promise.resolve()),
  },
}));

vi.mock("../../friends/services/friendService", () => ({
  friendService: { removeFriend: vi.fn() },
}));

vi.mock("../../profile/services/profileService", () => ({
  profileService: {
    createUserProfileWithUsername: vi.fn(() =>
      Promise.resolve("mocked_username"),
    ),
  },
}));

vi.mock("../utils/auth", () => ({
  checkAndReactivateUser: vi.fn(() => Promise.resolve(false)),
  isUserDeactivated: vi.fn(() => false),
}));

vi.mock("../utils/session", () => ({
  getBrowserSessionInfo: vi.fn(() => ({
    userAgent: "mock-agent",
    language: "en-US",
    screen: "1920x1080",
  })),
}));

describe("authService", () => {
  let freshUser: User;

  beforeEach(() => {
    vi.clearAllMocks();
    freshUser = createMockUser() as unknown as User;
    auth.auth.currentUser = freshUser;
    auth.signInWithEmailAndPassword.mockResolvedValue({ user: freshUser });
    auth.createUserWithEmailAndPassword.mockResolvedValue({ user: freshUser });
    auth.signInWithPopup.mockResolvedValue({ user: freshUser });

    const pathsToWire = [
      "user",
      "users",
      "username",
      "usernames",
      "activity",
      "countryLists",
      "layers",
      "markers",
      "savedMaps",
      "sessions",
      "settings",
    ];

    for (const p of pathsToWire) {
      if (!(p in getPaths)) {
        (getPaths as any)[p] = vi.fn((...args: string[]) =>
          fs.collection({} as any, `mock_path_${p}_${args.join("_")}`),
        );
      }
    }

    fs.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ status: "active" }),
    });

    fs.getDocs.mockResolvedValue(
      createMockSnapshot([{ id: "friend_id", data: { uid: "test-user" } }]),
    );
  });

  it("signIn handles active accounts, migrates guest data if present, and records the active browser session", async () => {
    vi.mocked(migrationService.hasGuestData).mockResolvedValueOnce(true);

    const res = await authService.signIn("test@example.com", "pass");

    expect(res.user.uid).toBe("test-user");
    expect(migrationService.migrateGuestDataToFirestore).toHaveBeenCalled();
    expect(activityMockTracker).toHaveBeenCalledWith(
      102,
      expect.any(Object),
      "test-user",
    );
    expect(sessionService.logSession).toHaveBeenCalledWith("test-user");
  });

  it("signInWithPersistence toggles local vs session states and triggers session logging along with migration", async () => {
    vi.mocked(migrationService.hasGuestData).mockResolvedValueOnce(true);

    await authService.signInWithPersistence("test@example.com", "pass", true);
    expect(auth.setPersistence).toHaveBeenCalledWith(
      expect.any(Object),
      "local",
    );
    expect(migrationService.migrateGuestDataToFirestore).toHaveBeenCalled();
    expect(sessionService.logSession).toHaveBeenCalledWith("test-user");

    fs.getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ status: "deactivated" }),
    });
    vi.mocked(isUserDeactivated).mockReturnValueOnce(true);
    vi.mocked(migrationService.hasGuestData).mockResolvedValueOnce(false);

    await authService.signInWithPersistence("test@example.com", "pass", false);
    expect(auth.setPersistence).toHaveBeenCalledWith(
      expect.any(Object),
      "session",
    );
    expect(migrationService.migrateGuestDataToFirestore).toHaveBeenCalledTimes(
      1,
    );
    expect(activityMockTracker).toHaveBeenCalledWith(
      111,
      expect.any(Object),
      "test-user",
    );
    expect(sessionService.logSession).toHaveBeenCalledTimes(2);
  });

  it("signUp creates profile, registers metadata, and initializes a session entry", async () => {
    const res = await authService.signUp("test@example.com", "pass");
    expect(res.username).toBe("mocked_username");
    expect(activityMockTracker).toHaveBeenCalledWith(
      101,
      expect.any(Object),
      "test-user",
    );
    expect(sessionService.logSession).toHaveBeenCalledWith("test-user");
  });

  it("logout completely tears down state and terminates active session tracker records", async () => {
    await authService.logout();
    expect(auth.signOut).toHaveBeenCalled();
    expect(auth.auth.currentUser).toBeNull();
    expect(activityMockTracker).toHaveBeenCalledWith(103, {}, "test-user");
    expect(sessionService.terminateSession).toHaveBeenCalledWith("test-user");
  });

  it("resetPassword sends reset tracking email", async () => {
    await authService.resetPassword("test@example.com");
    expect(auth.sendPasswordResetEmail).toHaveBeenCalled();
    expect(activityMockTracker).toHaveBeenCalledWith(
      104,
      { email: "test@example.com" },
      "test-user",
    );
  });

  it("updateUserProfile patches auth records and logs change", async () => {
    await authService.updateUserProfile(freshUser, { displayName: "New" });
    expect(auth.updateProfile).toHaveBeenCalledWith(freshUser, {
      displayName: "New",
    });
    expect(activityMockTracker).toHaveBeenCalledWith(
      120,
      expect.any(Object),
      "test-user",
    );
  });

  it("signInWithGoogle registers implicit user profiles and connects session pipeline", async () => {
    const res = await authService.signInWithGoogle();
    expect(res.user.uid).toBe("test-user");
    expect(auth.signInWithPopup).toHaveBeenCalled();
    expect(sessionService.logSession).toHaveBeenCalledWith("test-user");
  });

  it("deactivateAccount updates flags and kills live sessions", async () => {
    await authService.deactivateAccount(freshUser);

    expect(fs.setDoc).toHaveBeenCalledWith(
      getPaths.user(freshUser.uid),
      expect.objectContaining({ status: "deactivated" }),
      { merge: true },
    );
    expect(activityMockTracker).toHaveBeenCalledWith(110, {}, "test-user");
    expect(sessionService.terminateSession).toHaveBeenCalledWith("test-user");
  });

  it("deleteAppAccount completely purges subcollections including sessions, and wipes references", async () => {
    await authService.deleteAppAccount(freshUser);

    expect(getDocsData).toHaveBeenCalledWith(getPaths.users());
    expect(friendService.removeFriend).toHaveBeenCalled();
    expect(fs.deleteDoc).toHaveBeenCalled();
    expect(auth.deleteUser).toHaveBeenCalledWith(freshUser);
  });

  it("handleReactivation runs database changes and returns true if user status is deactivated", async () => {
    fs.getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ status: "deactivated" }),
    });
    vi.mocked(isUserDeactivated).mockReturnValueOnce(true);

    const wasReactivated = await authService.handleReactivation("test-user");

    expect(wasReactivated).toBe(true);
    expect(fs.setDoc).toHaveBeenCalledWith(
      getPaths.user("test-user"),
      expect.objectContaining({ status: "active" }),
      { merge: true },
    );
  });

  it("handleReactivation skips updates and returns false if user status is already active", async () => {
    fs.getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ status: "active" }),
    });
    vi.mocked(isUserDeactivated).mockReturnValueOnce(false);

    const wasReactivated = await authService.handleReactivation("test-user");

    expect(wasReactivated).toBe(false);
    expect(fs.setDoc).not.toHaveBeenCalled();
  });
});
