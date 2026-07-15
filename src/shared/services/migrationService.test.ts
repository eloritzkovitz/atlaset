import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@app/db", () => ({
  appDb: {
    layers: {
      count: vi.fn(),
      toArray: vi.fn(),
      get: vi.fn(),
      clear: vi.fn(),
      put: vi.fn(),
      add: vi.fn(),
      delete: vi.fn(),
      bulkAdd: vi.fn(),
      bulkPut: vi.fn(),
    },
    markers: {
      count: vi.fn(),
      toArray: vi.fn(),
      get: vi.fn(),
      clear: vi.fn(),
      put: vi.fn(),
      add: vi.fn(),
      delete: vi.fn(),
      bulkAdd: vi.fn(),
      bulkPut: vi.fn(),
    },
    settings: {
      count: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      clear: vi.fn(),
      add: vi.fn(),
      delete: vi.fn(),
      bulkAdd: vi.fn(),
      bulkPut: vi.fn(),
    },
    trips: {
      count: vi.fn(),
      toArray: vi.fn(),
      get: vi.fn(),
      clear: vi.fn(),
      put: vi.fn(),
      add: vi.fn(),
      delete: vi.fn(),
      bulkAdd: vi.fn(),
      bulkPut: vi.fn(),
    },
  },
  __esModule: true,
}));
vi.mock("../../features/atlas/layers/services/layersService", () => ({
  layersService: {
    load: vi.fn(),
    save: vi.fn(),
  },
}));
vi.mock("../../features/atlas/markers/services/markersService", () => ({
  markersService: {
    load: vi.fn(),
    save: vi.fn(),
  },
}));
vi.mock("../../features/settings/services/settingsService", () => ({
  settingsService: {
    save: vi.fn(),
  },
}));

import { appDb } from "@app/db";
import { layersService } from "../../features/atlas/layers/services/layersService";
import { markersService } from "../../features/atlas/markers/services/markersService";
import { settingsService } from "../../features/settings/common/services/settingsService";
import { migrationService } from "./migrationService";
import { resetAllMocks } from "../test-utils/firestoreMocks";

describe("migrationService", () => {
  beforeEach(() => {
    resetAllMocks(
      appDb.markers,
      appDb.layers,
      appDb.settings,
      markersService,
      layersService,
      settingsService,
    );
  });

  describe("hasGuestData", () => {
    it("returns true if any guest data exists", async () => {
      (appDb.markers.count as any).mockResolvedValueOnce(0);
      (appDb.layers.count as any).mockResolvedValueOnce(2);
      (appDb.settings.count as any).mockResolvedValueOnce(0);
      expect(await migrationService.hasGuestData()).toBe(true);
    });

    it("returns false if no guest data exists", async () => {
      (appDb.markers.count as any).mockResolvedValueOnce(0);
      (appDb.layers.count as any).mockResolvedValueOnce(0);
      (appDb.settings.count as any).mockResolvedValueOnce(0);
      expect(await migrationService.hasGuestData()).toBe(false);
    });
  });

  describe("migrateGuestDataToFirestore", () => {
    it("merges and migrates all guest data, then clears guest DB", async () => {
      (appDb.markers.toArray as any).mockResolvedValueOnce([{ id: "a" }]);
      vi.spyOn(markersService, "load").mockResolvedValueOnce([
        {
          id: "b",
          name: "",
          coordinates: [0, 0],
          visible: false,
        },
      ]);
      vi.spyOn(markersService, "save").mockResolvedValueOnce(undefined);

      (appDb.layers.toArray as any).mockResolvedValueOnce([{ id: "x" }]);
      vi.spyOn(layersService, "load").mockResolvedValueOnce([
        { id: "y", name: "", color: "", countries: [], visible: false },
      ]);
      vi.spyOn(layersService, "save").mockResolvedValueOnce(undefined);

      (appDb.settings.get as any).mockResolvedValueOnce({
        id: "main",
        theme: "dark",
        account: {},
        display: {},
        privacy: {},
        map: {},
      });
      vi.spyOn(settingsService, "save").mockResolvedValueOnce(undefined);

      await migrationService.migrateGuestDataToFirestore();

      expect(markersService.save).toHaveBeenCalledWith([
        { id: "a" },
        { id: "b", name: "", coordinates: [0, 0], visible: false },
      ]);
      expect(appDb.markers.clear).toHaveBeenCalled();

      expect(layersService.save).toHaveBeenCalledWith([
        { id: "x" },
        { id: "y", name: "", color: "", countries: [], visible: false },
      ]);
      expect(appDb.layers.clear).toHaveBeenCalled();

      expect(settingsService.save).toHaveBeenCalledWith({
        id: "main",
        theme: "dark",
        account: {},
        display: {},
        privacy: {},
        map: {},
      });
      expect(appDb.settings.clear).toHaveBeenCalled();
    });

    it("does not save settings if none exist", async () => {
      (appDb.markers.toArray as any).mockResolvedValueOnce([]);
      vi.spyOn(markersService, "load").mockResolvedValueOnce([]);
      vi.spyOn(markersService, "save").mockResolvedValueOnce(undefined);

      (appDb.layers.toArray as any).mockResolvedValueOnce([]);
      vi.spyOn(layersService, "load").mockResolvedValueOnce([]);
      vi.spyOn(layersService, "save").mockResolvedValueOnce(undefined);

      (appDb.settings.get as any).mockResolvedValueOnce(undefined);

      await migrationService.migrateGuestDataToFirestore();

      expect(settingsService.save).not.toHaveBeenCalled();
      expect(appDb.settings.clear).not.toHaveBeenCalled();
    });
  });
});
