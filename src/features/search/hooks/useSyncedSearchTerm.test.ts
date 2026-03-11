import { renderHook, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useSyncedSearchTerm } from "./useSyncedSearchTerm";

function wrapper(props: { children: React.ReactNode }) {
  return MemoryRouter({
    initialEntries: ["/?query=foo"],
    children: props.children,
  });
}

describe("useSyncedSearchTerm", () => {
  it("initializes searchTerm from query param", () => {
    const { result } = renderHook(() => useSyncedSearchTerm(), { wrapper });
    expect(result.current[0]).toBe("foo");
  });

  it("updates searchTerm when query param changes", () => {
    function wrapper1(props: { children: React.ReactNode }) {
      return MemoryRouter({
        initialEntries: ["/?query=foo"],
        children: props.children,
      });
    }
    const { result, rerender } = renderHook(() => useSyncedSearchTerm(), {
      wrapper: wrapper1,
    });
    expect(result.current[0]).toBe("foo");
    rerender({});
    function wrapper2(props: { children: React.ReactNode }) {
      return MemoryRouter({
        initialEntries: ["/?query=bar"],
        children: props.children,
      });
    }
    const { result: result2 } = renderHook(() => useSyncedSearchTerm(), {
      wrapper: wrapper2,
    });
    expect(result2.current[0]).toBe("bar");
  });

  it("setSearchTerm updates local state", () => {
    const { result } = renderHook(() => useSyncedSearchTerm(), { wrapper });
    act(() => {
      result.current[1]("baz");
    });
    expect(result.current[0]).toBe("baz");
  });

  it("defaults to empty string if query param is missing", () => {
    function wrapperNoQuery(props: { children: React.ReactNode }) {
      return MemoryRouter({ initialEntries: ["/"], children: props.children });
    }
    const { result } = renderHook(() => useSyncedSearchTerm(), {
      wrapper: wrapperNoQuery,
    });
    expect(result.current[0]).toBe("");
  });

  describe("useSyncedSearchTerm (locationOverride)", () => {
    it("updates searchTerm when query param changes (covers setSearchTerm)", () => {
      let location = { search: "?query=foo" };
      const { result, rerender } = renderHook(() =>
        useSyncedSearchTerm(location),
      );
      expect(result.current[0]).toBe("foo");
      location = { search: "?query=bar" };
      rerender();
      expect(result.current[0]).toBe("bar");
    });
  });
});
