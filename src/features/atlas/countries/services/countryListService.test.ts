import { describe, it, expect, vi, beforeEach } from "vitest";
import { appDb } from "@lib/db";
import {
  mockAuthControls as auth,
  mockFirestoreControls as fs,
} from "@test-utils/firebaseMockRegistry";
import { createMockSnapshot } from "@test-utils/firestoreMocks";
import { countryListService } from "./countryListService";

vi.mock("@lib/db", () => ({
  appDb: {
    countryLists: {
      toArray: vi.fn().mockResolvedValue([]),
      add: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
      put: vi.fn().mockResolvedValue(undefined),
    },
  },
}));

describe("countryListService", () => {
  const mockBatch = { update: vi.fn(), commit: vi.fn() };
  const sampleList = { id: "list-1", name: "Favorites", countryCodes: ["FR"] };

  beforeEach(() => {
    vi.clearAllMocks();
    fs.writeBatch.mockReturnValue(mockBatch as any);
    auth.getCurrentUser.mockReturnValue({ uid: "test-user-123" } as any);
  });

  const setupAuthSnaps = (layersData: any[], mapsLayers: any) => {
    auth.isAuthenticated.mockReturnValue(true);
    fs.getDocs
      .mockResolvedValueOnce(
        createMockSnapshot(
          layersData.map((d, i) => ({ id: `l${i}`, data: d })),
        ),
      )
      .mockResolvedValueOnce(
        createMockSnapshot([{ id: "m1", data: { layers: mapsLayers } }]),
      );
  };

  describe("guest mode", () => {
    it("handles local synchronization only", async () => {
      auth.isAuthenticated.mockReturnValue(false);
      auth.getCurrentUser.mockReturnValue(null);

      const addSpy = vi.spyOn(appDb.countryLists, "add");
      const delSpy = vi.spyOn(appDb.countryLists, "delete");

      await countryListService.save(sampleList);
      await countryListService.delete(sampleList);

      expect(addSpy).toHaveBeenCalledWith(sampleList);
      expect(delSpy).toHaveBeenCalledWith("list-1");
      expect(fs.writeBatch).not.toHaveBeenCalled();
    });
  });

  describe("authenticated cascading updates", () => {
    it("commits batch on matching references", async () => {
      setupAuthSnaps([{ listId: "list-1" }], [{ listId: "list-1" }]);
      await countryListService.save(sampleList);
      expect(mockBatch.update).toHaveBeenCalled();
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    it("cascades deletion cleanly to matching layers and maps", async () => {
      setupAuthSnaps([{ listId: "list-1" }], [{ listId: "list-1" }]);
      await countryListService.delete(sampleList);
      expect(mockBatch.commit).toHaveBeenCalled();
      expect(fs.deleteDoc).toHaveBeenCalled();
    });

    it.each([
      ["no refs exist", [], []],
      ["non-array layer payload in map data", [], "not-an-array"],
      ["mismatched listId value", [], [{ listId: "different-id" }]],
    ])("skips batch commits if %s", async (_, layers, maps) => {
      setupAuthSnaps(layers, maps);
      await countryListService.save(sampleList);
      expect(mockBatch.commit).not.toHaveBeenCalled();
    });

    it("deletes documents without batch processing when references are clear", async () => {
      setupAuthSnaps([], []);
      await countryListService.delete(sampleList);
      expect(mockBatch.commit).not.toHaveBeenCalled();
      expect(fs.deleteDoc).toHaveBeenCalled();
    });
  });
});
