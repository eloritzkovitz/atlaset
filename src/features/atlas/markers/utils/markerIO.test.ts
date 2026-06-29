import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Coordinates } from "@features/atlas/map";
import {
  importMarkersFromFile,
  parseAndNormalizeMarkers,
  serializeMarkers,
  exportMarkersToFile,
} from "./markerIO";

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
    coordinates: [1, 2] as Coordinates,
    visible: true,
    order: 1,
  };

  describe("importMarkersFromFile", () => {
    it("assigns id if missing", () => {
      const importMarkers = vi.fn();
      const rawData = { ...sampleMarker, id: undefined };
      mockFileReaderResult(JSON.stringify([rawData]));

      importMarkersFromFile(createMockEvent([new Blob()]), importMarkers);

      expect(importMarkers.mock.calls[0][0][0].id).toBeDefined();
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
      const expectedOutput = [{ name: "Marker", coordinates: [1, 2] }];
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
