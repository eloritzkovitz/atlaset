import { describe, it, expect, beforeEach, vi } from "vitest";
import { ACTIONS } from "@constants/actions";
import { activityMockTracker } from "@test-utils/activityMocks";
import { createMockUser } from "@test-utils/authMocks";
import {
  mockAuthControls as auth,
  mockFirestoreControls as fs,
} from "@test-utils/firebaseMockRegistry";
import { createMockSnapshot } from "@test-utils/firestoreMocks";
import { tripsService } from "./tripsService";
import { sharedTripsService } from "./sharedTripsService";

const { notificationSendMock } = vi.hoisted(() => ({
  notificationSendMock: vi.fn(),
}));

vi.mock("./sharedTripsService");

vi.mock("../../user/profile/services/profileService", () => ({
  profileService: { updateVisitedCountryCodes: vi.fn() },
}));

vi.mock("@features/notifications/services/notificationService", () => ({
  notificationService: {
    send: notificationSendMock,
  },
}));

describe("tripsService", () => {
  let freshUser: any;

  beforeEach(() => {
    vi.clearAllMocks();
    freshUser = createMockUser();
    auth.isAuthenticated.mockReturnValue(true);
    auth.getCurrentUser.mockReturnValue(freshUser);
  });

  describe("unauthenticated safety checks", () => {
    beforeEach(() => {
      auth.isAuthenticated.mockReturnValue(false);
      auth.getCurrentUser.mockReturnValue(null);
    });

    it("enforces authentication across all service methods", async () => {
      const trip = { id: "t1", name: "Trip" } as any;

      await expect(tripsService.load()).rejects.toThrow(
        "Authentication required.",
      );
      await expect(tripsService.save([trip])).rejects.toThrow(
        "Authentication required to save trips.",
      );
      await expect(tripsService.add(trip)).rejects.toThrow(
        "Authentication required to add a trip.",
      );
      await expect(tripsService.updateFavorite(trip, true)).rejects.toThrow(
        "Authentication required to update favorite.",
      );
      await expect(tripsService.updateRating(trip, 5)).rejects.toThrow(
        "Authentication required to update rating.",
      );
      await expect(tripsService.edit(trip)).rejects.toThrow(
        "Authentication required to edit a trip.",
      );
      await expect(tripsService.remove(trip)).rejects.toThrow(
        "Authentication required to edit a trip.",
      );

      expect(fs.setDoc).not.toHaveBeenCalled();
      expect(fs.deleteDoc).not.toHaveBeenCalled();
    });
  });

  describe("authenticated routes", () => {
    it("loads local and shared trips, filtering deleted shared trips", async () => {
      fs.getDocs
        .mockResolvedValueOnce(
          createMockSnapshot([{ id: "2", data: { name: "Trip 2" } }]) as any,
        )
        .mockResolvedValueOnce(
          createMockSnapshot([
            {
              id: "ref1",
              data: { ownerUid: "friend1", tripId: "shared1" },
            },
            {
              id: "ref2",
              data: { ownerUid: "friend2", tripId: "deletedTrip" },
            },
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

    it("saves trips and logs activity", async () => {
      await tripsService.save([{ id: "a", name: "A" } as any]);

      expect(fs.setDoc).toHaveBeenCalled();
      expect(activityMockTracker).toHaveBeenCalled();
    });

    it("adds participants and notifies them", async () => {
      const trip = {
        id: "t1",
        name: "Trip",
        participants: ["friend1"],
        startDate: "2026-01-01",
        endDate: "2026-01-10",
      } as any;

      const result = await tripsService.add(trip);

      expect(sharedTripsService.addReference).toHaveBeenCalledWith(
        "friend1",
        freshUser.uid,
        "t1",
      );

      expect(notificationSendMock).toHaveBeenCalledWith("friend1", {
        action: ACTIONS.TRIP_PARTICIPANT_ADDED,
        actor: {
          uid: freshUser.uid,
          displayName: freshUser.displayName ?? "",
          photoURL: freshUser.photoURL ?? "",
        },
        details: {
          actorName: freshUser.displayName ?? "",
          itemId: "t1",          
          itemName: "Trip",
        },
      });

      expect(result.participants).toContain(freshUser.uid);
      expect(result.startDate).toBe("2026-01-01");
      expect(result.endDate).toBe("2026-01-10");
    });

    it("handles missing participants and dates during add", async () => {
      const result = await tripsService.add({
        id: "t1",
        name: "Trip",
      } as any);

      expect(result.participants).toEqual([freshUser.uid]);
      expect(fs.setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          startDate: null,
          endDate: null,
        }),
      );
      expect(notificationSendMock).not.toHaveBeenCalled();
    });

    it("adds and removes participants during edit and notifies both", async () => {
      fs.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          participants: ["oldFriend", "stayingFriend"],
        }),
      } as any);

      await tripsService.edit({
        id: "t1",
        name: "Trip",
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

      expect(notificationSendMock).toHaveBeenCalledTimes(2);

      expect(notificationSendMock).toHaveBeenCalledWith(
        "newFriend",
        expect.objectContaining({
          action: ACTIONS.TRIP_PARTICIPANT_ADDED,
          details: {
            actorName: freshUser.displayName ?? "",
            itemId: "t1",
            itemName: "Trip",
          },
        }),
      );

      expect(notificationSendMock).toHaveBeenCalledWith(
        "oldFriend",
        expect.objectContaining({
          action: ACTIONS.TRIP_PARTICIPANT_REMOVED,
          details: {
            actorName: freshUser.displayName ?? "",
            itemId: "t1",
            itemName: "Trip",
          },
        }),
      );

      expect(fs.setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          startDate: "2026-06-01",
          endDate: "2026-06-15",
        }),
      );
    });

    it("handles missing trip data during edit", async () => {
      fs.getDoc.mockResolvedValue({
        exists: () => false,
      } as any);

      await tripsService.edit({
        id: "t1",
        name: "No Dates",
      } as any);

      expect(fs.setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          participants: [freshUser.uid],
          startDate: null,
          endDate: null,
        }),
      );
      expect(notificationSendMock).not.toHaveBeenCalled();
    });

    it("updates rating for numeric and undefined values", async () => {
      const trip = { id: "t1", name: "Trip 1" } as any;

      await tripsService.updateRating(trip, 5);
      expect(fs.setDoc).toHaveBeenCalledWith(
        expect.anything(),
        { rating: 5 },
        { merge: true },
      );

      await tripsService.updateRating(trip, undefined);
      expect(fs.setDoc).toHaveBeenCalledWith(
        expect.anything(),
        { rating: null },
        { merge: true },
      );
    });

    it("updates favorited and unfavorited states", async () => {
      const trip = { id: "t1", name: "Trip 1" } as any;

      await tripsService.updateFavorite(trip, true);
      expect(activityMockTracker).toHaveBeenCalledWith(
        413,
        expect.objectContaining({ action: "favorited" }),
        expect.anything(),
      );

      await tripsService.updateFavorite(trip, false);
      expect(activityMockTracker).toHaveBeenCalledWith(
        413,
        expect.objectContaining({ action: "unfavorited" }),
        expect.anything(),
      );
    });

    it("removes participant references and notifies participants", async () => {
      const trip = {
        id: "del",
        name: "My Trip",
        participants: ["friend1", freshUser.uid],
      } as any;

      await tripsService.remove(trip);

      expect(sharedTripsService.removeReference).toHaveBeenCalledWith(
        "friend1",
        "del",
      );
      expect(sharedTripsService.removeReference).not.toHaveBeenCalledWith(
        freshUser.uid,
        "del",
      );

      expect(notificationSendMock).toHaveBeenCalledWith(
        "friend1",
        expect.objectContaining({
          action: ACTIONS.TRIP_PARTICIPANT_REMOVED,
          details: {
            actorName: freshUser.displayName ?? "",
            itemId: "del",
            itemName: "My Trip",            
          },
        }),
      );

      expect(fs.deleteDoc).toHaveBeenCalled();
    });

    it("handles removal without participants", async () => {
      await tripsService.remove({ id: "del1" } as any);
      await tripsService.remove({
        id: "del2",
        participants: [freshUser.uid],
      } as any);

      expect(sharedTripsService.removeReference).not.toHaveBeenCalled();
      expect(notificationSendMock).not.toHaveBeenCalled();
      expect(fs.deleteDoc).toHaveBeenCalledTimes(2);
    });
  });
});
