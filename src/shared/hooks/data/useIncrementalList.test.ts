import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useIncrementalList } from "./useIncrementalList";

describe("useIncrementalList", () => {
  const mockItems = Array.from({ length: 40 }, (_, i) => `item-${i}`);

  it("should initialize with initialBatchSize and incrementally stream all items", async () => {
    const { result } = renderHook(() =>
      useIncrementalList(mockItems, {
        initialBatchSize: 10,
        loadBatchSize: 15,
      }),
    );

    expect(result.current).toHaveLength(10);
    expect(result.current[0]).toBe("item-0");

    await waitFor(() => {
      expect(result.current).toHaveLength(40);
    });

    expect(result.current[39]).toBe("item-39");
  });

  it("should handle lists smaller than the initialBatchSize gracefully", () => {
    const smallList = ["a", "b"];
    const { result } = renderHook(() =>
      useIncrementalList(smallList, { initialBatchSize: 5 }),
    );

    expect(result.current).toHaveLength(2);
  });

  it("should reset state cleanly when a fresh list is mounted", () => {
    const { result, unmount } = renderHook(() =>
      useIncrementalList(mockItems, { initialBatchSize: 5, loadBatchSize: 5 }),
    );
    expect(result.current).toHaveLength(5);

    unmount();

    const freshList = Array.from({ length: 20 }, (_, i) => `new-${i}`);
    const { result: newResult } = renderHook(() =>
      useIncrementalList(freshList, { initialBatchSize: 5, loadBatchSize: 5 }),
    );

    expect(newResult.current).toHaveLength(5);
    expect(newResult.current[0]).toBe("new-0");
  });
});
