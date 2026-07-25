import { describe, it, expect, beforeEach, vi } from "vitest";
import { activityMockTracker } from "@test-utils/activityMocks";
import { createMockUser } from "@test-utils/authMocks";
import {
  mockAuthControls as auth,
  mockFirestoreControls as fs,
} from "@test-utils/firebaseMockRegistry";
import { createMockSnapshot } from "@test-utils/firestoreMocks";
import { tripsService } from "./tripsService";
import { sharedTripsService } from "./sharedTripsService";

vi.mock("@app/firebase", () => ({ db: {} }));
vi.mock("./sharedTripsService");
vi.mock("../../user/profile/services/profileService", () => ({
  profileService: { updateVisitedCountryCodes: vi.fn() },
}));

describe("tripsService", () => {
  let freshUser: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(sharedTripsService.removeReference).mockClear();
    freshUser = createMockUser();
    auth.isAuthenticated.mockReturnValue(true);
    auth.getCurrentUser.mockReturnValue(freshUser);
  });

  describe("authenticated routes", () => {
    beforeEach(() => {
      auth.isAuthenticated.mockReturnValue(true);
      auth.getCurrentUser.mockReturnValue(freshUser);
    });

    it("loads local and shared trips seamlessly", async () => {
      fs.getDocs.mockResolvedValueOnce(
        createMockSnapshot([{ id: "2", data: { name: "Trip 2" } }]) as any,
      );
      fs.getDocs.mockResolvedValueOnce(
        createMockSnapshot([
          { id: "ref1", data: { ownerUid: "friend1", tripId: "shared1" } },
        ]) as any,
      );
      fs.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ name: "Shared Trip" }),
      } as any);

      const trips = await tripsService.load();
      expect(trips).toHaveLength(2);
    });

    it("saves collective trip configurations and registers activity", async () => {
      await tripsService.save([{ id: "a", name: "A" } as any]);
      expect(fs.setDoc).toHaveBeenCalled();
      expect(activityMockTracker).toHaveBeenCalled();
    });

    it("inserts new trips and handles participant logic", async () => {
      await tripsService.add({ id: "t1", participants: ["friend1"] } as any);
      expect(sharedTripsService.addReference).toHaveBeenCalledWith(
        "friend1",
        freshUser.uid,
        "t1",
      );
    });

    it("handles participant deltas in edits", async () => {
      fs.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ participants: ["old"] }),
      } as any);
      await tripsService.edit({ id: "t1", participants: ["new"] } as any);
      expect(sharedTripsService.removeReference).toHaveBeenCalledWith(
        "old",
        "t1",
      );
      expect(sharedTripsService.addReference).toHaveBeenCalledWith(
        "new",
        freshUser.uid,
        "t1",
      );
    });

    it("handles undefined dates in edit by setting them to null", async () => {
      fs.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({}),
      } as any);

      await tripsService.edit({ id: "t1", name: "No Dates" } as any);

      expect(fs.setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          startDate: null,
          endDate: null,
        }),
      );
    });

    it("removes records and cleans up references", async () => {
      const mockTrip = {
        id: "del",
        name: "My Trip",
        participants: ["friend1"],
      } as any;

      await tripsService.remove(mockTrip);

      expect(sharedTripsService.removeReference).toHaveBeenCalledWith(
        "friend1",
        "del",
      );
      expect(fs.deleteDoc).toHaveBeenCalled();
    });

    it("handles removal logic for owners and missing participant arrays", async () => {
      const mockTrip = {
        id: "del",
        participants: [freshUser.uid],
      } as any;

      await tripsService.remove(mockTrip);

      expect(sharedTripsService.removeReference).not.toHaveBeenCalled();
    });

    it("handles undefined dates and participants during add", async () => {
      await tripsService.add({ id: "t1", name: "Trip" } as any);
      expect(fs.setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ startDate: null, endDate: null }),
      );
    });

    it("identifies added participants in edit", async () => {
      fs.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ participants: ["old"] }),
      } as any);

      await tripsService.edit({
        id: "t1",
        participants: ["old", "newFriend"],
      } as any);

      expect(sharedTripsService.addReference).toHaveBeenCalledWith(
        "newFriend",
        freshUser.uid,
        "t1",
      );
    });

    it("handles non-existent document in edit", async () => {
      fs.getDoc.mockResolvedValue({ exists: () => false } as any);
      await tripsService.edit({ id: "t1" } as any);
      expect(fs.setDoc).toHaveBeenCalled();
    });

    it("handles undefined rating in updateRating", async () => {
      const mockTrip = { id: "t1", name: "Trip 1" } as any;
      await tripsService.updateRating(mockTrip, undefined);
      expect(fs.setDoc).toHaveBeenCalledWith(
        expect.anything(),
        { rating: null },
        { merge: true },
      );
    });

    it("handles both favorited and unfavorited status updates", async () => {
      const mockTrip = { id: "t1", name: "Trip 1" } as any;
      await tripsService.updateFavorite(mockTrip, true);
      expect(activityMockTracker).toHaveBeenCalledWith(
        413,
        expect.objectContaining({ action: "favorited" }),
        expect.anything(),
      );
      await tripsService.updateFavorite(mockTrip, false);
      expect(activityMockTracker).toHaveBeenCalledWith(
        413,
        expect.objectContaining({ action: "unfavorited" }),
        expect.anything(),
      );
    });

    it("throws error for unauthenticated remove", async () => {
      auth.isAuthenticated.mockReturnValue(false);
      await expect(tripsService.remove({ id: "t1" } as any)).rejects.toThrow();
    });
  });

  it("enforces authentication on all methods", async () => {
    auth.isAuthenticated.mockReturnValue(false);
    auth.getCurrentUser.mockReturnValue(null);
    const mockTrip = { id: "id" } as any;

    const methods = [
      () => tripsService.load(),
      () => tripsService.save([]),
      () => tripsService.add(mockTrip),
      () => tripsService.updateFavorite(mockTrip, true),
      () => tripsService.updateRating(mockTrip, 1),
      () => tripsService.edit(mockTrip),
      () => tripsService.remove(mockTrip),
    ];
    for (const method of methods) await expect(method()).rejects.toThrow();
  });
});
