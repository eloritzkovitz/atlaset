import { vi, describe, it, expect, beforeEach } from "vitest";
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
  const sample1: UserActivity = { id: "1", action: 120 as any, timestamp: ts1 };
  const sample2: UserActivity = { id: "2", action: 130 as any, timestamp: ts2 };
  const sample3: UserActivity = { id: "3", action: 140 as any, timestamp: ts3 };
  const mockLastDoc = { id: "2", exists: () => true, data: () => ({}) };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches initial activity successfully", async () => {
    (activityService.fetchActivityPage as Mock).mockResolvedValueOnce({
      activities: [sample1, sample2],
      lastDoc: null,
      pageSize: 2,
    });

    const { result } = renderHook(() => useUserActivity());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.activity).toEqual([sample1, sample2]);
    expect(result.current.hasMore).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("handles non-Error thrown types during initial fetch (string fallback)", async () => {
    (activityService.fetchActivityPage as Mock).mockRejectedValueOnce(
      "String failure",
    );

    const { result } = renderHook(() => useUserActivity());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("String failure");
  });

  it("loads more activity successfully", async () => {
    (activityService.fetchActivityPage as Mock)
      .mockResolvedValueOnce({
        activities: [sample1, sample2],
        lastDoc: mockLastDoc,
        pageSize: 10,
      })
      .mockResolvedValueOnce({
        activities: [sample3],
        lastDoc: null,
        pageSize: 1,
      });

    const { result } = renderHook(() => useUserActivity());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.loadMore();
    });

    expect(result.current.activity).toEqual([sample1, sample2, sample3]);
    expect(result.current.hasMore).toBe(false);
  });

  it("handles errors and non-Error thrown types during loadMore", async () => {
    (activityService.fetchActivityPage as Mock)
      .mockResolvedValueOnce({
        activities: [sample1],
        lastDoc: mockLastDoc,
        pageSize: 10,
      })
      .mockRejectedValueOnce("loadMore raw string error");

    const { result } = renderHook(() => useUserActivity());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.loadMore();
    });

    expect(result.current.error).toBe("loadMore raw string error");
    expect(result.current.loading).toBe(false);
  });

  it("skips loadMore when preconditions are not met", async () => {
    (activityService.fetchActivityPage as Mock).mockResolvedValueOnce({
      activities: [],
      lastDoc: null,
      pageSize: 10,
    });

    const { result } = renderHook(() => useUserActivity());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.loadMore();
    });

    expect(activityService.fetchActivityPage).toHaveBeenCalledTimes(1);
  });

  it("deletes an activity item", async () => {
    (activityService.fetchActivityPage as Mock).mockResolvedValueOnce({
      activities: [sample1, sample3],
      lastDoc: null,
      pageSize: 2,
    });
    (activityService.deleteActivity as Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useUserActivity());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.deleteActivity(sample1);
    });

    expect(result.current.activity).toEqual([sample3]);
  });

  it("handles errors and raw string thrown types during delete", async () => {
    (activityService.fetchActivityPage as Mock).mockResolvedValueOnce({
      activities: [sample1],
      lastDoc: null,
      pageSize: 1,
    });
    (activityService.deleteActivity as Mock).mockRejectedValueOnce(
      "delete failed string",
    );

    const { result } = renderHook(() => useUserActivity());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.deleteActivity(sample1);
    });

    expect(result.current.error).toBe("delete failed string");
  });
});
