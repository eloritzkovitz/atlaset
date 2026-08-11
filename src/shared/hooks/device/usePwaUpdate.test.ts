import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { usePwaUpdate } from "./usePwaUpdate";

const mockUpdateServiceWorker = vi.fn();
let mockNeedRefreshState = false;
let registeredOptions: any = null;

vi.mock("virtual:pwa-register/react", () => ({
  useRegisterSW: (options: any) => {
    registeredOptions = options;
    return {
      needRefresh: [mockNeedRefreshState, vi.fn()],
      updateServiceWorker: mockUpdateServiceWorker,
    };
  },
}));

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
  beforeEach(() => {
    vi.useFakeTimers();
    mockNeedRefreshState = false;
    registeredOptions = null;
    mockUpdateServiceWorker.mockReset();

    (window as any).location = { reload: vi.fn() };
    (global as any).BroadcastChannel = MockBroadcastChannel;

    Object.defineProperty(window, "navigator", {
      value: { ...window.navigator, onLine: true },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    delete (global as any).BroadcastChannel;
    MockBroadcastChannel.instances = [];
  });

  it("syncs needRefresh state when online and schedules registration intervals", () => {
    mockNeedRefreshState = true;
    const { result } = renderHook(() => usePwaUpdate());

    expect(result.current.needRefresh).toBe(true);

    const mockRegistration = { update: vi.fn() };
    registeredOptions?.onRegisteredSW(
      "http://test.com/sw.js",
      mockRegistration,
    );

    vi.advanceTimersByTime(15 * 60 * 1000);
    expect(mockRegistration.update).toHaveBeenCalledTimes(1);

    expect(() =>
      registeredOptions?.onRegisterError(new Error("SW error")),
    ).not.toThrow();
  });

  it("prevents setting needRefresh when offline", () => {
    Object.defineProperty(window.navigator, "onLine", {
      value: false,
      configurable: true,
    });

    mockNeedRefreshState = true;
    const { result } = renderHook(() => usePwaUpdate());

    expect(result.current.needRefresh).toBe(false);
  });

  it("broadcasts reload to other tabs and calls pwaUpdateServiceWorker on update", () => {
    const { result } = renderHook(() => usePwaUpdate());
    const bc = new MockBroadcastChannel();

    act(() => {
      result.current.updateServiceWorker();
    });

    expect(mockUpdateServiceWorker).toHaveBeenCalledWith(true);

    act(() => {
      bc.postMessage({ type: "reload-now" });
    });
    expect(window.location.reload).toHaveBeenCalled();
  });

  it("handles BroadcastChannel failure gracefully", () => {
    (global as any).BroadcastChannel = class {
      constructor() {
        throw new Error("BC not supported");
      }
    };

    mockNeedRefreshState = true;
    const { result } = renderHook(() => usePwaUpdate());

    expect(result.current.needRefresh).toBe(true);
    expect(() => act(() => result.current.updateServiceWorker())).not.toThrow();
  });

  it("responds to cross-tab BroadcastChannel messages for update and reload", () => {
    const { result } = renderHook(() => usePwaUpdate());
    const bc = new MockBroadcastChannel();

    act(() => {
      bc.postMessage({ type: "update-available" });
    });
    expect(result.current.needRefresh).toBe(true);

    act(() => {
      bc.postMessage({ type: "reload-now" });
    });
    expect(window.location.reload).toHaveBeenCalled();
  });
});
