import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { handlePwaUpdateMessage, usePwaUpdate } from "./usePwaUpdate";

let swOptions: any = null;
const pwaState = { needRefresh: false };
const mockUpdateServiceWorker = vi.fn();
const mockReload = vi.fn();

vi.mock("virtual:pwa-register/react", () => ({
  useRegisterSW: (options: any) => {
    swOptions = options;
    return {
      needRefresh: [pwaState.needRefresh, vi.fn()],
      updateServiceWorker: mockUpdateServiceWorker,
    };
  },
}));

class MockBroadcastChannel {
  static instances: MockBroadcastChannel[] = [];
  listeners: ((event: MessageEvent) => void)[] = [];

  constructor() {
    MockBroadcastChannel.instances.push(this);
  }

  postMessage(data: unknown) {
    const event = { data } as MessageEvent;
    MockBroadcastChannel.instances
      .filter((instance) => instance !== this)
      .forEach((instance) =>
        instance.listeners.forEach((listener) => listener(event)),
      );
  }

  addEventListener(_type: string, listener: (event: MessageEvent) => void) {
    this.listeners.push(listener);
  }

  removeEventListener(_type: string, listener: (event: MessageEvent) => void) {
    this.listeners = this.listeners.filter((i) => i !== listener);
  }

  close() {
    MockBroadcastChannel.instances = MockBroadcastChannel.instances.filter(
      (i) => i !== this,
    );
  }
}

describe("usePwaUpdate", () => {
  const triggerSWRegister = async (
    regProps: Partial<ServiceWorkerRegistration> | null = {},
    error?: Error,
  ) => {
    await act(async () => {
      if (error) {
        swOptions?.onRegisterError(error);
      } else if (regProps === null) {
        swOptions?.onRegisteredSW("sw.js", undefined);
      } else {
        const registration = {
          update: vi.fn(() => Promise.resolve()),
          ...regProps,
        };
        swOptions?.onRegisteredSW("sw.js", registration);
      }
      await Promise.resolve();
    });
  };

  beforeEach(() => {
    vi.useFakeTimers();
    swOptions = null;
    pwaState.needRefresh = false;
    vi.clearAllMocks();

    Object.defineProperty(window, "location", {
      configurable: true,
      value: { reload: mockReload },
    });
    Object.defineProperty(globalThis, "BroadcastChannel", {
      configurable: true,
      writable: true,
      value: MockBroadcastChannel,
    });
    Object.defineProperty(window, "BroadcastChannel", {
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
    MockBroadcastChannel.instances = [];
  });

  it("updates silently when a waiting worker exists on initial check", async () => {
    pwaState.needRefresh = true;
    const updateSpy = vi.fn().mockResolvedValue(undefined);
    renderHook(() => usePwaUpdate());

    await triggerSWRegister({
      update: updateSpy,
      waiting: {} as ServiceWorker,
    });

    expect(mockUpdateServiceWorker).toHaveBeenCalledWith(true);

    vi.advanceTimersByTime(15 * 60 * 1000);
    expect(updateSpy).toHaveBeenCalledTimes(2);
  });

  it("handles SW registration errors and empty registration objects gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    renderHook(() => usePwaUpdate());
    await triggerSWRegister({
      update: vi.fn().mockRejectedValue(new Error("Update failed")),
    });
    await triggerSWRegister(null, new Error("SW error"));
    expect(consoleSpy).toHaveBeenCalledWith(
      "SW registration error",
      expect.any(Error),
    );

    await triggerSWRegister(null);
    consoleSpy.mockRestore();
  });

  it("shows update available state when triggered online post-registration", async () => {
    const { result, rerender } = renderHook(() => usePwaUpdate());
    await triggerSWRegister();

    pwaState.needRefresh = true;
    rerender();

    expect(result.current.needRefresh).toBe(true);
  });

  it("prevents setting update state when offline", async () => {
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      value: false,
    });
    pwaState.needRefresh = true;

    const { result, rerender } = renderHook(() => usePwaUpdate());
    await triggerSWRegister();
    rerender();

    expect(result.current.needRefresh).toBe(false);
  });

  it("triggers SW update and broadcasts reload across channels", async () => {
    const { result } = renderHook(() => usePwaUpdate());
    const channel2 = new MockBroadcastChannel();

    await act(async () => {
      await result.current.updateServiceWorker();
    });

    expect(mockUpdateServiceWorker).toHaveBeenCalledWith(true);

    act(() => {
      channel2.postMessage({ type: "reload-now" });
    });

    expect(mockReload).toHaveBeenCalledOnce();
  });

  it("handles BroadcastChannel failure gracefully", async () => {
    const FailingChannel = function () {
      throw new Error("unsupported");
    };

    Object.defineProperty(globalThis, "BroadcastChannel", {
      configurable: true,
      writable: true,
      value: FailingChannel,
    });
    Object.defineProperty(window, "BroadcastChannel", {
      configurable: true,
      writable: true,
      value: FailingChannel,
    });

    const { result, unmount } = renderHook(() => usePwaUpdate());

    await act(async () => {
      await result.current.updateServiceWorker();
    });

    expect(mockUpdateServiceWorker).toHaveBeenCalled();
    expect(() => unmount()).not.toThrow();
  });

  it("handles handlePwaUpdateMessage correctly across conditions", () => {
    const onUpdate = vi.fn();

    handlePwaUpdateMessage(
      { data: { type: "update-available" } } as MessageEvent,
      true,
      onUpdate,
      mockReload,
    );
    expect(onUpdate).toHaveBeenCalledWith(true);

    handlePwaUpdateMessage(
      { data: { type: "update-available" } } as MessageEvent,
      false,
      onUpdate,
      mockReload,
    );
    expect(onUpdate).toHaveBeenCalledTimes(1);

    handlePwaUpdateMessage(
      { data: { type: "reload-now" } } as MessageEvent,
      true,
      onUpdate,
      mockReload,
    );
    expect(mockReload).toHaveBeenCalledOnce();

    handlePwaUpdateMessage(
      { data: { type: "unknown" } } as MessageEvent,
      true,
      onUpdate,
      mockReload,
    );
    expect(mockReload).toHaveBeenCalledTimes(1);
  });
});
