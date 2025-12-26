import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock dependencies before importing the service
vi.mock("@utils/db", () => {
  const tripsMock = {
    count: vi.fn(),
    toArray: vi.fn(),
    clear: vi.fn(),
    add: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    bulkAdd: vi.fn(),
    bulkPut: vi.fn(),
  };
  return {
    appDb: {
      trips: tripsMock,
      overlays: {},
      markers: {},
      settings: {},
    },
    __esModule: true,
  };
});  
vi.mock("../../../../firebase", () => ({
  db: {},
  __esModule: true,
}));

import { tripsService } from "./tripsService";
import { appDb } from "@utils/db";
import * as firebaseUtils from "@utils/firebase";
import * as firestore from "firebase/firestore";
import { logUserActivity } from "../../../features/user";

// Cast imported mocks to Vitest mock types
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

describe.skip("tripsService", () => {
  beforeEach(() => {
    // Reset all mocks
    if (!appDb.overlays) {
      throw new Error(
        "appDb.overlays is undefined. The mock was not set up correctly."
      );
    }
    Object.values(appDb.overlays).forEach((fn) =>
      (fn as { mockReset: () => void }).mockReset()
    );
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

  it("loads trips from IndexedDB (guest)", async () => {
    isAuthenticatedMock.mockReturnValue(false);
    (
      appDb.trips.toArray as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce([{ id: "1", name: "Trip 1" }]);
    const trips = await tripsService.load();
    expect(trips).toEqual([{ id: "1", name: "Trip 1" }]);
    expect(appDb.trips.toArray).toHaveBeenCalled();
  });

  it("loads trips from Firestore (authenticated)", async () => {
    isAuthenticatedMock.mockReturnValue(true);
    const tripsCol = {};
    getCurrentUserMock.mockReturnValue(tripsCol);
    getDocsMock.mockResolvedValueOnce({
      docs: [
        { id: "2", data: () => ({ name: "Trip 2" }) },
        { id: "3", data: () => ({ name: "Trip 3" }) },
      ],
    });
    const trips = await tripsService.load();
    expect(getCurrentUserMock).toHaveBeenCalledWith("trips");
    expect(getDocsMock).toHaveBeenCalledWith(tripsCol);
    expect(trips).toEqual([
      { id: "2", name: "Trip 2" },
      { id: "3", name: "Trip 3" },
    ]);
  });

  it("saves trips to IndexedDB (guest)", async () => {
    isAuthenticatedMock.mockReturnValue(false);
    const trips = [
      { id: "a", name: "A" },
      { id: "b", name: "B" },
    ];
    await tripsService.save(trips as any);
    expect(appDb.trips.clear).toHaveBeenCalled();
    expect(appDb.trips.bulkAdd).toHaveBeenCalledWith(trips);
  });

  it("saves empty trips to IndexedDB (guest)", async () => {
    (isAuthenticatedMock as any).mockReturnValue(false);
    await tripsService.save([]);
    expect(appDb.trips.clear).toHaveBeenCalled();
    expect(appDb.trips.bulkAdd).not.toHaveBeenCalled();
  });

  it("saves trips to Firestore (authenticated)", async () => {
    isAuthenticatedMock.mockReturnValue(true);
    const tripsCol = {};
    getCurrentUserMock.mockReturnValue(tripsCol);
    (docMock as any).mockImplementation((_col: any, id: any) => ({ _col, id }));
    const trips = [
      { id: "a", name: "A" },
      { id: "b", name: "B" },
    ];
    await tripsService.save(trips as any);
    expect(getCurrentUserMock).toHaveBeenCalledWith("trips");
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

  it("adds a trip to IndexedDB (guest)", async () => {
    (isAuthenticatedMock as any).mockReturnValue(false);
    const trip = { id: "2", name: "Trip 2" };
    await tripsService.add(trip as any);
    expect(appDb.trips.add).toHaveBeenCalledWith(trip);
  });

  it("adds a trip to Firestore (authenticated)", async () => {
    isAuthenticatedMock.mockReturnValue(true);
    const tripsCol = {};
    getCurrentUserMock.mockReturnValue(tripsCol);
    docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));
    const trip = { id: "2", name: "Trip 2" };
    await tripsService.add(trip as any);
    expect(setDocMock).toHaveBeenCalledWith({ _col: tripsCol, id: "2" }, trip);
  });

  it("updates a trip in IndexedDB (guest)", async () => {
    isAuthenticatedMock.mockReturnValue(false);
    const trip = { id: "3", name: "Trip 3" };
    await tripsService.edit(trip as any);
    expect(appDb.trips.put).toHaveBeenCalledWith(trip);
  });

  it("updates a trip in Firestore (authenticated)", async () => {
    isAuthenticatedMock.mockReturnValue(true);
    const tripsCol = {};
    getCurrentUserMock.mockReturnValue(tripsCol);
    docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));
    const trip = {
      id: "3",
      name: "Trip 3",
      startDate: undefined,
      endDate: undefined,
    };
    await tripsService.edit(trip as any);
    expect(setDocMock).toHaveBeenCalledWith(
      { _col: tripsCol, id: "3" },
      { id: "3", name: "Trip 3", startDate: null, endDate: null }
    );
  });

  it("updates favorite in IndexedDB (guest)", async () => {
    isAuthenticatedMock.mockReturnValue(false);
    (
      appDb.trips.get as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      id: "fav",
      name: "FavTrip",
      favorite: false,
    });
    await tripsService.updateFavorite("fav", true);
    expect(appDb.trips.get).toHaveBeenCalledWith("fav");
    expect(appDb.trips.put).toHaveBeenCalledWith({
      id: "fav",
      name: "FavTrip",
      favorite: true,
    });
  });

  it("updates favorite in Firestore (authenticated)", async () => {
    isAuthenticatedMock.mockReturnValue(true);
    const tripsCol = {};
    getCurrentUserMock.mockReturnValue(tripsCol);
    docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));
    await tripsService.updateFavorite("fav", true);
    expect(setDocMock).toHaveBeenCalledWith(
      { _col: tripsCol, id: "fav" },
      { favorite: true },
      { merge: true }
    );
  });

  it("updates rating in IndexedDB (guest)", async () => {
    isAuthenticatedMock.mockReturnValue(false);
    (
      appDb.trips.get as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({
      id: "rate",
      name: "RateTrip",
      rating: 1,
    });
    await tripsService.updateRating("rate", 5);
    expect(appDb.trips.get).toHaveBeenCalledWith("rate");
    expect(appDb.trips.put).toHaveBeenCalledWith({
      id: "rate",
      name: "RateTrip",
      rating: 5,
    });
  });

  it("updates rating in Firestore (authenticated)", async () => {
    isAuthenticatedMock.mockReturnValue(true);
    const tripsCol = {};
    getCurrentUserMock.mockReturnValue(tripsCol);
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
    const tripsCol = {};
    getCurrentUserMock.mockReturnValue(tripsCol);
    docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));
    await tripsService.updateRating("rate", undefined);
    expect(setDocMock).toHaveBeenCalledWith(
      { _col: tripsCol, id: "rate" },
      { rating: null },
      { merge: true }
    );
  });

  it("removes a trip from IndexedDB (guest)", async () => {
    isAuthenticatedMock.mockReturnValue(false);
    await tripsService.remove("4");
    expect(appDb.trips.delete).toHaveBeenCalledWith("4");
  });

  it("removes a trip from Firestore (authenticated)", async () => {
    isAuthenticatedMock.mockReturnValue(true);
    const tripsCol = {};
    getCurrentUserMock.mockReturnValue(tripsCol);
    docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));
    await tripsService.remove("4");
    expect(deleteDocMock).toHaveBeenCalledWith({ _col: tripsCol, id: "4" });
  });
});
