import { renderHook, act } from "@testing-library/react";
import { usePwaUpdate } from "./usePwaUpdate";

describe("usePwaUpdate", () => {
  beforeEach(() => {
    // Reset global state before each test
    (window as any).location = { reload: vitest.fn() };
  });

  it("should set needRefresh and waitingWorker on swUpdated event", () => {
    const waitingWorker = { postMessage: vitest.fn() };
    const { result } = renderHook(() => usePwaUpdate());

    act(() => {
      const event = new CustomEvent("swUpdated", { detail: { waiting: waitingWorker } });
      window.dispatchEvent(event);
    });

    expect(result.current.needRefresh).toBe(true);
    // updateServiceWorker should use the waitingWorker
    act(() => {
      result.current.updateServiceWorker();
    });
    expect(waitingWorker.postMessage).toHaveBeenCalledWith({ type: "SKIP_WAITING" });
    expect(window.location.reload).toHaveBeenCalled();
  });

  it("should reload if no waitingWorker", () => {
    const { result } = renderHook(() => usePwaUpdate());
    // Simulate updateServiceWorker with no waitingWorker
    act(() => {
      result.current.updateServiceWorker();
    });
    expect(window.location.reload).toHaveBeenCalled();
  });
});
