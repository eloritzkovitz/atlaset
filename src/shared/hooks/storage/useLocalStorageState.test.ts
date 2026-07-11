import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorageState } from "./useLocalStorageState";

describe("useLocalStorageState", () => {
  beforeEach(() => localStorage.clear());

  it("handles standard reads, updates, and initialization parsing errors", () => {
    localStorage.setItem("test_key", JSON.stringify(["stored"]));
    const { result: r1 } = renderHook(() =>
      useLocalStorageState("test_key", ["fallback"]),
    );
    expect(r1.current[0]).toEqual(["stored"]);

    localStorage.setItem("test_key", "bad-broken-json-{");
    const { result: r2 } = renderHook(() =>
      useLocalStorageState("test_key", ["fallback"]),
    );
    expect(r2.current[0]).toEqual(["fallback"]);

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Quota Exceeded");
    });

    const { result: r3 } = renderHook(() =>
      useLocalStorageState("error_key", "valid"),
    );
    act(() => {
      r3.current[1]("new_val");
    });

    expect(r3.current[0]).toBe("new_val");
    expect(warnSpy).toHaveBeenCalled();
  });
});
