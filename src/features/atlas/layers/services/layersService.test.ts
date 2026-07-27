import { describe, it, expect, beforeEach, vi } from "vitest";
import { appDb } from "@lib/db";
import {
  mockAuthControls,
  mockFirestoreControls as fs,
} from "@test-utils/firebaseMockRegistry";
import { createMockSnapshot } from "@test-utils/firestoreMocks";
import { layersService } from "./layersService";

vi.mock("@lib/db", () => ({
  appDb: {
    layers: {
      count: vi.fn(),
      toArray: vi.fn(),
      clear: vi.fn(),
      add: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      bulkAdd: vi.fn(),
      bulkPut: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe("layersService", () => {
  const mockBatch = {
    delete: vi.fn(),
    set: vi.fn(),
    update: vi.fn(),
    commit: vi.fn(),
  };
  const mockLayersCol = { type: "collection-mock" };
  const mockDocRef = (col: any, id: any) => ({ col, id });

  beforeEach(() => {
    vi.clearAllMocks();
    fs.writeBatch.mockReturnValue(mockBatch as any);
    fs.collection.mockReturnValue(mockLayersCol as any);
    fs.doc.mockImplementation(mockDocRef as any);
  });

  describe("load", () => {
    it("sorts layers by order (load)", async () => {
      mockAuthControls.isAuthenticated.mockReturnValue(false);

      vi.mocked(appDb.layers.toArray).mockResolvedValue([
        { id: "a", order: 2 },
        { id: "b" },
        { id: "c", order: 1 },
      ] as any);

      const layers = await layersService.load();
      expect(layers.map((o) => o.id)).toEqual(["b", "c", "a"]);
    });

    it("does nothing if layers are empty", async () => {
      await layersService.save([]);
      expect(fs.writeBatch).not.toHaveBeenCalled();
      expect(appDb.layers.clear).not.toHaveBeenCalled();
    });
  });

  describe("reorder", () => {
    it("handles reordering (guest)", async () => {
      mockAuthControls.isAuthenticated.mockReturnValue(false);
      await layersService.reorder([{ id: "a", order: 1 }] as any);
      expect(appDb.layers.update).toHaveBeenCalledWith("a", { order: 1 });
    });

    it("handles reordering (auth)", async () => {
      mockAuthControls.isAuthenticated.mockReturnValue(true);
      await layersService.reorder([{ id: "foo", order: 1 }] as any);
      expect(mockBatch.update).toHaveBeenCalled();
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    it("reorder does nothing if layers are empty", async () => {
      await layersService.reorder([]);
      expect(fs.writeBatch).not.toHaveBeenCalled();
      expect(appDb.layers.update).not.toHaveBeenCalled();
    });
  });

  describe("save", () => {
    it("saves all (guest) - bulk clearing and putting", async () => {
      mockAuthControls.isAuthenticated.mockReturnValue(false);
      await layersService.save([{ id: "foo" }] as any);
      expect(appDb.layers.clear).toHaveBeenCalled();
      expect(appDb.layers.bulkPut).toHaveBeenCalled();
    });

    it("saves all (auth) - batch deleting and setting", async () => {
      mockAuthControls.isAuthenticated.mockReturnValue(true);
      fs.getDocs.mockResolvedValue(
        createMockSnapshot([{ id: "old1", data: {} }]) as any,
      );
      await layersService.save([{ id: "foo" }] as any);
      expect(mockBatch.delete).toHaveBeenCalled();
      expect(mockBatch.set).toHaveBeenCalled();
      expect(mockBatch.commit).toHaveBeenCalled();
    });
  });
});
