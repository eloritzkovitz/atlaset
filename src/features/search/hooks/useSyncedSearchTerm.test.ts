import React from "react";
import { renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useSyncedSearchTerm } from "./useSyncedSearchTerm";

const createWrapper =
  (initialEntries: string[]) =>
  ({ children }: { children: React.ReactNode }) =>
    React.createElement(MemoryRouter, { initialEntries }, children);

describe("useSyncedSearchTerm", () => {
  it("initializes searchTerm from query param", () => {
    const wrapper = createWrapper(["/?query=foo"]);
    const { result } = renderHook(() => useSyncedSearchTerm(), { wrapper });
    expect(result.current[0]).toBe("foo");
  });

  it("defaults to empty string if query param is missing", () => {
    const wrapperNoQuery = createWrapper(["/"]);
    const { result } = renderHook(() => useSyncedSearchTerm(), {
      wrapper: wrapperNoQuery,
    });
    expect(result.current[0]).toBe("");
  });
});
