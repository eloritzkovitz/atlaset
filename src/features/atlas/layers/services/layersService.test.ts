import { describe, it, expect, beforeEach, vi } from "vitest";
import { appDb } from "@app/db";
import {
  mockAuthControls,
  mockFirestoreControls as fs,
} from "@test-utils/firebaseMockRegistry";
import { createMockSnapshot } from "@test-utils/firestoreMocks";
import { layersService } from "./layersService";

vi.mock("@app/db", () => ({
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
vi.mock("@app/firebase", () => ({ db: {}, analytics: {} }));

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

  describe("guest (IndexedDB) path", () => {
    beforeEach(() => {
      mockAuthControls.isAuthenticated.mockReturnValue(false);
    });

    it("warns and returns if layers array is empty", async () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      await layersService.save([]);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("empty layers array"),
      );
      warnSpy.mockRestore();
    });

    it("reorders layers", async () => {
      await layersService.reorder([
        { id: "a", order: 1 },
        { id: "b", order: 2 },
      ] as any);
      expect(appDb.layers.update).toHaveBeenCalledWith("a", { order: 1 });
      expect(appDb.layers.update).toHaveBeenCalledWith("b", { order: 2 });
    });

    it("saves, adds, edits, and removes layers cleanly", async () => {
      await layersService.save([{ id: "foo" }] as any);
      expect(appDb.layers.clear).toHaveBeenCalled();
      expect(appDb.layers.bulkPut).toHaveBeenCalledWith([{ id: "foo" }]);

      await layersService.add({ id: "bar" } as any);
      expect(appDb.layers.add).toHaveBeenCalledWith({ id: "bar" });

      await layersService.edit({ id: "baz" } as any);
      expect(appDb.layers.put).toHaveBeenCalledWith({ id: "baz" });

      await layersService.remove("baz");
      expect(appDb.layers.delete).toHaveBeenCalledWith("baz");
    });

    it("sorts layers by order, treating missing order as 0", async () => {
      vi.mocked(appDb.layers.toArray).mockResolvedValue([
        { id: "a", order: 2 },
        { id: "b" },
        { id: "c", order: 1 },
      ] as any);
      const layers = await layersService.load();
      expect(layers.map((o) => o.id)).toEqual(["b", "c", "a"]);
    });
  });

  describe("authenticated (Firestore) path", () => {
    beforeEach(() => {
      mockAuthControls.isAuthenticated.mockReturnValue(true);
      mockAuthControls.getCurrentUser.mockReturnValue({
        uid: "test-user",
        displayName: "TestUser",
      } as any);
    });

    it("warns and returns if layers array is empty", async () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      await layersService.save([]);
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it("reorders layers in Firestore", async () => {
      await layersService.reorder([
        { id: "foo", order: 1 },
        { id: "bar", order: 2 },
      ] as any);
      expect(mockBatch.update).toHaveBeenCalledWith(
        mockDocRef(mockLayersCol, "foo"),
        { order: 1 },
      );
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    it("loads layers from Firestore", async () => {
      fs.getDocs.mockResolvedValue(
        createMockSnapshot([{ id: "x", data: { name: "Layer X" } }]) as any,
      );
      const layers = await layersService.load();
      expect(fs.collection).toHaveBeenCalledWith(
        {},
        "users",
        "test-user",
        "layers",
      );
      expect(layers).toContainEqual(
        expect.objectContaining({ id: "x", name: "Layer X" }),
      );
    });

    it("saves layers to Firestore", async () => {
      fs.getDocs.mockResolvedValue(
        createMockSnapshot([{ id: "old1", data: {}, ref: "ref1" }]) as any,
      );
      await layersService.save([{ id: "foo" }] as any);
      expect(mockBatch.delete).toHaveBeenCalledWith("ref1");
      expect(mockBatch.set).toHaveBeenCalledWith(
        mockDocRef(mockLayersCol, "foo"),
        { id: "foo" },
      );
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    it("adds, edits, and removes layers dynamically", async () => {
      await layersService.add({ id: "bar" } as any);
      expect(fs.setDoc).toHaveBeenCalledWith(mockDocRef(mockLayersCol, "bar"), {
        id: "bar",
      });

      await layersService.edit({ id: "baz" } as any);
      expect(fs.setDoc).toHaveBeenCalledWith(mockDocRef(mockLayersCol, "baz"), {
        id: "baz",
      });

      fs.getDocs.mockResolvedValue(
        createMockSnapshot([{ id: "baz", data: {} }]) as any,
      );
      await layersService.remove("baz");
      expect(fs.deleteDoc).toHaveBeenCalledWith(
        mockDocRef(mockLayersCol, "baz"),
      );
    });
  });
});
