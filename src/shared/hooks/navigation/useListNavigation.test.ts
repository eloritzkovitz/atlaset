import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useKeyHandler } from "../input/useKeyHandler";
import { useListNavigation } from "./useListNavigation";

vi.mock("../input/useKeyHandler", () => ({ useKeyHandler: vi.fn() }));

const items = [
  { id: "A", name: "Alpha" },
  { id: "B", name: "Bravo" },
  { id: "C", name: "Charlie" },
];

type Item = (typeof items)[number];

describe("useListNavigation", () => {
  const onSelect = vi.fn();
  const onHover = vi.fn();
  const onItemInfo = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.spyOn(document, "getElementById").mockReturnValue({
      scrollIntoView: vi.fn(),
    } as unknown as HTMLElement);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  const renderNavigation = (
    overrides: Partial<Parameters<typeof useListNavigation<Item>>[0]> = {},
  ) =>
    renderHook(() =>
      useListNavigation<Item>({
        items,
        getKey: (item) => item.id,
        selectedKey: "A",
        hoveredKey: null,
        onSelect,
        onHover,
        ...overrides,
      }),
    );

  const trigger = (key: string) => {
    vi.mocked(useKeyHandler).mock.calls[0][0]({
      key,
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent);

    vi.runAllTimers();
  };

  it.each([
    ["ArrowDown", "A", "B"],
    ["ArrowUp", "B", "A"],
    ["Home", "C", "A"],
    ["End", "A", "C"],
    ["PageDown", "A", "C"],
    ["PageUp", "C", "A"],
    ["PageUp", "B", "A"],
  ])("handles %s", (key, current, expected) => {
    renderNavigation({ selectedKey: current });
    trigger(key);

    expect(onSelect).toHaveBeenCalledWith(expected);
    expect(onHover).toHaveBeenCalledWith(expected);
  });

  it("wraps arrow navigation", () => {
    renderNavigation({ selectedKey: "A" });
    trigger("ArrowUp");
    expect(onSelect).toHaveBeenCalledWith("C");

    vi.clearAllMocks();

    renderNavigation({ selectedKey: "C" });
    trigger("ArrowDown");
    expect(onSelect).toHaveBeenCalledWith("A");
  });

  it("uses hovered item and defaults missing key", () => {
    renderNavigation({ hoveredKey: "B" });
    trigger("ArrowDown");
    expect(onSelect).toHaveBeenCalledWith("C");

    vi.clearAllMocks();

    renderNavigation({ selectedKey: "missing" });
    trigger("ArrowDown");
    expect(onSelect).toHaveBeenCalledWith("B");
  });

  it("handles Enter", () => {
    renderNavigation({ selectedKey: "B", onItemInfo });
    trigger("Enter");

    expect(onItemInfo).toHaveBeenCalledWith(items[1]);

    vi.clearAllMocks();

    renderNavigation({ selectedKey: "B" });
    trigger("Enter");

    expect(onItemInfo).not.toHaveBeenCalled();
  });

  it("ignores unsupported keys", () => {
    renderNavigation();
    trigger("Escape");

    expect(onSelect).not.toHaveBeenCalled();
    expect(onHover).not.toHaveBeenCalled();
    expect(onItemInfo).not.toHaveBeenCalled();
  });

  it("handles empty and disabled navigation", () => {
    renderNavigation({ items: [] });
    trigger("ArrowDown");

    expect(onSelect).not.toHaveBeenCalled();

    vi.clearAllMocks();

    renderNavigation({ enabled: false });

    expect(useKeyHandler).toHaveBeenCalledWith(
      expect.any(Function),
      ["ArrowDown", "ArrowUp", "Enter", "Home", "End", "PageDown", "PageUp"],
      { enabled: false },
    );
  });
});
