import { vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMutationObserver } from "./useMutationObserver";

// Helper to create a div and ref
function createDivRef() {
  const div = document.createElement("div");
  document.body.appendChild(div);
  return { div, ref: { current: div } };
}

describe("useMutationObserver", () => {
  it("should call callback on mutation", async () => {
    const { div, ref } = createDivRef();
    const callback = vi.fn();
    renderHook(() => useMutationObserver(ref, callback));
    act(() => {
      div.textContent = "changed";
    });
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(callback).toHaveBeenCalled();
  });

  it("should disconnect observer on unmount", () => {
    const { div, ref } = createDivRef();
    const callback = vi.fn();
    const disconnectSpy = vi.spyOn(MutationObserver.prototype, "disconnect");
    const { unmount } = renderHook(() => useMutationObserver(ref, callback));
    unmount();
    expect(disconnectSpy).toHaveBeenCalled();
    disconnectSpy.mockRestore();
  });

  it("should do nothing if ref is null", () => {
    const callback = vi.fn();
    const observeSpy = vi.spyOn(MutationObserver.prototype, "observe");
    renderHook(() => useMutationObserver({ current: null }, callback));
    expect(observeSpy).not.toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
    observeSpy.mockRestore();
  });
});
