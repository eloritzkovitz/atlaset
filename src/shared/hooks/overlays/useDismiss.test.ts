import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useUI } from "@app/contexts/UIContext";
import { useKeyHandler } from "../input/useKeyHandler";
import { useDismiss } from "./useDismiss";
import { mockUIContext } from "@test-utils/mockUIContext";

vi.mock("@app/contexts/UIContext", () => ({
  useUI: vi.fn(),
}));

vi.mock("../input/useKeyHandler", () => ({
  useKeyHandler: vi.fn(),
}));

const mockUseUI = vi.mocked(useUI);
const mockUseKeyHandler = vi.mocked(useKeyHandler);

describe("useDismiss", () => {
  function mount(
    options: {
      uiVisible?: boolean;
      modalOpen?: boolean;
      show?: boolean;
      escEnabled?: boolean;
      isModal?: boolean;
      onHide?: () => void;
    } = {},
  ) {
    let escapeHandler: (() => void) | undefined;

    mockUseUI.mockReturnValue({
      ...mockUIContext,
      uiVisible: options.uiVisible ?? true,
      modalOpen: options.modalOpen ?? false,
    });

    mockUseKeyHandler.mockImplementation((handler) => {
      escapeHandler = handler as () => void;
    });

    renderHook(() => useDismiss(options));

    return { escapeHandler };
  }

  it("hides when UI becomes hidden", () => {
    let uiVisible = true;
    const onHide = vi.fn();

    mockUseUI.mockImplementation(() => ({
      ...mockUIContext,
      uiVisible,
    }));

    const { rerender } = renderHook(() => useDismiss({ onHide }));

    uiVisible = false;
    rerender();

    expect(onHide).toHaveBeenCalledOnce();
  });

  it("does not hide when show is false", () => {
    let uiVisible = true;
    const onHide = vi.fn();

    mockUseUI.mockImplementation(() => ({
      ...mockUIContext,
      uiVisible,
    }));

    const { rerender } = renderHook(() => useDismiss({ show: false, onHide }));

    uiVisible = false;
    rerender();

    expect(onHide).not.toHaveBeenCalled();
  });

  it("hides on Escape for panels and modals", () => {
    for (const options of [
      { modalOpen: false },
      { modalOpen: true, isModal: true },
    ]) {
      const onHide = vi.fn();
      const { escapeHandler } = mount({
        ...options,
        onHide,
        escEnabled: true,
      });

      escapeHandler?.();

      expect(onHide).toHaveBeenCalledOnce();
    }
  });

  it("does not hide a panel when a modal is open", () => {
    const onHide = vi.fn();
    const { escapeHandler } = mount({
      modalOpen: true,
      escEnabled: true,
      onHide,
    });

    escapeHandler?.();

    expect(onHide).not.toHaveBeenCalled();
  });

  it("does nothing on Escape without onHide", () => {
    const { escapeHandler } = mount({
      escEnabled: true,
    });

    escapeHandler?.();
  });
});
