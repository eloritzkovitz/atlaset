import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useDisclosure } from "./useDisclosure";

describe("useDisclosure", () => {
  it("handles initial state, default values, and basic open/close/toggle methods", () => {
    const { result } = renderHook(() => useDisclosure());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.data).toBeNull();

    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);

    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.setIsOpen(false));
    expect(result.current.isOpen).toBe(false);
  });

  it("handles payload data lifecycle (custom initial state, open payload, and direct setData)", () => {
    interface DummyData {
      id: number;
      name: string;
    }
    const initialPayload: DummyData = { id: 1, name: "Initial" };
    const nextPayload: DummyData = { id: 2, name: "Updated" };

    const { result } = renderHook(() =>
      useDisclosure<DummyData>(true, initialPayload),
    );

    expect(result.current.isOpen).toBe(true);
    expect(result.current.data).toEqual(initialPayload);

    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
    expect(result.current.data).toEqual(initialPayload);

    act(() => result.current.open(nextPayload));
    expect(result.current.data).toEqual(nextPayload);

    act(() => result.current.setData(null));
    expect(result.current.data).toBeNull();
  });
});
