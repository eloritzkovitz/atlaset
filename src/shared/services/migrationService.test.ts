import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@utils/db", () => ({
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
vi.mock("../../features/trips/services/tripsService", () => ({
  tripsService: {
    load: vi.fn(),
    save: vi.fn(),
  },
}));

import { appDb } from "@utils/db";
import { layersService } from "../../features/atlas/layers/services/layersService";
import { markersService } from "../../features/atlas/markers/services/markersService";
import { settingsService } from "../../features/settings/services/settingsService";
import { tripsService } from "../../features/trips/services/tripsService";
import { migrationService } from "./migrationService";
import { resetAllMocks } from "../test-utils/mockDbAndFirestore";

describe("migrationService", () => {
  beforeEach(() => {
    resetAllMocks(
      appDb.markers,
      appDb.layers,
      appDb.settings,
      appDb.trips,
      markersService,
      layersService,
      settingsService,
      tripsService
    );
  });

  describe("hasGuestData", () => {
    it("returns true if any guest data exists", async () => {
      (appDb.markers.count as any).mockResolvedValueOnce(0);
      (appDb.layers.count as any).mockResolvedValueOnce(2);
      (appDb.settings.count as any).mockResolvedValueOnce(0);
      (appDb.trips.count as any).mockResolvedValueOnce(0);
      expect(await migrationService.hasGuestData()).toBe(true);
    });

    it("returns false if no guest data exists", async () => {
      (appDb.markers.count as any).mockResolvedValueOnce(0);
      (appDb.layers.count as any).mockResolvedValueOnce(0);
      (appDb.settings.count as any).mockResolvedValueOnce(0);
      (appDb.trips.count as any).mockResolvedValueOnce(0);
      expect(await migrationService.hasGuestData()).toBe(false);
    });
  });

  describe("migrateGuestDataToFirestore", () => {
    it("merges and migrates all guest data, then clears guest DB", async () => {
      // Markers
      (appDb.markers.toArray as any).mockResolvedValueOnce([{ id: "a" }]);
      vi.spyOn(markersService, "load").mockResolvedValueOnce([
        {
          id: "b",
          name: "",
          latitude: 0,
          longitude: 0,
          visible: false,
        },
      ]);
      vi.spyOn(markersService, "save").mockResolvedValueOnce(undefined);

      // Layers
      (appDb.layers.toArray as any).mockResolvedValueOnce([{ id: "x" }]);
      vi.spyOn(layersService, "load").mockResolvedValueOnce([
        { id: "y", name: "", color: "", countries: [], visible: false },
      ]);
      vi.spyOn(layersService, "save").mockResolvedValueOnce(undefined);

      // Settings
      (appDb.settings.get as any).mockResolvedValueOnce({
        id: "main",
        theme: "dark",
        account: {},
        display: {},
        map: {},
        layers: {},
      });
      vi.spyOn(settingsService, "save").mockResolvedValueOnce(undefined);

      // Trips
      (appDb.trips.toArray as any).mockResolvedValueOnce([{ id: "t1" }]);
      vi.spyOn(tripsService, "load").mockResolvedValueOnce([
        {
          id: "t2",
          name: "",
          countryCodes: [],
          startDate: "",
          endDate: "",
          fullDays: 0,
        },
      ]);
      vi.spyOn(tripsService, "save").mockResolvedValueOnce(undefined);

      await migrationService.migrateGuestDataToFirestore();

      // Markers merged and saved
      expect(markersService.save).toHaveBeenCalledWith([
        { id: "a" },
        { id: "b", name: "", latitude: 0, longitude: 0, visible: false },
      ]);
      expect(appDb.markers.clear).toHaveBeenCalled();

      // Layers merged and saved
      expect(layersService.save).toHaveBeenCalledWith([
        { id: "x" },
        { id: "y", name: "", color: "", countries: [], visible: false },
      ]);
      expect(appDb.layers.clear).toHaveBeenCalled();

      // Settings saved and cleared
      expect(settingsService.save).toHaveBeenCalledWith({
        id: "main",
        theme: "dark",
        account: {},
        display: {},
        map: {},
        layers: {},
      });
      expect(appDb.settings.clear).toHaveBeenCalled();

      // Trips merged and saved
      expect(tripsService.save).toHaveBeenCalledWith([
        { id: "t1" },
        {
          id: "t2",
          name: "",
          countryCodes: [],
          startDate: "",
          endDate: "",
          fullDays: 0,
        },
      ]);
      expect(appDb.trips.clear).toHaveBeenCalled();
    });

    it("does not save settings if none exist", async () => {
      (appDb.markers.toArray as any).mockResolvedValueOnce([]);
      vi.spyOn(markersService, "load").mockResolvedValueOnce([]);
      vi.spyOn(markersService, "save").mockResolvedValueOnce(undefined);

      (appDb.layers.toArray as any).mockResolvedValueOnce([]);
      vi.spyOn(layersService, "load").mockResolvedValueOnce([]);
      vi.spyOn(layersService, "save").mockResolvedValueOnce(undefined);

      (appDb.settings.get as any).mockResolvedValueOnce(undefined);

      (appDb.trips.toArray as any).mockResolvedValueOnce([]);
      vi.spyOn(tripsService, "load").mockResolvedValueOnce([]);
      vi.spyOn(tripsService, "save").mockResolvedValueOnce(undefined);

      await migrationService.migrateGuestDataToFirestore();

      expect(settingsService.save).not.toHaveBeenCalled();
      expect(appDb.settings.clear).not.toHaveBeenCalled();
    });
  });
});
