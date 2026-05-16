import { describe, it, expect, vi } from "vitest";
import { getSharedTripIds } from "./sharedTripsService";
import * as getDocsModule from "firebase/firestore";

vi.mock("firebase/firestore", () => ({
  getFirestore: () => ({}),
  collection: (...args: string[]) => ({ path: args.join("/") }),
    addDoc: vi.fn(),
    getDocs: vi.fn(async (_q) => ({
    docs: [{ id: "trip1" }, { id: "trip2" }, { id: "trip3" }],
  })),
}));

describe("getSharedTripIds", () => {
  it("returns shared trip IDs for a user", async () => {
    const ids = await getSharedTripIds("user123");
    expect(ids).toEqual(["trip1", "trip2", "trip3"]);
  });

  it("returns empty array if no shared trips", async () => {
    const spy = vi.spyOn(getDocsModule, "getDocs");
    spy.mockResolvedValueOnce({
      docs: [],
      metadata: {
        hasPendingWrites: false,
        fromCache: false,
        isEqual: () => true,
      },
      query: {
        converter: null,
        type: "query",
        firestore: {
          type: "firestore",
          app: {
            name: "mock",
            options: {},
            automaticDataCollectionEnabled: false,
          },
          toJSON: () => ({}),
        },
        withConverter: function (_converter: any) {
          return this as any;
        },
      },
      size: 0,
      empty: true,
      forEach: (_cb: any) => {},
      docChanges: () => [],
      toJSON: () => ({}),
    });
    const ids = await getSharedTripIds("user456");
    expect(ids).toEqual([]);
    spy.mockRestore();
  });
});
