
import { renderHook, act } from '@testing-library/react';
import { useMenuActions } from "./useMenuActions";

describe("useMenuActions", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("wraps actions to close menu before calling", () => {
    const setMenuOpen = vi.fn();
    const action = vi.fn();
    const actions = { test: action };
    const { result } = renderHook(() => useMenuActions(actions, setMenuOpen));
    act(() => {
      if (result.current.test) {
        result.current.test();
      }
      vi.runAllTimers();
    });
    expect(setMenuOpen).toHaveBeenCalledWith(false);
    expect(action).toHaveBeenCalled();
  });

  it("returns undefined for missing actions", () => {
    const setMenuOpen = vi.fn();
    const actions = { test: undefined };
    const { result } = renderHook(() => useMenuActions(actions, setMenuOpen));
    expect(result.current.test).toBeUndefined();
  });

  it("does not call action if undefined", () => {
    const setMenuOpen = vi.fn();
    const actions = { test: undefined };
    const { result } = renderHook(() => useMenuActions(actions, setMenuOpen));
    act(() => {
      if (result.current.test) result.current.test();
      vi.runAllTimers();
    });
    expect(setMenuOpen).not.toHaveBeenCalled();
  });
});
