import {
  createDbMock,
  firestoreMocks,
  authMocks,
  resetAllMocks,
} from "@test-utils/mockDbAndFirestore";
import { markersService } from "./markersService";
import { vi } from "vitest";

// IndexedDB mock
vi.mock("@utils/db", () => {
  const markersMock = createDbMock([
    "toArray",
    "clear",
    "bulkAdd",
    "add",
    "put",
    "delete",
  ]);
  return {
    appDb: { markers: markersMock },
    __markersMock: markersMock,
  };
});

// Firebase Auth/User mocks
vi.mock("@utils/firebase", () => authMocks);

// Firestore mocks
vi.mock("firebase/firestore", () => firestoreMocks);
vi.mock("../../firebase", () => ({ db: {} }));

const { __markersMock: markersMock } = (await import("@utils/db")) as any;
const { isAuthenticated, getCurrentUser } = await import("@utils/firebase");
const { collection, doc, getDocs, setDoc, deleteDoc, writeBatch } =
  await import("firebase/firestore");

describe("markersService", () => {
  beforeEach(() => {
    resetAllMocks(markersMock, firestoreMocks, authMocks);
  });

  describe("guest (IndexedDB) path", () => {
    beforeEach(() => {
      (isAuthenticated as any).mockReturnValue(false);
    });

    it("loads markers from IndexedDB", async () => {
      markersMock.toArray.mockResolvedValueOnce([
        { id: "1", name: "Test Marker" },
      ]);
      const markers = await markersService.load();
      expect(markers).toEqual([{ id: "1", name: "Test Marker" }]);
      expect(markersMock.toArray).toHaveBeenCalled();
    });

    it("saves markers (with markers)", async () => {
      const markers = [{ id: "1", name: "Test Marker" }];
      await markersService.save(markers as any);
      expect(markersMock.clear).toHaveBeenCalled();
      expect(markersMock.bulkAdd).toHaveBeenCalledWith(markers);
    });

    it("saves markers (empty array)", async () => {
      await markersService.save([]);
      expect(markersMock.clear).toHaveBeenCalled();
      expect(markersMock.bulkAdd).not.toHaveBeenCalled();
    });

    it("adds a marker", async () => {
      const marker = { id: "2", name: "New Marker" };
      await markersService.add(marker as any);
      expect(markersMock.add).toHaveBeenCalledWith(marker);
    });

    it("edits a marker", async () => {
      const marker = { id: "3", name: "Edit Marker" };
      await markersService.edit(marker as any);
      expect(markersMock.put).toHaveBeenCalledWith(marker);
    });

    it("removes a marker", async () => {
      await markersService.remove("4");
      expect(markersMock.delete).toHaveBeenCalledWith("4");
    });
  });

  describe("authenticated (Firestore) path", () => {
    beforeEach(() => {
      (isAuthenticated as any).mockReturnValue(true);
      (getCurrentUser as any).mockReturnValue({ uid: "abc" });
    });

    it("loads markers from Firestore", async () => {
      const markersCol = {};
      (collection as any).mockReturnValue(markersCol);
      (getDocs as any).mockResolvedValueOnce({
        docs: [
          { id: "x", data: () => ({ name: "Marker X" }) },
          { id: "y", data: () => ({ name: "Marker Y" }) },
        ],
      });
      const markers = await markersService.load();
      expect(collection).toHaveBeenCalledWith({}, "users", "abc", "markers");
      expect(getDocs).toHaveBeenCalledWith(markersCol);
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
      (collection as any).mockReturnValue(markersCol);
      (writeBatch as any).mockReturnValue(batch);
      (getDocs as any).mockResolvedValueOnce({
        docs: [{ ref: "ref1" }, { ref: "ref2" }],
      });
      (doc as any).mockImplementation((_col: any, id: any) => ({ _col, id }));

      const markers = [{ id: "foo" }, { id: "bar" }];
      await markersService.save(markers as any);

      expect(collection).toHaveBeenCalledWith({}, "users", "abc", "markers");
      expect(writeBatch).toHaveBeenCalled();
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
    });

    it("adds a marker to Firestore", async () => {
      const markersCol = {};
      (collection as any).mockReturnValue(markersCol);
      (doc as any).mockImplementation((_col: any, id: any) => ({ _col, id }));
      const marker = { id: "bar" };
      await markersService.add(marker as any);
      expect(setDoc).toHaveBeenCalledWith(
        { _col: markersCol, id: "bar" },
        marker
      );
    });

    it("edits a marker in Firestore", async () => {
      const markersCol = {};
      (collection as any).mockReturnValue(markersCol);
      (doc as any).mockImplementation((_col: any, id: any) => ({ _col, id }));
      const marker = { id: "baz" };
      await markersService.edit(marker as any);
      expect(setDoc).toHaveBeenCalledWith(
        { _col: markersCol, id: "baz" },
        marker
      );
    });

    it("removes a marker from Firestore", async () => {
      const markersCol = {};
      (collection as any).mockReturnValue(markersCol);
      (doc as any).mockImplementation((_col: any, id: any) => ({ _col, id }));
      await markersService.remove("baz");
      expect(deleteDoc).toHaveBeenCalledWith({ _col: markersCol, id: "baz" });
    });
  });
});
