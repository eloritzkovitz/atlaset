import { vi, describe, it, expect, beforeEach } from "vitest";
import { type User } from "firebase/auth";
import { getPaths } from "@lib/firebase";
import { logUserActivity } from "@features/activity";
import { createMockUser } from "@test-utils/authMocks";
import {
  mockNativeAuthControls as auth,
  mockFirestoreControls as fs,
} from "@test-utils/firebaseMockRegistry";
import { createMockSnapshot } from "@test-utils/firestoreMocks";
import { accountService } from "./accountService";
import { friendService } from "../../friends/services/friendService";
import { isUserDeactivated } from "../utils/account";

vi.mock("@features/activity", () => ({
  logUserActivity: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@lib/firebase", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@lib/firebase")>();
  return {
    ...actual,
  };
});

vi.mock("../utils/account", () => ({
  isUserDeactivated: vi.fn(() => false),
}));

vi.mock("../../friends/services/friendService", () => ({
  friendService: {
    removeFriend: vi.fn().mockResolvedValue(undefined),
  },
}));

describe("accountService", () => {
  let freshUser: User;

  beforeEach(() => {
    vi.clearAllMocks();
    freshUser = createMockUser() as unknown as User;
    auth.auth.currentUser = freshUser;

    const pathsToWire = [
      "user",
      "users",
      "username",
      "usernames",
      "sub",
      "subDoc",
    ];

    for (const p of pathsToWire) {
      (getPaths as any)[p] = vi.fn((...args: string[]) => ({
        __mockName: p,
        __mockArgs: args,
        path: `mock_path_${p}_${args.join("_")}`,
      }));
    }

    fs.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ status: "active" }),
    });
  });

  describe("deactivateAccount", () => {
    it("updates status to deactivated and logs activity", async () => {
      await accountService.deactivateAccount(freshUser.uid);

      expect(fs.setDoc).toHaveBeenCalledWith(
        getPaths.user(freshUser.uid),
        expect.objectContaining({
          status: "deactivated",
          deactivatedAt: expect.any(String),
        }),
        { merge: true },
      );
      expect(logUserActivity).toHaveBeenCalledWith(110, {}, freshUser.uid);
    });
  });

  describe("reactivateAccount", () => {
    it("updates database status when user is deactivated", async () => {
      fs.getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ status: "deactivated" }),
      });
      vi.mocked(isUserDeactivated).mockReturnValueOnce(true);

      const wasReactivated =
        await accountService.reactivateAccount("test-user");

      expect(wasReactivated).toBe(true);
      expect(fs.setDoc).toHaveBeenCalledWith(
        getPaths.user("test-user"),
        expect.objectContaining({ status: "active" }),
        { merge: true },
      );
    });

    it("skips database updates when user is already active", async () => {
      fs.getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ status: "active" }),
      });
      vi.mocked(isUserDeactivated).mockReturnValueOnce(false);

      const wasReactivated =
        await accountService.reactivateAccount("test-user");

      expect(wasReactivated).toBe(false);
      expect(fs.setDoc).not.toHaveBeenCalled();
    });
  });

  describe("deleteAccountData", () => {
    it("completely purges subcollections, removes friends, deletes username document, and deletes auth user", async () => {
      fs.getDocs.mockImplementation((ref: any) => {
        if (ref?.__mockName === "usernames") {
          return Promise.resolve(
            createMockSnapshot([
              { id: "matching_username_doc", data: { uid: freshUser.uid } },
            ]),
          );
        }
        if (ref?.__mockName === "sub" && ref?.__mockArgs?.[1] === "friends") {
          return Promise.resolve(
            createMockSnapshot([
              { id: "friend_1", data: { uid: "friend_1_uid" } },
            ]),
          );
        }
        return Promise.resolve(createMockSnapshot([]));
      });

      await accountService.deleteAccount(freshUser);

      expect(friendService.removeFriend).toHaveBeenCalledWith(
        "friend_1",
        freshUser.uid,
      );
      expect(getPaths.username).toHaveBeenCalledWith("matching_username_doc");
      expect(fs.deleteDoc).toHaveBeenCalledWith(
        getPaths.username("matching_username_doc"),
      );
      expect(auth.deleteUser).toHaveBeenCalledWith(freshUser);
    });
  });
});
