import {
  firestoreMocks,
  authMocks,
  resetAllMocks,
} from "@test-utils/mockDbAndFirestore";
import {
  mockIndexedDb,
  mockFirebaseUtils,
  mockFirestore,
  tripsMock,
} from "@test-utils/setupVitestMocks";
import { tripsService } from "./tripsService";

// Mock IndexedDB, Firebase utils, and Firestore
mockIndexedDb();
mockFirebaseUtils();
mockFirestore();

// Import services and mocks
const { isAuthenticated, getUserCollection } = await import("@utils/firebase");
const { doc, getDocs, setDoc, deleteDoc } = await import("firebase/firestore");

describe("tripsService", () => {
  beforeEach(() => {
    resetAllMocks(tripsMock, firestoreMocks, authMocks);
  });

  it("loads trips from IndexedDB (guest)", async () => {
    (isAuthenticated as any).mockReturnValue(false);
    tripsMock.toArray.mockResolvedValueOnce([{ id: "1", name: "Trip 1" }]);
    const trips = await tripsService.load();
    expect(trips).toEqual([{ id: "1", name: "Trip 1" }]);
    expect(tripsMock.toArray).toHaveBeenCalled();
  });

  it("loads trips from Firestore (authenticated)", async () => {
    (isAuthenticated as any).mockReturnValue(true);
    const tripsCol = {};
    (getUserCollection as any).mockReturnValue(tripsCol);
    (getDocs as any).mockResolvedValueOnce({
      docs: [
        { id: "2", data: () => ({ name: "Trip 2" }) },
        { id: "3", data: () => ({ name: "Trip 3" }) },
      ],
    });
    const trips = await tripsService.load();
    expect(getUserCollection).toHaveBeenCalledWith("trips");
    expect(getDocs).toHaveBeenCalledWith(tripsCol);
    expect(trips).toEqual([
      { id: "2", name: "Trip 2" },
      { id: "3", name: "Trip 3" },
    ]);
  });

  it("saves trips to IndexedDB (guest)", async () => {
    (isAuthenticated as any).mockReturnValue(false);
    const trips = [
      { id: "a", name: "A" },
      { id: "b", name: "B" },
    ];
    await tripsService.save(trips as any);
    expect(tripsMock.clear).toHaveBeenCalled();
    expect(tripsMock.bulkAdd).toHaveBeenCalledWith(trips);
  });

  it("saves empty trips to IndexedDB (guest)", async () => {
    (isAuthenticated as any).mockReturnValue(false);
    await tripsService.save([]);
    expect(tripsMock.clear).toHaveBeenCalled();
    expect(tripsMock.bulkAdd).not.toHaveBeenCalled();
  });

  it("saves trips to Firestore (authenticated)", async () => {
    (isAuthenticated as any).mockReturnValue(true);
    const tripsCol = {};
    (getUserCollection as any).mockReturnValue(tripsCol);
    (doc as any).mockImplementation((_col: any, id: any) => ({ _col, id }));
    const trips = [
      { id: "a", name: "A" },
      { id: "b", name: "B" },
    ];
    await tripsService.save(trips as any);
    expect(getUserCollection).toHaveBeenCalledWith("trips");
    expect(setDoc).toHaveBeenCalledTimes(2);
    expect(setDoc).toHaveBeenCalledWith({ _col: tripsCol, id: "a" }, trips[0]);
    expect(setDoc).toHaveBeenCalledWith({ _col: tripsCol, id: "b" }, trips[1]);
  });

  it("adds a trip to IndexedDB (guest)", async () => {
    (isAuthenticated as any).mockReturnValue(false);
    const trip = { id: "2", name: "Trip 2" };
    await tripsService.add(trip as any);
    expect(tripsMock.add).toHaveBeenCalledWith(trip);
  });

  it("adds a trip to Firestore (authenticated)", async () => {
    (isAuthenticated as any).mockReturnValue(true);
    const tripsCol = {};
    (getUserCollection as any).mockReturnValue(tripsCol);
    (doc as any).mockImplementation((_col: any, id: any) => ({ _col, id }));
    const trip = { id: "2", name: "Trip 2" };
    await tripsService.add(trip as any);
    expect(setDoc).toHaveBeenCalledWith({ _col: tripsCol, id: "2" }, trip);
  });

  it("updates a trip in IndexedDB (guest)", async () => {
    (isAuthenticated as any).mockReturnValue(false);
    const trip = { id: "3", name: "Trip 3" };
    await tripsService.edit(trip as any);
    expect(tripsMock.put).toHaveBeenCalledWith(trip);
  });

  it("updates a trip in Firestore (authenticated)", async () => {
    (isAuthenticated as any).mockReturnValue(true);
    const tripsCol = {};
    (getUserCollection as any).mockReturnValue(tripsCol);
    (doc as any).mockImplementation((_col: any, id: any) => ({ _col, id }));
    const trip = { id: "3", name: "Trip 3" };
    await tripsService.edit(trip as any);
    expect(setDoc).toHaveBeenCalledWith({ _col: tripsCol, id: "3" }, trip);
  });

  it("updates favorite in IndexedDB (guest)", async () => {
    (isAuthenticated as any).mockReturnValue(false);
    tripsMock.get.mockResolvedValueOnce({
      id: "fav",
      name: "FavTrip",
      favorite: false,
    });
    await tripsService.updateFavorite("fav", true);
    expect(tripsMock.get).toHaveBeenCalledWith("fav");
    expect(tripsMock.put).toHaveBeenCalledWith({
      id: "fav",
      name: "FavTrip",
      favorite: true,
    });
  });

  it("updates favorite in Firestore (authenticated)", async () => {
    (isAuthenticated as any).mockReturnValue(true);
    const tripsCol = {};
    (getUserCollection as any).mockReturnValue(tripsCol);
    (doc as any).mockImplementation((_col: any, id: any) => ({ _col, id }));
    await tripsService.updateFavorite("fav", true);
    expect(setDoc).toHaveBeenCalledWith(
      { _col: tripsCol, id: "fav" },
      { favorite: true },
      { merge: true }
    );
  });

  it("updates rating in IndexedDB (guest)", async () => {
    (isAuthenticated as any).mockReturnValue(false);
    tripsMock.get.mockResolvedValueOnce({
      id: "rate",
      name: "RateTrip",
      rating: 1,
    });
    await tripsService.updateRating("rate", 5);
    expect(tripsMock.get).toHaveBeenCalledWith("rate");
    expect(tripsMock.put).toHaveBeenCalledWith({
      id: "rate",
      name: "RateTrip",
      rating: 5,
    });
  });

  it("updates rating in Firestore (authenticated)", async () => {
    (isAuthenticated as any).mockReturnValue(true);
    const tripsCol = {};
    (getUserCollection as any).mockReturnValue(tripsCol);
    (doc as any).mockImplementation((_col: any, id: any) => ({ _col, id }));
    await tripsService.updateRating("rate", 4);
    expect(setDoc).toHaveBeenCalledWith(
      { _col: tripsCol, id: "rate" },
      { rating: 4 },
      { merge: true }
    );
  });

  it("updates rating to undefined in Firestore (authenticated)", async () => {
    (isAuthenticated as any).mockReturnValue(true);
    const tripsCol = {};
    (getUserCollection as any).mockReturnValue(tripsCol);
    (doc as any).mockImplementation((_col: any, id: any) => ({ _col, id }));
    await tripsService.updateRating("rate", undefined);
    expect(setDoc).toHaveBeenCalledWith(
      { _col: tripsCol, id: "rate" },
      { rating: null },
      { merge: true }
    );
  });

  it("removes a trip from IndexedDB (guest)", async () => {
    (isAuthenticated as any).mockReturnValue(false);
    await tripsService.remove("4");
    expect(tripsMock.delete).toHaveBeenCalledWith("4");
  });

  it("removes a trip from Firestore (authenticated)", async () => {
    (isAuthenticated as any).mockReturnValue(true);
    const tripsCol = {};
    (getUserCollection as any).mockReturnValue(tripsCol);
    (doc as any).mockImplementation((_col: any, id: any) => ({ _col, id }));
    await tripsService.remove("4");
    expect(deleteDoc).toHaveBeenCalledWith({ _col: tripsCol, id: "4" });
  });
});
