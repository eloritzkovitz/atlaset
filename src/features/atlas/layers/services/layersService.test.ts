import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock dependencies before importing the service
vi.mock("@utils/db", () => {
  const layersMock = {
    count: vi.fn(),
    toArray: vi.fn(),
    clear: vi.fn(),
    add: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    bulkAdd: vi.fn(),
    bulkPut: vi.fn(),
    update: vi.fn(), // Add update mock for reorder layers
  };
  return {
    appDb: {
      layers: layersMock,
    },
  };
});
vi.mock("@utils/firebase", () => {
  return {
    isAuthenticated: vi.fn(),
    getCurrentUser: vi.fn(),
    __esModule: true,
  };
});
vi.mock("firebase/firestore", () => {
  return {
    collection: vi.fn(),
    doc: vi.fn(),
    getDocs: vi.fn(),
    setDoc: vi.fn(),
    deleteDoc: vi.fn(),
    writeBatch: vi.fn(),
    __esModule: true,
  };
});
vi.mock("../../../../features/user", () => {
  return {
    logUserActivity: vi.fn(),
    __esModule: true,
  };
});
vi.mock("../../../../firebase", () => ({
  db: {},
  __esModule: true,
}));

import { layersService } from "./layersService";
import { appDb } from "@utils/db";
import * as firebaseUtils from "@utils/firebase";
import * as firestore from "firebase/firestore";
import { logUserActivity } from "../../../user";
import { VISITED_LAYER_ID } from "../constants/layers";

// Cast imported mocks to Vitest mock types
const isAuthenticatedMock =
  firebaseUtils.isAuthenticated as unknown as ReturnType<typeof vi.fn>;
const getCurrentUserMock =
  firebaseUtils.getCurrentUser as unknown as ReturnType<typeof vi.fn>;
const collectionMock = firestore.collection as unknown as ReturnType<
  typeof vi.fn
>;
const docMock = firestore.doc as unknown as ReturnType<typeof vi.fn>;
const getDocsMock = firestore.getDocs as unknown as ReturnType<typeof vi.fn>;
const setDocMock = firestore.setDoc as unknown as ReturnType<typeof vi.fn>;
const deleteDocMock = firestore.deleteDoc as unknown as ReturnType<
  typeof vi.fn
>;
const writeBatchMock = firestore.writeBatch as unknown as ReturnType<
  typeof vi.fn
>;

