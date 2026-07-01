import { vi, describe, it, expect, beforeEach } from "vitest";
import { mockFirestoreControls as fs } from "@test-utils/firebaseMockRegistry";
import {
  createMockSnapshot,
  createMockDocSnap,
} from "@test-utils/firestoreMocks";
import { profileService } from "./profileService";
import { logUserActivity } from "../../activity/utils/activity";

vi.mock("@app/firebase", () => ({ db: {} }));
vi.mock("../../activity/utils/activity", () => ({ logUserActivity: vi.fn() }));

describe("profileService", () => {
  let mockTx: { get: any; set: any; update: any; delete: any };

  beforeEach(() => {
    vi.clearAllMocks();

    fs.doc.mockReturnValue({ type: "document" });

    mockTx = {
      get: vi.fn(),
      set: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    mockTx.get.mockResolvedValue(createMockDocSnap(false));

    fs.transaction.mockReturnValue(mockTx);
  });

  describe("username checking and generation", () => {
    it("checkUsernameExists returns boolean accurately", async () => {
      fs.getDoc.mockResolvedValueOnce(createMockDocSnap(true));
      expect(await profileService.checkUsernameExists("taken")).toBe(true);

      fs.getDoc.mockResolvedValueOnce(createMockDocSnap(false));
      expect(await profileService.checkUsernameExists("")).toBe(false);
    });

    it("generateUniqueUsername sanitizes inputs and breaks early if free", async () => {
      fs.getDoc.mockResolvedValueOnce(createMockDocSnap(false));

      const username = await profileService.generateUniqueUsername(
        "Alex $ Smith",
        null,
      );
      expect(username).toBe("alexsmith");
    });
  });

  describe("profile lifecycle", () => {
    it("createUserProfileWithUsername returns early if user exists", async () => {
      fs.getDoc
        .mockResolvedValueOnce(createMockDocSnap(true, { username: "name1" }))
        .mockResolvedValueOnce(createMockDocSnap(false));

      const res = await profileService.createUserProfileWithUsername({
        uid: "u1",
        displayName: "Name",
        email: "test@test.com",
      });
      expect(res).toBe("name1");
    });

    it("createUserProfileWithUsername returns early or throws immediately if user doc already exists", async () => {
      fs.getDoc.mockResolvedValueOnce(
        createMockDocSnap(true, { username: "taken_username" }),
      );

      const res = await profileService.createUserProfileWithUsername({
        uid: "u1",
        displayName: "Test",
        email: "test@test.com",
      });

      expect(res).toBe("taken_username");
    });

    it("createUserProfileWithUsername executes safely inside a transaction", async () => {
      fs.getDoc.mockResolvedValueOnce(createMockDocSnap(false));
      fs.getDoc.mockResolvedValueOnce(createMockDocSnap(false));
      mockTx.get.mockResolvedValueOnce(createMockDocSnap(false));

      const res = await profileService.createUserProfileWithUsername({
        uid: "u1",
        displayName: "Alex",
        email: "alex@test.com",
        joinDate: "2026-01-01",
      });

      expect(res).toBe("alex");
      expect(mockTx.set).toHaveBeenCalledTimes(2);
    });

    it("createUserProfileWithUsername throws inside transaction if username slips through as taken", async () => {
      fs.getDoc.mockResolvedValueOnce(createMockDocSnap(false));
      fs.getDoc.mockResolvedValueOnce(createMockDocSnap(false));
      mockTx.get.mockResolvedValueOnce(createMockDocSnap(true));

      await expect(
        profileService.createUserProfileWithUsername({
          uid: "u1",
          displayName: "Alex",
          email: "a@b.com",
        }),
      ).rejects.toThrow("Username taken");
    });
  });

  describe("profile lookups & mutation", () => {
    it("getUserProfileByUid maps document data fields properly", async () => {
      fs.getDoc.mockResolvedValueOnce(createMockDocSnap(true, { uid: "u1" }));
      const profile = await profileService.getUserProfileByUid("u1");
      expect(profile?.uid).toBe("u1");

      expect(await profileService.getUserProfileByUid("")).toBeNull();
    });

    it("getUserProfileByUsername acts as a join look up across two collections", async () => {
      fs.getDoc
        .mockResolvedValueOnce(createMockDocSnap(true, { uid: "u1" }))
        .mockResolvedValueOnce(createMockDocSnap(true, { username: "alex" }));

      const profile = await profileService.getUserProfileByUsername("alex");
      expect(profile?.username).toBe("alex");
      expect(await profileService.getUserProfileByUsername("")).toBeNull();
    });

    it("editProfile performs mutations and dispatches logUserActivity tracking", async () => {
      fs.getDoc.mockResolvedValue(
        createMockDocSnap(true, { displayName: "Alex" }),
      );

      await profileService.editProfile("u1", { displayName: "New Name" });
      expect(fs.updateDoc).toHaveBeenCalled();
      expect(logUserActivity).toHaveBeenCalledWith(
        120,
        expect.any(Object),
        "u1",
      );
    });

    it("changeUsername safely moves records inside a single atomic transaction transaction", async () => {
      mockTx.get.mockResolvedValueOnce(createMockDocSnap(false));

      const cleanedName = await profileService.changeUsername({
        uid: "u1",
        oldUsername: "old",
        newUsername: "New! Name",
      });
      expect(cleanedName).toBe("newname");
      expect(mockTx.update).toHaveBeenCalled();
      expect(mockTx.set).toHaveBeenCalled();
      expect(mockTx.delete).toHaveBeenCalled();
    });

    it("changeUsername throws an error if the new username is already taken", async () => {
      mockTx.get.mockResolvedValueOnce(
        createMockDocSnap(true, { uid: "someone_else" }),
      );

      await expect(
        profileService.changeUsername({
          uid: "u1",
          oldUsername: "oldname",
          newUsername: "takenname",
        }),
      ).rejects.toThrow("Username taken");

      expect(mockTx.set).not.toHaveBeenCalled();
      expect(mockTx.delete).not.toHaveBeenCalled();
    });

    it("getHomeCountry and setHomeCountry behave deterministically", async () => {
      fs.getDoc.mockResolvedValueOnce(
        createMockDocSnap(true, { homeCountry: "CA" }),
      );
      expect(await profileService.getHomeCountry("u1")).toBe("CA");

      await profileService.setHomeCountry("u1", "US");
      expect(fs.updateDoc).toHaveBeenCalledWith(expect.any(Object), {
        homeCountry: "US",
      });
    });
  });

  describe("updateVisitedCountryCodes calculation pipeline", () => {
    it("gathers owned and shared references to calculate finished travels cleanly", async () => {
      fs.getDocs
        .mockResolvedValueOnce(
          createMockSnapshot([
            {
              id: "trip1",
              data: { status: "completed", countryCodes: ["US", "MX"] },
            },
          ]),
        )
        .mockResolvedValueOnce(
          createMockSnapshot([
            { id: "s1", data: { ownerUid: "otherUser", tripId: "shared1" } },
          ]),
        );

      fs.getDoc.mockResolvedValueOnce(
        createMockDocSnap(true, {
          status: "completed",
          countryCodes: ["MX", "CA"],
        }),
      );

      await profileService.updateVisitedCountryCodes("u1");

      expect(fs.updateDoc).toHaveBeenCalledWith(expect.any(Object), {
        visitedCountryCodes: expect.arrayContaining(["US", "MX", "CA"]),
      });
    });
  });

  it("updateVisitedCountryCodes handles empty shared or owned trip edge cases gracefully", async () => {
    fs.getDocs
      .mockResolvedValueOnce(createMockSnapshot([]))
      .mockResolvedValueOnce(createMockSnapshot([]));

    await profileService.updateVisitedCountryCodes("u1");

    expect(fs.updateDoc).toHaveBeenCalledWith(expect.any(Object), {
      visitedCountryCodes: [],
    });
  });
});
