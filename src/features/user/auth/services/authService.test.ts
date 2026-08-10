import { vi, describe, it, expect, beforeEach } from "vitest";
import { type User } from "firebase/auth";
import { activityMockTracker } from "@test-utils/activityMocks";
import { createMockUser } from "@test-utils/authMocks";
import {
  mockNativeAuthControls as auth,
  mockFirestoreControls as fs,
} from "@test-utils/firebaseMockRegistry";
import { createMockSnapshot } from "@test-utils/firestoreMocks";
import { authService } from "./authService";
import { sessionService } from "./sessionService";
import { accountService } from "../../account/services/accountService";

vi.mock("@lib/db", () => ({
  appDb: {
    countryLists: { count: vi.fn() },
    layers: { count: vi.fn() },
    markers: { count: vi.fn() },
    settings: { count: vi.fn() },
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

    fs.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ status: "active" }),
    });

    fs.getDocs.mockResolvedValue(
      createMockSnapshot([{ id: "friend_id", data: { uid: "test-user" } }]),
    );
  });

  it("completeSignIn logs activity code 111 when account is reactivated", async () => {
    vi.spyOn(accountService, "reactivateAccount").mockResolvedValueOnce(true);

    await authService.completeSignIn(freshUser, "email");

    expect(activityMockTracker).toHaveBeenCalledWith(
      111,
      { userName: freshUser.displayName, email: freshUser.email },
      "test-user",
    );

    expect(activityMockTracker).toHaveBeenCalledWith(
      102,
      expect.any(Object),
      "test-user",
    );
  });

  it("signIn handles local vs session persistence correctly", async () => {
    await authService.signIn("test@example.com", "pass", false);
    expect(auth.setPersistence).toHaveBeenCalledWith(
      expect.any(Object),
      "session",
    );

    await authService.signIn("test@example.com", "pass", true);
    expect(auth.setPersistence).toHaveBeenCalledWith(
      expect.any(Object),
      "local",
    );
  });

  it("signIn runs post-sign-in handlers", async () => {
    const res = await authService.signIn("test@example.com", "pass");

    expect(res.user.uid).toBe("test-user");
    expect(activityMockTracker).toHaveBeenCalledWith(
      102,
      expect.any(Object),
      "test-user",
    );
    expect(sessionService.logSession).toHaveBeenCalledWith("test-user");
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

  it("signInWithGoogle registers implicit user profiles and logs session", async () => {
    const res = await authService.signInWithGoogle();
    expect(res.user.uid).toBe("test-user");
    expect(auth.signInWithPopup).toHaveBeenCalled();
    expect(sessionService.logSession).toHaveBeenCalledWith("test-user");
  });
});
