import { describe, it, expect, beforeEach, vi } from "vitest";
import { appDb } from "@lib/db";
import {
  mockAuthControls as auth,
  mockFirestoreControls as fs,
} from "@test-utils/firebaseMockRegistry";
import { createMockSnapshot } from "@test-utils/firestoreMocks";
import { markersService } from "./markersService";

vi.mock("@lib/db", () => ({
  appDb: {
    markers: {
      count: vi.fn(),
      toArray: vi.fn(),
      clear: vi.fn(),
      add: vi.fn(),
      put: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      bulkAdd: vi.fn(),
      bulkPut: vi.fn(),
    },
  },
}));

describe("markersService", () => {
  const mockBatch = {
    delete: vi.fn(),
    set: vi.fn(),
    update: vi.fn(),
    commit: vi.fn(),
  };
  const mockMarkersCol = { type: "collection-mock" };
  const mockDocRef = (col: any, id: any) => ({ col, id });

  beforeEach(() => {
    fs.writeBatch.mockReturnValue(mockBatch as any);
    fs.collection.mockReturnValue(mockMarkersCol as any);
    fs.doc.mockImplementation(mockDocRef as any);
  });

  describe("load", () => {
    it("handles all edge cases for order sorting", async () => {
      auth.isAuthenticated.mockReturnValue(true);

      fs.getDocs.mockResolvedValue(
        createMockSnapshot([
          { id: "3", data: { name: "No Order A" } },
          { id: "1", data: { order: 1 } },
          { id: "2", data: { name: "No Order B" } },
        ]) as any,
      );

      const result = await markersService.load();
      expect(result[2].id).toBe("1");
    });
  });

  describe("save", () => {
    it("returns early if markers is undefined", async () => {
      await markersService.save(undefined as any);
      expect(fs.writeBatch).not.toHaveBeenCalled();
      expect(appDb.markers.clear).not.toHaveBeenCalled();
    });

    it("clears existing markers when passed an empty array (auth - Firestore batch)", async () => {
      auth.isAuthenticated.mockReturnValue(true);
      fs.getDocs.mockResolvedValue(
        createMockSnapshot([{ id: "o1", data: {} }]) as any,
      );

      await markersService.save([]);

      expect(fs.writeBatch).toHaveBeenCalled();
      expect(mockBatch.delete).toHaveBeenCalled();
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    it("clears localTable when passed an empty array (guest - IndexedDB)", async () => {
      auth.isAuthenticated.mockReturnValue(false);

      await markersService.save([]);

      expect(appDb.markers.clear).toHaveBeenCalled();
      expect(appDb.markers.bulkPut).not.toHaveBeenCalled();
    });

    it("saves all markers (auth - Firestore batch)", async () => {
      auth.isAuthenticated.mockReturnValue(true);
      fs.getDocs.mockResolvedValue(
        createMockSnapshot([{ id: "o1", data: {} }]) as any,
      );
      await markersService.save([{ id: "foo" }] as any);
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    it("saves to localTable (guest - IndexedDB)", async () => {
      auth.isAuthenticated.mockReturnValue(false);
      await markersService.save([{ id: "foo" }] as any);
      expect(appDb.markers.clear).toHaveBeenCalled();
      expect(appDb.markers.bulkPut).toHaveBeenCalledWith([{ id: "foo" }]);
    });
  });

  describe("reorder", () => {
    it("returns early if markers are empty or undefined", async () => {
      await markersService.reorder([]);
      expect(fs.writeBatch).not.toHaveBeenCalled();
      expect(appDb.markers.update).not.toHaveBeenCalled();
    });

    it("reorders markers (guest - IndexedDB)", async () => {
      auth.isAuthenticated.mockReturnValue(false);
      await markersService.reorder([{ id: "a", order: 1 }] as any);
      expect(appDb.markers.update).toHaveBeenCalledWith("a", { order: 1 });
    });

    it("reorders markers (auth - Firestore batch)", async () => {
      auth.isAuthenticated.mockReturnValue(true);
      await markersService.reorder([{ id: "foo", order: 1 }] as any);
      expect(mockBatch.update).toHaveBeenCalled();
      expect(mockBatch.commit).toHaveBeenCalled();
    });
  });
});
