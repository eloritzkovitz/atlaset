import { vi, describe, it, expect, beforeEach } from "vitest";
import { activityMockTracker } from "@test-utils/activityMocks";
import { mockFirestoreControls as fs } from "@test-utils/firebaseMockRegistry";
import { createMockSnapshot } from "@test-utils/firestoreMocks";
import { getDocData } from "@lib/firebase";
import { friendService } from "./friendService";

describe("friendService", () => {
  const docRef = { type: "document" };

  beforeEach(() => {
    vi.clearAllMocks();

    fs.doc.mockReturnValue(docRef as any);

    fs.writeBatch.mockReturnValue({
      set: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      commit: vi.fn().mockResolvedValue(undefined),
    });
  });

  describe("requests", () => {
    it("sends a request", async () => {
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
    });

    it("accepts a request and logs activity", async () => {
      await friendService.acceptFriendRequest("a", "b");

      const batch = fs.writeBatch.mock.results[0].value;

      expect(batch.set).toHaveBeenCalledTimes(2);
      expect(batch.delete).toHaveBeenCalledTimes(1);
      expect(batch.commit).toHaveBeenCalled();

      expect(activityMockTracker).toHaveBeenCalledTimes(2);
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

  describe("friend mutations", () => {
    it("removes both friend references", async () => {
      await friendService.removeFriend("a", "b");

      expect(fs.doc).toHaveBeenCalledTimes(2);
      expect(fs.deleteDoc).toHaveBeenCalledTimes(2);
    });
  });

  describe("queries", () => {
    it.each([
      ["friends", "getFriends", [{ id: "x", online: true }]],
      ["requests", "getFriendRequests", [{ id: "x", from: "x" }]],
    ])("gets %s", async (_, method, expected) => {
      fs.getDocs.mockResolvedValueOnce(
        createMockSnapshot([
          {
            id: expected[0].id,
            data: expected[0],
          },
        ]),
      );

      const result =
        await friendService[method as "getFriends" | "getFriendRequests"]("a");

      expect(result).toEqual(expected);
    });

    it("gets outgoing request", async () => {
      vi.mocked(getDocData)
        .mockResolvedValueOnce({
          id: "x",
          from: "a",
        } as any)
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
      ["listenForFriends", [{ active: true }]],
      ["listenForFriendRequests", [{ pending: true }]],
    ])("%s streams updates", (method, data) => {
      const cb = vi.fn();

      fs.onSnapshot.mockImplementationOnce((_ref, next) => {
        next(
          createMockSnapshot([
            {
              id: "x",
              data: data[0],
            },
          ]),
        );

        return vi.fn();
      });

      friendService[method as "listenForFriends" | "listenForFriendRequests"](
        "a",
        cb,
      );

      expect(cb).toHaveBeenCalledWith([
        {
          uid: "x",
          ...data[0],
        },
      ]);
    });
  });
});
