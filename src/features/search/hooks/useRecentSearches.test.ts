import { renderHook, act } from "@testing-library/react";
import { useRecentSearches } from "./useRecentSearches";

// Mock localStorage with full Storage interface
global.localStorage = {
  store: {} as Record<string, string>,
  getItem(key: string) {
    return this.store[key] || null;
  },
  setItem(key: string, value: string) {
    this.store[key] = value;
  },
  removeItem(key: string) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  },
  get length() {
    return Object.keys(this.store).length;
  },
  key(index: number) {
    return Object.keys(this.store)[index] || null;
  },
};

const wrapper = ({ children }: { children: React.ReactNode }) => children;

describe("useRecentSearches", () => {
  beforeEach(() => {
    global.localStorage.clear();
  });

  it("loads recent searches from localStorage on mount", () => {
    global.localStorage.setItem(
      "recentSearches",
      JSON.stringify(["foo", "bar"]),
    );
    const { result } = renderHook(() => useRecentSearches(), { wrapper });
    expect(result.current.recentSearches).toEqual(["foo", "bar"]);
  });

  it("saves a term to recent searches and persists", () => {
    const { result } = renderHook(() => useRecentSearches(), { wrapper });
    act(() => {
      result.current.saveRecentSearch("test");
    });
    expect(result.current.recentSearches).toEqual(["test"]);
    expect(JSON.parse(global.localStorage.getItem("recentSearches")!)).toEqual([
      "test",
    ]);
  });

  it("removes a term from recent searches and persists", () => {
    global.localStorage.setItem(
      "recentSearches",
      JSON.stringify(["foo", "bar"]),
    );
    const { result } = renderHook(() => useRecentSearches(), { wrapper });
    act(() => {
      result.current.removeRecentSearch("foo");
    });
    expect(result.current.recentSearches).toEqual(["bar"]);
    expect(JSON.parse(global.localStorage.getItem("recentSearches")!)).toEqual([
      "bar",
    ]);
  });

  it("clears all recent searches and persists", () => {
    global.localStorage.setItem(
      "recentSearches",
      JSON.stringify(["foo", "bar"]),
    );
    const { result } = renderHook(() => useRecentSearches(), { wrapper });
    act(() => {
      result.current.clearAllRecentSearches();
    });
    expect(result.current.recentSearches).toEqual([]);
    expect(global.localStorage.getItem("recentSearches")).toBeNull();
  });

  it("limits the number of recent searches to maxCount", () => {
    const { result } = renderHook(() => useRecentSearches(3), { wrapper });
    act(() => {
      result.current.saveRecentSearch("one");
      result.current.saveRecentSearch("two");
      result.current.saveRecentSearch("three");
      result.current.saveRecentSearch("four");
    });
    expect(result.current.recentSearches).toEqual(["four"]);
  });

  it("moves existing term to front when re-saved", () => {
    const { result } = renderHook(() => useRecentSearches(3), { wrapper });
    act(() => {
      result.current.saveRecentSearch("one");
      result.current.saveRecentSearch("two");
      result.current.saveRecentSearch("three");
      result.current.saveRecentSearch("two");
    });
    expect(result.current.recentSearches).toEqual(["two"]);
  });
});
