import { describe, it, expect, vi, beforeEach } from "vitest";
import Papa from "papaparse";
import * as jsonUtils from "@utils/json";
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
      const spy = vi.spyOn(document, "createElement");
      exportTripsToCSV([]);
      expect(spy).not.toHaveBeenCalled();
    });

    it("generates csv text stripping out the ID column and triggers a simulated click", () => {
      const mockAnchor = {
        setAttribute: vi.fn(),
        click: vi.fn(),
      } as unknown as HTMLAnchorElement;

      vi.spyOn(document, "createElement").mockImplementation(
        (tagName: string) => {
          if (tagName === "a") return mockAnchor;
          return document.createElement(tagName);
        },
      );

      vi.spyOn(document.body, "appendChild").mockImplementation((node) => node);
      vi.spyOn(document.body, "removeChild").mockImplementation((node) => node);

      window.URL.createObjectURL = vi.fn(() => "blob:url");
      window.URL.revokeObjectURL = vi.fn();

      exportTripsToCSV([sampleTrip]);

      expect(mockAnchor.setAttribute).toHaveBeenCalledWith("href", "blob:url");
      expect(mockAnchor.setAttribute).toHaveBeenCalledWith(
        "download",
        "trips.csv",
      );
      expect(mockAnchor.click).toHaveBeenCalled();
      expect(document.body.removeChild).toHaveBeenCalledWith(mockAnchor);
      expect(window.URL.revokeObjectURL).toHaveBeenCalledWith("blob:url");
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
