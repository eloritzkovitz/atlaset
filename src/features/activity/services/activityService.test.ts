import { describe, it, beforeEach, expect } from "vitest";
import {
  mockAuthControls as auth,
  mockFirestoreControls as fs,
} from "@test-utils/firebaseMockRegistry";
import { createMockSnapshot } from "@test-utils/firestoreMocks";
import { activityService } from "./activityService";
import type { UserActivity } from "../types";

describe("activityService", () => {
  const mockCol = { type: "user-collection-mock" };
  const mockDocRef = { type: "document-reference-mock" };
  const sampleActivity: UserActivity = {
    id: "1",
    action: 120,
    timestamp: 100,
  };

  const makeFakeDoc = (id: string, dataObj: object) =>
    ({ id, data: () => dataObj }) as any;

  beforeEach(() => {
    auth.getUserCollection.mockReturnValue(mockCol as any);
    fs.doc.mockReturnValue(mockDocRef as any);
  });

  describe("fetchActivityPage", () => {
    it("throws error when unauthenticated", async () => {
      auth.isAuthenticated.mockReturnValue(false);
      await expect(activityService.fetchActivityPage()).rejects.toThrow(
        "Not authenticated",
      );
    });

    it("fetches activity page and returns formatted items", async () => {
      auth.isAuthenticated.mockReturnValue(true);
      const fakeDoc = makeFakeDoc("1", { action: "test" });
      fs.getDocs.mockResolvedValue({ docs: [fakeDoc] } as any);

      const result = await activityService.fetchActivityPage();
      expect(result.activities).toEqual([{ id: "1", action: "test" }]);
      expect(result.lastDoc).toBe(fakeDoc);
      expect(result.pageSize).toBe(1);
    });

    it("returns empty set when query yields no results", async () => {
      auth.isAuthenticated.mockReturnValue(true);
      fs.getDocs.mockResolvedValue(createMockSnapshot([]) as any);

      const result = await activityService.fetchActivityPage();
      expect(result.activities).toEqual([]);
      expect(result.lastDoc).toBeNull();
      expect(result.pageSize).toBe(0);
    });

    it("supports pagination using startAfter offset doc", async () => {
      auth.isAuthenticated.mockReturnValue(true);
      const targetDoc = makeFakeDoc("2", { action: "next" });
      fs.getDocs.mockResolvedValue({ docs: [targetDoc] } as any);

      const result = await activityService.fetchActivityPage({
        after: makeFakeDoc("last", { action: "prev" }),
      });
      expect(result.activities).toEqual([{ id: "2", action: "next" }]);
      expect(result.lastDoc).toBe(targetDoc);
    });
  });

  describe("deleteActivity", () => {
    it("throws error when unauthenticated", async () => {
      auth.isAuthenticated.mockReturnValue(false);
      await expect(
        activityService.deleteActivity(sampleActivity),
      ).rejects.toThrow("Not authenticated");
    });

    it("deletes activity document in Firestore using entity id", async () => {
      auth.isAuthenticated.mockReturnValue(true);
      fs.deleteDoc.mockResolvedValue(undefined);

      await activityService.deleteActivity(sampleActivity);
      expect(fs.doc).toHaveBeenCalledWith(mockCol, "1");
      expect(fs.deleteDoc).toHaveBeenCalledWith(mockDocRef);
    });
  });
});
