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
  });

  describe("unauthenticated safety checks", () => {
    beforeEach(() => {
      auth.isAuthenticated.mockReturnValue(false);
      auth.getCurrentUser.mockReturnValue(null);
    });

    it("enforces authentication across all service methods", async () => {
      const dummyTrip = { id: "t1", name: "Trip" } as any;

      await expect(tripsService.load()).rejects.toThrow(
        "Authentication required.",
      );
      await expect(tripsService.save([dummyTrip])).rejects.toThrow(
        "Authentication required to save trips.",
      );
      await expect(tripsService.add(dummyTrip)).rejects.toThrow(
        "Authentication required to add a trip.",
      );
      await expect(
        tripsService.updateFavorite(dummyTrip, true),
      ).rejects.toThrow("Authentication required to update favorite.");
      await expect(tripsService.updateRating(dummyTrip, 5)).rejects.toThrow(
        "Authentication required to update rating.",
      );
      await expect(tripsService.edit(dummyTrip)).rejects.toThrow(
        "Authentication required to edit a trip.",
      );
      await expect(tripsService.remove(dummyTrip)).rejects.toThrow(
        "Authentication required to edit a trip.",
      );

      expect(fs.setDoc).not.toHaveBeenCalled();
      expect(fs.deleteDoc).not.toHaveBeenCalled();
    });
  });

  describe("authenticated routes", () => {
    beforeEach(() => {
      auth.isAuthenticated.mockReturnValue(true);
      auth.getCurrentUser.mockReturnValue(freshUser);
    });

    it("loads local and shared trips seamlessly, filtering out null shared trips", async () => {
      fs.getDocs.mockResolvedValueOnce(
        createMockSnapshot([{ id: "2", data: { name: "Trip 2" } }]) as any,
      );
      fs.getDocs.mockResolvedValueOnce(
        createMockSnapshot([
          { id: "ref1", data: { ownerUid: "friend1", tripId: "shared1" } },
          { id: "ref2", data: { ownerUid: "friend2", tripId: "deletedTrip" } },
        ]) as any,
      );
      fs.getDoc
        .mockResolvedValueOnce({
          exists: () => true,
          data: () => ({ name: "Shared Trip" }),
        } as any)
        .mockResolvedValueOnce({
          exists: () => false,
          data: () => null,
        } as any);

      const trips = await tripsService.load();
      expect(trips).toHaveLength(2);
      expect(trips[1].name).toBe("Shared Trip");
    });

    it("saves collective trip configurations and registers activity", async () => {
      await tripsService.save([{ id: "a", name: "A" } as any]);
      expect(fs.setDoc).toHaveBeenCalled();
      expect(activityMockTracker).toHaveBeenCalled();
    });

    it("inserts new trips, handles participant logic, and preserves defined dates", async () => {
      const inputTrip = {
        id: "t1",
        name: "Trip",
        participants: ["friend1"],
        startDate: "2026-01-01",
        endDate: "2026-01-10",
      } as any;

      const result = await tripsService.add(inputTrip);

      expect(sharedTripsService.addReference).toHaveBeenCalledWith(
        "friend1",
        freshUser.uid,
        "t1",
      );
      expect(result.startDate).toBe("2026-01-01");
      expect(result.endDate).toBe("2026-01-10");
    });

    it("handles non-array participants and undefined dates during add", async () => {
      const result = await tripsService.add({ id: "t1", name: "Trip" } as any);

      expect(result.participants).toEqual([freshUser.uid]);
      expect(fs.setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ startDate: null, endDate: null }),
      );
    });

    it("handles added and removed participants during edit with defined dates", async () => {
      fs.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ participants: ["oldFriend", "stayingFriend"] }),
      } as any);

      await tripsService.edit({
        id: "t1",
        participants: ["stayingFriend", "newFriend"],
        startDate: "2026-06-01",
        endDate: "2026-06-15",
      } as any);

      expect(sharedTripsService.removeReference).toHaveBeenCalledWith(
        "oldFriend",
        "t1",
      );
      expect(sharedTripsService.addReference).toHaveBeenCalledWith(
        "newFriend",
        freshUser.uid,
        "t1",
      );
      expect(fs.setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          startDate: "2026-06-01",
          endDate: "2026-06-15",
        }),
      );
    });

    it("handles non-existent doc, non-array participants, and undefined dates during edit", async () => {
      fs.getDoc.mockResolvedValue({ exists: () => false } as any);

      await tripsService.edit({ id: "t1", name: "No Dates" } as any);

      expect(fs.setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          participants: [freshUser.uid],
          startDate: null,
          endDate: null,
        }),
      );
    });

    it("handles rating updates for both numeric values and undefined", async () => {
      const mockTrip = { id: "t1", name: "Trip 1" } as any;

      await tripsService.updateRating(mockTrip, 5);
      expect(fs.setDoc).toHaveBeenCalledWith(
        expect.anything(),
        { rating: 5 },
        { merge: true },
      );

      await tripsService.updateRating(mockTrip, undefined);
      expect(fs.setDoc).toHaveBeenCalledWith(
        expect.anything(),
        { rating: null },
        { merge: true },
      );
    });

    it("handles favorited and unfavorited status updates", async () => {
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

    it("removes records and cleans up participant references", async () => {
      const mockTrip = {
        id: "del",
        name: "My Trip",
        participants: ["friend1", freshUser.uid],
      } as any;

      await tripsService.remove(mockTrip);

      expect(sharedTripsService.removeReference).toHaveBeenCalledWith(
        "friend1",
        "del",
      );
      expect(sharedTripsService.removeReference).not.toHaveBeenCalledWith(
        freshUser.uid,
        "del",
      );
      expect(fs.deleteDoc).toHaveBeenCalled();
    });

    it("handles removal logic when participants is undefined or only contains owner", async () => {
      await tripsService.remove({ id: "del1" } as any);
      await tripsService.remove({
        id: "del2",
        participants: [freshUser.uid],
      } as any);

      expect(sharedTripsService.removeReference).not.toHaveBeenCalled();
      expect(fs.deleteDoc).toHaveBeenCalledTimes(2);
    });
  });
});
