import { vi, describe, it, expect, beforeEach } from "vitest";
import { activityMockTracker } from "@test-utils/activityMocks";
import { createMockUser } from "@test-utils/authMocks";
import {
  mockNativeAuthControls as auth,
  mockFirestoreControls as fs,
} from "@test-utils/firebaseMockRegistry";
import { createMockSnapshot } from "@test-utils/firestoreMocks";
import { authService } from "./authService";
import { checkAndReactivateUser } from "../utils/auth";
import { friendService } from "../../friends/services/friendService";

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
vi.mock("../../friends/services/friendService", () => ({
  friendService: { removeFriend: vi.fn() },
}));
vi.mock("../../profile/services/profileService", () => ({
  profileService: {
    createUserProfileWithUsername: vi.fn(() => "mocked_username"),
  },
}));
vi.mock("../utils/auth", () => ({
  checkAndReactivateUser: vi.fn(() => Promise.resolve(false)),
}));
vi.mock("../utils/device", () => ({
  getDeviceInfo: vi.fn(() => ({ userAgent: "mock-agent" })),
  logDevice: vi.fn(),
  removeDevice: vi.fn(),
}));

describe("authService", () => {
  let freshUser: any;

  beforeEach(() => {
    vi.clearAllMocks();
    freshUser = createMockUser();
    auth.auth.currentUser = freshUser;
    auth.signInWithEmailAndPassword.mockResolvedValue({ user: freshUser });
    auth.createUserWithEmailAndPassword.mockResolvedValue({ user: freshUser });
    auth.signInWithPopup.mockResolvedValue({ user: freshUser });
    fs.getDocs.mockResolvedValue(
      createMockSnapshot([{ id: "friend_id", data: { uid: "test-user" } }]),
    );
  });

  it("signIn handles active accounts", async () => {
    const res = await authService.signIn("test@example.com", "pass");
    expect(res.user.uid).toBe("test-user");
    expect(activityMockTracker).toHaveBeenCalledWith(
      102,
      expect.any(Object),
      "test-user",
    );
  });

  it("signInWithPersistence toggles local vs session states", async () => {
    await authService.signInWithPersistence("test@example.com", "pass", true);
    expect(auth.setPersistence).toHaveBeenCalledWith(
      expect.any(Object),
      "local",
    );

    vi.mocked(checkAndReactivateUser).mockResolvedValueOnce(true);
    await authService.signInWithPersistence("test@example.com", "pass", false);
    expect(auth.setPersistence).toHaveBeenCalledWith(
      expect.any(Object),
      "session",
    );
    expect(activityMockTracker).toHaveBeenCalledWith(
      111,
      expect.any(Object),
      "test-user",
    );
  });

  it("signUp creates profile and registers metadata", async () => {
    const res = await authService.signUp("test@example.com", "pass");
    expect(res.username).toBe("mocked_username");
    expect(activityMockTracker).toHaveBeenCalledWith(
      101,
      expect.any(Object),
      "test-user",
    );
  });

  it("logout completely tears down state", async () => {
    await authService.logout();
    expect(auth.signOut).toHaveBeenCalled();
    expect(auth.auth.currentUser).toBeNull();
    expect(activityMockTracker).toHaveBeenCalledWith(103, {}, "test-user");
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

  it("signInWithGoogle registers implicit user profiles", async () => {
    const res = await authService.signInWithGoogle();
    expect(res.user.uid).toBe("test-user");
    expect(auth.signInWithPopup).toHaveBeenCalled();
  });

  it("deactivateAccount updates flags and kills live sessions", async () => {
    await authService.deactivateAccount(freshUser);
    expect(fs.setDoc).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({ status: "deactivated" }),
      { merge: true },
    );
    expect(activityMockTracker).toHaveBeenCalledWith(110, {}, "test-user");
  });

  it("deleteAppAccount completely purges subcollections and references", async () => {
    await authService.deleteAppAccount(freshUser);
    expect(friendService.removeFriend).toHaveBeenCalled();
    expect(fs.deleteDoc).toHaveBeenCalled();
    expect(auth.deleteUser).toHaveBeenCalledWith(freshUser);
  });
});
