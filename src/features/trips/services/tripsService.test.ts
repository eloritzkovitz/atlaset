import { describe, it, expect, beforeEach, vi } from "vitest";
import { activityMockTracker } from "@test-utils/activityMocks";
import { createMockUser } from "@test-utils/authMocks";
import {
  mockAuthControls as auth,
  mockFirestoreControls as fs,
} from "@test-utils/firebaseMockRegistry";
import { createMockSnapshot } from "@test-utils/firestoreMocks";
import { tripsService } from "./tripsService";
import { profileService } from "../../user/profile/services/profileService";

vi.mock("@app/firebase", () => ({ db: {} }));
vi.mock("../../user/profile/services/profileService", () => ({
  profileService: { updateVisitedCountryCodes: vi.fn() },
}));

describe("tripsService", () => {
  let freshUser: any;
  const mockCol = { type: "trips-collection" };
  const mockDocRef = (col: any, id: any) => ({ col, id });

  beforeEach(() => {
    vi.clearAllMocks();

    freshUser = createMockUser();

    auth.getUserCollection.mockReturnValue(mockCol as any);
    fs.doc.mockImplementation(mockDocRef as any);
  });

  describe("authenticated routes", () => {
    beforeEach(() => {
      auth.isAuthenticated.mockReturnValue(true);
      auth.getCurrentUser.mockReturnValue(freshUser);
    });

    it("loads local and shared trips seamlessly from backend queries", async () => {
      fs.getDocs
        .mockResolvedValueOnce(
          createMockSnapshot([{ id: "2", data: { name: "Trip 2" } }]) as any,
        )
        .mockResolvedValueOnce(
          createMockSnapshot([
            { id: "s1", data: { ownerUid: "friend1", tripId: "shared1" } },
          ]) as any,
        );
      fs.getDoc.mockResolvedValue({
        id: "shared1",
        exists: () => true,
        data: () => ({ name: "Shared Trip" }),
      } as any);

      const trips = await tripsService.load();
      expect(trips).toEqual([
        { id: "2", name: "Trip 2" },
        { id: "shared1", name: "Shared Trip" },
      ]);
      expect(auth.getUserCollection).toHaveBeenCalled();
    });

    it("saves collective trip configurations and registers system activity logs", async () => {
      const trips = [
        { id: "a", name: "A" },
        { id: "b", name: "B" },
      ];

      await tripsService.save(trips as any);
      expect(fs.setDoc).toHaveBeenCalledWith(
        mockDocRef(mockCol, "a"),
        trips[0],
      );
      expect(fs.setDoc).toHaveBeenCalledWith(
        mockDocRef(mockCol, "b"),
        trips[1],
      );

      vi.clearAllMocks();

      await tripsService.save([]);
      expect(fs.setDoc).not.toHaveBeenCalled();
      expect(activityMockTracker).toHaveBeenCalledWith(
        410,
        expect.objectContaining({ count: 0 }),
        freshUser.uid,
      );
    });

    it("inserts new trips and handles missing values via default fallbacks", async () => {
      const trip = {
        id: "2",
        name: "Trip 2",
        participants: undefined,
        startDate: undefined,
        endDate: undefined,
      };
      await tripsService.add(trip as any);

      expect(fs.setDoc).toHaveBeenCalledWith(
        mockDocRef(mockCol, "2"),
        expect.objectContaining({
          participants: [freshUser.uid],
          startDate: null,
          endDate: null,
        }),
      );
      expect(profileService.updateVisitedCountryCodes).toHaveBeenCalledWith(
        freshUser.uid,
      );
    });

    it("inserts new trips with explicit participants and sets up shared subcollections", async () => {
      const trip = {
        id: "3",
        name: "Trip 3",
        participants: ["friend1"],
        startDate: "2026-07-01",
        endDate: "2026-07-10",
      };

      await tripsService.add(trip as any);

      expect(fs.setDoc).toHaveBeenNthCalledWith(
        1,
        mockDocRef(mockCol, "3"),
        expect.objectContaining({
          participants: ["friend1", freshUser.uid],
          startDate: "2026-07-01",
          endDate: "2026-07-10",
        }),
      );

      expect(fs.collection).toHaveBeenCalledWith(
        expect.anything(),
        `users/friend1/sharedTrips`,
      );
      expect(fs.setDoc).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ id: "3" }),
        {
          ownerUid: freshUser.uid,
          tripId: "3",
        },
      );
    });

    it("handles variations of edits safely with full participant delta logic", async () => {
      fs.getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ participants: undefined }),
      } as any);

      const incomingUpdate1 = {
        id: "5",
        name: "Trip 5",
        participants: ["friend1"],
      };

      await tripsService.edit(incomingUpdate1 as any);
      expect(fs.collection).toHaveBeenCalledWith(
        expect.anything(),
        "users/friend1/sharedTrips",
      );

      vi.clearAllMocks();
      fs.getDoc.mockResolvedValueOnce({
        exists: () => false,
      } as any);

      const incomingUpdate2 = {
        id: "6",
        name: "Trip 6",
        participants: ["friend2"],
      };

      await tripsService.edit(incomingUpdate2 as any);
      expect(fs.collection).toHaveBeenCalledWith(
        expect.anything(),
        "users/friend2/sharedTrips",
      );

      vi.clearAllMocks();
      fs.getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ participants: [freshUser.uid, "friendToRemove"] }),
      } as any);

      const incomingUpdate3 = {
        id: "7",
        name: "Trip 7",
        participants: [freshUser.uid],
      };

      await tripsService.edit(incomingUpdate3 as any);
      expect(fs.deleteDoc).toHaveBeenCalled();
    });

    it("deletes records flawlessly, resolving complex participant trees", async () => {
      fs.getDocs.mockResolvedValueOnce(
        createMockSnapshot([
          {
            id: "del",
            data: {
              name: "DelTrip",
              participants: [freshUser.uid, "friend1", "friend2"],
            },
          },
        ]) as any,
      );

      await tripsService.remove("del");

      expect(fs.collection).toHaveBeenCalledWith(
        expect.anything(),
        "users/friend1/sharedTrips",
      );
      expect(fs.collection).toHaveBeenCalledWith(
        expect.anything(),
        "users/friend2/sharedTrips",
      );
      expect(fs.deleteDoc).toHaveBeenCalledWith(mockDocRef(mockCol, "del"));

      vi.clearAllMocks();
      fs.getDocs.mockResolvedValueOnce(
        createMockSnapshot([
          {
            id: "del-empty",
            data: { name: "EmptyTrip", participants: undefined },
          },
        ]) as any,
      );

      await tripsService.remove("del-empty");
      expect(fs.deleteDoc).toHaveBeenCalledWith(
        mockDocRef(mockCol, "del-empty"),
      );

      vi.clearAllMocks();
      fs.getDocs.mockResolvedValueOnce(createMockSnapshot([]) as any);

      await tripsService.remove("del2");
      expect(activityMockTracker).toHaveBeenCalledWith(
        415,
        expect.objectContaining({ itemName: undefined }),
        freshUser.uid,
      );
    });

    it("updates auxiliary metrics cleanly across favoriting and custom ratings parameters", async () => {
      await tripsService.updateFavorite("fav", true);
      expect(fs.setDoc).toHaveBeenCalledWith(
        mockDocRef(mockCol, "fav"),
        { favorite: true },
        { merge: true },
      );

      await tripsService.updateRating("rate", 4);
      expect(fs.setDoc).toHaveBeenCalledWith(
        mockDocRef(mockCol, "rate"),
        { rating: 4 },
        { merge: true },
      );

      await tripsService.updateRating("rate", undefined);
      expect(fs.setDoc).toHaveBeenCalledWith(
        mockDocRef(mockCol, "rate"),
        { rating: null },
        { merge: true },
      );
    });
  });

  describe("unauthenticated restrictions", () => {
    beforeEach(() => {
      auth.isAuthenticated.mockReturnValue(false);
    });

    it("safeguards individual service endpoints against structural data leaks", async () => {
      const payloads: [string, () => Promise<any>][] = [
        ["load trips.", () => tripsService.load()],
        ["save trips.", () => tripsService.save([{ id: "1" } as any])],
        ["add a trip.", () => tripsService.add({ id: "1" } as any)],
        ["edit a trip.", () => tripsService.edit({ id: "1" } as any)],
        ["update favorite.", () => tripsService.updateFavorite("1", true)],
        ["update rating.", () => tripsService.updateRating("1", 5)],
        ["remove a trip.", () => tripsService.remove("1")],
      ];

      for (const [action, execution] of payloads) {
        await expect(execution()).rejects.toThrow(
          new RegExp(`Authentication required to ${action}`),
        );
      }
    });
  });
});
