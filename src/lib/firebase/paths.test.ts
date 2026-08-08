import { describe, it, expect, vi } from "vitest";
import { getPaths } from "./paths";

vi.mock("firebase/firestore", () => {
  return {
    collection: vi.fn((_db, path, ...segments) => ({
      path: [path, ...segments].filter(Boolean).join("/"),
    })),
    doc: vi.fn((_db, path, ...segments) => ({
      path: [path, ...segments].filter(Boolean).join("/"),
    })),
  };
});

vi.mock("./config", () => ({
  db: {},
}));

describe("getPaths Path Factory Utilities (Dynamic Version)", () => {
  it("generates correct paths for direct document references", () => {
    expect(getPaths.user("u1").path).toBe("users/u1");
    expect(getPaths.username("alex").path).toBe("usernames/alex");
    expect(getPaths.settingsDoc("u1").path).toBe("users/u1/settings/main");
    expect(getPaths.friendDoc("u1", "u2").path).toBe("users/u1/friends/u2");
    expect(getPaths.friendRequestDoc("u2", "u1").path).toBe(
      "users/u2/friendRequests/u1",
    );
    expect(getPaths.subDoc("u1", "trips", "t99").path).toBe(
      "users/u1/trips/t99",
    );
  });

  it("generates correct collection paths dynamically", () => {
    expect(getPaths.users().path).toBe("users");
    expect(getPaths.usernames().path).toBe("usernames");

    const subcollectionKeys: Array<
      | "activity"
      | "friends"
      | "friendRequests"
      | "trips"
      | "sharedTrips"
      | "settings"
      | "countryLists"
      | "layers"
      | "markers"
      | "savedMaps"
      | "sessions"
    > = [
      "activity",
      "friends",
      "friendRequests",
      "trips",
      "sharedTrips",
      "settings",
      "countryLists",
      "layers",
      "markers",
      "savedMaps",
      "sessions",
    ];

    for (const key of subcollectionKeys) {
      expect(getPaths.sub("u1", key).path).toBe(`users/u1/${key}`);
    }
  });
});
