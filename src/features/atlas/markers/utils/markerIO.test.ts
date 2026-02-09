import type { Coordinates } from "@features/atlas/map";
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

  describe("importMarkersFromFile", () => {
    it("assigns id if missing", () => {
      const importMarkers = vi.fn();
      const markers = [
        {
          name: "Marker",
          coordinates: [1, 2] as Coordinates,
          visible: true,
        },
      ];
      const file = new Blob([JSON.stringify(markers)], {
        type: "application/json",
      });
      const event = {
        target: {
          files: [file],
          value: "",
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      const readAsText = vi.fn(function (this: any) {
        this.onload({ target: { result: JSON.stringify(markers) } });
      });
      (window as any).FileReader = function () {
        this.readAsText = readAsText;
      };
      importMarkersFromFile(event, importMarkers);
      expect(importMarkers.mock.calls[0][0][0].id).toBeDefined();
    });
  });

  describe("parseAndNormalizeMarkers and serializeMarkers", () => {
    it("parses a single marker object and returns array", () => {
      const single = {
        id: "1",
        name: "Marker",
        coordinates: [1, 2] as Coordinates,
        visible: true,
      };
      const result = parseAndNormalizeMarkers(JSON.stringify(single));
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toMatchObject(single);
    });

    it("parses an array of markers and returns array", () => {
      const arr = [
        {
          id: "1",
          name: "Marker",
          coordinates: [1, 2] as Coordinates,
          visible: true,
        },
        {
          id: "2",
          name: "Marker2",
          coordinates: [3, 4] as Coordinates,
          visible: false,
        },
      ];
      const result = parseAndNormalizeMarkers(JSON.stringify(arr));
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[1]).toMatchObject(arr[1]);
    });

    it("serializes a single marker as array JSON", () => {
      const single = {
        id: "1",
        name: "Marker",
        coordinates: [1, 2] as Coordinates,
        order: 1,
        visible: true,
      };
      const expected = [{ name: "Marker", coordinates: [1, 2] as Coordinates }];
      const json = serializeMarkers(single);
      expect(json).toBe(JSON.stringify(expected, null, 2));
    });

    it("serializes an array of markers as array JSON", () => {
      const arr = [
        {
          id: "1",
          name: "Marker",
          coordinates: [1, 2] as Coordinates,
          order: 1,
          visible: true,
        },
        {
          id: "2",
          name: "Marker2",
          coordinates: [3, 4] as Coordinates,
          order: 2,
          visible: false,
        },
      ];
      const expected = [
        { name: "Marker", coordinates: [1, 2] as Coordinates },
        { name: "Marker2", coordinates: [3, 4] as Coordinates },
      ];
      const json = serializeMarkers(arr);
      expect(json).toBe(JSON.stringify(expected, null, 2));
    });
  });

  describe("exportMarkersToFile", () => {
    it("does nothing if markers is falsy", () => {
      // @ts-expect-error
      expect(exportMarkersToFile(undefined)).toBeUndefined();
    });

    it("creates a download link and triggers click", () => {
      const markers: Marker[] = [
        {
          id: "1",
          name: "Marker",
          coordinates: [1, 2] as Coordinates,
          visible: true,
        },
      ];
      const createObjectURL = vi.fn(() => "blob:url");
      const revokeObjectURL = vi.fn();
      const click = vi.fn();
      const createElement = vi
        .spyOn(document, "createElement")
        .mockReturnValue({
          set href(_href: string) {},
          set download(_name: string) {},
          click,
        } as any);

      Object.defineProperty(window.URL, "createObjectURL", {
        value: createObjectURL,
      });
      Object.defineProperty(window.URL, "revokeObjectURL", {
        value: revokeObjectURL,
      });

      exportMarkersToFile(markers);

      expect(createObjectURL).toHaveBeenCalled();
      expect(click).toHaveBeenCalled();
      expect(revokeObjectURL).toHaveBeenCalledWith("blob:url");

      createElement.mockRestore();
    });
  });
});
