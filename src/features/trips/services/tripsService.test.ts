import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@utils/firebase", () => {
  return {
    isAuthenticated: vi.fn(),
    getCurrentUser: vi.fn(),
    getUserCollection: vi.fn(),
    __esModule: true,
  };
});
vi.mock("firebase/firestore", () => {
  return {
    collection: vi.fn(),
    doc: vi.fn(),
    getDocs: vi.fn(),
    setDoc: vi.fn(),
    deleteDoc: vi.fn(),
    writeBatch: vi.fn(),
    getDoc: vi.fn(),
    __esModule: true,
  };
});
vi.mock("@features/user", () => {
  return {
    logUserActivity: vi.fn(),
    __esModule: true,
  };
});
vi.mock("@firebase", () => ({
  db: {},
  __esModule: true,
}));
vi.mock("../../user/profile/services/profileService", () => ({
  profileService: {
    updateVisitedCountryCodes: vi.fn(),
  },
  __esModule: true,
}));
import { profileService } from "../../user/profile/services/profileService";
const updateVisitedCountryCodesMock = profileService.updateVisitedCountryCodes as unknown as ReturnType<typeof vi.fn>;

import { tripsService } from "./tripsService";
import * as firebaseUtils from "@utils/firebase";
import * as firestore from "firebase/firestore";
import { logUserActivity } from "@features/user";

const isAuthenticatedMock =
  firebaseUtils.isAuthenticated as unknown as ReturnType<typeof vi.fn>;
const getCurrentUserMock =
  firebaseUtils.getCurrentUser as unknown as ReturnType<typeof vi.fn>;
const collectionMock = firestore.collection as unknown as ReturnType<
  typeof vi.fn
>;
const docMock = firestore.doc as unknown as ReturnType<typeof vi.fn>;
const getDocsMock = firestore.getDocs as unknown as ReturnType<typeof vi.fn>;
const setDocMock = firestore.setDoc as unknown as ReturnType<typeof vi.fn>;
const deleteDocMock = firestore.deleteDoc as unknown as ReturnType<
  typeof vi.fn
>;
const writeBatchMock = firestore.writeBatch as unknown as ReturnType<
  typeof vi.fn
>;

