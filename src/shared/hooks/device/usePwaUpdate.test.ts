import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { usePwaUpdate } from "./usePwaUpdate";

class MockBroadcastChannel {
  static instances: MockBroadcastChannel[] = [];
  listeners: ((ev: MessageEvent) => void)[] = [];
  constructor() {
    MockBroadcastChannel.instances.push(this);
  }
  postMessage(msg: any) {
    const ev = { data: msg } as MessageEvent;
    MockBroadcastChannel.instances.forEach((inst) =>
      inst.listeners.forEach((h) => h(ev)),
    );
  }
  addEventListener(_type: string, handler: (ev: MessageEvent) => void) {
    this.listeners.push(handler);
  }
  removeEventListener(_type: string, handler: (ev: MessageEvent) => void) {
    this.listeners = this.listeners.filter((h) => h !== handler);
  }
  close() {
    MockBroadcastChannel.instances = MockBroadcastChannel.instances.filter(
      (i) => i !== this,
    );
  }
}

describe("usePwaUpdate", () => {
  let mockSw: EventTarget & { getRegistration: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    vi.useFakeTimers();
    (window as any).location = { reload: vi.fn() };
    (global as any).BroadcastChannel = MockBroadcastChannel;

    mockSw = Object.assign(new EventTarget(), {
      getRegistration: vi.fn().mockResolvedValue(null),
    });

    Object.defineProperty(window, "navigator", {
      value: { ...window.navigator, onLine: true, serviceWorker: mockSw },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    delete (global as any).BroadcastChannel;
    MockBroadcastChannel.instances = [];
  });

  const dispatchSWUpdate = (waiting?: any, delay = 2500) => {
    if (delay > 0) act(() => vi.advanceTimersByTime(delay));
    act(() => {
      window.dispatchEvent(
        new CustomEvent("swUpdated", { detail: { waiting } }),
      );
    });
  };

  it("silently activates waiting worker on initial load or pre-mount registration", async () => {
    const worker1 = { postMessage: vi.fn() };
    const worker2 = { postMessage: vi.fn() };

    mockSw.getRegistration.mockResolvedValueOnce({ waiting: worker1 });
    renderHook(() => usePwaUpdate());
    await act(async () => await Promise.resolve());
    expect(worker1.postMessage).toHaveBeenCalledWith({ type: "SKIP_WAITING" });

    const { result } = renderHook(() => usePwaUpdate());
    dispatchSWUpdate(worker2, 0);
    expect(result.current.needRefresh).toBe(false);
    expect(worker2.postMessage).toHaveBeenCalledWith({ type: "SKIP_WAITING" });
  });

  it("handles active session updates and worker execution", () => {
    const worker = {
      postMessage: vi.fn((msg) => {
        if (msg?.type === "SKIP_WAITING") {
          mockSw.dispatchEvent(new Event("controllerchange"));
        }
      }),
    };

    const { result } = renderHook(() => usePwaUpdate());
    dispatchSWUpdate(worker);

    expect(result.current.needRefresh).toBe(true);

    act(() => result.current.updateServiceWorker());
    expect(worker.postMessage).toHaveBeenCalledWith({ type: "SKIP_WAITING" });
    expect(window.location.reload).toHaveBeenCalled();
  });

  it("handles offline state and online event recovery", () => {
    Object.defineProperty(window.navigator, "onLine", {
      value: false,
      configurable: true,
    });

    const { result } = renderHook(() => usePwaUpdate());
    dispatchSWUpdate({ postMessage: vi.fn() });

    expect(result.current.needRefresh).toBe(false);

    Object.defineProperty(window.navigator, "onLine", {
      value: true,
      configurable: true,
    });
    act(() => window.dispatchEvent(new Event("online")));

    expect(result.current.needRefresh).toBe(true);
  });

  it("handles fallback and error states", () => {
    const throwingWorker = {
      postMessage: vi.fn(() => {
        throw new Error("fail");
      }),
    };
    const { result: r1 } = renderHook(() => usePwaUpdate());
    dispatchSWUpdate(throwingWorker);
    act(() => r1.current.updateServiceWorker());
    expect(window.location.reload).toHaveBeenCalled();

    const { result: r2 } = renderHook(() => usePwaUpdate());
    act(() => r2.current.updateServiceWorker());
    expect(window.location.reload).toHaveBeenCalled();

    (global as any).BroadcastChannel = class {
      constructor() {
        throw new Error("BC disabled");
      }
    };
    const { result: r3 } = renderHook(() => usePwaUpdate());
    dispatchSWUpdate();
    expect(r3.current.needRefresh).toBe(true);
  });

  it("responds to cross-tab BroadcastChannel messages", () => {
    renderHook(() => usePwaUpdate());
    const bc = new MockBroadcastChannel();

    act(() => bc.postMessage({ type: "reload-now" }));
    expect(window.location.reload).toHaveBeenCalled();
  });
});
