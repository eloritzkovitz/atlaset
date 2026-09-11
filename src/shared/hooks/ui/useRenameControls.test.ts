import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useRenameControls } from "./useRenameControls";

const event = (key: string) =>
  ({
    key,
    stopPropagation: vi.fn(),
  }) as never;

describe("useRenameControls", () => {
  it("initializes and enters edit mode", () => {
    const { result } = renderHook(() => useRenameControls({ name: "Test" }));

    expect(result.current.isEditing).toBe(false);
    expect(result.current.editName).toBe("Test");

    act(() => result.current.handleEdit());
    act(() => result.current.setEditName("New"));

    expect(result.current.isEditing).toBe(true);
    expect(result.current.editName).toBe("New");
  });

  it("saves and blurs changed names", () => {
    const onNameChange = vi.fn();
    const { result } = renderHook(() =>
      useRenameControls({ name: "Test", onNameChange }),
    );

    act(() => result.current.setEditName("New"));
    act(() => result.current.handleSave());

    act(() => result.current.handleEdit());
    act(() => result.current.setEditName("Another"));
    act(() => result.current.handleBlur());

    expect(onNameChange).toHaveBeenNthCalledWith(1, "New");
    expect(onNameChange).toHaveBeenNthCalledWith(2, "Another");
    expect(onNameChange).toHaveBeenCalledTimes(2);
  });

  it("handles unchanged names", () => {
    const onNameChange = vi.fn();
    const { result } = renderHook(() =>
      useRenameControls({ name: "Test", onNameChange }),
    );

    act(() => {
      result.current.handleSave();
      result.current.handleBlur();
      result.current.handleKeyDown(event("Enter"));
    });

    expect(onNameChange).not.toHaveBeenCalled();
  });

  it("handles Enter, Escape, and other keys", () => {
    const onNameChange = vi.fn();
    const { result } = renderHook(() =>
      useRenameControls({ name: "Test", onNameChange }),
    );

    act(() => result.current.setEditName("New"));
    act(() => result.current.handleKeyDown(event("a")));

    expect(result.current.isEditing).toBe(false);

    act(() => result.current.handleEdit());
    act(() => result.current.handleKeyDown(event("Enter")));

    expect(onNameChange).toHaveBeenCalledWith("New");
    expect(result.current.isEditing).toBe(false);

    act(() => result.current.handleEdit());
    act(() => result.current.setEditName("Changed"));
    act(() => result.current.handleKeyDown(event("Escape")));

    expect(result.current.editName).toBe("Test");
    expect(result.current.isEditing).toBe(false);
  });

  it("handles changed names without callbacks", () => {
    const { result } = renderHook(() => useRenameControls({ name: "Test" }));

    act(() => result.current.setEditName("New"));
    act(() => result.current.handleSave());

    act(() => result.current.handleEdit());
    act(() => result.current.setEditName("Another"));
    act(() => result.current.handleBlur());

    act(() => result.current.handleEdit());
    act(() => result.current.setEditName("Third"));
    act(() => result.current.handleKeyDown(event("Enter")));

    expect(result.current.isEditing).toBe(false);
  });

  it("syncs name changes and cancels", () => {
    const { result, rerender } = renderHook(
      ({ name }) => useRenameControls({ name }),
      { initialProps: { name: "Test" } },
    );

    act(() => result.current.setEditName("Changed"));
    rerender({ name: "Updated" });

    expect(result.current.editName).toBe("Updated");

    act(() => result.current.setEditName("Changed"));
    act(() => result.current.handleCancel());

    expect(result.current.editName).toBe("Updated");
    expect(result.current.isEditing).toBe(false);
  });
});
