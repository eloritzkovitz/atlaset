import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  mockAuthControls as auth,
  mockFirestoreControls as fs,
} from "@test-utils/firebaseMockRegistry";
import { createMockSnapshot } from "@test-utils/firestoreMocks";
import { countryListService } from "./countryListService";
import { appDb } from "@app/db";

vi.mock("@app/db", () => ({
  appDb: {
    countryLists: {
      toArray: vi.fn().mockResolvedValue([]),
      add: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
    },
  },
}));
vi.mock("@app/firebase", () => ({ db: {}, analytics: {} }));

describe("countryListService", () => {
  const mockBatch = { update: vi.fn(), commit: vi.fn() };
  const sampleList = { id: "list-1", name: "Favorites", countryCodes: ["FR"] };

  beforeEach(() => {
    vi.clearAllMocks();
    fs.writeBatch.mockReturnValue(mockBatch as any);
  });

  describe("save", () => {
    it("saves to localTable and skips batch in guest mode", async () => {
      auth.isAuthenticated.mockReturnValue(false);
      const addSpy = vi.spyOn(appDb.countryLists, "add");
      await countryListService.save(sampleList);
      expect(addSpy).toHaveBeenCalledWith(sampleList);
      expect(fs.writeBatch).not.toHaveBeenCalled();
    });

    it("persists and cascades batch updates in authenticated mode", async () => {
      auth.isAuthenticated.mockReturnValue(true);
      const layersSnap = createMockSnapshot([
        { id: "l1", data: { listId: "list-1" }, ref: { path: "l1" } },
      ]);
      const mapsSnap = createMockSnapshot([
        {
          id: "m1",
          data: { layers: [{ listId: "list-1" }] },
          ref: { path: "m1" },
        },
      ]);
      fs.getDocs
        .mockResolvedValueOnce(layersSnap)
        .mockResolvedValueOnce(mapsSnap);

      await countryListService.save(sampleList);
      expect(fs.setDoc).toHaveBeenCalled();
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    it("does not commit batch if no updates are found", async () => {
      auth.isAuthenticated.mockReturnValue(true);
      fs.getDocs.mockResolvedValue(createMockSnapshot([]));
      await countryListService.save(sampleList);
      expect(mockBatch.commit).not.toHaveBeenCalled();
    });

    it("skips non-array layers in maps", async () => {
      auth.isAuthenticated.mockReturnValue(true);
      const mapsSnap = createMockSnapshot([
        { id: "m1", data: { layers: "not-an-array" }, ref: { path: "m1" } },
      ]);
      fs.getDocs
        .mockResolvedValueOnce(createMockSnapshot([]))
        .mockResolvedValueOnce(mapsSnap);
      await countryListService.save(sampleList);
      expect(mockBatch.commit).not.toHaveBeenCalled();
    });

    it("skips updating maps when listId does not match", async () => {
      auth.isAuthenticated.mockReturnValue(true);
      const mapsSnap = createMockSnapshot([
        {
          id: "m1",
          data: { layers: [{ listId: "other-list" }] },
          ref: { path: "m1" },
        },
      ]);
      fs.getDocs
        .mockResolvedValueOnce(createMockSnapshot([]))
        .mockResolvedValueOnce(mapsSnap);

      await countryListService.save(sampleList);

      expect(mockBatch.update).not.toHaveBeenCalled();
      expect(mockBatch.commit).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("deletes locally and skips batch in guest mode", async () => {
      auth.isAuthenticated.mockReturnValue(false);
      const delSpy = vi.spyOn(appDb.countryLists, "delete");
      await countryListService.delete("list-1");
      expect(delSpy).toHaveBeenCalledWith("list-1");
      expect(fs.writeBatch).not.toHaveBeenCalled();
    });

    it("cascades nullification and deletes in authenticated mode", async () => {
      auth.isAuthenticated.mockReturnValue(true);
      const layersSnap = createMockSnapshot([
        { id: "l1", data: { listId: "list-1" }, ref: { path: "l1" } },
      ]);
      const mapsSnap = createMockSnapshot([
        {
          id: "m1",
          data: { layers: [{ listId: "list-1" }] },
          ref: { path: "m1" },
        },
      ]);
      fs.getDocs
        .mockResolvedValueOnce(layersSnap)
        .mockResolvedValueOnce(mapsSnap);

      await countryListService.delete("list-1");
      expect(mockBatch.commit).toHaveBeenCalled();
      expect(fs.deleteDoc).toHaveBeenCalled();
    });

    it("deletes document without committing batch if no references exist", async () => {
      auth.isAuthenticated.mockReturnValue(true);
      fs.getDocs.mockResolvedValue(createMockSnapshot([]));
      await countryListService.delete("list-1");
      expect(mockBatch.commit).not.toHaveBeenCalled();
      expect(fs.deleteDoc).toHaveBeenCalled();
    });

    it("does not update maps if the listId does not match the deleted ID", async () => {
      auth.isAuthenticated.mockReturnValue(true);
      const mapsSnap = createMockSnapshot([
        {
          id: "m1",
          data: { layers: [{ listId: "different-id" }] },
          ref: { path: "m1" },
        },
      ]);
      fs.getDocs
        .mockResolvedValueOnce(createMockSnapshot([]))
        .mockResolvedValueOnce(mapsSnap);

      await countryListService.delete("list-1");

      expect(mockBatch.update).not.toHaveBeenCalled();
      expect(mockBatch.commit).not.toHaveBeenCalled();
    });
  });
});
