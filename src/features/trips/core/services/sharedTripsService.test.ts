import { describe, it, expect } from "vitest";
import { mockFirestoreControls as fs } from "@test-utils/firebaseMockRegistry";
import { sharedTripsService } from "./sharedTripsService";

describe("sharedTripsService", () => {
  it("getSharedTripIds targets the correct collection path", async () => {
    fs.getDocs.mockResolvedValueOnce({
      docs: [
        { id: "t1", data: () => ({}) },
        { id: "t2", data: () => ({}) },
      ],
    });

    const ids = await sharedTripsService.getSharedTripIds("u1");

    expect(fs.collection).toHaveBeenCalledWith(
      expect.anything(),
      "users/u1/sharedTrips",
    );
    expect(ids).toEqual(["t1", "t2"]);
  });

  it("addReference targets the correct subcollection", async () => {
    await sharedTripsService.addReference("p1", "o1", "t1");

    expect(fs.collection).toHaveBeenCalledWith(
      expect.anything(),
      "users/p1/sharedTrips",
    );
    expect(fs.setDoc).toHaveBeenCalledWith(
      expect.objectContaining({ id: "t1" }),
      { ownerUid: "o1", tripId: "t1" },
    );
  });

  it("removeReference deletes from the correct subcollection", async () => {
    await sharedTripsService.removeReference("p1", "t1");

    expect(fs.collection).toHaveBeenCalledWith(
      expect.anything(),
      "users/p1/sharedTrips",
    );
    expect(fs.deleteDoc).toHaveBeenCalledWith(
      expect.objectContaining({ id: "t1" }),
    );
  });
});
