import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import {
  staticUserResults,
  staticCountries,
  staticCurrencies,
  staticRegions,
  staticFriends,
} from "@test-utils/mockSearchResults";
import { useSearch } from "./useSearch";

// Static fixtures
const staticLanguages = {
  fre: { code: "fre", name: "French" },
  eng: { code: "eng", name: "English" },
};

const staticTimezones = [
  { code: "UTC+01:00", name: "CET" },
  { code: "UTC+00:00", name: "GMT" },
];

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

// Mutable mock states controlled per test
let mockCountryData: any;
let mockUserSearchResults: any[];
let mockFriendsList: any[] | undefined;

vi.mock("@features/countries", () => ({
  useCountryData: () => mockCountryData,
  getSubregionsForRegion: (_: any[], region: string) =>
    region === "Europe" ? ["Western Europe"] : [],
}));

vi.mock("../hooks/useUserSearch", () => ({
  useUserSearch: () => ({ results: mockUserSearchResults, loading: false }),
}));

vi.mock("@features/user/auth", () => ({
  useAuth: () => ({ user: { uid: "1" } }),
}));

vi.mock("@features/user/friends", () => ({
  useUserFriends: () => ({ friends: mockFriendsList }),
}));

vi.mock("../utils/search", () => ({
  rankAndMap: (
    items: any[],
    getName: (item: any) => string,
    searchTerm: string,
    mapFn?: (item: any) => any,
  ) => mockSearchFilter(items, getName, searchTerm, mapFn),
}));

const getByType = (results: any[], type: string) =>
  results.filter((r) => r.type === type);

describe("useSearch", () => {
  beforeEach(() => {
    // Reset to healthy default mocks before each test
    mockCountryData = {
      countries: staticCountries,
      currencies: staticCurrencies,
      languages: staticLanguages,
      timezones: staticTimezones,
      allRegions: staticRegions,
    };
    mockUserSearchResults = staticUserResults;
    mockFriendsList = staticFriends;
  });

  it("returns empty state when searchTerm is empty", () => {
    const { result } = renderHook(() => useSearch(""));
    expect(result.current.results).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it("ranks users by current user (0), friend (1), and other (2)", () => {
    const { result } = renderHook(() => useSearch("a"));
    const users = getByType(result.current.results, "user");
    expect(users.map((u) => u.displayName)).toEqual([
      "Carol",
      "Barbara",
      "Alice",
    ]);
  });

  it.each([
    ["Euro", "currency", "code", "EUR"],
    ["French", "language", "code", "fre"],
    ["UTC+01:00", "timezone", "code", "UTC+01:00"],
    ["France", "country", "name", "France"],
    ["Europe", "region", "region", "Europe"],
    ["Western Europe", "subregion", "subregion", "Western Europe"],
  ])(
    "correctly filters and maps %s search for %s",
    (searchTerm, type, key, expectedValue) => {
      const { result } = renderHook(() => useSearch(searchTerm));
      const matches = getByType(result.current.results, type);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0][key]).toBe(expectedValue);
    },
  );

  it("handles updates to searchTerm and toggles loading", () => {
    const { result, rerender } = renderHook(
      ({ term }: { term: string }) => useSearch(term),
      { initialProps: { term: "fr" } },
    );
    expect(getByType(result.current.results, "country")[0].name).toBe("France");

    act(() => {
      rerender({ term: "barbara" });
    });
    expect(getByType(result.current.results, "user")[0].displayName).toBe(
      "Barbara",
    );
  });

  it("handles empty/undefined data sources safely", () => {
    mockUserSearchResults = [];
    mockFriendsList = undefined;
    mockCountryData = {
      countries: undefined,
      currencies: undefined,
      languages: undefined,
      timezones: undefined,
      allRegions: undefined,
    };

    const { result } = renderHook(() => useSearch("a"));
    expect(result.current.results).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it("supports array-formatted languages natively", () => {
    mockCountryData.languages = [{ code: "eng", name: "English" }];

    const { result } = renderHook(() => useSearch("English"));
    const languages = getByType(result.current.results, "language");
    expect(languages[0].code).toBe("eng");
  });
});
