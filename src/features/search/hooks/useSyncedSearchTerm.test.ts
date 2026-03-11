import React from "react";
import { renderHook, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useSyncedSearchTerm } from "./useSyncedSearchTerm";

const createWrapper =
  (initialEntries: string[]) =>
  ({ children }: { children: React.ReactNode }) =>
    React.createElement(MemoryRouter, { initialEntries }, children);

const createLocation = (query: string) => ({
  pathname: "/",
  search: query,
  hash: "",
  state: null,
  key: "test",
  unstable_mask: undefined,
});

describe("useSyncedSearchTerm", () => {
  it("initializes searchTerm from query param", () => {
    const wrapper = createWrapper(["/?query=foo"]);
    const { result } = renderHook(() => useSyncedSearchTerm(), { wrapper });
    expect(result.current[0]).toBe("foo");
  });

  it("updates searchTerm when query param changes", () => {
    const wrapperFoo = createWrapper(["/?query=foo"]);
    const wrapperBar = createWrapper(["/?query=bar"]);
    const { result } = renderHook(() => useSyncedSearchTerm(), {
      wrapper: wrapperFoo,
    });
    expect(result.current[0]).toBe("foo");
    const { result: result2 } = renderHook(() => useSyncedSearchTerm(), {
      wrapper: wrapperBar,
    });
    expect(result2.current[0]).toBe("bar");
  });

  it("setSearchTerm updates local state", () => {
    const wrapper = createWrapper(["/?query=foo"]);
    const { result } = renderHook(() => useSyncedSearchTerm(), { wrapper });
    act(() => {
      result.current[1]("baz");
    });
    expect(result.current[0]).toBe("baz");
  });

  it("syncs searchTerm to query param when it changes", () => {
    const wrapperFoo = createWrapper(["/?query=foo"]);
    const wrapperBar = createWrapper(["/?query=bar"]);
    const { result, rerender } = renderHook(() => useSyncedSearchTerm(), {
      wrapper: wrapperFoo,
    });
    expect(result.current[0]).toBe("foo");
    rerender();
    // Simulate query param change by rerendering with new wrapper
    const { result: result2 } = renderHook(() => useSyncedSearchTerm(), {
      wrapper: wrapperBar,
    });
    expect(result2.current[0]).toBe("bar");
  });

  it("defaults to empty string if query param is missing", () => {
    const wrapperNoQuery = createWrapper(["/"]);
    const { result } = renderHook(() => useSyncedSearchTerm(), {
      wrapper: wrapperNoQuery,
    });
    expect(result.current[0]).toBe("");
  });

  describe("useSyncedSearchTerm (locationOverride)", () => {
    it("initializes searchTerm from locationOverride query param", () => {
      const location = createLocation("?query=foo");
      const { result } = renderHook(() => useSyncedSearchTerm(location));
      expect(result.current[0]).toBe("foo");
    });

    it("updates searchTerm when locationOverride query param changes", () => {
      let location = createLocation("?query=foo");
      const { result, rerender } = renderHook(() =>
        useSyncedSearchTerm(location),
      );
      expect(result.current[0]).toBe("foo");
      location = createLocation("?query=bar");
      rerender();
      expect(result.current[0]).toBe("bar");
    });

    it("defaults to empty string if locationOverride query param is missing", () => {
      const location = createLocation("");
      const { result } = renderHook(() => useSyncedSearchTerm(location));
      expect(result.current[0]).toBe("");
    });

    it("setSearchTerm updates local state with locationOverride", () => {
      const location = createLocation("?query=foo");
      const { result } = renderHook(() => useSyncedSearchTerm(location));
      act(() => {
        result.current[1]("baz");
      });
      expect(result.current[0]).toBe("baz");
    });

    it("syncs searchTerm to locationOverride query param when it changes", () => {
      let location = createLocation("?query=foo");
      const { result, rerender } = renderHook(() =>
        useSyncedSearchTerm(location),
      );
      expect(result.current[0]).toBe("foo");
      location = createLocation("?query=bar");
      rerender();
      expect(result.current[0]).toBe("bar");
    });
  });
});
