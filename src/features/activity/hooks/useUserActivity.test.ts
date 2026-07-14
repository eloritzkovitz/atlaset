import { vi } from "vitest";
import type { Mock } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useUserActivity } from "../hooks/useUserActivity";
import type { UserActivity } from "../types";
import { activityService } from "../services/activityService";

vi.mock("../services/activityService");

const ts1 = 1771161000000;
const ts2 = 1771160990000;
const ts3 = 1771160980000;

describe("useUserActivity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches initial activity", async () => {
    const activities: UserActivity[] = [
      { id: "1", action: 120, timestamp: ts1 },
      { id: "2", action: 130, timestamp: ts2 },
    ];
    (
      activityService.fetchActivityPage as unknown as Mock
    ).mockResolvedValueOnce({
      activities,
      lastDoc: null,
      pageSize: 2,
    });
    const { result } = renderHook(() => useUserActivity());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.activity).toEqual(activities);
    expect(result.current.loading).toBe(false);
    expect(result.current.hasMore).toBe(false);
  });

  it("sets error if initial fetch fails", async () => {
    const error = new Error("initial fetch failed");
    (
      activityService.fetchActivityPage as unknown as Mock
    ).mockRejectedValueOnce(error);
    const { result } = renderHook(() => useUserActivity());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toEqual(error);
  });

  it("loads more activity", async () => {
    const initialActivities: UserActivity[] = [
      { id: "1", action: 120, timestamp: ts1 },
      { id: "2", action: 130, timestamp: ts2 },
    ];
    const moreActivities: UserActivity[] = [
      { id: "3", action: 140, timestamp: ts3 },
    ];
    const lastDocMock = { id: "2", exists: () => true, data: () => ({}) };
    (activityService.fetchActivityPage as unknown as Mock)
      .mockImplementationOnce(() => {
        return Promise.resolve({
          activities: initialActivities,
          lastDoc: lastDocMock,
          pageSize: 10,
        });
      })
      .mockImplementationOnce(() => {
        return Promise.resolve({
          activities: moreActivities,
          lastDoc: null,
          pageSize: 1,
        });
      });
    const { result } = renderHook(() => useUserActivity());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.loadMore();
    });
    expect((activityService.fetchActivityPage as Mock).mock.calls.length).toBe(
      2,
    );
    await waitFor(() => expect(result.current.activity.length).toBe(3));
    expect(result.current.activity).toEqual([
      ...initialActivities,
      ...moreActivities,
    ]);
    expect(result.current.hasMore).toBe(false);
  });

  it("does not fetch if loadMore preconditions fail", async () => {
    // Case 1: lastDoc is null (immediately after mount)
    (
      activityService.fetchActivityPage as unknown as Mock
    ).mockResolvedValueOnce({
      activities: [],
      lastDoc: null,
      pageSize: 10,
    });
    const { result } = renderHook(() => useUserActivity());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.loadMore();
    });
    expect((activityService.fetchActivityPage as Mock).mock.calls.length).toBe(
      1,
    );

    // Case 2: hasMore is false (after a fetch that sets hasMore false)
    (
      activityService.fetchActivityPage as unknown as Mock
    ).mockResolvedValueOnce({
      activities: [],
      lastDoc: { id: "3", exists: () => true, data: () => ({}) },
      pageSize: 1,
    });
    const { result: result2 } = renderHook(() => useUserActivity());
    await waitFor(() => expect(result2.current.loading).toBe(false));
    const before2 = (activityService.fetchActivityPage as Mock).mock.calls
      .length;
    await act(async () => {
      await result2.current.loadMore();
    });
    await act(async () => {
      await result2.current.loadMore();
    });
    const after2 = (activityService.fetchActivityPage as Mock).mock.calls
      .length;
    expect(after2 - before2).toBe(0);
  });

  it("deletes an activity", async () => {
    const initialActivities: UserActivity[] = [
      { id: "1", action: 120, timestamp: ts1 },
      { id: "3", action: 140, timestamp: ts3 },
    ];
    (
      activityService.fetchActivityPage as unknown as Mock
    ).mockResolvedValueOnce({
      activities: initialActivities,
      lastDoc: null,
      pageSize: 2,
    });
    (
      activityService.deleteActivityById as unknown as Mock
    ).mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useUserActivity());
    await act(async () => {
      await result.current.deleteActivity("1");
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.activity).toEqual([
      { id: "3", action: 140, timestamp: ts3 },
    ]);
  });

  it("sets error if delete fails", async () => {
    const initialActivities: UserActivity[] = [
      { id: "1", action: 120, timestamp: ts1 },
      { id: "3", action: 140, timestamp: ts3 },
    ];
    (
      activityService.fetchActivityPage as unknown as Mock
    ).mockResolvedValueOnce({
      activities: initialActivities,
      lastDoc: null,
      pageSize: 2,
    });
    const error = new Error("delete failed");
    (
      activityService.deleteActivityById as unknown as Mock
    ).mockRejectedValueOnce(error);
    const { result } = renderHook(() => useUserActivity());
    await act(async () => {
      await result.current.deleteActivity("1");
    });
    expect(result.current.error).toEqual(error);
  });

  it("clears error on new loadMore", async () => {
    // Initial fetch is successful
    const initialActivities: UserActivity[] = [
      { id: "1", action: 120, timestamp: ts1 },
      { id: "2", action: 130, timestamp: ts2 },
    ];
    const lastDocMock = { id: "2", exists: () => true, data: () => ({}) };
    (
      activityService.fetchActivityPage as unknown as Mock
    ).mockResolvedValueOnce({
      activities: initialActivities,
      lastDoc: lastDocMock,
      pageSize: 10,
    });
    const { result } = renderHook(() => useUserActivity());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();

    // Next loadMore fails
    (
      activityService.fetchActivityPage as unknown as Mock
    ).mockRejectedValueOnce(new Error("fail loadMore"));
    await act(async () => {
      await result.current.loadMore();
    });
    expect(result.current.error).toBeInstanceOf(Error);

    // Next loadMore succeeds
    (
      activityService.fetchActivityPage as unknown as Mock
    ).mockResolvedValueOnce({
      activities: [{ id: "3", action: 140, timestamp: ts3 }],
      lastDoc: null,
      pageSize: 1,
    });
    await act(async () => {
      await result.current.loadMore();
    });
    expect(result.current.error).toBeNull();
  });
});
