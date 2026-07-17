import { describe, it, expect, vi } from "vitest";
import * as firestore from "firebase/firestore";
import { sharedTripsService } from "./sharedTripsService";

vi.mock("firebase/firestore", async () => {
  const actual = await vi.importActual("firebase/firestore");
  return {
    ...(actual as any),
    collection: vi.fn(),
    getDocs: vi.fn(),
    doc: vi.fn(),
    setDoc: vi.fn(),
    deleteDoc: vi.fn(),
  };
});

describe("sharedTripsService", () => {
  it("getSharedTripIds targets the correct collection path", async () => {
    vi.mocked(firestore.getDocs).mockResolvedValue({
      docs: [{ id: "t1" }, { id: "t2" }],
    } as any);

    const ids = await sharedTripsService.getSharedTripIds("u1");

    expect(firestore.collection).toHaveBeenCalledWith(
      expect.anything(),
      "users",
      "u1",
      "sharedTrips",
    );
    expect(ids).toEqual(["t1", "t2"]);
  });

  it("addReference targets the correct subcollection", async () => {
    await sharedTripsService.addReference("p1", "o1", "t1");

    expect(firestore.collection).toHaveBeenCalledWith(
      expect.anything(),
      "users/p1/sharedTrips",
    );
    expect(firestore.setDoc).toHaveBeenCalled();
  });

  it("removeReference deletes from the correct subcollection", async () => {
    await sharedTripsService.removeReference("p1", "t1");

    expect(firestore.collection).toHaveBeenCalledWith(
      expect.anything(),
      "users/p1/sharedTrips",
    );
    expect(firestore.deleteDoc).toHaveBeenCalled();
  });
});
