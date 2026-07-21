import { vi, describe, it, expect, beforeEach } from "vitest";

const { mockDb } = vi.hoisted(() => ({
  mockDb: {
    countryLists: {
      count: vi.fn(),
      toArray: vi.fn(),
      clear: vi.fn(),
      add: vi.fn(),
    },
    layers: { count: vi.fn(), toArray: vi.fn(), clear: vi.fn(), add: vi.fn() },
    markers: { count: vi.fn(), toArray: vi.fn(), clear: vi.fn(), add: vi.fn() },
    settings: { count: vi.fn(), get: vi.fn(), clear: vi.fn(), add: vi.fn() },
  },
}));

vi.mock("@app/db", () => ({ appDb: mockDb }));

vi.mock("../../features/countries/services/countryListService", () => ({
  countryListService: { add: vi.fn() },
}));
vi.mock("../../features/atlas/layers/services/layersService", () => ({
  layersService: { add: vi.fn() },
}));
vi.mock("../../features/atlas/markers/services/markersService", () => ({
  markersService: { add: vi.fn() },
}));
vi.mock("../../features/settings/common/services/settingsService", () => ({
  settingsService: { save: vi.fn() },
}));

import { appDb } from "@app/db";
import { countryListService } from "@features/countries";
import { settingsService } from "@features/settings/common/services/settingsService";
import { migrationService } from "./migrationService";

describe("migrationService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("hasGuestData", () => {
    it("returns true if any data exists", async () => {
      vi.spyOn(appDb.countryLists, "count").mockResolvedValue(1);
      vi.spyOn(appDb.layers, "count").mockResolvedValue(0);
      vi.spyOn(appDb.markers, "count").mockResolvedValue(0);
      vi.spyOn(appDb.settings, "count").mockResolvedValue(0);

      expect(await migrationService.hasGuestData()).toBe(true);
    });

    it("returns false if no data exists", async () => {
      [appDb.countryLists, appDb.layers, appDb.markers, appDb.settings].forEach(
        (db) => vi.spyOn(db, "count").mockResolvedValue(0),
      );
      expect(await migrationService.hasGuestData()).toBe(false);
    });
  });

  describe("migrateGuestDataToFirestore", () => {
    it("migrates all tables and clears them", async () => {
      const mockList = { id: "l1" };
      vi.spyOn(appDb.countryLists, "toArray").mockResolvedValue([mockList]);
      vi.spyOn(appDb.layers, "toArray").mockResolvedValue([]);
      vi.spyOn(appDb.markers, "toArray").mockResolvedValue([]);
      vi.spyOn(appDb.settings, "get").mockResolvedValue(null);

      await migrationService.migrateGuestDataToFirestore();

      expect(countryListService.add).toHaveBeenCalledWith(mockList);
      expect(appDb.countryLists.clear).toHaveBeenCalled();
    });

    it("migrates settings if they exist", async () => {
      const mockSettings = { id: "main" };
      vi.spyOn(appDb.countryLists, "toArray").mockResolvedValue([]);
      vi.spyOn(appDb.layers, "toArray").mockResolvedValue([]);
      vi.spyOn(appDb.markers, "toArray").mockResolvedValue([]);
      vi.spyOn(appDb.settings, "get").mockResolvedValue(mockSettings);

      await migrationService.migrateGuestDataToFirestore();

      expect(settingsService.save).toHaveBeenCalledWith(mockSettings);
      expect(appDb.settings.clear).toHaveBeenCalled();
    });
  });
});
