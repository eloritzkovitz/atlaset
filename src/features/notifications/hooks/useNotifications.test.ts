import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockFirestoreControls as fs } from "@test-utils/firebaseMockRegistry";
import { useNotifications } from "./useNotifications";
import { notificationService } from "../services/notificationService";

vi.mock("../services/notificationService", () => ({
  notificationService: {
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
  },
}));

const unsubscribe = vi.fn();

const notifications = [
  {
    id: "notification-1",
    recipientId: "user-1",
    action: 101,
    read: false,
    createdAt: {},
  },
  {
    id: "notification-2",
    recipientId: "user-1",
    action: 102,
    read: true,
    createdAt: {},
  },
];

const createSnapshot = (items = notifications) => ({
  docs: items.map(({ id, ...data }) => ({
    id,
    data: () => data,
  })),
});

const subscribe = (items = notifications) => {
  fs.onSnapshot.mockImplementation((_query, onNext) => {
    onNext(createSnapshot(items));
    return unsubscribe;
  });
};

const renderNotifications = (
  recipientId?: string,
  notificationLimit?: number,
) =>
  renderHook(() =>
    useNotifications(
      recipientId,
      notificationLimit === undefined ? {} : { limit: notificationLimit },
    ),
  );

describe("useNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    subscribe();
  });

  it("returns empty state without a recipient", () => {
    const { result } = renderNotifications();

    expect(result.current).toMatchObject({
      notifications: [],
      unreadCount: 0,
      loading: false,
      error: null,
    });

    expect(fs.onSnapshot).not.toHaveBeenCalled();
  });

  it("loads notifications and calculates unread count", async () => {
    const { result } = renderNotifications("user-1");

    await waitFor(() => {
      expect(result.current.notifications).toEqual(notifications);
    });

    expect(result.current.unreadCount).toBe(1);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("queries notifications newest first", async () => {
    renderNotifications("user-1");

    await waitFor(() => {
      expect(fs.orderBy).toHaveBeenCalledWith("createdAt", "desc");
    });

    expect(fs.onSnapshot).toHaveBeenCalledTimes(1);
  });

  it("applies the optional limit", async () => {
    renderNotifications("user-1", 10);

    await waitFor(() => {
      expect(fs.limit).toHaveBeenCalledWith(10);
    });
  });

  it("does not apply a limit when omitted", async () => {
    renderNotifications("user-1");

    await waitFor(() => {
      expect(fs.orderBy).toHaveBeenCalled();
    });

    expect(fs.limit).not.toHaveBeenCalled();
  });

  it("unsubscribes on unmount", () => {
    const { unmount } = renderNotifications("user-1");

    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });

  it("handles Firestore errors", async () => {
    const error = new Error("Firestore error");

    fs.onSnapshot.mockImplementation((_query, _onNext, onError) => {
      onError(error);
      return unsubscribe;
    });

    const { result } = renderNotifications("user-1");

    await waitFor(() => {
      expect(result.current.error).toBe(error);
    });

    expect(result.current.loading).toBe(false);
  });

  it("marks a notification as read", async () => {
    const { result } = renderNotifications("user-1");

    await act(() => result.current.markAsRead("notification-1"));

    expect(notificationService.markAsRead).toHaveBeenCalledWith(
      "user-1",
      "notification-1",
    );
  });

  it("does nothing when marking as read without a recipient", async () => {
    const { result } = renderNotifications();

    await act(() => result.current.markAsRead("notification-1"));

    expect(notificationService.markAsRead).not.toHaveBeenCalled();
  });

  it("marks all unread notifications as read", async () => {
    const { result } = renderNotifications("user-1");

    await waitFor(() => {
      expect(result.current.unreadCount).toBe(1);
    });

    await act(() => result.current.markAllAsRead());

    expect(notificationService.markAllAsRead).toHaveBeenCalledWith("user-1", [
      "notification-1",
    ]);
  });

  it("does nothing when there are no unread notifications", async () => {
    subscribe([
      {
        id: "notification-1",
        recipientId: "user-1",
        action: 101,
        read: true,
        createdAt: {},
      },
    ]);

    const { result } = renderNotifications("user-1");

    await waitFor(() => {
      expect(result.current.unreadCount).toBe(0);
    });

    await act(() => result.current.markAllAsRead());

    expect(notificationService.markAllAsRead).not.toHaveBeenCalled();
  });

  it("does nothing when marking all as read without a recipient", async () => {
    const { result } = renderNotifications();

    await act(() => result.current.markAllAsRead());

    expect(notificationService.markAllAsRead).not.toHaveBeenCalled();
  });

  it("resubscribes when the recipient changes", async () => {
    const { rerender } = renderHook(
      ({ recipientId }) => useNotifications(recipientId),
      {
        initialProps: {
          recipientId: "user-1",
        },
      },
    );

    await waitFor(() => {
      expect(fs.onSnapshot).toHaveBeenCalledTimes(1);
    });

    rerender({ recipientId: "user-2" });

    await waitFor(() => {
      expect(fs.onSnapshot).toHaveBeenCalledTimes(2);
    });
  });

  it("resubscribes when the limit changes", async () => {
    const { rerender } = renderHook(
      ({ notificationLimit }) =>
        useNotifications("user-1", {
          limit: notificationLimit,
        }),
      {
        initialProps: {
          notificationLimit: 10,
        },
      },
    );

    await waitFor(() => {
      expect(fs.limit).toHaveBeenCalledWith(10);
    });

    rerender({ notificationLimit: 20 });

    await waitFor(() => {
      expect(fs.limit).toHaveBeenCalledWith(20);
    });
  });
});
