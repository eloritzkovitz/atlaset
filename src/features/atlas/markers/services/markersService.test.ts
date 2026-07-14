import { describe, it, expect, beforeEach, vi } from "vitest";
import { appDb } from "@app/db";
import { activityMockTracker } from "@test-utils/activityMocks";
import {
  mockAuthControls as auth,
  mockFirestoreControls as fs,
} from "@test-utils/firebaseMockRegistry";
import { createMockSnapshot } from "@test-utils/firestoreMocks";
import { markersService } from "./markersService";

vi.mock("@app/db", () => ({
  appDb: {
    markers: {
      count: vi.fn(),
      toArray: vi.fn(),
      clear: vi.fn(),
      add: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      bulkAdd: vi.fn(),
      bulkPut: vi.fn(),
    },
  },
}));
vi.mock("@app/firebase", () => ({ db: {} }));

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
    vi.clearAllMocks();
    fs.writeBatch.mockReturnValue(mockBatch as any);
    fs.collection.mockReturnValue(mockMarkersCol as any);
    fs.doc.mockImplementation(mockDocRef as any);
  });

  describe("guest (IndexedDB) path", () => {
    beforeEach(() => {
      auth.isAuthenticated.mockReturnValue(false);
    });

    it("reorders markers in IndexedDB", async () => {
      const markers = [
        { id: "a", order: 1 },
        { id: "b", order: 2 },
      ];
      await markersService.reorder(markers as any);
      expect(appDb.markers.put).toHaveBeenCalledWith({ id: "a", order: 1 });
      expect(appDb.markers.put).toHaveBeenCalledWith({ id: "b", order: 2 });
    });

    it("loads markers from IndexedDB", async () => {
      vi.mocked(appDb.markers.toArray).mockResolvedValue([
        { id: "1", name: "Test Marker" },
      ]);
      const markers = await markersService.load();
      expect(markers).toEqual([{ id: "1", name: "Test Marker" }]);
    });

    it("saves markers cleanly for both populated and empty arrays", async () => {
      const populated = [{ id: "1", name: "Test Marker" }];
      await markersService.save(populated as any);
      expect(appDb.markers.clear).toHaveBeenCalled();
      expect(appDb.markers.bulkAdd).toHaveBeenCalledWith(populated);

      vi.clearAllMocks();

      await markersService.save([]);
      expect(appDb.markers.clear).toHaveBeenCalled();
      expect(appDb.markers.bulkAdd).not.toHaveBeenCalled();
    });

    it("adds, edits, and removes markers fluidly", async () => {
      await markersService.add({ id: "2", name: "New Marker" } as any);
      expect(appDb.markers.add).toHaveBeenCalledWith({
        id: "2",
        name: "New Marker",
      });

      await markersService.edit({ id: "3", name: "Edit Marker" } as any);
      expect(appDb.markers.put).toHaveBeenCalledWith({
        id: "3",
        name: "Edit Marker",
      });

      await markersService.remove("4");
      expect(appDb.markers.delete).toHaveBeenCalledWith("4");
    });
  });

  describe("authenticated (Firestore) path", () => {
    beforeEach(() => {
      auth.isAuthenticated.mockReturnValue(true);
      auth.getCurrentUser.mockReturnValue({
        uid: "test-user",
        displayName: "TestUser",
      } as any);
    });

    it("reorders markers in Firestore using transactional batches", async () => {
      const markers = [
        { id: "foo", order: 1 },
        { id: "bar", order: 2 },
      ];
      await markersService.reorder(markers as any);
      expect(mockBatch.update).toHaveBeenCalledWith(
        mockDocRef(mockMarkersCol, "foo"),
        { order: 1 },
      );
      expect(mockBatch.update).toHaveBeenCalledWith(
        mockDocRef(mockMarkersCol, "bar"),
        { order: 2 },
      );
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    it("loads markers from Firestore", async () => {
      fs.getDocs.mockResolvedValue(
        createMockSnapshot([
          { id: "x", data: { name: "Marker X" } },
          { id: "y", data: { name: "Marker Y" } },
        ]) as any,
      );
      const markers = await markersService.load();
      expect(fs.collection).toHaveBeenCalledWith(
        {},
        "users",
        "test-user",
        "markers",
      );
      expect(markers).toEqual([
        { id: "x", name: "Marker X" },
        { id: "y", name: "Marker Y" },
      ]);
    });

    it("saves markers to Firestore and logs user metrics", async () => {
      fs.getDocs.mockResolvedValue(
        createMockSnapshot([
          { id: "o1", data: {}, ref: "ref1" },
          { id: "o2", data: {}, ref: "ref2" },
        ]) as any,
      );
      const markers = [{ id: "foo" }, { id: "bar" }];

      await markersService.save(markers as any);

      expect(mockBatch.delete).toHaveBeenCalledTimes(2);
      expect(mockBatch.set).toHaveBeenCalledWith(
        mockDocRef(mockMarkersCol, "foo"),
        markers[0],
      );
      expect(mockBatch.commit).toHaveBeenCalled();
      expect(activityMockTracker).toHaveBeenCalledWith(
        220,
        { count: 2, userName: "TestUser" },
        "test-user",
      );
    });

    it("adds, edits, and removes markers while firing activity logs", async () => {
      await markersService.add({ id: "bar", name: "Bar Marker" } as any);
      expect(fs.setDoc).toHaveBeenCalledWith(
        mockDocRef(mockMarkersCol, "bar"),
        {
          id: "bar",
          name: "Bar Marker",
        },
      );
      expect(activityMockTracker).toHaveBeenCalledWith(
        221,
        { markerId: "bar", itemName: "Bar Marker", userName: "TestUser" },
        "test-user",
      );

      await markersService.edit({ id: "baz", name: "Baz Marker" } as any);
      expect(fs.setDoc).toHaveBeenCalledWith(
        mockDocRef(mockMarkersCol, "baz"),
        {
          id: "baz",
          name: "Baz Marker",
        },
      );
      expect(activityMockTracker).toHaveBeenCalledWith(
        222,
        { markerId: "baz", itemName: "Baz Marker", userName: "TestUser" },
        "test-user",
      );

      fs.getDocs.mockResolvedValue(
        createMockSnapshot([
          { id: "baz", data: { name: "Baz Marker" } },
        ]) as any,
      );
      await markersService.remove("baz");
      expect(fs.deleteDoc).toHaveBeenCalledWith(
        mockDocRef(mockMarkersCol, "baz"),
      );
      expect(activityMockTracker).toHaveBeenCalledWith(
        223,
        { markerId: "baz", itemName: "Baz Marker", userName: "TestUser" },
        "test-user",
      );
    });
  });
});
