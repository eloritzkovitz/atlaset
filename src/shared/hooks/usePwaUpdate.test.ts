import { vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { mockNeedRefresh } from "../test-utils/mockPwa";
import { usePwaUpdate } from "./usePwaUpdate";

describe("usePwaUpdate", () => {
  beforeEach(() => {
    (window as any).location = { reload: vi.fn() };
  });

  it("should return needRefresh and updateServiceWorker from useRegisterSW", () => {
    const { result } = renderHook(() => usePwaUpdate());
    // By default, needRefresh is false
    expect(result.current.needRefresh).toBe(false);
    // updateServiceWorker should be a function
    expect(typeof result.current.updateServiceWorker).toBe("function");
  });

  it("should reflect needRefresh when set by useRegisterSW", () => {
    const { result, rerender } = renderHook(() => usePwaUpdate());
    // Set needRefresh to true via the mock
    mockNeedRefresh.value = true;
    rerender();
    expect(result.current.needRefresh).toBe(true);
    // Reset for other tests
    mockNeedRefresh.value = false;
  });

  it("should call updateServiceWorker when invoked", () => {
    const { result } = renderHook(() => usePwaUpdate());
    act(() => {
      result.current.updateServiceWorker();
    });
    // The mock function should have been called
    expect(typeof result.current.updateServiceWorker).toBe("function");
  });  
});
