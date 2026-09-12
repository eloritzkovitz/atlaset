import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { handlePwaUpdateMessage, usePwaUpdate } from "./usePwaUpdate";

const mockUpdateServiceWorker = vi.fn();
const mockReload = vi.fn();
let activeUpdateServiceWorker = mockUpdateServiceWorker;
let mockNeedRefreshState = false;
let registeredOptions: any = null;

vi.mock("virtual:pwa-register/react", () => ({
  useRegisterSW: (options: any) => {
    registeredOptions = options;
    return {
      needRefresh: [mockNeedRefreshState, vi.fn()],
      updateServiceWorker: activeUpdateServiceWorker,
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
    MockBroadcastChannel.instances.forEach((inst: MockBroadcastChannel) =>
      inst.listeners.forEach((handler: (ev: MessageEvent) => void) =>
        handler(ev),
      ),
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
      (instance: MockBroadcastChannel) => instance !== this,
    );
  }
}

describe("usePwaUpdate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockNeedRefreshState = false;
    activeUpdateServiceWorker = mockUpdateServiceWorker;
    registeredOptions = null;
    mockUpdateServiceWorker.mockReset();

    Object.defineProperty(window, "location", {
      configurable: true,
      value: { reload: mockReload },
    });
    Object.defineProperty(window, "BroadcastChannel", {
      configurable: true,
      writable: true,
      value: MockBroadcastChannel,
    });
    Object.defineProperty(globalThis, "BroadcastChannel", {
      configurable: true,
      writable: true,
      value: MockBroadcastChannel,
    });

    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      value: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    mockReload.mockReset();
    delete (window as any).BroadcastChannel;
    delete (globalThis as any).BroadcastChannel;
    MockBroadcastChannel.instances = [];
  });

  it("updates silently when a waiting version exists at launch", async () => {
    mockNeedRefreshState = true;
    const { result, rerender } = renderHook(() => usePwaUpdate());

    expect(result.current.needRefresh).toBe(false);
    expect(mockUpdateServiceWorker).toHaveBeenCalledWith(true);

    activeUpdateServiceWorker = vi.fn();
    rerender();
    expect(activeUpdateServiceWorker).not.toHaveBeenCalled();

    const mockRegistration = { update: vi.fn() };
    let cleanupRegistration: (() => void) | undefined;
    await act(async () => {
      cleanupRegistration = registeredOptions?.onRegisteredSW(
        "http://test.com/sw.js",
        mockRegistration,
      );
      await Promise.resolve();
    });

    vi.advanceTimersByTime(15 * 60 * 1000);
    expect(mockRegistration.update).toHaveBeenCalledTimes(2);
    cleanupRegistration?.();

    expect(() =>
      registeredOptions?.onRegisterError(new Error("SW error")),
    ).not.toThrow();

    expect(() =>
      registeredOptions?.onRegisteredSW("http://test.com/sw.js"),
    ).not.toThrow();
  });

  it("shows the update state when a version arrives after launch", async () => {
    const { result, rerender } = renderHook(() => usePwaUpdate());

    await act(async () => {
      registeredOptions?.onRegisteredSW("http://test.com/sw.js", {
        update: vi.fn(),
      });
      await Promise.resolve();
    });

    mockNeedRefreshState = true;
    rerender();

    expect(result.current.needRefresh).toBe(true);
    expect(mockUpdateServiceWorker).not.toHaveBeenCalled();
  });

  it("prevents setting needRefresh when offline", () => {
    Object.defineProperty(navigator, "onLine", {
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
    expect(mockReload).toHaveBeenCalled();
  });

  it("handles BroadcastChannel failure gracefully", () => {
    const unavailableBroadcastChannel = class {
      constructor() {
        throw new Error("BC not supported");
      }
    };
    Object.defineProperty(globalThis, "BroadcastChannel", {
      configurable: true,
      writable: true,
      value: unavailableBroadcastChannel,
    });
    Object.defineProperty(window, "BroadcastChannel", {
      configurable: true,
      writable: true,
      value: unavailableBroadcastChannel,
    });

    mockNeedRefreshState = true;
    const { result } = renderHook(() => usePwaUpdate());

    expect(result.current.needRefresh).toBe(false);
    expect(mockUpdateServiceWorker).toHaveBeenCalledWith(true);
    expect(() => act(() => result.current.updateServiceWorker())).not.toThrow();
  });

  it("handles an update announcement from another tab", () => {
    const onUpdateAvailable = vi.fn();

    handlePwaUpdateMessage(
      { data: { type: "update-available" } } as MessageEvent,
      true,
      onUpdateAvailable,
      mockReload,
    );

    expect(onUpdateAvailable).toHaveBeenCalledOnce();

    handlePwaUpdateMessage(
      { data: { type: "reload-now" } } as MessageEvent,
      true,
      onUpdateAvailable,
      mockReload,
    );

    expect(mockReload).toHaveBeenCalledOnce();
  });
});
