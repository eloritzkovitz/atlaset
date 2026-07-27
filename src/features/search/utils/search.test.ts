import {
  getSearchRoute,
  getUserLabel,
  rankByStartsWithAndContains,
  rankAndMap,
} from "./search";

const mockCreatedAt = new Date().toISOString();

const mockTimestamp = {
  seconds: 0,
  nanoseconds: 0,
  toDate: () => new Date(),
  toMillis: () => 0,
  isEqual: () => true,
  toJSON: () => ({ seconds: 0, nanoseconds: 0, type: "Timestamp" }),
  valueOf: () => "mock-timestamp",
};
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
});
const makeFriend = (uid: string) => ({ uid, createdAt: mockTimestamp });
const currentUser = makeProfile("1");
const friendList = [makeFriend("2"), makeFriend("3")];

describe("getSearchRoute", () => {
  it("returns correct search route for a given term", () => {
    const term = "test search";
    const expectedRoute = `/search?query=${encodeURIComponent(term)}`;
    expect(getSearchRoute(term)).toBe(expectedRoute);
  });

  it("trims whitespace from the search term", () => {
    const term = "   spaced out   ";
    const expectedRoute = `/search?query=${encodeURIComponent(term.trim())}`;
    expect(getSearchRoute(term)).toBe(expectedRoute);
  });
});

describe("getUserLabel", () => {
  it("returns 'You' for current user", () => {
    expect(getUserLabel(makeProfile("1"), currentUser, friendList)).toBe("You");
  });

  it("returns 'Friend' for friend", () => {
    expect(getUserLabel(makeProfile("2"), currentUser, friendList)).toBe(
      "Friend",
    );
  });

  it("returns '' for non-friend, non-user", () => {
    expect(getUserLabel(makeProfile("4"), currentUser, friendList)).toBe("");
  });

  it("returns '' if currentUser is null", () => {
    expect(getUserLabel(makeProfile("2"), null, friendList)).toBe("");
  });
});

describe("rankByStartsWithAndContains", () => {
  const items = ["apple", "banana", "grape", "pineapple", "apricot"];

  it("ranks items starting with searchTerm first", () => {
    const result = rankByStartsWithAndContains(items, (i) => i, "ap");
    expect(result.slice(0, 2)).toEqual(["apple", "apricot"]);
    expect(result).toContain("pineapple");
  });

  it("returns empty array if no match", () => {
    const result = rankByStartsWithAndContains(items, (i) => i, "zzz");
    expect(result).toEqual([]);
  });

  it("handles undefined labels gracefully", () => {
    const objItems = [{ name: "apple" }, { name: "banana" }];
    const result = rankByStartsWithAndContains(objItems, () => undefined, "ap");
    expect(result).toEqual([]);
  });
});

describe("rankAndMap", () => {
  const items = [
    { name: "apple" },
    { name: "banana" },
    { name: "grape" },
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
    expect(result).toEqual(["APPLE", "APRICOT", "GRAPE", "PINEAPPLE"]);
    expect(result).not.toContain("BANANA");
    expect(result.filter((x) => x === "APPLE").length).toBe(1);
  });

  it("returns empty array if no match", () => {
    const result = rankAndMap(
      items,
      (i) => i.name,
      "zzz",
      (i) => i.name,
    );
    expect(result).toEqual([]);
  });

  it("handles undefined labels gracefully", () => {
    const objItems = [{ name: "apple" }, { name: "banana" }];
    const result = rankAndMap(
      objItems,
      () => undefined,
      "ap",
      (i) => i.name,
    );
    expect(result).toEqual([]);
  });
});
