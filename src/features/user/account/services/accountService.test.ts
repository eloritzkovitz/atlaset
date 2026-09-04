import { beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { getDocData, getDocsData, getPaths } from "@lib/firebase";
import { logUserActivity } from "@features/activity";
import type { FirestoreUser } from "@features/user/profile/types";
import { createMockUser } from "@test-utils/authMocks";
import {
  mockNativeAuthControls as auth,
  mockFirestoreControls as fs,
} from "@test-utils/firebaseMockRegistry";
import { createMockDocSnap } from "@test-utils/firestoreMocks";
import { accountService } from "./accountService";
import { isUserDeactivated } from "../utils/account";
import { friendService } from "../../friends/services/friendService";
import { profileService } from "../../profile/services/profileService";

vi.mock("@features/activity", () => ({
  logUserActivity: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../utils/account", () => ({
  isUserDeactivated: vi.fn(() => false),
}));

vi.mock("../../friends/services/friendService", () => ({
  friendService: {
    removeFriend: vi.fn().mockResolvedValue(undefined),
  },
}));

describe("accountService", () => {
  let user: User;

  const input = {
    uid: "u1",
    displayName: "Alex",
    email: "alex@example.com",
    photoURL: "https://example.com/alex.jpg",
  };

  const transaction = (exists = false) => ({
    get: vi.fn().mockResolvedValue(createMockDocSnap(exists)),
    set: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  });

  beforeEach(() => {
    user = createMockUser() as unknown as User;
    auth.auth.currentUser = user;

    vi.spyOn(profileService, "generateUniqueUsername").mockResolvedValue(
      "alex",
    );

    fs.runTransaction.mockImplementation(async (_db: any, callback: any) =>
      callback(transaction()),
    );
  });

  describe("createAccount", () => {
    it("returns existing account", async () => {
      vi.mocked(getDocData).mockResolvedValue({
        uid: input.uid,
        username: "alex",
      } as any);

      await expect(accountService.createAccount(input)).resolves.toBe("alex");
      expect(fs.runTransaction).not.toHaveBeenCalled();
    });

    it("creates an account", async () => {
      vi.mocked(getDocData).mockResolvedValue(null);

      const tx = transaction();
      fs.runTransaction.mockImplementationOnce(
        async (_db: any, callback: any) => callback(tx),
      );

      await expect(accountService.createAccount(input)).resolves.toBe("alex");

      expect(tx.get).toHaveBeenCalledWith(getPaths.username("alex"));
      expect(tx.set).toHaveBeenCalledTimes(2);

      expect(tx.set).toHaveBeenNthCalledWith(1, getPaths.username("alex"), {
        uid: "u1",
      });

      expect(tx.set).toHaveBeenNthCalledWith(
        2,
        getPaths.user("u1"),
        expect.objectContaining({
          uid: "u1",
          username: "alex",
          displayName: "Alex",
          email: "alex@example.com",
          photoURL: input.photoURL,
          isPublic: true,
          status: "active",
          joinDate: expect.any(Timestamp),
        }),
      );
    });

    it("preserves join date", async () => {
      vi.mocked(getDocData).mockResolvedValue(null);

      const joinDate = Timestamp.fromDate(new Date("2026-01-01T00:00:00.000Z"));
      const tx = transaction();

      fs.runTransaction.mockImplementationOnce(
        async (_db: any, callback: any) => callback(tx),
      );

      await accountService.createAccount({ ...input, joinDate });

      expect(tx.set).toHaveBeenNthCalledWith(
        2,
        getPaths.user("u1"),
        expect.objectContaining({ joinDate }),
      );
    });

    it("uses fallback values", async () => {
      vi.mocked(getDocData).mockResolvedValue(null);
      vi.mocked(profileService.generateUniqueUsername).mockResolvedValue(
        "user",
      );

      const tx = transaction();

      fs.runTransaction.mockImplementationOnce(
        async (_db: any, callback: any) => callback(tx),
      );

      await expect(
        accountService.createAccount({
          uid: "u2",
          displayName: null,
          email: null,
          photoURL: null,
        }),
      ).resolves.toBe("user");

      expect(tx.set).toHaveBeenNthCalledWith(
        2,
        getPaths.user("u2"),
        expect.objectContaining({
          username: "user",
          displayName: "",
          email: "",
          photoURL: "",
          status: "active",
        }),
      );
    });

    it("throws when username is taken", async () => {
      vi.mocked(getDocData).mockResolvedValue(null);

      const tx = transaction(true);

      fs.runTransaction.mockImplementationOnce(
        async (_db: any, callback: any) => callback(tx),
      );

      await expect(accountService.createAccount(input)).rejects.toThrow(
        "USERNAME_TAKEN",
      );

      expect(tx.set).not.toHaveBeenCalled();
    });

    it("initializes country when IP is provided", async () => {
      vi.mocked(getDocData).mockResolvedValue(null);

      const initializeCountry = vi
        .spyOn(profileService, "initializeUserCountry")
        .mockResolvedValue(undefined);

      await accountService.createAccount(input, "127.0.0.1");

      expect(initializeCountry).toHaveBeenCalledWith("u1", "127.0.0.1");
    });

    it("does not initialize country without IP", async () => {
      vi.mocked(getDocData).mockResolvedValue(null);

      const initializeCountry = vi
        .spyOn(profileService, "initializeUserCountry")
        .mockResolvedValue(undefined);

      await accountService.createAccount(input);

      expect(initializeCountry).not.toHaveBeenCalled();
    });
  });

  describe("ensureAccount", () => {
    it("returns existing account", async () => {
      vi.mocked(getDocData).mockResolvedValue({
        uid: "u1",
        username: "alex",
      } as any);

      await expect(accountService.ensureAccount(input)).resolves.toBe("alex");
    });

    it("creates account when missing", async () => {
      vi.mocked(getDocData).mockResolvedValue(null);

      const createAccount = vi
        .spyOn(accountService, "createAccount")
        .mockResolvedValue("alex");

      await expect(
        accountService.ensureAccount(input, "127.0.0.1"),
      ).resolves.toBe("alex");

      expect(createAccount).toHaveBeenCalledWith(input, "127.0.0.1");
    });
  });

  describe("deactivateAccount", () => {
    it("deactivates account and logs activity", async () => {
      await accountService.deactivateAccount(user.uid);

      expect(fs.setDoc).toHaveBeenCalledWith(
        getPaths.user(user.uid),
        expect.objectContaining({
          status: "deactivated",
          deactivatedAt: expect.any(String),
        }),
        { merge: true },
      );

      expect(logUserActivity).toHaveBeenCalledWith(102, {}, user.uid);
    });
  });

  describe("reactivateAccount", () => {
    it("reactivates a deactivated account", async () => {
      vi.mocked(getDocData).mockResolvedValue({
        uid: "test-user",
        username: "test",
        status: "deactivated",
      } as FirestoreUser);

      vi.mocked(isUserDeactivated).mockReturnValue(true);

      await expect(accountService.reactivateAccount("test-user")).resolves.toBe(
        true,
      );

      expect(fs.setDoc).toHaveBeenCalledWith(
        getPaths.user("test-user"),
        expect.objectContaining({ status: "active" }),
        { merge: true },
      );
    });

    it("does nothing for an active account", async () => {
      vi.mocked(getDocData).mockResolvedValue({
        uid: "test-user",
        username: "test",
        status: "active",
      } as FirestoreUser);

      vi.mocked(isUserDeactivated).mockReturnValue(false);

      await expect(accountService.reactivateAccount("test-user")).resolves.toBe(
        false,
      );

      expect(fs.setDoc).not.toHaveBeenCalled();
    });
  });

  describe("deleteAccount", () => {
    it("removes account data and Firebase user", async () => {
      const batch = {
        delete: vi.fn(),
        commit: vi.fn().mockResolvedValue(undefined),
      };

      fs.writeBatch.mockReturnValue(batch as any);

      vi.mocked(getDocsData)
        .mockResolvedValueOnce([
          {
            id: "friend-1",
            uid: "friend-1",
          },
        ] as any)
        .mockResolvedValueOnce([
          {
            id: "alex",
            uid: user.uid,
          },
        ] as any)
        .mockResolvedValueOnce([
          {
            id: "activity-1",
          },
        ] as any)
        .mockResolvedValue([]);

      await accountService.deleteAccount(user);

      expect(friendService.removeFriend).toHaveBeenCalledWith(
        "friend-1",
        user.uid,
      );
      expect(fs.deleteDoc).toHaveBeenCalledWith(getPaths.username("alex"));
      expect(batch.delete).toHaveBeenCalledWith(
        getPaths.subDoc(user.uid, "activity", "activity-1"),
      );
      expect(batch.commit).toHaveBeenCalled();
      expect(fs.deleteDoc).toHaveBeenCalledWith(getPaths.user(user.uid));
      expect(auth.deleteUser).toHaveBeenCalledWith(user);
    });
  });
});
