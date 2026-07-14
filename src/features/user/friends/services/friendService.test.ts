import { vi, describe, it, expect, beforeEach } from "vitest";
import { activityMockTracker } from "@test-utils/activityMocks";
import { mockFirestoreControls as fs } from "@test-utils/firebaseMockRegistry";
import {
  createMockSnapshot,
  createMockDocSnap,
} from "@test-utils/firestoreMocks";
import { friendService } from "./friendService";

vi.mock("@app/firebase", () => ({ db: {} }));

describe("friendService", () => {
  let mockBatch: { set: any; delete: any; commit: any };

  beforeEach(() => {
    vi.clearAllMocks();

    fs.doc.mockReturnValue({ type: "document" });
    fs.collection.mockReturnValue({ type: "collection" });

    mockBatch = {
      set: vi.fn(),
      delete: vi.fn(),
      commit: vi.fn().mockResolvedValue(undefined),
    };
    fs.writeBatch.mockReturnValue(mockBatch as any);
  });

  describe("friend requests management", () => {
    it("sendFriendRequest sets document data with a server timestamp", async () => {
      await friendService.sendFriendRequest("userA", "userB");

      expect(fs.doc).toHaveBeenCalledWith(
        expect.any(Object),
        "users/userB/friendRequests",
        "userA",
      );

      expect(fs.setDoc).toHaveBeenCalledWith(expect.any(Object), {
        from: "userA",
        to: "userB",
        createdAt: expect.any(Object),
      });
    });

    it("acceptFriendRequest executes an atomic writeBatch and triggers activity logs", async () => {
      await friendService.acceptFriendRequest("userA", "userB");

      expect(mockBatch.set).toHaveBeenCalledTimes(2);
      expect(mockBatch.delete).toHaveBeenCalledTimes(1);
      expect(mockBatch.commit).toHaveBeenCalledTimes(1);

      expect(activityMockTracker).toHaveBeenCalledWith(
        140,
        { friendId: "userB" },
        "userA",
      );
      expect(activityMockTracker).toHaveBeenCalledWith(
        140,
        { friendId: "userA" },
        "userB",
      );
    });

    it("rejectFriendRequest explicitly drops the inbound request reference document", async () => {
      await friendService.rejectFriendRequest("userA", "userB");

      expect(fs.doc).toHaveBeenCalledWith(
        expect.any(Object),
        "users/userA/friendRequests",
        "userB",
      );
      expect(fs.deleteDoc).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe("friend mutation & lookups", () => {
    it("removeFriend deletes relational references on both sides", async () => {
      await friendService.removeFriend("userA", "userB");

      expect(fs.doc).toHaveBeenCalledWith(
        expect.any(Object),
        "users/userA/friends",
        "userB",
      );
      expect(fs.doc).toHaveBeenCalledWith(
        expect.any(Object),
        "users/userB/friends",
        "userA",
      );
      expect(fs.deleteDoc).toHaveBeenCalledTimes(2);
    });

    it("getFriends returns mapped collection data structures", async () => {
      fs.getDocs.mockResolvedValueOnce(
        createMockSnapshot([{ id: "friend1", data: { connected: true } }]),
      );

      const res = await friendService.getFriends("userA");
      expect(res).toEqual([{ uid: "friend1", connected: true }]);
    });

    it("getFriendRequests gathers all incoming document references", async () => {
      fs.getDocs.mockResolvedValueOnce(
        createMockSnapshot([{ id: "userB", data: { from: "userB" } }]),
      );

      const res = await friendService.getFriendRequests("userA");
      expect(res).toEqual([{ uid: "userB", from: "userB" }]);
    });

    it("getOutgoingFriendRequest maps structure if found, otherwise returns null", async () => {
      fs.getDoc.mockResolvedValueOnce(
        createMockDocSnap(true, { from: "userA" }),
      );
      const found = await friendService.getOutgoingFriendRequest(
        "userB",
        "userA",
      );
      expect(found).toEqual({ uid: "mock-doc-id", from: "userA" });

      fs.getDoc.mockResolvedValueOnce(createMockDocSnap(false));
      const missing = await friendService.getOutgoingFriendRequest(
        "userB",
        "userA",
      );
      expect(missing).toBeNull();
    });
  });

  describe("realtime streaming subscriptions", () => {
    it("listenForFriends executes callback payload maps from snapshot updates", () => {
      const cbSpy = vi.fn();

      fs.onSnapshot.mockImplementationOnce((_col, onNext) => {
        onNext(createMockSnapshot([{ id: "friend1", data: { active: true } }]));
        return () => "unsubscribed";
      });

      const unsubscribe = friendService.listenForFriends("userA", cbSpy);

      expect(cbSpy).toHaveBeenCalledWith([{ uid: "friend1", active: true }]);
      expect(unsubscribe()).toBe("unsubscribed");
    });

    it("listenForFriendRequests coordinates updates cleanly over streams", () => {
      const cbSpy = vi.fn();

      fs.onSnapshot.mockImplementationOnce((_col, onNext) => {
        onNext(createMockSnapshot([{ id: "req1", data: { pending: true } }]));
        return () => "unsubscribed";
      });

      const unsubscribe = friendService.listenForFriendRequests("userA", cbSpy);

      expect(cbSpy).toHaveBeenCalledWith([{ uid: "req1", pending: true }]);
      expect(unsubscribe()).toBe("unsubscribed");
    });
  });
});
