import { renderHook, act } from "@testing-library/react";
import { useMenuActions, createCloseMenuAndCall } from "./useMenuActions";

describe("useMenuActions", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  const setup = (actions: any) => {
    const setMenuOpen = vi.fn();
    const { result } = renderHook(() => useMenuActions(actions, setMenuOpen));
    return { result, setMenuOpen };
  };

  it("wraps actions to close menu before calling", () => {
    const action = vi.fn();
    const { result, setMenuOpen } = setup({ test: action });
    act(() => {
      result.current.test?.();
      vi.runAllTimers();
    });
    expect(setMenuOpen).toHaveBeenCalledWith(false);
    expect(action).toHaveBeenCalled();
  });

  it("createCloseMenuAndCall calls action when provided", () => {
    const setMenuOpen = vi.fn();
    const action = vi.fn();
    const closeAndCall = createCloseMenuAndCall(setMenuOpen);
    closeAndCall(action);
    expect(action).toHaveBeenCalled();
  });

  it("createCloseMenuAndCall schedules close when action is undefined", () => {
    const setMenuOpen = vi.fn();
    const closeAndCall = createCloseMenuAndCall(setMenuOpen);
    act(() => {
      closeAndCall(undefined);
      vi.runAllTimers();
    });
    expect(setMenuOpen).toHaveBeenCalledWith(false);
  });

  it("returns undefined for missing actions", () => {
    const { result } = setup({ test: undefined });
    expect(result.current.test).toBeUndefined();
  });

  it("does not call action if undefined", () => {
    const { result, setMenuOpen } = setup({ test: undefined });
    act(() => {
      result.current.test?.();
      vi.runAllTimers();
    });
    expect(setMenuOpen).not.toHaveBeenCalled();
  });
});
