import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { usePwaUpdate } from "./usePwaUpdate";

describe("usePwaUpdate", () => {
  it("never exposes a prompt", () => {
    const { result } = renderHook(() => usePwaUpdate());

    expect(result.current.needRefresh).toBe(false);
  });

  it("applies updates silently", async () => {
    const { result } = renderHook(() => usePwaUpdate());

    expect(() => act(() => result.current.updateServiceWorker())).not.toThrow();
  });
});
