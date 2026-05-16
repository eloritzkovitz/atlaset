import { activityService } from "./activityService";
import { vi, type Mock } from "vitest";

vi.mock("firebase/firestore", () => ({
  getDocs: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
  addDoc: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  startAfter: vi.fn(),
  QueryDocumentSnapshot: class {},
}));
vi.mock("@utils/firebase", () => ({
  getUserCollection: vi.fn(),
  isAuthenticated: vi.fn(),
}));

import {
  getDocs,
  deleteDoc,
  doc,
  QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { getUserCollection, isAuthenticated } from "@utils/firebase";

// Helper to create a fake QueryDocumentSnapshot
function makeFakeDoc(
  id: string,
  dataObj: object,
): QueryDocumentSnapshot<DocumentData> {
  return {
    id,
    data: () => dataObj,
    metadata: {} as any,
    exists: true,
    get: vi.fn(),
    toJSON: vi.fn(),
    ref: {} as any,
  } as unknown as QueryDocumentSnapshot<DocumentData>;
}

describe("activityService", () => {
  const mockGetUserCollection = getUserCollection as Mock;
  const mockIsAuthenticated = isAuthenticated as Mock;
  const mockGetDocs = getDocs as Mock;
  const mockDeleteDoc = deleteDoc as Mock;
  const mockDoc = doc as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchActivityPage", () => {
    it("throws if not authenticated", async () => {
      mockIsAuthenticated.mockReturnValue(false);
      await expect(activityService.fetchActivityPage()).rejects.toThrow(
        "Not authenticated",
      );
    });

    it("fetches activities and returns correct structure", async () => {
      mockIsAuthenticated.mockReturnValue(true);
      const fakeCol = {};
      mockGetUserCollection.mockReturnValue(fakeCol);
      const fakeDoc = makeFakeDoc("1", { action: "test" });
      const fakeSnapshot = { docs: [fakeDoc] };
      mockGetDocs.mockResolvedValue(fakeSnapshot);
      const result = await activityService.fetchActivityPage();
      expect(result.activities).toEqual([{ id: "1", action: "test" }]);
      expect(result.lastDoc).toBe(fakeDoc);
      expect(result.pageSize).toBe(1);
    });

    it("returns lastDoc as null if no docs", async () => {
      mockIsAuthenticated.mockReturnValue(true);
      mockGetUserCollection.mockReturnValue({});
      mockGetDocs.mockResolvedValue({ docs: [] });
      const result = await activityService.fetchActivityPage();
      expect(result.lastDoc).toBeNull();
      expect(result.activities).toEqual([]);
      expect(result.pageSize).toBe(0);
    });

    it("fetches with 'after' param and uses startAfter", async () => {
      mockIsAuthenticated.mockReturnValue(true);
      const fakeCol = {};
      mockGetUserCollection.mockReturnValue(fakeCol);
      const fakeDoc = makeFakeDoc("2", { action: "next" });
      const fakeSnapshot = { docs: [fakeDoc] };
      mockGetDocs.mockResolvedValue(fakeSnapshot);
      const afterDoc = makeFakeDoc("last", { action: "prev" });
      const result = await activityService.fetchActivityPage({
        after: afterDoc,
      });
      expect(result.activities).toEqual([{ id: "2", action: "next" }]);
      expect(result.lastDoc).toBe(fakeDoc);
      expect(result.pageSize).toBe(1);
    });
  });

  describe("deleteActivityById", () => {
    it("throws if not authenticated", async () => {
      mockIsAuthenticated.mockReturnValue(false);
      await expect(activityService.deleteActivityById("1")).rejects.toThrow(
        "Not authenticated",
      );
    });

    it("calls deleteDoc with correct args", async () => {
      mockIsAuthenticated.mockReturnValue(true);
      const fakeCol = {};
      mockGetUserCollection.mockReturnValue(fakeCol);
      const fakeDocRef = { id: "1" };
      mockDoc.mockReturnValue(fakeDocRef);
      mockDeleteDoc.mockResolvedValue(undefined);
      await activityService.deleteActivityById("1");
      expect(mockDoc).toHaveBeenCalledWith(fakeCol, "1");
      expect(mockDeleteDoc).toHaveBeenCalledWith(fakeDocRef);
    });
  });
});
