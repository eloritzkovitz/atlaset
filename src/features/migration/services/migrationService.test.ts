// src/features/migration/services/migrationService.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { migrationService } from "./migrationService";
import { countryListService } from "@features/atlas/countries/services/countryListService";
import { layersService } from "@features/atlas/layers/services/layersService";
import { markersService } from "@features/atlas/markers/services/markersService";
import { settingsService } from "@features/settings/core/services/settingsService";
import { appDb } from "@lib/db";
import { getDocData, getPaths } from "@lib/firebase";

// --- Mocks Setup ---
vi.mock("@features/atlas/countries/services/countryListService", () => ({
  countryListService: { add: vi.fn() },
}));
vi.mock("@features/atlas/layers/services/layersService", () => ({
  layersService: { add: vi.fn() },
}));
vi.mock("@features/atlas/markers/services/markersService", () => ({
  markersService: { add: vi.fn() },
}));
vi.mock("@features/settings/core/services/settingsService", () => ({
  settingsService: { save: vi.fn() },
}));

vi.mock("@lib/firebase", () => ({
  getDocData: vi.fn(),
  getPaths: {
    settingsDoc: vi.fn((uid: string) => `users/${uid}/settings/main`),
  },
}));

// Define mock factory inline to avoid hoisting scope errors
vi.mock("@lib/db", () => {
  const createMockTable = () => ({
    count: vi.fn(),
    clear: vi.fn(),
    toArray: vi.fn(),
    get: vi.fn(),
  });

  return {
    appDb: {
      countryLists: createMockTable(),
      layers: createMockTable(),
      markers: createMockTable(),
      settings: createMockTable(),
    },
  };
});

describe("migrationService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- hasLocalData ---
  describe("hasLocalData", () => {
    it("returns true when any table has counts greater than 0", async () => {
      vi.mocked(appDb.countryLists.count).mockResolvedValue(0);
      vi.mocked(appDb.layers.count).mockResolvedValue(1);
      vi.mocked(appDb.markers.count).mockResolvedValue(0);
      vi.mocked(appDb.settings.count).mockResolvedValue(0);

      const result = await migrationService.hasLocalData();
      expect(result).toBe(true);
    });

    it("returns false when all tables are empty", async () => {
      vi.mocked(appDb.countryLists.count).mockResolvedValue(0);
      vi.mocked(appDb.layers.count).mockResolvedValue(0);
      vi.mocked(appDb.markers.count).mockResolvedValue(0);
      vi.mocked(appDb.settings.count).mockResolvedValue(0);

      const result = await migrationService.hasLocalData();
      expect(result).toBe(false);
    });
  });

  // --- clearLocalData ---
  describe("clearLocalData", () => {
    it("clears all four Dexie tables", async () => {
      await migrationService.clearLocalData();

      expect(appDb.countryLists.clear).toHaveBeenCalledTimes(1);
      expect(appDb.layers.clear).toHaveBeenCalledTimes(1);
      expect(appDb.markers.clear).toHaveBeenCalledTimes(1);
      expect(appDb.settings.clear).toHaveBeenCalledTimes(1);
    });
  });

  // --- migrate ---
  describe("migrate", () => {
    const userId = "user-123";

    beforeEach(() => {
      vi.mocked(appDb.countryLists.toArray).mockResolvedValue([]);
      vi.mocked(appDb.layers.toArray).mockResolvedValue([]);
      vi.mocked(appDb.markers.toArray).mockResolvedValue([]);
      vi.mocked(appDb.settings.get).mockResolvedValue(null);
    });

    it("skips service calls when local tables are empty", async () => {
      await migrationService.migrate(userId);

      expect(countryListService.add).not.toHaveBeenCalled();
      expect(layersService.add).not.toHaveBeenCalled();
      expect(markersService.add).not.toHaveBeenCalled();
      expect(settingsService.save).not.toHaveBeenCalled();

      // migrateTable early-returns when empty, so clear() is only called once via clearLocalData()
      expect(appDb.countryLists.clear).toHaveBeenCalledTimes(1);
      expect(appDb.settings.clear).toHaveBeenCalledTimes(1);
    });

    it("migrates table items to Firestore services and clears local tables", async () => {
      const mockList = { id: "list-1" };
      const mockLayer = { id: "layer-1" };
      const mockMarker = { id: "marker-1" };

      vi.mocked(appDb.countryLists.toArray).mockResolvedValue([
        mockList as any,
      ]);
      vi.mocked(appDb.layers.toArray).mockResolvedValue([mockLayer as any]);
      vi.mocked(appDb.markers.toArray).mockResolvedValue([mockMarker as any]);

      await migrationService.migrate(userId);

      expect(countryListService.add).toHaveBeenCalledWith(mockList);
      expect(layersService.add).toHaveBeenCalledWith(mockLayer);
      expect(markersService.add).toHaveBeenCalledWith(mockMarker);

      expect(appDb.countryLists.clear).toHaveBeenCalled();
      expect(appDb.layers.clear).toHaveBeenCalled();
      expect(appDb.markers.clear).toHaveBeenCalled();
    });

    it("saves local settings if no existing settings are found in Firestore", async () => {
      const mockLocalSettings = { mapTheme: "dark" };
      vi.mocked(appDb.settings.get).mockResolvedValue(mockLocalSettings);
      vi.mocked(getDocData).mockResolvedValue(null);

      await migrationService.migrate(userId);

      expect(getPaths.settingsDoc).toHaveBeenCalledWith(userId);
      expect(getDocData).toHaveBeenCalledWith("users/user-123/settings/main");
      expect(settingsService.save).toHaveBeenCalledWith(mockLocalSettings);
    });

    it("does NOT save local settings if Firestore settings already exist", async () => {
      const mockLocalSettings = { mapTheme: "dark" };
      const mockCloudSettings = { mapTheme: "light" };

      vi.mocked(appDb.settings.get).mockResolvedValue(mockLocalSettings);
      vi.mocked(getDocData).mockResolvedValue(mockCloudSettings);

      await migrationService.migrate(userId);

      expect(settingsService.save).not.toHaveBeenCalled();
    });
  });
});
