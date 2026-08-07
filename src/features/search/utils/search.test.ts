import { describe, it, expect, vi } from "vitest";
import type { Country } from "@features/countries/types";
import type { SearchResult } from "../types";
import {
  getSearchRoute,
  getCountryLabel,
  getUserLabel,
  getSearchResultKey,
  rankByStartsWithAndContains,
  rankAndMap,
} from "./search";

vi.mock("@lib/i18n/config", () => ({
  default: {
    t: (
      key: string,
      options?: { sovereign?: string; defaultValue?: string },
    ) => {
      if (options?.sovereign) return `${key}:${options.sovereign}`;
      return options?.defaultValue || key;
    },
  },
}));

vi.mock("@features/countries/utils/countryData", () => ({
  getCountryName: (code: string) => (code === "FR" ? "France" : null),
}));

const mockCreatedAt = "2024-01-01T00:00:00Z";

const makeProfile = (uid: string) => ({
  uid,
  username: `user${uid}`,
  displayName: `User ${uid}`,
  isPublic: true,
  email: `user${uid}@example.com`,
  photoURL: "http://example.com/photo.jpg",
  emailVerified: true,
  phoneNumber: "1234567890",
  providerId: "provider1",
  createdAt: mockCreatedAt,
  lastSignInTime: mockCreatedAt,
});

const makeFriend = (uid: string) => ({ uid, createdAt: mockCreatedAt });
const currentUser = makeProfile("1");
const friendList = [makeFriend("2"), makeFriend("3")];

describe("getSearchRoute", () => {
  it("trims and encodes search routes correctly", () => {
    expect(getSearchRoute("  spaced out  ")).toBe(
      `/search?query=${encodeURIComponent("spaced out")}`,
    );
  });
});

describe("getCountryLabel", () => {
  const mockCountries = [] as Country[];

  it("returns formatted label for dependency / overseas_region with known sovereign", () => {
    const item = {
      sovereigntyStatus: "dependency",
      sovereignState: "FR",
    } as Country;
    expect(getCountryLabel(item, mockCountries)).toBe(
      "countries:labels.dependency_of:France",
    );
  });

  it("returns default country label for independent states or unknown sovereigns", () => {
    const independent = { sovereigntyStatus: "sovereign" } as Country;
    const unknownSovereign = {
      sovereigntyStatus: "dependency",
      sovereignState: "UNKNOWN",
    } as Country;

    expect(getCountryLabel(independent, mockCountries)).toBe("Country");
    expect(getCountryLabel(unknownSovereign, mockCountries)).toBe("Country");
  });
});

describe("getUserLabel", () => {
  it("returns correct user relationship label", () => {
    expect(getUserLabel(makeProfile("1"), currentUser, friendList)).toBe("You");
    expect(getUserLabel(makeProfile("2"), currentUser, friendList)).toBe(
      "Friend",
    );
    expect(getUserLabel(makeProfile("4"), currentUser, friendList)).toBe("");
    expect(getUserLabel(makeProfile("2"), null, friendList)).toBe("");
  });
});

describe("getSearchResultKey", () => {
  it("generates correct key for each search result type", () => {
    expect(
      getSearchResultKey({ type: "user", uid: "usr1" } as SearchResult),
    ).toBe("usr1");
    expect(
      getSearchResultKey({
        type: "country",
        isoCode: "US",
        name: "USA",
      } as SearchResult),
    ).toBe("US");
    expect(
      getSearchResultKey({
        type: "country",
        isoCode: "",
        name: "USA",
      } as SearchResult),
    ).toBe("USA");
    expect(
      getSearchResultKey({ type: "currency", code: "USD" } as SearchResult),
    ).toBe("USD");
    expect(
      getSearchResultKey({ type: "region", region: "Europe" } as SearchResult),
    ).toBe("Europe");
    expect(
      getSearchResultKey({
        type: "subregion",
        region: "Europe",
        subregion: "Western Europe",
      } as SearchResult),
    ).toBe("Europe-Western Europe");
  });

  it("falls back to JSON stringification for unknown item types", () => {
    const unknownItem = {
      type: "unknown_type",
      id: 123,
    } as unknown as SearchResult;
    expect(getSearchResultKey(unknownItem)).toBe(JSON.stringify(unknownItem));
  });
});

describe("rankByStartsWithAndContains", () => {
  const items = ["apple", "banana", "grape", "pineapple", "apricot"];

  it("ranks items starting with search term first", () => {
    const result = rankByStartsWithAndContains(items, (i) => i, "ap");
    expect(result.slice(0, 2)).toEqual(["apple", "apricot"]);
    expect(result).toContain("pineapple");
  });

  it("handles empty matches or undefined labels gracefully", () => {
    expect(rankByStartsWithAndContains(items, (i) => i, "zzz")).toEqual([]);
    expect(
      rankByStartsWithAndContains([{ name: "apple" }], () => undefined, "ap"),
    ).toEqual([]);
  });
});

describe("rankAndMap", () => {
  const items = [
    { name: "apple" },
    { name: "banana" },
    { name: "pineapple" },
    { name: "apricot" },
    { name: "apple" },
  ];

  it("ranks, deduplicates, and maps items", () => {
    const result = rankAndMap(
      items,
      (i) => i.name,
      "ap",
      (i) => i.name.toUpperCase(),
    );
    expect(result).toEqual(["APPLE", "APRICOT", "PINEAPPLE"]);
  });

  it("handles empty matches and undefined labels", () => {
    expect(
      rankAndMap(
        items,
        (i) => i.name,
        "zzz",
        (i) => i.name,
      ),
    ).toEqual([]);
    expect(
      rankAndMap(
        items,
        () => undefined,
        "ap",
        (i) => i.name,
      ),
    ).toEqual([]);
  });
});
