import { describe, it, expect, vi } from "vitest";
import { notificationService } from "./notificationService";
import { mockFirestoreControls as fs } from "@test-utils/firebaseMockRegistry";

vi.mock("@lib/firebase", () => ({
  db: {},
  getPaths: {
    sub: vi.fn((uid: string, collection: string) => ({
      id: `users/${uid}/${collection}`,
      type: "collection",
    })),
    subDoc: vi.fn((uid: string, collection: string, docId: string) => ({
      id: `users/${uid}/${collection}/${docId}`,
      type: "document",
    })),
  },
}));

describe("notificationService", () => {
  describe("send", () => {
    it("sends a notification", async () => {
      vi.spyOn(crypto, "randomUUID").mockReturnValue(
        "00000000-0000-0000-0000-000000000001",
      );

      await notificationService.send("b", {
        action: 101,
        actor: {
          uid: "a",
          displayName: "Alex",
          photoURL: "alex.jpg",
        },
      });

      expect(fs.addDoc).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "users/b/notifications",
          type: "collection",
        }),
        expect.objectContaining({
          action: 101,
          recipientId: "b",
          read: false,
          createdAt: expect.anything(),
        }),
      );
    });

    it("does not notify the actor", async () => {
      await notificationService.send("a", {
        action: 101,
        actor: {
          uid: "a",
          displayName: "Alex",
          photoURL: "alex.jpg",
        },
      });

      expect(fs.addDoc).not.toHaveBeenCalled();
    });
  });

  describe("markAsRead", () => {
    it("marks a notification as read", async () => {
      await notificationService.markAsRead("a", "notification-1");

      expect(fs.updateDoc).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "users/a/notifications/notification-1",
        }),
        { read: true },
      );
    });
  });

  describe("markAllAsRead", () => {
    it("marks all notifications as read", async () => {
      const batch = {
        update: vi.fn(),
        commit: vi.fn().mockResolvedValue(undefined),
      };

      fs.writeBatch.mockReturnValue(batch as any);

      await notificationService.markAllAsRead("a", [
        "notification-1",
        "notification-2",
      ]);

      expect(batch.update).toHaveBeenCalledTimes(2);
      expect(batch.update).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          id: "users/a/notifications/notification-1",
        }),
        { read: true },
      );
      expect(batch.update).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          id: "users/a/notifications/notification-2",
        }),
        { read: true },
      );
      expect(batch.commit).toHaveBeenCalled();
    });

    it("does nothing when there are no notifications", async () => {
      await notificationService.markAllAsRead("a", []);

      expect(fs.writeBatch).not.toHaveBeenCalled();
    });
  });
});
