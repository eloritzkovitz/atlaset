import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRecentSearches } from "./useRecentSearches";

describe("useRecentSearches", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("manages recent searches lifecycle with local storage and constraints", () => {
    const { result } = renderHook(() => useRecentSearches(2));
    expect(result.current.recentSearches).toEqual([]);

    act(() => {
      result.current.saveRecentSearch("France");
    });
    act(() => {
      result.current.saveRecentSearch("Italy");
    });
    act(() => {
      result.current.saveRecentSearch("France");
    });
    act(() => {
      result.current.saveRecentSearch("Japan");
    });

    expect(result.current.recentSearches).toEqual(["Japan", "France"]);
    expect(
      JSON.parse(localStorage.getItem("atlaset:recent_searches")!),
    ).toEqual(["Japan", "France"]);

    act(() => {
      result.current.removeRecentSearch("France");
    });
    expect(result.current.recentSearches).toEqual(["Japan"]);

    act(() => {
      result.current.clearAllRecentSearches();
    });
    expect(result.current.recentSearches).toEqual([]);
    expect(
      JSON.parse(localStorage.getItem("atlaset:recent_searches")!),
    ).toEqual([]);
  });
});
