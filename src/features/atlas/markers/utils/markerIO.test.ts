import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  importMarkersFromFile,
  exportMarkersToFile,
  parseAndNormalizeMarkers,
  serializeMarkers,
} from "./markerIO";
import * as utils from "@utils";
import type { Marker } from "../types";

describe("markerIO utils", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const createMockEvent = (file?: File) =>
    ({
      target: {
        files: file ? [file] : null,
        value: "markers.json",
      },
    }) as unknown as React.ChangeEvent<HTMLInputElement>;

  const existingMarker: Marker = {
    id: "m1",
    name: "Israel",
    isoCode: "ISR",
    order: 0,
  } as Marker;

  describe("importMarkersFromFile", () => {
    it("does nothing if no file is selected", async () => {
      const importMarkers = vi.fn();
      await importMarkersFromFile(
        createMockEvent(undefined),
        [],
        importMarkers,
      );
      expect(importMarkers).not.toHaveBeenCalled();
    });

    it("handles parsing errors via onError callback", async () => {
      const importMarkers = vi.fn();
      const onError = vi.fn();
      const invalidFile = new File(["not json"], "bad.json", {
        type: "application/json",
      });

      await importMarkersFromFile(
        createMockEvent(invalidFile),
        [],
        importMarkers,
        onError,
      );

      expect(onError).toHaveBeenCalledWith(expect.any(Error));
      expect(importMarkers).not.toHaveBeenCalled();
    });

    it("filters out duplicates based on existing ISO codes, ignores invalid ISOs, and updates order index", async () => {
      const importMarkers = vi.fn();

      const importedData = [
        { name: "Israel Duplicate", isoCode: "ISR" },
        { name: "France", isoCode: "FRA" },
        { name: "France Duplicate", isoCode: "FRA" },
        { name: "No ISO Marker" },
      ];

      const file = new File([JSON.stringify(importedData)], "markers.json", {
        type: "application/json",
      });

      await importMarkersFromFile(
        createMockEvent(file),
        [existingMarker],
        importMarkers,
      );

      expect(importMarkers).toHaveBeenCalledTimes(1);
      const result = importMarkers.mock.calls[0][0];

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ id: "m1", isoCode: "ISR", order: 0 });
      expect(result[1]).toMatchObject({ isoCode: "FRA", order: 1 });
    });
  });

  describe("parseAndNormalizeMarkers and serializeMarkers", () => {
    it("parses single objects or raw arrays interchangeably and generates missing IDs", () => {
      const rawWithoutId = { name: "Japan", isoCode: "JPN" };
      const rawWithId = { id: "existing-id", name: "Italy", isoCode: "ITA" };

      const parsedMissingId = parseAndNormalizeMarkers(
        JSON.stringify(rawWithoutId),
      );
      expect(parsedMissingId[0].id).toBeDefined();

      const parsedWithId = parseAndNormalizeMarkers(JSON.stringify(rawWithId));
      expect(parsedWithId[0].id).toBe("existing-id");

      expect(
        parseAndNormalizeMarkers(JSON.stringify([rawWithoutId])),
      ).toHaveLength(1);
    });

    it("serializes markers and strips volatile fields", () => {
      const marker = {
        id: "1",
        name: "Italy",
        isoCode: "ITA",
        order: 1,
      } as Marker;
      const expectedOutput = [{ name: "Italy", isoCode: "ITA" }];

      expect(serializeMarkers(marker)).toBe(
        JSON.stringify(expectedOutput, null, 2),
      );
    });
  });

  describe("exportMarkersToFile", () => {
    it("returns early when markers input is nullish", () => {
      const exportToFileSpy = vi.spyOn(utils, "exportToFile");
      exportMarkersToFile(null as unknown as Marker);
      expect(exportToFileSpy).not.toHaveBeenCalled();
    });

    it("delegates marker export to exportToFile utility with correct omitted fields", () => {
      const exportToFileSpy = vi
        .spyOn(utils, "exportToFile")
        .mockImplementation(() => {});

      exportMarkersToFile([existingMarker]);

      expect(exportToFileSpy).toHaveBeenCalledWith(
        [existingMarker],
        undefined,
        ["id", "order", "visible"],
        "marker",
      );
    });
  });
});