describe("tripsService", () => {
  it("loads shared trips from Firestore (authenticated)", async () => {
    isAuthenticatedMock.mockReturnValue(true);
    getCurrentUserMock.mockReturnValue({ uid: "abc" });
    const tripsCol = {};
    (
      firebaseUtils.getUserCollection as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(tripsCol);

    getDocsMock
      .mockResolvedValueOnce({
        docs: [{ id: "2", data: () => ({ name: "Trip 2" }) }],
      })
      .mockResolvedValueOnce({
        docs: [{ data: () => ({ ownerUid: "friend1", tripId: "shared1" }) }],
      });

    const sharedTripDoc = {
      id: "shared1",
      exists: () => true,
      data: () => ({ name: "Shared Trip" }),
    };
    const getDocSpy = vi
      .spyOn(firestore, "getDoc")
      .mockResolvedValue(sharedTripDoc as any);
    const trips = await tripsService.load();
    expect(trips).toEqual([
      { id: "2", name: "Trip 2" },
      { id: "shared1", name: "Shared Trip" },
    ]);
    getDocSpy.mockRestore();
    updateVisitedCountryCodesMock.mockReset();
  });

  it("save does nothing if trips is empty (authenticated)", async () => {
    isAuthenticatedMock.mockReturnValue(true);
    getCurrentUserMock.mockReturnValue({ uid: "abc", displayName: "TestUser" });
    const tripsCol = {};
    (
      firebaseUtils.getUserCollection as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(tripsCol);
    await tripsService.save([]);
    expect(setDocMock).not.toHaveBeenCalled();
    expect(logUserActivity).toHaveBeenCalledWith(
      410,
      expect.objectContaining({ count: 0, userName: "TestUser" }),
      "abc"
    );
  });

  beforeEach(() => {
    isAuthenticatedMock.mockReset();
    getCurrentUserMock.mockReset();
    collectionMock.mockReset();
    docMock.mockReset();
    getDocsMock.mockReset();
    setDocMock.mockReset();
    deleteDocMock.mockReset();
    writeBatchMock.mockReset();
    vi.mocked(logUserActivity).mockReset();
  });

  it("loads trips from Firestore (authenticated)", async () => {
    isAuthenticatedMock.mockReturnValue(true);
    getCurrentUserMock.mockReturnValue({ uid: "abc" });
    const tripsCol = {};
    (
      firebaseUtils.getUserCollection as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(tripsCol);

    getDocsMock
      .mockResolvedValueOnce({
        docs: [
          { id: "2", data: () => ({ name: "Trip 2" }) },
          { id: "3", data: () => ({ name: "Trip 3" }) },
        ],
      })
      .mockResolvedValueOnce({ docs: [] });
    const trips = await tripsService.load();
    expect(firebaseUtils.getUserCollection).toHaveBeenCalledWith("trips");
    expect(getDocsMock).toHaveBeenCalledWith(tripsCol);
    expect(trips).toEqual([
      { id: "2", name: "Trip 2" },
      { id: "3", name: "Trip 3" },
    ]);
  });

  it("saves trips to Firestore (authenticated)", async () => {
    isAuthenticatedMock.mockReturnValue(true);
    getCurrentUserMock.mockReturnValue({ uid: "abc" });
    const tripsCol = {};
    (
      firebaseUtils.getUserCollection as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(tripsCol);
    docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));
    const trips = [
      { id: "a", name: "A" },
      { id: "b", name: "B" },
    ];
    await tripsService.save(trips as any);
    expect(firebaseUtils.getUserCollection).toHaveBeenCalledWith("trips");
    expect(setDocMock).toHaveBeenCalledTimes(2);
    expect(setDocMock).toHaveBeenCalledWith(
      { _col: tripsCol, id: "a" },
      trips[0]
    );
    expect(setDocMock).toHaveBeenCalledWith(
      { _col: tripsCol, id: "b" },
      trips[1]
    );
  });

  it("adds a trip to Firestore (authenticated) and logs activity and updates visitedCountryCodes", async () => {
    isAuthenticatedMock.mockReturnValue(true);
    getCurrentUserMock.mockReturnValue({ uid: "abc", displayName: "TestUser" });
    const tripsCol = {};
    (
      firebaseUtils.getUserCollection as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(tripsCol);
    docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));

    const trip = {
      id: "2",
      name: "Trip 2",
      participants: ["abc", "friend1", "friend2"],
    };
    await tripsService.add(trip as any);

    expect(setDocMock).toHaveBeenCalledWith(
      { _col: tripsCol, id: "2" },
      {
        id: "2",
        name: "Trip 2",
        participants: ["abc", "friend1", "friend2"],
        startDate: null,
        endDate: null,
      }
    );

    expect(setDocMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: "2" }),
      expect.objectContaining({ ownerUid: "abc", tripId: "2" })
    );
    expect(setDocMock).toHaveBeenCalledTimes(3);
    expect(logUserActivity).toHaveBeenCalledWith(
      411,
      expect.objectContaining({
        tripId: "2",
        itemName: "Trip 2",
        userName: "TestUser",
      }),
      "abc"
    );
    expect(updateVisitedCountryCodesMock).toHaveBeenCalledWith("abc");
  });

  it("edit sets null for undefined dates in Firestore and updates visitedCountryCodes", async () => {
    isAuthenticatedMock.mockReturnValue(true);
    getCurrentUserMock.mockReturnValue({ uid: "abc", displayName: "TestUser" });
    const tripsCol = {};
    (
      firebaseUtils.getUserCollection as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(tripsCol);
    docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));

    getDocsMock.mockResolvedValueOnce({ docs: [] });
    const prevTripDoc = {
      id: "5",
      exists: () => true,
      data: () => ({ participants: ["abc", "friend1"] }),
      ref: {},
      metadata: {
        hasPendingWrites: false,
        fromCache: false,
        isEqual: () => false,
      },
      get: () => undefined,
      toJSON: () => ({}),
    };
    const getDocSpy = vi
      .spyOn(firestore, "getDoc")
      .mockResolvedValue(prevTripDoc as any);
    const trip = {
      id: "5",
      name: "Trip 5",
      participants: ["abc", "friend2"],
      startDate: undefined,
      endDate: undefined,
    };
    await tripsService.edit(trip as any);

    expect(setDocMock).toHaveBeenCalledWith(
      { _col: tripsCol, id: "5" },
      {
        id: "5",
        name: "Trip 5",
        participants: ["abc", "friend2"],
        startDate: null,
        endDate: null,
      }
    );

    expect(setDocMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: "5" }),
      expect.objectContaining({ ownerUid: "abc", tripId: "5" })
    );
    expect(deleteDocMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: "5" })
    );
    expect(logUserActivity).toHaveBeenCalledWith(
      412,
      expect.objectContaining({
        tripId: "5",
        itemName: "Trip 5",
        userName: "TestUser",
      }),
      "abc"
    );
    expect(updateVisitedCountryCodesMock).toHaveBeenCalledWith("abc");
    getDocSpy.mockRestore();
  });

  it("remove logs activity with tripName if found in Firestore and updates visitedCountryCodes", async () => {
    isAuthenticatedMock.mockReturnValue(true);
    getCurrentUserMock.mockReturnValue({ uid: "abc", displayName: "TestUser" });
    const tripsCol = {};
    (
      firebaseUtils.getUserCollection as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(tripsCol);
    docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));
    getDocsMock.mockResolvedValueOnce({
      docs: [{ id: "del", data: () => ({ name: "DelTrip" }) }],
    });
    await tripsService.remove("del");
    expect(deleteDocMock).toHaveBeenCalledWith({ _col: tripsCol, id: "del" });
    expect(logUserActivity).toHaveBeenCalledWith(
      415,
      expect.objectContaining({
        tripId: "del",
        itemName: "DelTrip",
        userName: "TestUser",
      }),
      "abc"
    );
    expect(updateVisitedCountryCodesMock).toHaveBeenCalledWith("abc");
  });

  it("remove logs activity with undefined tripName if not found in Firestore and updates visitedCountryCodes", async () => {
    isAuthenticatedMock.mockReturnValue(true);
    getCurrentUserMock.mockReturnValue({ uid: "abc", displayName: "TestUser" });
    const tripsCol = {};
    (
      firebaseUtils.getUserCollection as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(tripsCol);
    docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));
    getDocsMock.mockResolvedValueOnce({ docs: [] });
    await tripsService.remove("del2");
    expect(deleteDocMock).toHaveBeenCalledWith({ _col: tripsCol, id: "del2" });
    expect(logUserActivity).toHaveBeenCalledWith(
      415,
      expect.objectContaining({
        tripId: "del2",
        itemName: undefined,
        userName: "TestUser",
      }),
      "abc"
    );
    expect(updateVisitedCountryCodesMock).toHaveBeenCalledWith("abc");
  });

  it("updates a trip in Firestore (authenticated)", async () => {
    isAuthenticatedMock.mockReturnValue(true);
    getCurrentUserMock.mockReturnValue({ uid: "abc" });
    const tripsCol = {};
    (
      firebaseUtils.getUserCollection as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(tripsCol);
    docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));
    const getDocSpy = vi
      .spyOn(firestore, "getDoc")
      .mockResolvedValue({ exists: () => false } as any);
    const trip = {
      id: "3",
      name: "Trip 3",
      startDate: undefined,
      endDate: undefined,
    };
    await tripsService.edit(trip as any);
    expect(setDocMock).toHaveBeenCalledWith(
      { _col: tripsCol, id: "3" },
      {
        id: "3",
        name: "Trip 3",
        startDate: null,
        endDate: null,
        participants: ["abc"],
      }
    );
    getDocSpy.mockRestore();
  });

  it("updates favorite in Firestore (authenticated)", async () => {
    isAuthenticatedMock.mockReturnValue(true);
    getCurrentUserMock.mockReturnValue({ uid: "abc" });
    const tripsCol = {};
    (
      firebaseUtils.getUserCollection as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(tripsCol);
    docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));
    await tripsService.updateFavorite("fav", true);
    expect(setDocMock).toHaveBeenCalledWith(
      { _col: tripsCol, id: "fav" },
      { favorite: true },
      { merge: true }
    );
  });

  it("updates rating in Firestore (authenticated)", async () => {
    isAuthenticatedMock.mockReturnValue(true);
    getCurrentUserMock.mockReturnValue({ uid: "abc" });
    const tripsCol = {};
    (
      firebaseUtils.getUserCollection as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(tripsCol);
    docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));
    await tripsService.updateRating("rate", 4);
    expect(setDocMock).toHaveBeenCalledWith(
      { _col: tripsCol, id: "rate" },
      { rating: 4 },
      { merge: true }
    );
  });

  it("updates rating to undefined in Firestore (authenticated)", async () => {
    isAuthenticatedMock.mockReturnValue(true);
    getCurrentUserMock.mockReturnValue({ uid: "abc" });
    const tripsCol = {};
    (
      firebaseUtils.getUserCollection as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(tripsCol);
    docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));
    await tripsService.updateRating("rate", undefined);
    expect(setDocMock).toHaveBeenCalledWith(
      { _col: tripsCol, id: "rate" },
      { rating: null },
      { merge: true }
    );
  });

  it("removes a trip from Firestore (authenticated)", async () => {
    isAuthenticatedMock.mockReturnValue(true);
    getCurrentUserMock.mockReturnValue({ uid: "abc" });
    const tripsCol = {};
    (
      firebaseUtils.getUserCollection as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(tripsCol);
    docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));

    getDocsMock.mockResolvedValueOnce({
      docs: [
        {
          id: "4",
          data: () => ({
            name: "Trip 4",
            participants: ["abc", "friend1", "friend2"],
          }),
        },
      ],
    });
    await tripsService.remove("4");

    expect(deleteDocMock).toHaveBeenCalledWith({ _col: tripsCol, id: "4" });
    expect(deleteDocMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: "4" })
    );
  });

  it("throws if not authenticated for load", async () => {
    isAuthenticatedMock.mockReturnValue(false);
    await expect(tripsService.load()).rejects.toThrow(
      "Authentication required to load trips."
    );
  });

  it("throws if not authenticated for save", async () => {
    isAuthenticatedMock.mockReturnValue(false);
    await expect(
      tripsService.save([{ id: "1", name: "Trip 1" } as any])
    ).rejects.toThrow("Authentication required to save trips.");
  });

  it("throws if not authenticated for add", async () => {
    isAuthenticatedMock.mockReturnValue(false);
    await expect(
      tripsService.add({ id: "1", name: "Trip 1" } as any)
    ).rejects.toThrow("Authentication required to add a trip.");
  });

  it("throws if not authenticated for edit", async () => {
    isAuthenticatedMock.mockReturnValue(false);
    await expect(
      tripsService.edit({ id: "1", name: "Trip 1" } as any)
    ).rejects.toThrow("Authentication required to edit a trip.");
  });

  it("throws if not authenticated for updateFavorite", async () => {
    isAuthenticatedMock.mockReturnValue(false);
    await expect(tripsService.updateFavorite("1", true)).rejects.toThrow(
      "Authentication required to update favorite."
    );
  });

  it("throws if not authenticated for updateRating", async () => {
    isAuthenticatedMock.mockReturnValue(false);
    await expect(tripsService.updateRating("1", 5)).rejects.toThrow(
      "Authentication required to update rating."
    );
  });

  it("throws if not authenticated for remove", async () => {
    isAuthenticatedMock.mockReturnValue(false);
    await expect(tripsService.remove("1")).rejects.toThrow(
      "Authentication required to remove a trip."
    );
  });

  it("add always includes owner in participants", async () => {
    isAuthenticatedMock.mockReturnValue(true);
    getCurrentUserMock.mockReturnValue({ uid: "abc", displayName: "TestUser" });
    const tripsCol = {};
    (
      firebaseUtils.getUserCollection as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(tripsCol);
    docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));
    const trip = { id: "1", name: "Trip 1", participants: ["friend1"] };
    await tripsService.add(trip as any);
    expect(setDocMock).toHaveBeenCalledWith(
      { _col: tripsCol, id: "1" },
      expect.objectContaining({ participants: ["friend1", "abc"] })
    );
  });

  it("edit always includes owner in participants", async () => {
    isAuthenticatedMock.mockReturnValue(true);
    getCurrentUserMock.mockReturnValue({ uid: "abc", displayName: "TestUser" });
    const tripsCol = {};
    (
      firebaseUtils.getUserCollection as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(tripsCol);
    docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));
    const prevTripDoc = {
      id: "1",
      exists: () => true,
      data: () => ({ participants: ["friend1"] }),
    };
    vi.spyOn(firestore, "getDoc").mockResolvedValueOnce(prevTripDoc as any);
    const trip = { id: "1", name: "Trip 1", participants: ["friend1"] };
    await tripsService.edit(trip as any);
    expect(setDocMock).toHaveBeenCalledWith(
      { _col: tripsCol, id: "1" },
      expect.objectContaining({ participants: ["friend1", "abc"] })
    );
  });
});