describe("layersService", () => {
  beforeEach(() => {
    // Reset all mocks
    if (!appDb.layers) {
      throw new Error(
        "appDb.layers is undefined. The mock was not set up correctly."
      );
    }
    Object.values(appDb.layers).forEach((fn) =>
      (fn as { mockReset: () => void }).mockReset()
    );
    isAuthenticatedMock.mockReset();
    getCurrentUserMock.mockReset();
    collectionMock.mockReset();
    docMock.mockReset();
    getDocsMock.mockReset();
    setDocMock.mockReset();
    deleteDocMock.mockReset();
    writeBatchMock.mockReset();
    vi.mocked(logUserActivity).mockReset();
  });

  describe("guest (IndexedDB) path", () => {
    it("warns and returns if layers array is empty (IndexedDB)", async () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      await layersService.save([]);
      expect(warnSpy).toHaveBeenCalledWith(
        "Attempted to save empty layers array. Aborting to prevent data loss."
      );
      warnSpy.mockRestore();
    });

    it("reorders layers in IndexedDB", async () => {
      const layers = [
        { id: "a", order: 1 },
        { id: "b", order: 2 },
      ];
      await layersService.reorder(layers as any);
      expect(appDb.layers.update).toHaveBeenCalledWith("a", { order: 1 });
      expect(appDb.layers.update).toHaveBeenCalledWith("b", { order: 2 });
    });
    beforeEach(() => {
      isAuthenticatedMock.mockReturnValue(false);
    });

    it("loads layers and adds visited layer if missing", async () => {
      (
        appDb.layers.toArray as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce([]);
      (
        appDb.layers.toArray as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce([
        { id: VISITED_LAYER_ID, name: "Visited Countries" },
      ]);
      const layers = await layersService.load();
      expect(layers[0].id).toBe(VISITED_LAYER_ID);
      expect(layers[0].name).toBe("Visited Countries");
    });

    it("loads layers and does not add visited layer if present", async () => {
      (
        appDb.layers.toArray as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce([
        { id: VISITED_LAYER_ID, name: "Visited Countries" },
      ]);
      const layers = await layersService.load();
      expect(layers[0].id).toBe(VISITED_LAYER_ID);
      expect(layers[0].name).toBe("Visited Countries");
      expect(layers).toHaveLength(1);
    });

    it("saves layers", async () => {
      const layers = [{ id: "foo" }];
      await layersService.save(layers as any);
      expect(appDb.layers.clear).toHaveBeenCalled();
      expect(appDb.layers.bulkPut).toHaveBeenCalledWith(layers);
    });

    it("adds a layer", async () => {
      const layer = { id: "bar" };
      await layersService.add(layer as any);
      expect(appDb.layers.add).toHaveBeenCalledWith(layer);
    });

    it("edits a layer", async () => {
      const layer = { id: "baz" };
      await layersService.edit(layer as any);
      expect(appDb.layers.put).toHaveBeenCalledWith(layer);
    });

    it("removes a layer", async () => {
      await layersService.remove("baz");
      expect(appDb.layers.delete).toHaveBeenCalledWith("baz");
    });

    it("sorts layers by order, treating missing order as 0", async () => {
      (
        appDb.layers.toArray as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce([
        { id: "a", order: 2 },
        { id: "b" }, // no order property
        { id: "c", order: 1 },
      ]);
      const layers = await layersService.load();
      // After sorting, order should be: VISITED_LAYER_ID, b (order 0), c (order 1), a (order 2)
      expect(layers.map((o) => o.id)).toEqual([
        VISITED_LAYER_ID,
        "b",
        "c",
        "a",
      ]);
    });
  });

  describe("authenticated (Firestore) path", () => {
    it("warns and returns if layers array is empty (Firestore)", async () => {
      isAuthenticatedMock.mockReturnValue(true);
      getCurrentUserMock.mockReturnValue({
        uid: "abc",
        displayName: "TestUser",
      });
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      await layersService.save([]);
      expect(warnSpy).toHaveBeenCalledWith(
        "Attempted to save empty layers array. Aborting to prevent data loss."
      );
      warnSpy.mockRestore();
    });

    it("reorders layers in Firestore", async () => {
      const layersCol = {};
      const batch = {
        update: vi.fn(),
        commit: vi.fn(),
      };
      collectionMock.mockReturnValue(layersCol);
      writeBatchMock.mockReturnValue(batch);
      docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));
      const layers = [
        { id: "foo", order: 1 },
        { id: "bar", order: 2 },
      ];
      await layersService.reorder(layers as any);
      expect(batch.update).toHaveBeenCalledWith(
        { _col: layersCol, id: "foo" },
        { order: 1 }
      );
      expect(batch.update).toHaveBeenCalledWith(
        { _col: layersCol, id: "bar" },
        { order: 2 }
      );
      expect(batch.commit).toHaveBeenCalled();
    });
    beforeEach(() => {
      isAuthenticatedMock.mockReturnValue(true);
      getCurrentUserMock.mockReturnValue({ uid: "abc" });
    });

    it("loads layers from Firestore and adds visited layer if missing", async () => {
      const layersCol = {};
      collectionMock.mockReturnValue(layersCol);
      getDocsMock.mockResolvedValueOnce({
        docs: [
          { id: "x", data: () => ({ name: "Layer X" }) },
          { id: "y", data: () => ({ name: "Layer Y" }) },
        ],
      });
      const layers = await layersService.load();
      expect(collectionMock).toHaveBeenCalledWith({}, "users", "abc", "layers");
      expect(getDocsMock).toHaveBeenCalledWith(layersCol);
      expect(layers.some((o) => o.id === VISITED_LAYER_ID)).toBe(true);
      expect(layers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: "x", name: "Layer X" }),
          expect.objectContaining({ id: "y", name: "Layer Y" }),
        ])
      );
    });

    it("saves layers to Firestore", async () => {
      const layersCol = {};
      const batch = {
        delete: vi.fn(),
        set: vi.fn(),
        commit: vi.fn(),
      };
      collectionMock.mockReturnValue(layersCol);
      writeBatchMock.mockReturnValue(batch);
      getDocsMock.mockResolvedValueOnce({
        docs: [{ ref: "ref1" }, { ref: "ref2" }],
      });
      docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));

      const layers = [{ id: "foo" }, { id: "bar" }];
      await layersService.save(layers as any);

      expect(collectionMock).toHaveBeenCalledWith({}, "users", "abc", "layers");
      expect(writeBatchMock).toHaveBeenCalled();
      expect(batch.delete).toHaveBeenCalledTimes(2);
      expect(batch.set).toHaveBeenCalledTimes(2);
      expect(batch.set).toHaveBeenCalledWith(
        { _col: layersCol, id: "foo" },
        layers[0]
      );
      expect(batch.set).toHaveBeenCalledWith(
        { _col: layersCol, id: "bar" },
        layers[1]
      );
      expect(batch.commit).toHaveBeenCalled();
    });

    it("adds a layer to Firestore", async () => {
      const layersCol = {};
      collectionMock.mockReturnValue(layersCol);
      docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));
      const layer = { id: "bar" };
      await layersService.add(layer as any);
      expect(setDocMock).toHaveBeenCalledWith(
        { _col: layersCol, id: "bar" },
        layer
      );
    });

    it("edits a layer in Firestore", async () => {
      const layersCol = {};
      collectionMock.mockReturnValue(layersCol);
      docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));
      const layer = { id: "baz" };
      await layersService.edit(layer as any);
      expect(setDocMock).toHaveBeenCalledWith(
        { _col: layersCol, id: "baz" },
        layer
      );
    });

    it("removes a layer from Firestore", async () => {
      const layersCol = {};
      collectionMock.mockReturnValue(layersCol);
      docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));
      getDocsMock.mockResolvedValueOnce({
        docs: [
          {
            id: "baz",
            data: () => ({ name: "Layer Baz" }),
          },
        ],
      });
      await layersService.remove("baz");
      expect(deleteDocMock).toHaveBeenCalledWith({
        _col: layersCol,
        id: "baz",
      });
    });
  });
});
