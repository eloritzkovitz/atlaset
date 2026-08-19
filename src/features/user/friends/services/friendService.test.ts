import { vi, describe, it, expect, beforeEach } from "vitest";
import { ACTIONS } from "@constants/actions";
import * as firebaseUtils from "@lib/firebase";
import { mockFirestoreControls as fs } from "@test-utils/firebaseMockRegistry";
import { createMockSnapshot } from "@test-utils/firestoreMocks";
import { friendService } from "./friendService";

const { activityMockTracker, notificationSendMock } = vi.hoisted(() => ({
  activityMockTracker: vi.fn(),
  notificationSendMock: vi.fn(),
}));

vi.mock("@features/activity", () => ({
  logUserActivity: activityMockTracker,
}));

vi.mock("@features/notifications/services/notificationService", () => ({
  notificationService: { send: notificationSendMock },
}));

describe("friendService", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    fs.doc.mockReturnValue({ type: "document" } as any);
    fs.writeBatch.mockReturnValue({
      set: vi.fn(),
      delete: vi.fn(),
      commit: vi.fn().mockResolvedValue(undefined),
    } as any);

    vi.spyOn(firebaseUtils, "getCurrentUser").mockReturnValue({
      uid: "a",
      displayName: "Alex",
      photoURL: "https://example.com/alex.jpg",
    } as any);
  });

  describe("requests", () => {
    it("sends a request and notification", async () => {
      await friendService.sendFriendRequest("a", "b");

      expect(fs.doc).toHaveBeenCalledWith(
        expect.any(Object),
        "users/b/friendRequests/a",
      );

      expect(fs.setDoc).toHaveBeenCalledWith(expect.any(Object), {
        from: "a",
        to: "b",
        createdAt: expect.any(Object),
      });

      expect(notificationSendMock).toHaveBeenCalledWith("b", {
        action: ACTIONS.FRIEND_REQUEST_SENT,
        actor: {
          uid: "a",
          displayName: "Alex",
          photoURL: "https://example.com/alex.jpg",
        },
      });
    });

    it("sends a request with missing user details", async () => {
      vi.spyOn(firebaseUtils, "getCurrentUser").mockReturnValue({
        uid: "a",
        displayName: null,
        photoURL: null,
      } as any);

      await friendService.sendFriendRequest("a", "b");

      expect(fs.setDoc).toHaveBeenCalledWith(expect.any(Object), {
        from: "a",
        to: "b",
        createdAt: expect.any(Object),
      });

      expect(notificationSendMock).toHaveBeenCalledWith("b", {
        action: ACTIONS.FRIEND_REQUEST_SENT,
        actor: {
          uid: "a",
          displayName: "",
          photoURL: "",
        },
      });
    });

    it("accepts a request and logs activity", async () => {
      await friendService.acceptFriendRequest("a", "b", "Bob");

      const batch = fs.writeBatch.mock.results[0].value;

      expect(batch.set).toHaveBeenCalledTimes(2);
      expect(batch.delete).toHaveBeenCalledTimes(1);
      expect(batch.commit).toHaveBeenCalled();

      expect(activityMockTracker).toHaveBeenNthCalledWith(
        1,
        ACTIONS.FRIENDSHIP_ESTABLISHED,
        { friendId: "b", userName: "Alex", friendName: "Bob" },
        "a",
      );
      expect(activityMockTracker).toHaveBeenNthCalledWith(
        2,
        ACTIONS.FRIENDSHIP_ESTABLISHED,
        { friendId: "a", userName: "Bob", friendName: "Alex" },
        "b",
      );
      expect(notificationSendMock).toHaveBeenCalledWith("b", {
        action: ACTIONS.FRIEND_REQUEST_ACCEPTED,
        actor: {
          uid: "a",
          displayName: "Alex",
          photoURL: "https://example.com/alex.jpg",
        },
      });
    });

    it("handles missing user details", async () => {
      vi.spyOn(firebaseUtils, "getCurrentUser").mockReturnValue({
        uid: "a",
        displayName: null,
        photoURL: null,
      } as any);

      await friendService.acceptFriendRequest("a", "b");

      expect(activityMockTracker).toHaveBeenNthCalledWith(
        1,
        ACTIONS.FRIENDSHIP_ESTABLISHED,
        { friendId: "b", userName: "", friendName: "" },
        "a",
      );
      expect(activityMockTracker).toHaveBeenNthCalledWith(
        2,
        ACTIONS.FRIENDSHIP_ESTABLISHED,
        { friendId: "a", userName: "", friendName: "" },
        "b",
      );
      expect(notificationSendMock).toHaveBeenCalledWith("b", {
        action: ACTIONS.FRIEND_REQUEST_ACCEPTED,
        actor: { uid: "a", displayName: "", photoURL: "" },
      });
    });

    it("rejects a request", async () => {
      await friendService.rejectFriendRequest("a", "b");

      expect(fs.deleteDoc).toHaveBeenCalledWith(expect.any(Object));
      expect(fs.doc).toHaveBeenCalledWith(
        expect.any(Object),
        "users/a/friendRequests",
        "b",
      );
    });
  });

  it("removes both friend references", async () => {
    await friendService.removeFriend("a", "b");

    expect(fs.doc).toHaveBeenNthCalledWith(
      1,
      expect.any(Object),
      "users/a/friends",
      "b",
    );
    expect(fs.doc).toHaveBeenNthCalledWith(
      2,
      expect.any(Object),
      "users/b/friends",
      "a",
    );
    expect(fs.deleteDoc).toHaveBeenCalledTimes(2);
  });

  describe("queries", () => {
    it.each([
      ["getFriends", [{ id: "x", online: true }]],
      ["getFriendRequests", [{ id: "x", from: "x" }]],
    ])("gets %s", async (method, expected) => {
      fs.getDocs.mockResolvedValueOnce(
        createMockSnapshot([{ id: "x", data: expected[0] }]),
      );

      expect(
        await friendService[method as "getFriends" | "getFriendRequests"]("a"),
      ).toEqual(expected);
    });

    it("gets outgoing request", async () => {
      vi.spyOn(firebaseUtils, "getDocData")
        .mockResolvedValueOnce({ id: "x", from: "a" } as any)
        .mockResolvedValueOnce(null);

      expect(await friendService.getOutgoingFriendRequest("b", "a")).toEqual({
        id: "x",
        from: "a",
      });
      expect(await friendService.getOutgoingFriendRequest("b", "a")).toBeNull();
    });
  });

  describe("listeners", () => {
    it.each([
      ["listenForFriends", { active: true }],
      ["listenForFriendRequests", { pending: true }],
    ])("%s streams updates", (method, data) => {
      const cb = vi.fn();

      fs.onSnapshot.mockImplementationOnce((_ref, next) => {
        next(createMockSnapshot([{ id: "x", data }]));
        return vi.fn();
      });

      friendService[method as "listenForFriends" | "listenForFriendRequests"](
        "a",
        cb,
      );

      expect(cb).toHaveBeenCalledWith([{ uid: "x", ...data }]);
    });
  });
});
