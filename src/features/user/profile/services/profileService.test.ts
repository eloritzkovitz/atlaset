import { vi, describe, it, expect, beforeEach } from "vitest";
import * as firestoreUtils from "@lib/firebase";
import { geoService } from "@lib/geo";
import { activityMockTracker } from "@test-utils/activityMocks";
import { mockFirestoreControls as fs } from "@test-utils/firebaseMockRegistry";
import { createMockDocSnap } from "@test-utils/firestoreMocks";
import { profileService } from "./profileService";

vi.mock("@app/firebase", () => ({ db: {} }));

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
      vi.spyOn(firestoreUtils, "getDocData")
        .mockResolvedValueOnce({ uid: "exists" })
        .mockResolvedValueOnce(null);
      expect(await profileService.checkUsernameExists("taken")).toBe(true);
      expect(await profileService.checkUsernameExists("")).toBe(false);
    });

    it("generateUniqueUsername sanitizes inputs", async () => {
      vi.spyOn(firestoreUtils, "getDocData").mockResolvedValue(null);
      expect(
        await profileService.generateUniqueUsername("Alex $ Smith", null),
      ).toBe("alexsmith");
    });

    it("generateUniqueUsername increments suffix if username is taken", async () => {
      vi.spyOn(firestoreUtils, "getDocData")
        .mockResolvedValueOnce({ uid: "taken" })
        .mockResolvedValueOnce(null);

      const username = await profileService.generateUniqueUsername(
        "Alex",
        null,
      );
      expect(username).toBe("alex1");
    });
  });

  describe("createUserProfileWithUsername", () => {
    it("createUserProfileWithUsername handles existing user/profile", async () => {
      vi.spyOn(firestoreUtils, "getDocData").mockResolvedValue({
        username: "name1",
      });
      expect(
        await profileService.createUserProfileWithUsername({
          uid: "u1",
        } as any),
      ).toBe("name1");
    });

    it("createUserProfileWithUsername executes transaction safely", async () => {
      vi.spyOn(firestoreUtils, "getDocData").mockResolvedValue(null);
      mockTx.get.mockResolvedValue(createMockDocSnap(false));
      const res = await profileService.createUserProfileWithUsername({
        uid: "u1",
        displayName: "Alex",
        email: null,
        photoURL: null,
      });
      expect(res).toBe("alex");
      expect(mockTx.set).toHaveBeenCalledTimes(2);
    });

    it("createUserProfileWithUsername throws if username taken in transaction", async () => {
      vi.spyOn(firestoreUtils, "getDocData").mockResolvedValue(null);
      mockTx.get.mockResolvedValue(createMockDocSnap(true));
      await expect(
        profileService.createUserProfileWithUsername({ uid: "u1" } as any),
      ).rejects.toThrow("Username taken");
    });

    it("createUserProfileWithUsername handles missing fields", async () => {
      vi.spyOn(firestoreUtils, "getDocData").mockResolvedValue(null);
      mockTx.get.mockResolvedValue(createMockDocSnap(false));
      const username = await profileService.createUserProfileWithUsername({
        uid: "u2",
        displayName: null,
        email: null,
      });
      expect(username).toBe("user");
    });

    it("createUserProfileWithUsername triggers initializeUserCountry if ipAddress is provided", async () => {
      vi.spyOn(firestoreUtils, "getDocData").mockResolvedValue(null);
      mockTx.get.mockResolvedValue(createMockDocSnap(false));
      const initSpy = vi
        .spyOn(profileService, "initializeUserCountry")
        .mockResolvedValue(undefined);
      await profileService.createUserProfileWithUsername(
        { uid: "u2", displayName: "Alex", email: "a@b.com" },
        "127.0.0.1",
      );
      expect(initSpy).toHaveBeenCalledWith("u2", "127.0.0.1");
      initSpy.mockRestore();
    });
  });

  describe("initializeUserCountry", () => {
    it("initializeUserCountry updates homeCountry on valid API response", async () => {
      vi.spyOn(geoService, "getGeoData").mockResolvedValueOnce({
        ipAddress: "1.1.1.1",
        countryCode: "IL",
        location: "Israel",
      });
      await profileService.initializeUserCountry("u1", "1.1.1.1");
      expect(fs.updateDoc).toHaveBeenCalledWith(expect.any(Object), {
        homeCountry: "IL",
      });
    });

    it("initializeUserCountry handles network errors gracefully", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockRejectedValue(new Error("Network Error")),
      );
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      await profileService.initializeUserCountry("u1", "1.1.1.1");
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
      vi.unstubAllGlobals();
    });

    it("initializeUserCountry does nothing if API returns empty data", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          json: vi.fn().mockResolvedValue({}),
        }),
      );
      await profileService.initializeUserCountry("u1", "1.1.1.1");
      expect(fs.updateDoc).not.toHaveBeenCalled();
      vi.unstubAllGlobals();
    });
  });

  describe("profile lookups & mutation", () => {
    it("getProfile maps data properly", async () => {
      vi.spyOn(firestoreUtils, "getDocData").mockResolvedValue({ uid: "u1" });
      expect((await profileService.getProfile("u1"))?.uid).toBe("u1");
    });

    it("getUserProfileByUsername joins across collections", async () => {
      vi.spyOn(firestoreUtils, "getDocData")
        .mockResolvedValueOnce({ uid: "u1" })
        .mockResolvedValueOnce({ uid: "u1" });
      const profile = await profileService.getUserProfileByUsername("alex");
      expect(profile?.uid).toBe("u1");
    });

    it("editProfile performs mutations and logs activity", async () => {
      vi.spyOn(firestoreUtils, "getDocData").mockResolvedValue({
        displayName: "Alex",
      });
      await profileService.editProfile("u1", { displayName: "New" });
      expect(fs.updateDoc).toHaveBeenCalled();
      expect(activityMockTracker).toHaveBeenCalled();
    });

    it("changeUsername atomically swaps username records", async () => {
      mockTx.get.mockResolvedValue(createMockDocSnap(false));
      const name = await profileService.changeUsername({
        uid: "u1",
        oldUsername: "old",
        newUsername: "New",
      });
      expect(name).toBe("new");
      expect(mockTx.update).toHaveBeenCalled();
      expect(mockTx.delete).toHaveBeenCalled();
    });

    it("changeUsername throws error if new username is taken", async () => {
      mockTx.get.mockResolvedValueOnce(createMockDocSnap(true));

      await expect(
        profileService.changeUsername({
          uid: "u1",
          oldUsername: "old",
          newUsername: "taken",
        }),
      ).rejects.toThrow("Username taken.");

      expect(mockTx.update).not.toHaveBeenCalled();
      expect(mockTx.delete).not.toHaveBeenCalled();
    });
  });

  describe("getHomeCountry", () => {
    it("getHomeCountry returns empty string if profile missing", async () => {
      vi.spyOn(firestoreUtils, "getDocData").mockResolvedValue(null);
      expect(await profileService.getHomeCountry("u1")).toBe("");
    });
  });

  describe("setHomeCountry", () => {
    it("setHomeCountry updates the user's home country", async () => {
      await profileService.setHomeCountry("u1", "US");
      expect(fs.updateDoc).toHaveBeenCalledWith(expect.any(Object), {
        homeCountry: "US",
      });
    });
  });

  describe("updateVisitedCountryCodes", () => {
    it("gathers owned and shared references to calculate finished travels cleanly", async () => {
      const getDocsDataSpy = vi.spyOn(firestoreUtils, "getDocsData");
      const getDocDataSpy = vi.spyOn(firestoreUtils, "getDocData");
      const updateDocSpy = vi
        .spyOn(fs, "updateDoc")
        .mockResolvedValue(undefined as any);

      const mockOwnedTrips = [
        { id: "trip1", status: "completed", countryCodes: ["US", "MX"] },
      ];

      const mockSharedRefs = [
        { id: "sharedRef1", ownerUid: "otherUser", tripId: "shared1" },
      ];

      const mockSharedTripDetail = {
        id: "shared1",
        status: "completed",
        countryCodes: ["MX", "CA"],
      };

      getDocsDataSpy
        .mockResolvedValueOnce(mockOwnedTrips as any)
        .mockResolvedValueOnce(mockSharedRefs as any);

      getDocDataSpy
        .mockResolvedValueOnce(mockSharedTripDetail as any)
        .mockResolvedValueOnce({ homeCountry: "US" } as any);

      await profileService.updateVisitedCountryCodes("u1");

      expect(updateDocSpy).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          visitedCountryCodes: expect.arrayContaining(["US", "MX", "CA"]),
        }),
      );

      getDocsDataSpy.mockRestore();
      getDocDataSpy.mockRestore();
      updateDocSpy.mockRestore();
    });
  });
});
