import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useRenameControls } from "./useRenameControls";

describe("useRenameControls", () => {
  it("should NOT call onNameChange on save if name unchanged", () => {
    const onNameChange = vi.fn();
    const { result } = renderHook(() =>
      useRenameControls({ name: "Test", onNameChange }),
    );
    act(() => {
      result.current.handleEdit();
      result.current.setEditName("Test");
      result.current.handleSave();
    });
    expect(onNameChange).not.toHaveBeenCalled();
    expect(result.current.isEditing).toBe(false);
  });

  it("should NOT call onNameChange on blur if name unchanged", () => {
    const onNameChange = vi.fn();
    const { result } = renderHook(() =>
      useRenameControls({ name: "Test", onNameChange }),
    );
    act(() => {
      result.current.handleEdit();
      result.current.setEditName("Test");
      result.current.handleBlur();
    });
    expect(onNameChange).not.toHaveBeenCalled();
    expect(result.current.isEditing).toBe(false);
  });

  it("should NOT call onNameChange on Enter if name unchanged", () => {
    const onNameChange = vi.fn();
    const { result } = renderHook(() =>
      useRenameControls({ name: "Test", onNameChange }),
    );
    act(() => {
      result.current.handleEdit();
      result.current.setEditName("Test");
      result.current.handleKeyDown({
        key: "Enter",
        stopPropagation: vi.fn(),
      } as any);
    });
    expect(onNameChange).not.toHaveBeenCalled();
    expect(result.current.isEditing).toBe(false);
  });
  it("should do nothing on handleKeyDown with other keys", () => {
    const onNameChange = vi.fn();
    const { result, rerender } = renderHook(() =>
      useRenameControls({ name: "Test", onNameChange }),
    );
    act(() => {
      result.current.handleEdit();
      result.current.setEditName("NewName");
    });
    rerender();
    act(() => {
      result.current.handleKeyDown({
        key: "a",
        stopPropagation: vi.fn(),
      } as any);
    });
    expect(onNameChange).not.toHaveBeenCalled();
    expect(result.current.isEditing).toBe(true);
    expect(result.current.editName).toBe("NewName");
  });

  it("should revert editName and exit edit mode on Escape in handleKeyDown", () => {
    const onNameChange = vi.fn();
    const { result, rerender } = renderHook(() =>
      useRenameControls({ name: "Test", onNameChange }),
    );
    act(() => {
      result.current.handleEdit();
      result.current.setEditName("Changed");
    });
    rerender();
    act(() => {
      result.current.handleKeyDown({
        key: "Escape",
        stopPropagation: vi.fn(),
      } as any);
    });
    expect(result.current.editName).toBe("Test");
    expect(result.current.isEditing).toBe(false);
    expect(onNameChange).not.toHaveBeenCalled();
  });
  it("should start with isEditing false and editName equal to name", () => {
    const { result } = renderHook(() => useRenameControls({ name: "Test" }));
    expect(result.current.isEditing).toBe(false);
    expect(result.current.editName).toBe("Test");
  });

  it("should enter edit mode when handleEdit is called", () => {
    const { result } = renderHook(() => useRenameControls({ name: "Test" }));
    act(() => {
      result.current.handleEdit();
    });
    expect(result.current.isEditing).toBe(true);
  });

  it("should update editName when setEditName is called", () => {
    const { result } = renderHook(() => useRenameControls({ name: "Test" }));
    act(() => {
      result.current.setEditName("NewName");
    });
    expect(result.current.editName).toBe("NewName");
  });

  it("should call onNameChange and exit edit mode on save", () => {
    const onNameChange = vi.fn();
    const { result, rerender } = renderHook(() =>
      useRenameControls({ name: "Test", onNameChange }),
    );
    act(() => {
      result.current.handleEdit();
      result.current.setEditName("NewName");
    });
    rerender();
    act(() => {
      result.current.handleSave();
    });
    expect(onNameChange).toHaveBeenCalledWith("NewName");
    expect(result.current.isEditing).toBe(false);
  });

  it("should revert editName and exit edit mode on cancel", () => {
    const { result } = renderHook(() => useRenameControls({ name: "Test" }));
    act(() => {
      result.current.handleEdit();
      result.current.setEditName("NewName");
      result.current.handleCancel();
    });
    expect(result.current.editName).toBe("Test");
    expect(result.current.isEditing).toBe(false);
  });

  it("should call onNameChange and exit edit mode on blur if name changed", () => {
    const onNameChange = vi.fn();
    const { result, rerender } = renderHook(() =>
      useRenameControls({ name: "Test", onNameChange }),
    );
    act(() => {
      result.current.handleEdit();
      result.current.setEditName("NewName");
    });
    rerender();
    act(() => {
      result.current.handleBlur();
    });
    expect(onNameChange).toHaveBeenCalledWith("NewName");
    expect(result.current.isEditing).toBe(false);
  });

  it("should handle Enter and Escape keys in handleKeyDown", () => {
    const onNameChange = vi.fn();
    const { result, rerender } = renderHook(() =>
      useRenameControls({ name: "Test", onNameChange }),
    );
    act(() => {
      result.current.handleEdit();
      result.current.setEditName("NewName");
    });
    rerender();
    act(() => {
      result.current.handleKeyDown({
        key: "Enter",
        stopPropagation: vi.fn(),
      } as any);
    });
    expect(onNameChange).toHaveBeenCalledWith("NewName");
    expect(result.current.isEditing).toBe(false);

    act(() => {
      result.current.handleEdit();
      result.current.setEditName("NewName");
    });
    rerender();
    act(() => {
      result.current.handleKeyDown({
        key: "Escape",
        stopPropagation: vi.fn(),
      } as any);
    });
    expect(result.current.editName).toBe("Test");
    expect(result.current.isEditing).toBe(false);
  });
});
