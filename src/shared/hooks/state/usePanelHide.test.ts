import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { usePanelHide } from "./usePanelHide";
import { mockUIContext } from "@test-utils/mockUIContext";

// Mock useUI
vi.mock("@contexts/UIContext", () => ({
  useUI: vi.fn(),
}));

// Mock useKeyHandler
vi.mock("../input/useKeyHandler", () => ({
  useKeyHandler: vi.fn(),
}));

import { useUI } from "@contexts/UIContext";
import { useKeyHandler } from "../input/useKeyHandler";

const mockUseUI = vi.mocked(useUI);
const mockUseKeyHandler = vi.mocked(useKeyHandler);

describe("usePanelHide", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls onHide when uiVisible becomes false", () => {
    let uiVisible = true;
    mockUseUI.mockImplementation(() => ({ ...mockUIContext, uiVisible }));

    const onHide = vi.fn();
    const { rerender } = renderHook(
      ({ show }) => usePanelHide({ show, onHide }),
      { initialProps: { show: true, onHide } }
    );

    // Simulate uiVisible changing to false
    uiVisible = false;
    rerender({ show: true, onHide });
    expect(onHide).toHaveBeenCalled();
  });

  it("does not call onHide if show is false", () => {
    let uiVisible = true;
    mockUseUI.mockImplementation(() => ({ ...mockUIContext, uiVisible }));

    const onHide = vi.fn();
    const { rerender } = renderHook(
      ({ show }) => usePanelHide({ show, onHide }),
      { initialProps: { show: false, onHide } }
    );

    uiVisible = false;
    rerender({ show: false, onHide });
    expect(onHide).not.toHaveBeenCalled();
  });

  it("registers useKeyHandler with correct args", () => {
    mockUseUI.mockReturnValue({ ...mockUIContext, uiVisible: true });
    const onHide = vi.fn();

    renderHook(() => usePanelHide({ show: true, onHide, escEnabled: true }));

    expect(mockUseKeyHandler).toHaveBeenCalledWith(
      expect.any(Function),
      ["Escape"],
      true
    );
  });

  it("does not register useKeyHandler if escEnabled is false", () => {
    mockUseUI.mockReturnValue({ ...mockUIContext, uiVisible: true });
    const onHide = vi.fn();

    renderHook(() => usePanelHide({ show: true, onHide, escEnabled: false }));

    expect(mockUseKeyHandler).toHaveBeenCalledWith(
      expect.any(Function),
      ["Escape"],
      false
    );
  });

  it("calls onHide when Escape is pressed and show, onHide, escEnabled are true", () => {
    mockUseUI.mockReturnValue({ ...mockUIContext, uiVisible: true });
    const onHide = vi.fn();

    // Capture the handler passed to useKeyHandler
    let escapeHandler: ((e: KeyboardEvent) => void) | undefined;
    mockUseKeyHandler.mockImplementation((handler) => {
      escapeHandler = handler;
    });

    renderHook(() => usePanelHide({ show: true, onHide, escEnabled: true }));

    // Simulate Escape key press
    escapeHandler?.({ key: "Escape" } as KeyboardEvent);

    expect(onHide).toHaveBeenCalled();
  });
});
