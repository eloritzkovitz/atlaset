import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock dependencies before importing the service
vi.mock("@utils/db", () => {
  const markersMock = {
    count: vi.fn(),
    toArray: vi.fn(),
    clear: vi.fn(),
    add: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    bulkAdd: vi.fn(),
    bulkPut: vi.fn(),
  };
  return {
    appDb: {
      markers: markersMock,
    },
    __esModule: true,
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

import { markersService } from "./markersService";
import { appDb } from "@utils/db";
import * as firebaseUtils from "@utils/firebase";
import * as firestore from "firebase/firestore";
import { logUserActivity } from "../../../../features/user";

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

describe("markersService", () => {
  beforeEach(() => {
    // Reset all mocks
    Object.values(appDb.markers).forEach((fn) => fn.mockReset());
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
    it("reorders markers in IndexedDB", async () => {
      const markers = [
        { id: "a", order: 1 },
        { id: "b", order: 2 },
      ];
      const putMock = appDb.markers.put as unknown as ReturnType<typeof vi.fn>;
      await markersService.reorder(markers as any);
      expect(putMock).toHaveBeenCalledWith({ ...markers[0] });
      expect(putMock).toHaveBeenCalledWith({ ...markers[1] });
    });
    beforeEach(() => {
      isAuthenticatedMock.mockReturnValue(false);
    });

    it("loads markers from IndexedDB", async () => {
      const toArrayMock = appDb.markers.toArray as unknown as ReturnType<
        typeof vi.fn
      >;
      toArrayMock.mockResolvedValueOnce([{ id: "1", name: "Test Marker" }]);
      const markers = await markersService.load();
      expect(markers).toEqual([{ id: "1", name: "Test Marker" }]);
      expect(toArrayMock).toHaveBeenCalled();
    });

    it("saves markers (with markers)", async () => {
      const markers = [{ id: "1", name: "Test Marker" }];
      await markersService.save(markers as any);
      expect(appDb.markers.clear).toHaveBeenCalled();
      expect(appDb.markers.bulkAdd).toHaveBeenCalledWith(markers);
    });

    it("saves markers (empty array)", async () => {
      await markersService.save([]);
      expect(appDb.markers.clear).toHaveBeenCalled();
      expect(appDb.markers.bulkAdd).not.toHaveBeenCalled();
    });

    it("adds a marker", async () => {
      const marker = { id: "2", name: "New Marker" };
      await markersService.add(marker as any);
      expect(appDb.markers.add).toHaveBeenCalledWith(marker);
    });

    it("edits a marker", async () => {
      const marker = { id: "3", name: "Edit Marker" };
      await markersService.edit(marker as any);
      expect(appDb.markers.put).toHaveBeenCalledWith(marker);
    });

    it("removes a marker", async () => {
      await markersService.remove("4");
      expect(appDb.markers.delete).toHaveBeenCalledWith("4");
    });
  });

  describe("authenticated (Firestore) path", () => {
    it("reorders markers in Firestore", async () => {
      const markersCol = {};
      const batch = {
        update: vi.fn(),
        commit: vi.fn(),
      };
      collectionMock.mockReturnValue(markersCol);
      writeBatchMock.mockReturnValue(batch);
      docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));
      const markers = [
        { id: "foo", order: 1 },
        { id: "bar", order: 2 },
      ];
      await markersService.reorder(markers as any);
      expect(batch.update).toHaveBeenCalledWith(
        { _col: markersCol, id: "foo" },
        { order: 1 }
      );
      expect(batch.update).toHaveBeenCalledWith(
        { _col: markersCol, id: "bar" },
        { order: 2 }
      );
      expect(batch.commit).toHaveBeenCalled();
    });
    beforeEach(() => {
      isAuthenticatedMock.mockReturnValue(true);
      getCurrentUserMock.mockReturnValue({
        uid: "abc",
        displayName: "TestUser",
      });
    });

    it("loads markers from Firestore", async () => {
      const markersCol = {};
      collectionMock.mockReturnValue(markersCol);
      getDocsMock.mockResolvedValueOnce({
        docs: [
          { id: "x", data: () => ({ name: "Marker X" }) },
          { id: "y", data: () => ({ name: "Marker Y" }) },
        ],
      });
      const markers = await markersService.load();
      expect(collectionMock).toHaveBeenCalledWith(
        {},
        "users",
        "abc",
        "markers"
      );
      expect(getDocsMock).toHaveBeenCalledWith(markersCol);
      expect(markers).toEqual([
        { id: "x", name: "Marker X" },
        { id: "y", name: "Marker Y" },
      ]);
    });

    it("saves markers to Firestore", async () => {
      const markersCol = {};
      const batch = {
        delete: vi.fn(),
        set: vi.fn(),
        commit: vi.fn(),
      };
      collectionMock.mockReturnValue(markersCol);
      writeBatchMock.mockReturnValue(batch);
      getDocsMock.mockResolvedValueOnce({
        docs: [{ ref: "ref1" }, { ref: "ref2" }],
      });
      docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));

      const markers = [{ id: "foo" }, { id: "bar" }];
      await markersService.save(markers as any);

      expect(collectionMock).toHaveBeenCalledWith(
        {},
        "users",
        "abc",
        "markers"
      );
      expect(writeBatchMock).toHaveBeenCalled();
      expect(batch.delete).toHaveBeenCalledTimes(2);
      expect(batch.set).toHaveBeenCalledTimes(2);
      expect(batch.set).toHaveBeenCalledWith(
        { _col: markersCol, id: "foo" },
        markers[0]
      );
      expect(batch.set).toHaveBeenCalledWith(
        { _col: markersCol, id: "bar" },
        markers[1]
      );
      expect(batch.commit).toHaveBeenCalled();
      expect(logUserActivity).toHaveBeenCalledWith(
        220,
        { count: 2, userName: "TestUser" },
        "abc"
      );
    });

    it("adds a marker to Firestore", async () => {
      const markersCol = {};
      collectionMock.mockReturnValue(markersCol);
      docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));
      const marker = { id: "bar", name: "Bar Marker" };
      await markersService.add(marker as any);
      expect(setDocMock).toHaveBeenCalledWith(
        { _col: markersCol, id: "bar" },
        marker
      );
      expect(logUserActivity).toHaveBeenCalledWith(
        221,
        { markerId: "bar", itemName: "Bar Marker", userName: "TestUser" },
        "abc"
      );
    });

    it("edits a marker in Firestore", async () => {
      const markersCol = {};
      collectionMock.mockReturnValue(markersCol);
      docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));
      const marker = { id: "baz", name: "Baz Marker" };
      await markersService.edit(marker as any);
      expect(setDocMock).toHaveBeenCalledWith(
        { _col: markersCol, id: "baz" },
        marker
      );
      expect(logUserActivity).toHaveBeenCalledWith(
        222,
        { markerId: "baz", itemName: "Baz Marker", userName: "TestUser" },
        "abc"
      );
    });

    it("removes a marker from Firestore", async () => {
      const markersCol = {};
      collectionMock.mockReturnValue(markersCol);
      docMock.mockImplementation((_col: any, id: any) => ({ _col, id }));
      getDocsMock.mockResolvedValueOnce({
        docs: [{ id: "baz", data: () => ({ name: "Baz Marker" }) }],
      });
      await markersService.remove("baz");
      expect(deleteDocMock).toHaveBeenCalledWith({
        _col: markersCol,
        id: "baz",
      });
      expect(logUserActivity).toHaveBeenCalledWith(
        223,
        { markerId: "baz", itemName: "Baz Marker", userName: "TestUser" },
        "abc"
      );
    });
  });
});
