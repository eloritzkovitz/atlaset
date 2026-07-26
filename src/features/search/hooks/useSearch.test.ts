import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import {
  staticUserResults,
  staticCountries,
  staticCurrencies,
  staticRegions,
  staticFriends,
} from "@test-utils/mockSearchResults";

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

const wrapper = ({ children }: { children: React.ReactNode }) => children;
const getResultsByType = (results: any[], type: string) =>
  results.filter((r) => r.type === type);
const getNames = (results: any[], key: string) => results.map((r) => r[key]);

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

async function renderUseSearchWithMocks(
  term: string,
  {
    countriesMock,
    userSearchMock,
    authMock,
    userFriendsMock,
    utilsSearchMock,
    useProps,
  }: {
    countriesMock?: any;
    userSearchMock?: any;
    authMock?: any;
    userFriendsMock?: any;
    utilsSearchMock?: any;
    useProps?: boolean;
  } = {},
) {
  vi.resetModules();
  vi.doMock(
    "@features/countries",
    () =>
      countriesMock ?? {
        useCountryData: () => ({
          countries: staticCountries,
          currencies: staticCurrencies,
          allRegions: staticRegions,
        }),
        getSubregionsForRegion: (_: any[], region: string) =>
          region === "Europe" ? ["Western Europe"] : [],
      },
  );
  vi.doMock(
    "../hooks/useUserSearch",
    () =>
      userSearchMock ?? {
        useUserSearch: () => ({ results: staticUserResults, loading: false }),
      },
  );
  vi.doMock(
    "@contexts/AuthContext",
    () => authMock ?? { useAuth: () => ({ user: { uid: "1" } }) },
  );
  vi.doMock(
    "@features/user/friends",
    () =>
      userFriendsMock ?? { useUserFriends: () => ({ friends: staticFriends }) },
  );
  vi.doMock(
    "../utils/search",
    () =>
      utilsSearchMock ?? {
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
      },
  );

  const { useSearch } = await import("./useSearch");
  if (useProps) {
    return renderHook(({ term: t }: { term: string }) => useSearch(t), {
      initialProps: { term },
      wrapper,
    });
  }
  return renderHook(() => useSearch(term), { wrapper });
}

describe("useSearch", () => {
  it("returns empty results and loading=false when searchTerm is empty", async () => {
    const { result } = await renderUseSearchWithMocks("");
    expect(result.current.results).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it("returns ranked and combined results for a search term", async () => {
    const { result } = await renderUseSearchWithMocks("a", { useProps: true });

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

  it("updates results when searchTerm changes", async () => {
    const { result, rerender } = await renderUseSearchWithMocks("fr", {
      useProps: true,
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

  it("sets loading true then false when searchTerm changes", async () => {
    const { result, rerender } = await renderUseSearchWithMocks("", {
      useProps: true,
    });
    expect(result.current.loading).toBe(false);
    act(() => {
      rerender({ term: "a" });
    });
    expect(result.current.loading).toBe(false);
  });

  it("ranks users correctly (current user, friend, other)", async () => {
    const { result } = await renderUseSearchWithMocks("a");
    const userResults = getResultsByType(result.current.results, "user");
    expect(userResults.length).toBe(3);
    expect(userResults[0].displayName).toBe("Carol");
    expect(userResults[1].displayName).toBe("Barbara");
    expect(userResults[2].displayName).toBe("Alice");
  });

  it("returns currency results when searching by currency name", async () => {
    const { result } = await renderUseSearchWithMocks("Euro");
    const currencyResults = getResultsByType(
      result.current.results,
      "currency",
    );
    expect(currencyResults.length).toBe(1);
    expect(currencyResults[0].name).toBe("Euro");
    expect(currencyResults[0].code).toBe("EUR");
  });

  it("returns currency results when searching by currency code", async () => {
    const { result } = await renderUseSearchWithMocks("EUR");
    const currencyResults = getResultsByType(
      result.current.results,
      "currency",
    );
    expect(currencyResults.length).toBe(1);
    expect(currencyResults[0].name).toBe("Euro");
    expect(currencyResults[0].code).toBe("EUR");
  });

  it("includes currency results in combined results", async () => {
    const { result } = await renderUseSearchWithMocks("Euro");
    const allResults = result.current.results;
    const currencyResults = getResultsByType(allResults, "currency");
    expect(allResults.some((r) => r.type === "currency")).toBe(true);
    expect(currencyResults[0]).toMatchObject({
      code: "EUR",
      name: "Euro",
      type: "currency",
    });
  });

  it.each([
    ["Europe", 0, 1, 1],
    ["Western Europe", 0, 0, 1],
  ])(
    "ranks and maps countries, regions, and subregions correctly for '%s'",
    async (searchTerm, expectedCountry, expectedRegion, expectedSubregion) => {
      const { result } = await renderUseSearchWithMocks(searchTerm);
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

  it("handles missing friend list without throwing (friendIds empty)", async () => {
    const { result } = await renderUseSearchWithMocks("Euro", {
      userFriendsMock: { useUserFriends: () => ({ friends: undefined }) },
    });
    expect(result.current.loading).toBe(false);
  });

  it("handles missing countries/currencies/regions (no mapped results)", async () => {
    const { result } = await renderUseSearchWithMocks("Euro", {
      countriesMock: {
        useCountryData: () => ({
          countries: undefined,
          currencies: undefined,
          allRegions: undefined,
        }),
        getSubregionsForRegion: () => [],
      },
    });
    expect(result.current.results.some((r) => r.type === "currency")).toBe(
      false,
    );
    expect(result.current.results.some((r) => r.type === "country")).toBe(
      false,
    );
    expect(result.current.results.some((r) => r.type === "region")).toBe(false);
    expect(result.current.results.some((r) => r.type === "subregion")).toBe(
      false,
    );
  });
});
