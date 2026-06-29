import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  mockAuthControls as auth,
  mockFirestoreControls as fs,
} from "@test-utils/firebaseMockRegistry";
import { createMockSnapshot } from "@test-utils/firestoreMocks";
import { countryListService } from "./countryListService";

describe("countryListService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auth.isAuthenticated.mockReturnValue(true);
  });

  const sampleList = {
    id: "list-1",
    name: "Favorites",
    countryCodes: ["FR", "DE"],
  };

  describe("load", () => {
    it("returns an empty array early if the user is unauthenticated", async () => {
      auth.isAuthenticated.mockReturnValue(false);
      const res = await countryListService.load();
      expect(res).toEqual([]);
      expect(fs.getDocs).not.toHaveBeenCalled();
    });

    it("fetches and maps documents successfully when authenticated", async () => {
      fs.getDocs.mockResolvedValue(
        createMockSnapshot([
          { id: "list-1", data: { name: "Favorites" } },
        ]) as any,
      );

      const res = await countryListService.load();
      expect(res).toEqual([{ id: "list-1", name: "Favorites" }]);
    });
  });

  describe("save", () => {
    it("bails early if the user is unauthenticated", async () => {
      auth.isAuthenticated.mockReturnValue(false);
      await countryListService.save(sampleList);
      expect(fs.setDoc).not.toHaveBeenCalled();
    });

    it("persists the list data and syncs flat layer references + nested map layers", async () => {
      const layersSnapshot = createMockSnapshot([
        {
          id: "layer-1",
          data: { listId: "list-1" },
          ref: { path: "layer-1-ref" },
        },
        { id: "layer-2", data: { listId: "other-list" } },
      ]);

      const mapsSnapshot = createMockSnapshot([
        {
          id: "map-1",
          data: {
            layers: [
              { listId: "list-1", countries: [] },
              null,
              { listId: "unrelated-list", countries: ["US"] },
            ],
          },
          ref: { path: "map-1-ref" },
        },
        { id: "map-2", data: { layers: "not-an-array" } },
      ]);

      fs.getDocs
        .mockResolvedValueOnce(layersSnapshot as any)
        .mockResolvedValueOnce(mapsSnapshot as any);

      await countryListService.save(sampleList);

      expect(fs.setDoc).toHaveBeenCalled();
      expect(fs.updateDoc).toHaveBeenCalledWith(
        { path: "layer-1-ref" } as any,
        {
          countries: ["FR", "DE"],
        },
      );
      expect(fs.updateDoc).toHaveBeenCalledWith({ path: "map-1-ref" } as any, {
        layers: [
          { listId: "list-1", countries: ["FR", "DE"] },
          null,
          { listId: "unrelated-list", countries: ["US"] },
        ],
      });
    });
  });

  describe("delete", () => {
    it("bails early if the user is unauthenticated", async () => {
      auth.isAuthenticated.mockReturnValue(false);
      await countryListService.delete("list-1");
      expect(fs.deleteDoc).not.toHaveBeenCalled();
    });

    it("nullifies matching flat layers, maps arrays, and calls deleteDoc target", async () => {
      const layersSnapshot = createMockSnapshot([
        {
          id: "layer-1",
          data: { listId: "list-1" },
          ref: { path: "layer-1-ref" },
        },
      ]);
      const mapsSnapshot = createMockSnapshot([
        {
          id: "map-1",
          data: { layers: [{ listId: "list-1" }, { listId: "keep-me" }] },
          ref: { path: "map-1-ref" },
        },
      ]);

      fs.getDocs
        .mockResolvedValueOnce(layersSnapshot as any)
        .mockResolvedValueOnce(mapsSnapshot as any);

      await countryListService.delete("list-1");

      expect(fs.updateDoc).toHaveBeenCalledWith(
        { path: "layer-1-ref" } as any,
        {
          listId: null,
        },
      );
      expect(fs.updateDoc).toHaveBeenCalledWith({ path: "map-1-ref" } as any, {
        layers: [{ listId: null }, { listId: "keep-me" }],
      });
      expect(fs.deleteDoc).toHaveBeenCalled();
    });
  });
});
