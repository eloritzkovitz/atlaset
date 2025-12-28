import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock dependencies before importing the service
vi.mock("@utils/db", () => {
  const overlaysMock = {
    count: vi.fn(),
    toArray: vi.fn(),
    clear: vi.fn(),
    add: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    bulkAdd: vi.fn(),
    bulkPut: vi.fn(),
    update: vi.fn(), // Add update mock for reorder overlays
  };
  return {
    appDb: {
      overlays: overlaysMock,
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

import { overlaysService } from "./overlaysService";
import { appDb } from "@utils/db";
import * as firebaseUtils from "@utils/firebase";
import * as firestore from "firebase/firestore";
import { logUserActivity } from "../../../../features/user";
import { VISITED_OVERLAY_ID } from "../constants/overlays";

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

describe("overlaysService", () => {
  beforeEach(() => {
    // Reset all mocks
    if (!appDb.overlays) {
      throw new Error(
        "appDb.overlays is undefined. The mock was not set up correctly."
      );
    }
    Object.values(appDb.overlays).forEach((fn) =>
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
    it("warns and returns if overlays array is empty (IndexedDB)", async () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      await overlaysService.save([]);
      expect(warnSpy).toHaveBeenCalledWith(
        "Attempted to save empty overlays array. Aborting to prevent data loss."
      );
      warnSpy.mockRestore();
    });

    it("reorders overlays in IndexedDB", async () => {
      const overlays = [
        { id: "a", order: 1 },
        { id: "b", order: 2 },
      ];
      await overlaysService.reorder(overlays as any);
      expect(appDb.overlays.update).toHaveBeenCalledWith("a", { order: 1 });
      expect(appDb.overlays.update).toHaveBeenCalledWith("b", { order: 2 });
    });
    beforeEach(() => {
      isAuthenticatedMock.mockReturnValue(false);
    });

    it("loads overlays and adds visited overlay if missing", async () => {
      (
        appDb.overlays.toArray as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce([]);
      (
        appDb.overlays.toArray as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce([
        { id: VISITED_OVERLAY_ID, name: "Visited Countries" },
      ]);
      const overlays = await overlaysService.load();
      expect(overlays[0].id).toBe(VISITED_OVERLAY_ID);
      expect(overlays[0].name).toBe("Visited Countries");
    });

    it("loads overlays and does not add visited overlay if present", async () => {
      (
        appDb.overlays.toArray as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce([
        { id: VISITED_OVERLAY_ID, name: "Visited Countries" },
      ]);
      const overlays = await overlaysService.load();
      expect(overlays[0].id).toBe(VISITED_OVERLAY_ID);
      expect(overlays[0].name).toBe("Visited Countries");
      expect(overlays).toHaveLength(1);
    });

    it("saves overlays", async () => {
      const overlays = [{ id: "foo" }];
      await overlaysService.save(overlays as any);
      expect(appDb.overlays.clear).toHaveBeenCalled();
      expect(appDb.overlays.bulkPut).toHaveBeenCalledWith(overlays);
    });

    it("adds an overlay", async () => {
      const overlay = { id: "bar" };
      await overlaysService.add(overlay as any);
      expect(appDb.overlays.add).toHaveBeenCalledWith(overlay);
    });

    it("edits an overlay", async () => {
      const overlay = { id: "baz" };
      await overlaysService.edit(overlay as any);
      expect(appDb.overlays.put).toHaveBeenCalledWith(overlay);
    });

    it("removes an overlay", async () => {
      await overlaysService.remove("baz");
      expect(appDb.overlays.delete).toHaveBeenCalledWith("baz");
    });

    it("sorts overlays by order, treating missing order as 0", async () => {
      (
        appDb.overlays.toArray as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce([
        { id: "a", order: 2 },
        { id: "b" }, // no order property
        { id: "c", order: 1 },
      ]);
      const overlays = await overlaysService.load();
      // After sorting, order should be: VISITED_OVERLAY_ID, b (order 0), c (order 1), a (order 2)
      expect(overlays.map((o) => o.id)).toEqual([
        VISITED_OVERLAY_ID,
        "b",
        "c",
        "a",
      ]);
    });
  });

  describe("authenticated (Firestore) path", () => {
    it("warns and returns if overlays array is empty (Firestore)", async () => {
      isAuthenticatedMock.mockReturnValue(true);
      getCurrentUserMock.mockReturnValue({
        uid: "abc",
        displayName: "TestUser",
      });
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      await overlaysService.save([]);
      expect(warnSpy).toHaveBeenCalledWith(
        "Attempted to save empty overlays array. Aborting to prevent data loss."
      );
      warnSpy.mockRestore();
    });

    it("reorders overlays in Firestore", async () => {
      const overlaysCol = {};
      const batch = {
        update: vi.fn(),
        commit: vi.fn(),
      };
      collectionMock.mockReturnValue(overlaysCol);
      writeBatchMock.mockReturnValue(batch);
      docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));
      const overlays = [
        { id: "foo", order: 1 },
        { id: "bar", order: 2 },
      ];
      await overlaysService.reorder(overlays as any);
      expect(batch.update).toHaveBeenCalledWith(
        { _col: overlaysCol, id: "foo" },
        { order: 1 }
      );
      expect(batch.update).toHaveBeenCalledWith(
        { _col: overlaysCol, id: "bar" },
        { order: 2 }
      );
      expect(batch.commit).toHaveBeenCalled();
    });
    beforeEach(() => {
      isAuthenticatedMock.mockReturnValue(true);
      getCurrentUserMock.mockReturnValue({ uid: "abc" });
    });

    it("loads overlays from Firestore and adds visited overlay if missing", async () => {
      const overlaysCol = {};
      collectionMock.mockReturnValue(overlaysCol);
      getDocsMock.mockResolvedValueOnce({
        docs: [
          { id: "x", data: () => ({ name: "Overlay X" }) },
          { id: "y", data: () => ({ name: "Overlay Y" }) },
        ],
      });
      const overlays = await overlaysService.load();
      expect(collectionMock).toHaveBeenCalledWith(
        {},
        "users",
        "abc",
        "overlays"
      );
      expect(getDocsMock).toHaveBeenCalledWith(overlaysCol);
      expect(overlays.some((o) => o.id === VISITED_OVERLAY_ID)).toBe(true);
      expect(overlays).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: "x", name: "Overlay X" }),
          expect.objectContaining({ id: "y", name: "Overlay Y" }),
        ])
      );
    });

    it("saves overlays to Firestore", async () => {
      const overlaysCol = {};
      const batch = {
        delete: vi.fn(),
        set: vi.fn(),
        commit: vi.fn(),
      };
      collectionMock.mockReturnValue(overlaysCol);
      writeBatchMock.mockReturnValue(batch);
      getDocsMock.mockResolvedValueOnce({
        docs: [{ ref: "ref1" }, { ref: "ref2" }],
      });
      docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));

      const overlays = [{ id: "foo" }, { id: "bar" }];
      await overlaysService.save(overlays as any);

      expect(collectionMock).toHaveBeenCalledWith(
        {},
        "users",
        "abc",
        "overlays"
      );
      expect(writeBatchMock).toHaveBeenCalled();
      expect(batch.delete).toHaveBeenCalledTimes(2);
      expect(batch.set).toHaveBeenCalledTimes(2);
      expect(batch.set).toHaveBeenCalledWith(
        { _col: overlaysCol, id: "foo" },
        overlays[0]
      );
      expect(batch.set).toHaveBeenCalledWith(
        { _col: overlaysCol, id: "bar" },
        overlays[1]
      );
      expect(batch.commit).toHaveBeenCalled();
    });

    it("adds an overlay to Firestore", async () => {
      const overlaysCol = {};
      collectionMock.mockReturnValue(overlaysCol);
      docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));
      const overlay = { id: "bar" };
      await overlaysService.add(overlay as any);
      expect(setDocMock).toHaveBeenCalledWith(
        { _col: overlaysCol, id: "bar" },
        overlay
      );
    });

    it("edits an overlay in Firestore", async () => {
      const overlaysCol = {};
      collectionMock.mockReturnValue(overlaysCol);
      docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));
      const overlay = { id: "baz" };
      await overlaysService.edit(overlay as any);
      expect(setDocMock).toHaveBeenCalledWith(
        { _col: overlaysCol, id: "baz" },
        overlay
      );
    });

    it("removes an overlay from Firestore", async () => {
      const overlaysCol = {};
      collectionMock.mockReturnValue(overlaysCol);
      docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));
      getDocsMock.mockResolvedValueOnce({
        docs: [
          {
            id: "baz",
            data: () => ({ name: "Overlay Baz" }),
          },
        ],
      });
      await overlaysService.remove("baz");
      expect(deleteDocMock).toHaveBeenCalledWith({
        _col: overlaysCol,
        id: "baz",
      });
    });
  });
});
