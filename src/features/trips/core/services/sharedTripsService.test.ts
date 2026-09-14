import { describe, it, expect } from "vitest";
import { mockFirestoreControls as fs } from "@test-utils/firebaseMockRegistry";
import { sharedTripsService } from "./sharedTripsService";

describe("sharedTripsService", () => {
  it("gets shared trips", async () => {
    fs.getDocs.mockResolvedValueOnce({
      docs: [
        {
          id: "t1",
          data: () => ({
            ownerUid: "o1",
            tripId: "t1",
            type: "shared",
            permission: "viewer",
          }),
        },
        {
          id: "t2",
          data: () => ({
            ownerUid: "o2",
            tripId: "t2",
            type: "participant",
            permission: "editor",
          }),
        },
      ],
    });

    const trips = await sharedTripsService.getSharedTrips("u1");

    expect(fs.collection).toHaveBeenCalledWith(
      expect.anything(),
      "users/u1/sharedTrips",
    );
    expect(trips).toHaveLength(2);
    expect(trips[0]).toEqual({
      id: "t1",
      ownerUid: "o1",
      tripId: "t1",
      type: "shared",
      permission: "viewer",
    });
  });

  it("getSharedTripIds targets the correct collection path", async () => {
    fs.getDocs.mockResolvedValueOnce({
      docs: [
        { id: "t1", data: () => ({ tripId: "t1" }) },
        { id: "t2", data: () => ({ tripId: "t2" }) },
      ],
    });

    const ids = await sharedTripsService.getSharedTripIds("u1");

    expect(ids).toEqual(["t1", "t2"]);
  });

  it("gets participant trips", async () => {
    fs.getDocs.mockResolvedValueOnce({
      docs: [
        {
          id: "t1",
          data: () => ({
            ownerUid: "o1",
            tripId: "t1",
            type: "participant",
            permission: "viewer",
          }),
        },
        {
          id: "t2",
          data: () => ({
            ownerUid: "o2",
            tripId: "t2",
            type: "shared",
            permission: "editor",
          }),
        },
      ],
    });

    const trips = await sharedTripsService.getParticipantTrips("u1");

    expect(trips).toHaveLength(1);
    expect(trips[0].tripId).toBe("t1");
    expect(trips[0].type).toBe("participant");
  });

  it("addReference uses default type and permission", async () => {
    await sharedTripsService.addReference("p1", "o1", "t1");

    expect(fs.collection).toHaveBeenCalledWith(
      expect.anything(),
      "users/p1/sharedTrips",
    );
    expect(fs.setDoc).toHaveBeenCalledWith(
      expect.objectContaining({ id: "t1" }),
      {
        ownerUid: "o1",
        tripId: "t1",
        type: "shared",
        permission: "viewer",
      },
    );
  });

  it("addReference stores the supplied type and permission", async () => {
    await sharedTripsService.addReference(
      "p1",
      "o1",
      "t1",
      "participant",
      "editor",
    );

    expect(fs.setDoc).toHaveBeenCalledWith(
      expect.objectContaining({ id: "t1" }),
      {
        ownerUid: "o1",
        tripId: "t1",
        type: "participant",
        permission: "editor",
      },
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
