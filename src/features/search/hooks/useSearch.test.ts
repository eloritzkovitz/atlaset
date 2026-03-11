import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useSearch } from "./useSearch";

const staticUserResults = [
  {
    uid: "1",
    displayName: "Carol",
    type: "user",
    isCurrentUser: true,
    isFriend: false,
  },
  {
    uid: "2",
    displayName: "Barbara",
    type: "user",
    isCurrentUser: false,
    isFriend: true,
  },
  {
    uid: "3",
    displayName: "Alice",
    type: "user",
    isCurrentUser: false,
    isFriend: false,
  },
];
const staticCountries = [
  { name: "France", type: "country" },
  { name: "Germany", type: "country" },
];

vi.mock("@features/countries", () => ({
  useCountryData: () => ({
    countries: staticCountries,
  }),
}));

vi.mock("../hooks/useUserSearch", () => ({
  useUserSearch: () => ({
    results: staticUserResults,
    loading: false,
  }),
}));

vi.mock("@contexts/AuthContext", () => ({
  useAuth: () => ({ user: { uid: "1" } }),
}));

const staticFriends = [{ uid: "2" }];

vi.mock("@features/user", () => ({
  useUserFriends: () => ({ friends: staticFriends }),
}));

vi.mock("../utils/search", () => ({
  rankByStartsWithAndContains: (
    items: any[],
    getName: (item: any) => string,
    searchTerm: string,
  ) => {
    if (!searchTerm) return items;
    return items.filter((item) =>
      getName(item).toLowerCase().includes(searchTerm.toLowerCase()),
    );
  },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => children;

describe("useSearch", () => {
  it("returns empty results and loading=false when searchTerm is empty", () => {
    const { result } = renderHook(() => useSearch(""), { wrapper });
    expect(result.current.results).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it("returns ranked and combined results for a search term", () => {
    const { result } = renderHook(({ term }) => useSearch(term), {
      initialProps: { term: "a" },
      wrapper,
    });

    expect(result.current.loading).toBe(false);
    const userNames = result.current.results
      .filter((r) => r.type === "user" && "displayName" in r)
      .map((r) => (r as any).displayName);
    const countryNames = result.current.results
      .filter((r) => r.type === "country" && "name" in r)
      .map((r) => (r as any).name);
    expect(userNames).toContain("Alice");
    expect(countryNames).toContain("France");
  });

  it("updates results when searchTerm changes", () => {
    const { result, rerender } = renderHook(({ term }) => useSearch(term), {
      initialProps: { term: "fr" },
      wrapper,
    });
    expect(
      result.current.results.some(
        (r) =>
          r.type === "country" && "name" in r && (r as any).name === "France",
      ),
    ).toBe(true);
    rerender({ term: "barbara" });
    expect(
      result.current.results.some(
        (r) =>
          r.type === "user" &&
          "displayName" in r &&
          (r as any).displayName === "Barbara",
      ),
    ).toBe(true);
  });

  it("sets loading true then false when searchTerm changes", () => {
    const { result, rerender } = renderHook(({ term }) => useSearch(term), {
      initialProps: { term: "" },
      wrapper,
    });
    expect(result.current.loading).toBe(false);
    act(() => {
      rerender({ term: "a" });
    });
    expect(result.current.loading).toBe(false);
  });

  it("ranks users correctly (current user, friend, other)", () => {
    const { result } = renderHook(() => useSearch("a"), { wrapper });
    const userResults = result.current.results.filter((r) => r.type === "user");
    expect(userResults.length).toBe(3);
    expect(userResults[0].displayName).toBe("Carol");
    expect(userResults[1].displayName).toBe("Barbara");
    expect(userResults[2].displayName).toBe("Alice");
  });

  it("ranks and maps countries correctly", () => {
    const { result } = renderHook(() => useSearch("fr"), { wrapper });
    const countryResults = result.current.results.filter(
      (r) => r.type === "country",
    );
    expect(countryResults.length).toBe(1);
    expect(countryResults[0].name).toBe("France");
    expect(countryResults[0].type).toBe("country");
  });
});
