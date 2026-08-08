import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useDismiss } from "./useDismiss";
import { mockUIContext } from "@test-utils/mockUIContext";

vi.mock("@app/contexts/UIContext", () => ({
  useUI: vi.fn(),
}));
vi.mock("../input/useKeyHandler", () => ({
  useKeyHandler: vi.fn(),
}));

import { useUI } from "@app/contexts/UIContext";
import { useKeyHandler } from "../input/useKeyHandler";

const mockUseUI = vi.mocked(useUI);
const mockUseKeyHandler = vi.mocked(useKeyHandler);

describe("useDismiss", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  function mount({
    uiVisible = true,
    modalOpen = false,
    show = true,
    escEnabled = false,
    isModal = false,
  } = {}) {
    mockUseUI.mockReturnValue({ ...mockUIContext, uiVisible, modalOpen });
    let escapeHandler: ((e: KeyboardEvent) => void) | undefined;
    mockUseKeyHandler.mockImplementation((handler) => {
      escapeHandler = handler as unknown as (e: KeyboardEvent) => void;
    });
    const onHide = vi.fn();
    renderHook(() => useDismiss({ show, onHide, escEnabled, isModal }));
    return { onHide, escapeHandler };
  }

  it("calls onHide when uiVisible becomes false", () => {
    let uiVisible = true;
    mockUseUI.mockImplementation(() => ({ ...mockUIContext, uiVisible }));
    const onHide = vi.fn();
    const { rerender } = renderHook(
      ({ show }) => useDismiss({ show, onHide }),
      { initialProps: { show: true, onHide } },
    );
    uiVisible = false;
    rerender({ show: true, onHide });
    expect(onHide).toHaveBeenCalled();
  });

  it("does not call onHide if show is false", () => {
    let uiVisible = true;
    mockUseUI.mockImplementation(() => ({ ...mockUIContext, uiVisible }));
    const onHide = vi.fn();
    const { rerender } = renderHook(
      ({ show }) => useDismiss({ show, onHide }),
      { initialProps: { show: false, onHide } },
    );
    uiVisible = false;
    rerender({ show: false, onHide });
    expect(onHide).not.toHaveBeenCalled();
  });

  it("registers useKeyHandler with correct args for escEnabled true/false", () => {
    mockUseUI.mockReturnValue({ ...mockUIContext, uiVisible: true });
    renderHook(() =>
      useDismiss({ show: true, onHide: () => {}, escEnabled: true }),
    );
    expect(mockUseKeyHandler).toHaveBeenLastCalledWith(
      expect.any(Function),
      ["Escape"],
      { enabled: true },
    );
    renderHook(() =>
      useDismiss({ show: true, onHide: () => {}, escEnabled: false }),
    );
    expect(mockUseKeyHandler).toHaveBeenLastCalledWith(
      expect.any(Function),
      ["Escape"],
      { enabled: false },
    );
  });

  it("calls onHide when Escape is pressed and show/onHide/escEnabled are true", () => {
    const { onHide, escapeHandler } = mount({
      uiVisible: true,
      escEnabled: true,
      show: true,
    });
    escapeHandler?.({ key: "Escape" } as KeyboardEvent);
    expect(onHide).toHaveBeenCalled();
  });

  it("calls onHide when isModal is true regardless of modalOpen", () => {
    const { onHide, escapeHandler } = mount({
      uiVisible: true,
      modalOpen: true,
      escEnabled: true,
      show: true,
      isModal: true,
    });
    escapeHandler?.({ key: "Escape" } as KeyboardEvent);
    expect(onHide).toHaveBeenCalled();
  });
});
