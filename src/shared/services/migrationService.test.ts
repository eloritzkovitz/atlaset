import { vi, describe, it, expect, beforeEach } from "vitest";
import { hasGuestData, migrateGuestDataToFirestore } from "./migrationService";
import { resetAllMocks } from "@test-utils/mockDbAndFirestore";

// Mocks for appDb and services
vi.mock("@utils/db", () => ({
  appDb: {
    markers: {
      count: vi.fn(),
      toArray: vi.fn(),
      clear: vi.fn(),
    },
    overlays: {
      count: vi.fn(),
      toArray: vi.fn(),
      clear: vi.fn(),
    },
    settings: {
      count: vi.fn(),
      get: vi.fn(),
      clear: vi.fn(),
    },
    trips: {
      count: vi.fn(),
      toArray: vi.fn(),
      clear: vi.fn(),
    },
  },
}));

vi.mock("./markersService", () => ({
  markersService: {
    load: vi.fn(),
    save: vi.fn(),
  },
}));
vi.mock("./overlaysService", () => ({
  overlaysService: {
    load: vi.fn(),
    save: vi.fn(),
  },
}));
vi.mock("./settingsService", () => ({
  settingsService: {
    save: vi.fn(),
  },
}));
vi.mock("./tripsService", () => ({
  tripsService: {
    load: vi.fn(),
    save: vi.fn(),
  },
}));

const { appDb } = await import("@utils/db");
const { markersService } = await import("./markersService");
const { overlaysService } = await import("./overlaysService");
const { settingsService } = await import("./settingsService");
const { tripsService } = await import("./tripsService");

describe("migrationService", () => {
  beforeEach(() => {
    resetAllMocks(
      appDb.markers,
      appDb.overlays,
      appDb.settings,
      appDb.trips,
      markersService,
      overlaysService,
      settingsService,
      tripsService
    );
  });

  describe("hasGuestData", () => {
    it("returns true if any guest data exists", async () => {
      (appDb.markers.count as any).mockResolvedValueOnce(0);
      (appDb.overlays.count as any).mockResolvedValueOnce(2);
      (appDb.settings.count as any).mockResolvedValueOnce(0);
      (appDb.trips.count as any).mockResolvedValueOnce(0);
      expect(await hasGuestData()).toBe(true);
    });

    it("returns false if no guest data exists", async () => {
      (appDb.markers.count as any).mockResolvedValueOnce(0);
      (appDb.overlays.count as any).mockResolvedValueOnce(0);
      (appDb.settings.count as any).mockResolvedValueOnce(0);
      (appDb.trips.count as any).mockResolvedValueOnce(0);
      expect(await hasGuestData()).toBe(false);
    });
  });

  describe("migrateGuestDataToFirestore", () => {
    it("merges and migrates all guest data, then clears guest DB", async () => {
      // Markers
      (appDb.markers.toArray as any).mockResolvedValueOnce([{ id: "a" }]);
      (markersService.load as any).mockResolvedValueOnce([{ id: "b" }]);
      (markersService.save as any).mockResolvedValueOnce(undefined);

      // Overlays
      (appDb.overlays.toArray as any).mockResolvedValueOnce([{ id: "x" }]);
      (overlaysService.load as any).mockResolvedValueOnce([{ id: "y" }]);
      (overlaysService.save as any).mockResolvedValueOnce(undefined);

      // Settings
      (appDb.settings.get as any).mockResolvedValueOnce({
        id: "main",
        theme: "dark",
      });
      (settingsService.save as any).mockResolvedValueOnce(undefined);

      // Trips
      (appDb.trips.toArray as any).mockResolvedValueOnce([{ id: "t1" }]);
      (tripsService.load as any).mockResolvedValueOnce([{ id: "t2" }]);
      (tripsService.save as any).mockResolvedValueOnce(undefined);

      await migrateGuestDataToFirestore();

      // Markers merged and saved
      expect(markersService.save).toHaveBeenCalledWith([
        { id: "a" },
        { id: "b" },
      ]);
      expect(appDb.markers.clear).toHaveBeenCalled();

      // Overlays merged and saved
      expect(overlaysService.save).toHaveBeenCalledWith([
        { id: "x" },
        { id: "y" },
      ]);
      expect(appDb.overlays.clear).toHaveBeenCalled();

      // Settings saved and cleared
      expect(settingsService.save).toHaveBeenCalledWith({
        id: "main",
        theme: "dark",
      });
      expect(appDb.settings.clear).toHaveBeenCalled();

      // Trips merged and saved
      expect(tripsService.save).toHaveBeenCalledWith([
        { id: "t1" },
        { id: "t2" },
      ]);
      expect(appDb.trips.clear).toHaveBeenCalled();
    });

    it("does not save settings if none exist", async () => {
      (appDb.markers.toArray as any).mockResolvedValueOnce([]);
      (markersService.load as any).mockResolvedValueOnce([]);
      (markersService.save as any).mockResolvedValueOnce(undefined);

      (appDb.overlays.toArray as any).mockResolvedValueOnce([]);
      (overlaysService.load as any).mockResolvedValueOnce([]);
      (overlaysService.save as any).mockResolvedValueOnce(undefined);

      (appDb.settings.get as any).mockResolvedValueOnce(undefined);

      (appDb.trips.toArray as any).mockResolvedValueOnce([]);
      (tripsService.load as any).mockResolvedValueOnce([]);
      (tripsService.save as any).mockResolvedValueOnce(undefined);

      await migrateGuestDataToFirestore();

      expect(settingsService.save).not.toHaveBeenCalled();
      expect(appDb.settings.clear).not.toHaveBeenCalled();
    });
  });
});
