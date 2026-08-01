import { renderHook, act } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { useQueryParam } from "./useQueryParam";

function createWrapper(initialEntries: string[] = ["/"]) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    );
  };
}

describe("useQueryParam", () => {
  it("returns defaultValue when query param is not present in URL", () => {
    const { result } = renderHook(
      () => useQueryParam<string>("testKey", "defaultVal"),
      { wrapper: createWrapper(["/"]) },
    );

    expect(result.current[0]).toBe("defaultVal");
  });

  it("returns initial param value if already present in URL", () => {
    const { result } = renderHook(
      () => useQueryParam<string>("testKey", "defaultVal"),
      { wrapper: createWrapper(["/?testKey=customVal"]) },
    );

    expect(result.current[0]).toBe("customVal");
  });

  it("updates query param in URL when setter is called", () => {
    const { result } = renderHook(
      () => {
        const location = useLocation();
        const [value, setValue] = useQueryParam<string>(
          "testKey",
          "defaultVal",
        );
        return { value, setValue, location };
      },
      { wrapper: createWrapper(["/"]) },
    );

    act(() => {
      result.current.setValue("newVal");
    });

    expect(result.current.value).toBe("newVal");
    expect(result.current.location.search).toBe("?testKey=newVal");
  });

  it("deletes search param from URL when set to defaultValue", () => {
    const { result } = renderHook(
      () => {
        const location = useLocation();
        const [value, setValue] = useQueryParam<string>(
          "testKey",
          "defaultVal",
        );
        return { value, setValue, location };
      },
      { wrapper: createWrapper(["/?testKey=customVal"]) },
    );

    act(() => {
      result.current.setValue("defaultVal");
    });

    expect(result.current.value).toBe("defaultVal");
    expect(result.current.location.search).toBe("");
  });

  it("preserves other existing search params when updating", () => {
    const { result } = renderHook(
      () => {
        const location = useLocation();
        const [value, setValue] = useQueryParam<string>(
          "testKey",
          "defaultVal",
        );
        return { value, setValue, location };
      },
      { wrapper: createWrapper(["/?otherKey=foo&anotherKey=bar"]) },
    );

    act(() => {
      result.current.setValue("newVal");
    });

    expect(result.current.location.search).toBe(
      "?otherKey=foo&anotherKey=bar&testKey=newVal",
    );
  });
});
