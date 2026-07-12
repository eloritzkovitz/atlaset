import { renderHook, act } from "@testing-library/react";
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
  beforeEach(() => {
    (window as any).location = { reload: vitest.fn() };
    (global as any).BroadcastChannel = MockBroadcastChannel;
    (window as any).navigator = (window as any).navigator || {};
    (window as any).navigator.serviceWorker = new EventTarget();
  });

  afterEach(() => {
    try {
      delete (global as any).BroadcastChannel;
      MockBroadcastChannel.instances = [];
    } catch {
      // ignore cleanup errors
    }
  });

  it("should set needRefresh and activate waiting worker on update", () => {
    const waitingWorker = {
      postMessage: vitest.fn((msg: any) => {
        if (msg?.type === "SKIP_WAITING") {
          (window as any).navigator.serviceWorker.dispatchEvent(
            new Event("controllerchange"),
          );
        }
      }),
    };

    const { result } = renderHook(() => usePwaUpdate());

    act(() => {
      const event = new CustomEvent("swUpdated", {
        detail: { waiting: waitingWorker },
      });
      window.dispatchEvent(event);
    });

    expect(result.current.needRefresh).toBe(true);

    act(() => {
      result.current.updateServiceWorker();
    });

    expect(waitingWorker.postMessage).toHaveBeenCalledWith({
      type: "SKIP_WAITING",
    });
    expect(window.location.reload).toHaveBeenCalled();
  });

  it("should reload if no waiting worker", () => {
    const { result } = renderHook(() => usePwaUpdate());

    act(() => {
      result.current.updateServiceWorker();
    });

    expect(window.location.reload).toHaveBeenCalled();
  });

  it("should set needRefresh even if BroadcastChannel isn't available", () => {
    (global as any).BroadcastChannel = class {
      constructor() {
        throw new Error("BC unavailable");
      }
    };

    const { result } = renderHook(() => usePwaUpdate());

    act(() => {
      const event = new CustomEvent("swUpdated", { detail: {} });
      window.dispatchEvent(event);
    });

    expect(result.current.needRefresh).toBe(true);
  });

  it("should reload when receiving reload-now from BroadcastChannel", () => {
    renderHook(() => usePwaUpdate());
    const bc = new (global as any).BroadcastChannel("sw-update");
    act(() => {
      bc.postMessage({ type: "reload-now" });
    });

    expect(window.location.reload).toHaveBeenCalled();
  });

  it("should fallback to reload when waiting worker postMessage throws", () => {
    const waitingWorker = {
      postMessage: vitest.fn(() => {
        throw new Error("postMessage failed");
      }),
    };

    const { result } = renderHook(() => usePwaUpdate());

    act(() => {
      const event = new CustomEvent("swUpdated", {
        detail: { waiting: waitingWorker },
      });
      window.dispatchEvent(event);
    });

    act(() => {
      result.current.updateServiceWorker();
    });

    expect(waitingWorker.postMessage).toHaveBeenCalled();
    expect(window.location.reload).toHaveBeenCalled();
  });
});
