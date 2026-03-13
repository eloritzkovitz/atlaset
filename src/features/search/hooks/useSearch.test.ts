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
  {
    name: "France",
    type: "country",
    region: "Europe",
    subregion: "Western Europe",
  },
  {
    name: "Germany",
    type: "country",
    region: "Europe",
    subregion: "Western Europe",
  },
];

vi.mock("@features/countries", () => ({
  useCountryData: () => ({
    countries: staticCountries,
    allRegions: ["Europe"],
  }),
  getSubregionsForRegion: (_: any[], region: string) =>
    region === "Europe" ? ["Western Europe"] : [],
}));
vi.mock("../hooks/useUserSearch", () => ({
  useUserSearch: () => ({ results: staticUserResults, loading: false }),
}));
vi.mock("@contexts/AuthContext", () => ({
  useAuth: () => ({ user: { uid: "1" } }),
}));
const staticFriends = [{ uid: "2" }];
vi.mock("@features/user", () => ({
  useUserFriends: () => ({ friends: staticFriends }),
}));
const mockSearchFilter = (
  items: any[],
  getName: (item: any) => string,
  searchTerm: string,
  mapFn?: (item: any) => any,
) => {
  if (!searchTerm) return mapFn ? items.map(mapFn) : items;
  return items
    .filter((item) =>
      getName(item).toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .map(mapFn || ((x) => x));
};
vi.mock("../utils/search", () => ({
  rankByStartsWithAndContains: (
    items: any[],
    getName: (item: any) => string,
    searchTerm: string,
  ) => mockSearchFilter(items, getName, searchTerm),
  rankAndMap: (
    items: any[],
    getName: (item: any) => string,
    searchTerm: string,
    mapFn: ((item: any) => any) | undefined,
  ) => mockSearchFilter(items, getName, searchTerm, mapFn),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => children;
const getResultsByType = (results: any[], type: string) =>
  results.filter((r) => r.type === type);
const getNames = (results: any[], key: string) => results.map((r) => r[key]);

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
    expect(
      getNames(getResultsByType(result.current.results, "user"), "displayName"),
    ).toContain("Alice");
    expect(
      getNames(getResultsByType(result.current.results, "country"), "name"),
    ).toContain("France");
    expect(
      getNames(getResultsByType(result.current.results, "region"), "region"),
    ).toEqual([]);
    expect(
      getNames(
        getResultsByType(result.current.results, "subregion"),
        "subregion",
      ),
    ).toEqual([]);
  });

  it("updates results when searchTerm changes", () => {
    const { result, rerender } = renderHook(({ term }) => useSearch(term), {
      initialProps: { term: "fr" },
      wrapper,
    });
    expect(
      getNames(getResultsByType(result.current.results, "country"), "name"),
    ).toContain("France");
    expect(
      getNames(
        getResultsByType(result.current.results, "subregion"),
        "subregion",
      ),
    ).not.toContain("Western Europe");
    rerender({ term: "barbara" });
    expect(
      getNames(getResultsByType(result.current.results, "user"), "displayName"),
    ).toContain("Barbara");
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
    const userResults = getResultsByType(result.current.results, "user");
    expect(userResults.length).toBe(3);
    expect(userResults[0].displayName).toBe("Carol");
    expect(userResults[1].displayName).toBe("Barbara");
    expect(userResults[2].displayName).toBe("Alice");
  });

  it.each([
    ["Europe", 0, 1, 1],
    ["Western Europe", 0, 0, 1],
  ])(
    "ranks and maps countries, regions, and subregions correctly for '%s'",
    (searchTerm, expectedCountry, expectedRegion, expectedSubregion) => {
      const { result } = renderHook(() => useSearch(searchTerm), { wrapper });
      const countryResults = getResultsByType(
        result.current.results,
        "country",
      );
      const regionResults = getResultsByType(result.current.results, "region");
      const subregionResults = getResultsByType(
        result.current.results,
        "subregion",
      );
      expect(countryResults.length).toBe(expectedCountry);
      expect(regionResults.length).toBe(expectedRegion);
      expect(subregionResults.length).toBe(expectedSubregion);
      if (expectedRegion) {
        expect(regionResults[0].region).toBe("Europe");
        expect(regionResults[0].type).toBe("region");
      }
      if (expectedSubregion) {
        expect(subregionResults[0].subregion).toBe("Western Europe");
        expect(subregionResults[0].type).toBe("subregion");
      }
    },
  );
});
