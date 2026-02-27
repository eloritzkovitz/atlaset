import { describe, it, expect, vi } from "vitest";
import { useMenuActions } from "./useMenuActions";

function setup(
  actions: Record<string, (() => void) | undefined>,
  setMenuOpen: (open: boolean) => void,
) {
  return useMenuActions(actions, setMenuOpen);
}

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
    const wrapped = setup(actions, setMenuOpen);
    wrapped.test && wrapped.test();
    vi.runAllTimers();
    expect(setMenuOpen).toHaveBeenCalledWith(false);
    expect(action).toHaveBeenCalled();
  });

  it("returns undefined for missing actions", () => {
    const setMenuOpen = vi.fn();
    const actions = { test: undefined };
    const wrapped = setup(actions, setMenuOpen);
    expect(wrapped.test).toBeUndefined();
  });

  it("does not call action if undefined", () => {
    const setMenuOpen = vi.fn();
    const actions = { test: undefined };
    const wrapped = setup(actions, setMenuOpen);
    if (wrapped.test) wrapped.test();
    vi.runAllTimers();
    expect(setMenuOpen).not.toHaveBeenCalled();
  });
});
