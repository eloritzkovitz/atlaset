import { renderHook } from "@testing-library/react";
import { useListNavigation } from "./useListNavigation";
import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";

vi.mock("../input/useKeyHandler", () => ({
  useKeyHandler: vi.fn(),
}));

import { useKeyHandler } from "../input/useKeyHandler";

const items = [
  { id: "A", name: "Alpha" },
  { id: "B", name: "Bravo" },
  { id: "C", name: "Charlie" },
];

type Item = (typeof items)[0];

describe("useListNavigation", () => {
  let onSelect: (key: string | null) => void;
  let onHover: (key: string | null) => void;
  let onItemInfo: (item: Item) => void;
  let scrollSpy: ReturnType<typeof vi.fn>;
  let getElementByIdSpy: ReturnType<typeof vi.fn>;

  function getDefaultProps() {
    return {
      items,
      getKey: (item: Item) => item.id,
      selectedKey: "A",
      hoveredKey: null,
      onSelect,
      onHover,
      enabled: true,
    };
  }

  function renderNavigationHook(overrides = {}) {
    return renderHook(() =>
      useListNavigation<Item>({
        ...getDefaultProps(),
        ...overrides,
      })
    );
  }

  function triggerKey(key: string, props = {}) {
    const handler = (useKeyHandler as any).mock.calls[0][0];
    handler({ key, preventDefault: vi.fn(), ...props });
    vi.runAllTimers();
  }

  beforeEach(() => {
    onSelect = vi.fn();
    onHover = vi.fn();
    onItemInfo = vi.fn();
    scrollSpy = vi.fn();
    getElementByIdSpy = vi
      .fn()
      .mockImplementation((id) => (id ? { scrollIntoView: scrollSpy } : null));
    vi.spyOn(document, "getElementById").mockImplementation(
      getElementByIdSpy as unknown as (id: string) => HTMLElement | null
    );
    vi.useFakeTimers();
  });

  afterEach(() => {
    (document.getElementById as any).mockRestore?.();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("navigates down with ArrowDown", () => {
    renderNavigationHook({ onSelect, onHover });
    triggerKey("ArrowDown");
    expect(onSelect).toHaveBeenCalledWith("B");
    expect(onHover).toHaveBeenCalledWith("B");
    expect(getElementByIdSpy).toHaveBeenCalledWith("B");
    expect(scrollSpy).toHaveBeenCalled();
  });

  it("wraps to first on ArrowDown at end", () => {
    renderNavigationHook({ selectedKey: "C", onSelect, onHover });
    triggerKey("ArrowDown");
    expect(onSelect).toHaveBeenCalledWith("A");
    expect(onHover).toHaveBeenCalledWith("A");
  });

  it("navigates up with ArrowUp", () => {
    renderNavigationHook({ selectedKey: "B", onSelect, onHover });
    triggerKey("ArrowUp");
    expect(onSelect).toHaveBeenCalledWith("A");
    expect(onHover).toHaveBeenCalledWith("A");
    expect(getElementByIdSpy).toHaveBeenCalledWith("A");
    expect(scrollSpy).toHaveBeenCalled();
  });

  it("wraps to last on ArrowUp at start", () => {
    renderNavigationHook({ selectedKey: "A", onSelect, onHover });
    triggerKey("ArrowUp");
    expect(onSelect).toHaveBeenCalledWith("C");
    expect(onHover).toHaveBeenCalledWith("C");
  });

  it("selects first with Home", () => {
    renderNavigationHook({ selectedKey: "C", onSelect, onHover });
    triggerKey("Home");
    expect(onSelect).toHaveBeenCalledWith("A");
    expect(onHover).toHaveBeenCalledWith("A");
    expect(getElementByIdSpy).toHaveBeenCalledWith("A");
    expect(scrollSpy).toHaveBeenCalled();
  });

  it("selects last with End", () => {
    renderNavigationHook({ selectedKey: "A", onSelect, onHover });
    triggerKey("End");
    expect(onSelect).toHaveBeenCalledWith("C");
    expect(onHover).toHaveBeenCalledWith("C");
    expect(getElementByIdSpy).toHaveBeenCalledWith("C");
    expect(scrollSpy).toHaveBeenCalled();
  });

  it("pages down with PageDown", () => {
    renderNavigationHook({ selectedKey: "A", onSelect, onHover });
    triggerKey("PageDown");
    expect(onSelect).toHaveBeenCalledWith("C");
    expect(onHover).toHaveBeenCalledWith("C");
    expect(getElementByIdSpy).toHaveBeenCalledWith("C");
    expect(scrollSpy).toHaveBeenCalled();
  });

  it("pages up with PageUp", () => {
    renderNavigationHook({ selectedKey: "C", onSelect, onHover });
    triggerKey("PageUp");
    expect(onSelect).toHaveBeenCalledWith("A");
    expect(onHover).toHaveBeenCalledWith("A");
    expect(getElementByIdSpy).toHaveBeenCalledWith("A");
    expect(scrollSpy).toHaveBeenCalled();
  });

  it("calls onItemInfo on Enter", () => {
    renderNavigationHook({ selectedKey: "B", onSelect, onHover, onItemInfo });
    triggerKey("Enter");
    expect(onItemInfo).toHaveBeenCalledWith(items[1]);
  });

  it("does nothing if items is empty", () => {
    renderNavigationHook({ items: [], onSelect, onHover });
    triggerKey("ArrowDown");
    expect(onSelect).not.toHaveBeenCalled();
    expect(onHover).not.toHaveBeenCalled();
  });

  it("does nothing if enabled is false", () => {
    renderNavigationHook({ enabled: false, onSelect, onHover });
    expect(useKeyHandler).toHaveBeenCalledWith(
      expect.any(Function),
      ["ArrowDown", "ArrowUp", "Enter", "Home", "End", "PageDown", "PageUp"],
      false
    );
  });
});
