import { describe, it, beforeEach, expect, vi } from "vitest";
import {
  mockAuthControls as auth,
  mockFirestoreControls as fs,
} from "@test-utils/firebaseMockRegistry";
import { createMockSnapshot } from "@test-utils/firestoreMocks";
import { activityService } from "./activityService";

describe("activityService", () => {
  const mockCol = { type: "user-collection-mock" };
  const mockDocRef = { type: "document-reference-mock" };

  const makeFakeDoc = (id: string, dataObj: object) => ({
    id,
    data: () => dataObj,
    metadata: {} as any,
    exists: true,
    get: vi.fn(),
    toJSON: vi.fn(),
    ref: {} as any,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    auth.getUserCollection.mockReturnValue(mockCol as any);
    fs.doc.mockReturnValue(mockDocRef as any);
  });

  describe("fetchActivityPage", () => {
    it("throws a security error if the client profile is unauthenticated", async () => {
      auth.isAuthenticated.mockReturnValue(false);
      await expect(activityService.fetchActivityPage()).rejects.toThrow(
        "Not authenticated",
      );
    });

    it("fetches activity entries and correctly maps the structural return values", async () => {
      auth.isAuthenticated.mockReturnValue(true);
      const fakeDoc = makeFakeDoc("1", { action: "test" });

      fs.getDocs.mockResolvedValue({ docs: [fakeDoc] } as any);

      const result = await activityService.fetchActivityPage();
      expect(result.activities).toEqual([{ id: "1", action: "test" }]);
      expect(result.lastDoc).toBe(fakeDoc);
      expect(result.pageSize).toBe(1);
    });

    it("returns an empty set and sets lastDoc to null if the query yields zero items", async () => {
      auth.isAuthenticated.mockReturnValue(true);
      fs.getDocs.mockResolvedValue(createMockSnapshot([]) as any);

      const result = await activityService.fetchActivityPage();
      expect(result.activities).toEqual([]);
      expect(result.lastDoc).toBeNull();
      expect(result.pageSize).toBe(0);
    });

    it("accepts a document pointer argument to enable subsequent list pagination offsets", async () => {
      auth.isAuthenticated.mockReturnValue(true);
      const targetDoc = makeFakeDoc("2", { action: "next" });
      const currentOffsetDoc = makeFakeDoc("last", { action: "prev" });

      fs.getDocs.mockResolvedValue({ docs: [targetDoc] } as any);

      const result = await activityService.fetchActivityPage({
        after: currentOffsetDoc as any,
      });
      expect(result.activities).toEqual([{ id: "2", action: "next" }]);
      expect(result.lastDoc).toBe(targetDoc);
    });
  });

  describe("deleteActivityById", () => {
    it("intercepts removal actions early if the connection is unauthenticated", async () => {
      auth.isAuthenticated.mockReturnValue(false);
      await expect(activityService.deleteActivityById("1")).rejects.toThrow(
        "Not authenticated",
      );
    });

    it("targets document identifiers accurately and triggers firestore deletion requests", async () => {
      auth.isAuthenticated.mockReturnValue(true);
      fs.deleteDoc.mockResolvedValue(undefined);

      await activityService.deleteActivityById("1");
      expect(fs.doc).toHaveBeenCalledWith(mockCol, "1");
      expect(fs.deleteDoc).toHaveBeenCalledWith(mockDocRef);
    });
  });
});
