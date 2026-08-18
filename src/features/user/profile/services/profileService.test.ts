import { vi, describe, it, expect, beforeEach } from "vitest";
import * as firestoreUtils from "@lib/firebase";
import { geoService } from "@lib/geo";
import { activityMockTracker } from "@test-utils/activityMocks";
import { mockFirestoreControls as fs } from "@test-utils/firebaseMockRegistry";
import { createMockDocSnap } from "@test-utils/firestoreMocks";
import { profileService } from "./profileService";

describe("profileService", () => {
  let mockTx: { get: any; set: any; update: any; delete: any };

  beforeEach(() => {
    vi.clearAllMocks();

    fs.doc.mockReturnValue({ type: "document" });

    mockTx = {
      get: vi.fn().mockResolvedValue(createMockDocSnap(false)),
      set: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    fs.transaction.mockReturnValue(mockTx);

    fs.runTransaction.mockImplementation(
      async (_db: unknown, callback: (tx: typeof mockTx) => unknown) =>
        callback(mockTx),
    );
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

    it("generateUniqueUsername falls back to user when display name and email are missing", async () => {
      vi.spyOn(firestoreUtils, "getDocData").mockResolvedValue(null);

      await expect(
        profileService.generateUniqueUsername(null, null),
      ).resolves.toBe("user");
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

    it("initializeUserCountry handles errors gracefully", async () => {
      vi.spyOn(geoService, "getGeoData").mockRejectedValueOnce(
        new Error("Network Error"),
      );

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await expect(
        profileService.initializeUserCountry("u1", "1.1.1.1"),
      ).resolves.toBeUndefined();

      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to auto-detect country:",
        expect.any(Error),
      );
      expect(fs.updateDoc).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("initializeUserCountry does nothing if API returns empty data", async () => {
      vi.spyOn(geoService, "getGeoData").mockResolvedValueOnce(null);

      await profileService.initializeUserCountry("u1", "1.1.1.1");

      expect(fs.updateDoc).not.toHaveBeenCalled();
    });
  });

  describe("getUserProfileByUsername", () => {
    it("joins across collections", async () => {
      vi.spyOn(firestoreUtils, "getDocData")
        .mockResolvedValueOnce({ uid: "u1" })
        .mockResolvedValueOnce({ uid: "u1" });
      const profile = await profileService.getUserProfileByUsername("alex");
      expect(profile?.uid).toBe("u1");
    });

    it("returns null for empty username", async () => {
      await expect(
        profileService.getUserProfileByUsername(""),
      ).resolves.toBeNull();
    });

    it("returns null when username does not exist", async () => {
      vi.spyOn(firestoreUtils, "getDocData").mockResolvedValue(null);

      await expect(
        profileService.getUserProfileByUsername("missing"),
      ).resolves.toBeNull();
    });
  });

  describe("profile lookups & mutation", () => {
    it("getProfile maps data properly", async () => {
      vi.spyOn(firestoreUtils, "getDocData").mockResolvedValue({ uid: "u1" });
      expect((await profileService.getProfile("u1"))?.uid).toBe("u1");
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
      mockTx.get.mockResolvedValue(createMockDocSnap(true));

      await expect(
        profileService.changeUsername({
          uid: "u1",
          oldUsername: "old",
          newUsername: "taken",
        }),
      ).rejects.toThrow("USERNAME_TAKEN");

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
    it("calculates visited countries from owned and shared completed trips", async () => {
      vi.spyOn(firestoreUtils, "getDocsData")
        .mockResolvedValueOnce([
          {
            id: "trip1",
            status: "completed",
            countryCodes: ["US", "MX"],
          },
        ] as any)
        .mockResolvedValueOnce([
          {
            id: "sharedRef1",
            ownerUid: "otherUser",
            tripId: "shared1",
          },
        ] as any);

      vi.spyOn(firestoreUtils, "getDocData")
        .mockResolvedValueOnce({
          id: "shared1",
          status: "completed",
          countryCodes: ["MX", "CA"],
        } as any)
        .mockResolvedValueOnce({
          homeCountry: "US",
        } as any);

      await profileService.updateVisitedCountryCodes("u1");

      expect(fs.updateDoc).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          visitedCountryCodes: expect.arrayContaining(["US", "MX", "CA"]),
        }),
      );
    });
  });
});
