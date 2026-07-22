import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useDataLoader } from "./useDataLoader";

describe("useDataLoader", () => {
  it("fetches data successfully and calls onSuccess", async () => {
    const onSuccess = vi.fn();
    const fetchFn = vi.fn().mockResolvedValue("hello");

    const { result } = renderHook(() => useDataLoader({ fetchFn, onSuccess }));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();

    await act(async () => {
      const res = await result.current.reload();
      expect(res).toBe("hello");
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe("hello");
    expect(result.current.error).toBeNull();
    expect(onSuccess).toHaveBeenCalledWith("hello");

    await act(async () => {
      await result.current.reload();
    });
    expect(result.current.loading).toBe(false);
  });

  it("handles Error instances and non-Error rejections", async () => {
    const onError = vi.fn();
    let shouldThrowErrorObj = true;

    const fetchFn = vi.fn().mockImplementation(() => {
      if (shouldThrowErrorObj) {
        return Promise.reject(new Error("Failed"));
      }
      return Promise.reject("String Error");
    });

    const { result } = renderHook(() => useDataLoader({ fetchFn, onError }));

    await act(async () => {
      await expect(result.current.reload()).rejects.toThrow("Failed");
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error?.message).toBe("Failed");
    expect(onError).toHaveBeenCalledWith(expect.any(Error));

    shouldThrowErrorObj = false;
    await act(async () => {
      await expect(result.current.reload()).rejects.toThrow("String Error");
    });

    expect(result.current.error?.message).toBe("String Error");
  });

  it("allows manual setData updates", () => {
    const fetchFn = vi.fn().mockResolvedValue([]);
    const { result } = renderHook(() => useDataLoader({ fetchFn }));

    act(() => {
      result.current.setData("manual update");
    });

    expect(result.current.data).toBe("manual update");
  });
});
