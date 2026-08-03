import { describe, it, expect, vi, beforeEach } from "vitest";
import Papa from "papaparse";
import * as jsonUtils from "@utils";
import {
  importTripsFromFile,
  exportTripsToCSV,
  exportTripsToJSON,
} from "./tripsIO";

vi.stubGlobal("crypto", {
  randomUUID: () => "mocked-uuid",
});

vi.mock("papaparse", () => ({
  default: {
    parse: vi.fn((_text, config) => {
      config.complete({
        data: [
          {
            name: "CSV Trip",
            countryCodes: ["FR"],
            startDate: "2023-01-01",
            endDate: "2023-01-05",
          },
        ],
      });
    }),
  },
}));

describe("tripsIO utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.alert = vi.fn();
  });

  const sampleTrip = {
    id: "1",
    name: "Paris Adventure",
    rating: -1,
    countryCodes: ["FR"],
    startDate: "2023-01-01",
    endDate: "2023-01-05",
    fullDays: 0,
  };

  const createMockFile = (name: string, content: string) => {
    const file = new Blob([content]) as any;
    file.name = name;
    file.text = () => Promise.resolve(content);
    return file;
  };

  describe("importTripsFromFile", () => {
    it("alerts on unsupported file types", async () => {
      const addTrip = vi.fn();
      const file = createMockFile("trips.txt", "some text");

      await importTripsFromFile(file, addTrip);

      expect(global.alert).toHaveBeenCalledWith("Unsupported file type.");
      expect(addTrip).not.toHaveBeenCalled();
    });

    it("alerts on invalid JSON structure", async () => {
      const addTrip = vi.fn();
      const file = createMockFile("trips.json", "bad json");

      await importTripsFromFile(file, addTrip);

      expect(global.alert).toHaveBeenCalledWith("Invalid JSON file.");
    });

    it("imports JSON trip arrays successfully", async () => {
      const addTrip = vi.fn().mockResolvedValue(undefined);

      await importTripsFromFile(
        createMockFile("trips.json", JSON.stringify([sampleTrip])),
        addTrip,
      );

      expect(global.alert).not.toHaveBeenCalled();
      expect(addTrip).toHaveBeenCalledTimes(1);
      expect(addTrip).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Paris Adventure",
          id: "mocked-uuid",
        }),
      );
    });

    it("parses and imports valid CSV lines using PapaParse", async () => {
      const addTrip = vi.fn().mockResolvedValue(undefined);
      const file = createMockFile(
        "trips.csv",
        "name,countryCodes,startDate,endDate\nCSV Trip,FR,2023-01-01,2023-01-05",
      );

      await importTripsFromFile(file, addTrip);

      expect(Papa.parse).toHaveBeenCalled();
      expect(addTrip).toHaveBeenCalledWith(
        expect.objectContaining({ name: "CSV Trip", id: "mocked-uuid" }),
      );
    });
  });

  describe("exportTripsToCSV", () => {
    it("safely bails if trips collection is empty", () => {
      const exportCSVSpy = vi
        .spyOn(jsonUtils, "exportToCSV")
        .mockImplementation(() => {});

      exportTripsToCSV([]);
      expect(exportCSVSpy).not.toHaveBeenCalled();
    });

    it("delegates csv generation and download orchestration", () => {
      const exportCSVSpy = vi
        .spyOn(jsonUtils, "exportToCSV")
        .mockImplementation(() => {});

      exportTripsToCSV([sampleTrip]);

      expect(exportCSVSpy).toHaveBeenCalledWith(
        [sampleTrip],
        expect.any(Array),
        "trips.csv",
      );
    });
  });

  describe("exportTripsToJSON", () => {
    it("delegates serialization and orchestration directly to the exportToFile utility", () => {
      const exportSpy = vi
        .spyOn(jsonUtils, "exportToFile")
        .mockImplementation(() => {});
      const trips = [sampleTrip];

      exportTripsToJSON(trips);

      expect(exportSpy).toHaveBeenCalledWith(trips, "trips.json", ["id"]);
    });
  });
});
