import { vi, describe, it, expect, beforeEach } from "vitest";
import { type User } from "firebase/auth";
import { ACTIONS } from "@constants/actions";
import { activityMockTracker } from "@test-utils/activityMocks";
import { createMockUser } from "@test-utils/authMocks";
import {
  mockNativeAuthControls as auth,
  mockFirestoreControls as fs,
} from "@test-utils/firebaseMockRegistry";
import { createMockSnapshot } from "@test-utils/firestoreMocks";
import { authService } from "./authService";
import { sessionService } from "../../account/services/sessionService";
import { accountService } from "../../account/services/accountService";

vi.mock("@lib/db", () => ({
  appDb: {
    countryLists: { count: vi.fn() },
    layers: { count: vi.fn() },
    markers: { count: vi.fn() },
    settings: { count: vi.fn() },
  },
}));

vi.mock("../../account/services/sessionService", () => ({
  sessionService: {
    getCurrentIpAddress: vi.fn(() => Promise.resolve()),
    logSession: vi.fn(() => Promise.resolve()),
    terminateCurrentSession: vi.fn(() => Promise.resolve()),
  },
}));

vi.mock("../../account/services/accountService", () => ({
  accountService: {
    createAccount: vi.fn(() => Promise.resolve("mocked_username")),
    ensureAccount: vi.fn(() => Promise.resolve()),
    reactivateAccount: vi.fn(() => Promise.resolve(false)),
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

vi.mock("../../account/utils/session", () => ({
  getBrowserSessionInfo: vi.fn(() => ({
    userAgent: "mock-agent",
    language: "en-US",
    screen: "1920x1080",
  })),
  clearLocalSession: vi.fn(),
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

  describe("signIn", () => {
    it("handles local vs session persistence correctly", async () => {
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

    it("runs post-sign-in handlers", async () => {
      const res = await authService.signIn("test@example.com", "pass");

      expect(res.user.uid).toBe("test-user");
      expect(activityMockTracker).toHaveBeenCalledWith(
        ACTIONS.SIGNED_IN,
        expect.any(Object),
        "test-user",
      );
      expect(sessionService.logSession).toHaveBeenCalledWith("test-user");
    });
  });

  describe("signInWithGoogle", () => {
    it("registers implicit user profiles and logs session", async () => {
      const res = await authService.signInWithGoogle();
      expect(res.user.uid).toBe("test-user");
      expect(auth.signInWithPopup).toHaveBeenCalled();
      expect(sessionService.logSession).toHaveBeenCalledWith("test-user");
    });
  });

  describe("signUp", () => {
    it("creates profile, registers metadata, and initializes a session entry", async () => {
      const res = await authService.signUp("test@example.com", "pass");
      expect(res.username).toBe("mocked_username");
      expect(activityMockTracker).toHaveBeenCalledWith(
        ACTIONS.ACCOUNT_CREATED,
        expect.any(Object),
        "test-user",
      );
      expect(sessionService.logSession).toHaveBeenCalledWith("test-user");
    });
  });

  describe("logout", () => {
    it("completely tears down state and terminates active session tracker records when user is logged in", async () => {
      await authService.logout();
      expect(auth.signOut).toHaveBeenCalled();
      expect(sessionService.terminateCurrentSession).toHaveBeenCalledWith(
        "test-user",
      );
    });

    it("clears local session and signs out cleanly even if auth.currentUser is null", async () => {
      auth.auth.currentUser = null;

      await authService.logout();

      expect(sessionService.terminateCurrentSession).not.toHaveBeenCalled();
      expect(activityMockTracker).not.toHaveBeenCalled();
      expect(auth.signOut).toHaveBeenCalled();
    });
  });

  describe("resetPassword", () => {
    it("sends reset tracking email", async () => {
      await authService.resetPassword("test@example.com");
      expect(auth.sendPasswordResetEmail).toHaveBeenCalled();
      expect(activityMockTracker).toHaveBeenCalledWith(
        ACTIONS.PASSWORD_RESET_REQUESTED,
        { email: "test@example.com" },
        "test-user",
      );
    });

    it("does not log activity if auth.currentUser is null", async () => {
      auth.auth.currentUser = null;
      await authService.resetPassword("test@example.com");
      expect(activityMockTracker).not.toHaveBeenCalled();
    });
  });

  describe("completeSignIn", () => {
    it("logs activity when account is reactivated", async () => {
      vi.mocked(accountService.reactivateAccount).mockResolvedValueOnce(true);

      const result = await authService.completeSignIn(freshUser, "email");

      expect(result).toBe(true);
      expect(activityMockTracker).toHaveBeenCalledWith(
        ACTIONS.ACCOUNT_REACTIVATED,
        { userName: freshUser.displayName, email: freshUser.email },
        "test-user",
      );
      expect(activityMockTracker).toHaveBeenCalledWith(
        ACTIONS.SIGNED_IN,
        expect.any(Object),
        "test-user",
      );
    });
  });
});
