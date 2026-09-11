import { createElement, type ReactNode } from "react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useQueryParam } from "./useQueryParam";

const wrapper =
  (initialEntry = "/") =>
  ({ children }: { children: ReactNode }) =>
    createElement(MemoryRouter, { initialEntries: [initialEntry] }, children);

describe("useQueryParam", () => {
  it("returns the default value", () => {
    const { result } = renderHook(() => useQueryParam("page", "1"), {
      wrapper: wrapper(),
    });

    expect(result.current[0]).toBe("1");
  });

  it("returns the URL value", () => {
    const { result } = renderHook(() => useQueryParam("page", "1"), {
      wrapper: wrapper("/?page=2"),
    });

    expect(result.current[0]).toBe("2");
  });

  it("sets and preserves other parameters", () => {
    const { result } = renderHook(
      () => {
        const location = useLocation();
        const [value, setValue] = useQueryParam("page", "1");
        return { value, setValue, search: location.search };
      },
      { wrapper: wrapper("/?sort=name") },
    );

    act(() => result.current.setValue("2"));

    expect(result.current.value).toBe("2");
    expect(result.current.search).toBe("?sort=name&page=2");
  });

  it("removes the parameter when set to default", () => {
    const { result } = renderHook(
      () => {
        const location = useLocation();
        const [, setValue] = useQueryParam("page", "1");
        return { setValue, search: location.search };
      },
      { wrapper: wrapper("/?page=2") },
    );

    act(() => result.current.setValue("1"));

    expect(result.current.search).toBe("");
  });

  it("supports replace=false", () => {
    const { result } = renderHook(
      () => useQueryParam("page", "1", { replace: false }),
      { wrapper: wrapper() },
    );

    act(() => result.current[1]("2"));

    expect(result.current[0]).toBe("2");
  });
});
