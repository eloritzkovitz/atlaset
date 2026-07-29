import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  importMarkersFromFile,
  parseAndNormalizeMarkers,
  serializeMarkers,
  exportMarkersToFile,
} from "./markerIO";
import type { Marker } from "../types";

describe("markerIO utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockEvent = (files?: any[]) =>
    ({
      target: { files, value: "" },
    }) as unknown as React.ChangeEvent<HTMLInputElement>;

  const mockFileReaderResult = (result: string) => {
    window.FileReader = function (this: any) {
      this.readAsText = () => {
        this.onload({ target: { result } });
      };
    } as any;
  };

  const sampleMarker = {
    id: "1",
    name: "Marker",
    isoCode: "US",
    color: "#ffffff",
    visible: true,
    order: 1,
  };

  describe("importMarkersFromFile", () => {
    it("assigns id if missing", async () => {
      const importMarkers = vi.fn();
      const rawData = { ...sampleMarker, id: undefined };
      mockFileReaderResult(JSON.stringify([rawData]));

      importMarkersFromFile(createMockEvent([new Blob()]), [], importMarkers);

      expect(importMarkers.mock.calls[0][0][0].id).toBeDefined();
    });

    it("filters out duplicates based on existing isoCodes and appends new markers", () => {
      const importMarkers = vi.fn();
      const existingMarkers: Marker[] = [
        { ...sampleMarker, id: "1", isoCode: "US", order: 0 },
        { ...sampleMarker, id: "2", isoCode: "FR", order: 1 },
      ];

      const importedFileContent = [
        { ...sampleMarker, id: "3", isoCode: "US" },
        { ...sampleMarker, id: "4", isoCode: "CA" },
        { ...sampleMarker, id: "5", isoCode: "CA" },
        { ...sampleMarker, id: "6", isoCode: "DE" },
      ];

      mockFileReaderResult(JSON.stringify(importedFileContent));

      importMarkersFromFile(
        createMockEvent([new Blob()]),
        existingMarkers,
        importMarkers,
      );

      const result = importMarkers.mock.calls[0][0];

      expect(result).toHaveLength(4);
      expect(result.map((m: Marker) => m.order)).toEqual([0, 1, 2, 3]);
      expect(result[2].isoCode).toBe("CA");
      expect(result[3].isoCode).toBe("DE");
    });
  });

  describe("parseAndNormalizeMarkers and serializeMarkers", () => {
    it("parses single objects or arrays interchangeably to array instances", () => {
      expect(
        parseAndNormalizeMarkers(JSON.stringify(sampleMarker)),
      ).toMatchObject([sampleMarker]);
      expect(
        parseAndNormalizeMarkers(JSON.stringify([sampleMarker])),
      ).toMatchObject([sampleMarker]);
    });

    it("serializes collections stripping out volatile runtime configurations", () => {
      const expectedOutput = [
        { name: "Marker", isoCode: "US", color: "#ffffff" },
      ];
      const format = (data: any) => JSON.stringify(data, null, 2);

      expect(serializeMarkers(sampleMarker)).toBe(format(expectedOutput));
      expect(serializeMarkers([sampleMarker])).toBe(format(expectedOutput));
    });
  });

  describe("exportMarkersToFile", () => {
    it("safely ignores nullish execution calls", () => {
      // @ts-expect-error
      expect(exportMarkersToFile(undefined)).toBeUndefined();
    });

    it("creates a download link and triggers click", () => {
      const click = vi.fn();
      vi.spyOn(document, "createElement").mockReturnValue({
        set href(_: any) {},
        set download(_: any) {},
        click,
      } as any);

      window.URL.createObjectURL = vi.fn(() => "blob:url");
      window.URL.revokeObjectURL = vi.fn();

      exportMarkersToFile([sampleMarker]);

      expect(window.URL.createObjectURL).toHaveBeenCalled();
      expect(click).toHaveBeenCalled();
      expect(window.URL.revokeObjectURL).toHaveBeenCalledWith("blob:url");
    });
  });
});
