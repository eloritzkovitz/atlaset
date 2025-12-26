import { vi, describe, it, expect, beforeEach } from "vitest";
import { migrationService } from "./migrationService";
import { resetAllMocks } from "../test-utils/mockDbAndFirestore";

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
const { markersService } = await import(
  "../../features/atlas/markers/services/markersService"
);
const { overlaysService } = await import(
  "../../features/atlas/overlays/services/overlaysService"
);
const { tripsService } = await import(
  "../../features/trips/services/tripsService"
);
const { settingsService } = await import(
  "../../features/settings/services/settingsService"
);

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
      expect(await migrationService.hasGuestData()).toBe(true);
    });

    it("returns false if no guest data exists", async () => {
      (appDb.markers.count as any).mockResolvedValueOnce(0);
      (appDb.overlays.count as any).mockResolvedValueOnce(0);
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

      // Overlays
      (appDb.overlays.toArray as any).mockResolvedValueOnce([{ id: "x" }]);
      vi.spyOn(overlaysService, "load").mockResolvedValueOnce([
        { id: "y", name: "", color: "", countries: [], visible: false },
      ]);
      vi.spyOn(overlaysService, "save").mockResolvedValueOnce(undefined);

      // Settings
      (appDb.settings.get as any).mockResolvedValueOnce({
        id: "main",
        theme: "dark",
        account: {},
        display: {},
        map: {},
        overlays: {},
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

      // Overlays merged and saved
      expect(overlaysService.save).toHaveBeenCalledWith([
        { id: "x" },
        { id: "y", name: "", color: "", countries: [], visible: false },
      ]);
      expect(appDb.overlays.clear).toHaveBeenCalled();

      // Settings saved and cleared
      expect(settingsService.save).toHaveBeenCalledWith({
        id: "main",
        theme: "dark",
        account: {},
        display: {},
        map: {},
        overlays: {},
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

      (appDb.overlays.toArray as any).mockResolvedValueOnce([]);
      vi.spyOn(overlaysService, "load").mockResolvedValueOnce([]);
      vi.spyOn(overlaysService, "save").mockResolvedValueOnce(undefined);

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
