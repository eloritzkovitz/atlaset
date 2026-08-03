import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  importLayersFromFile,
  exportLayersToFile,
  parseAndNormalizeLayers,
  serializeLayers,
} from "./layerIO";
import * as utils from "@utils";

describe("layerIO utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.alert = vi.fn();
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

  const sampleLayer = {
    id: "1",
    name: "Layer",
    color: "#fff",
    countries: [],
    visible: true,
    order: 1,
  };

  describe("importLayersFromFile", () => {
    it("does nothing if no file is selected", () => {
      const importLayers = vi.fn();
      importLayersFromFile(createMockEvent(undefined), importLayers);
      expect(importLayers).not.toHaveBeenCalled();
    });

    it("alerts on invalid JSON", () => {
      const importLayers = vi.fn();
      mockFileReaderResult("not json");

      importLayersFromFile(createMockEvent([new Blob()]), importLayers);
      expect(global.alert).toHaveBeenCalled();
    });

    it("imports both single objects and raw arrays correctly", () => {
      const importLayers = vi.fn();

      mockFileReaderResult(JSON.stringify(sampleLayer));
      importLayersFromFile(createMockEvent([new Blob()]), importLayers);
      expect(importLayers).toHaveBeenLastCalledWith([
        expect.objectContaining({ id: "1" }),
      ]);

      mockFileReaderResult(JSON.stringify([sampleLayer]));
      importLayersFromFile(createMockEvent([new Blob()]), importLayers);
      expect(importLayers).toHaveBeenLastCalledWith([
        expect.objectContaining({ id: "1" }),
      ]);
    });

    it("normalizes rgba color structures and backfills missing IDs", () => {
      const importLayers = vi.fn();
      const rawData = {
        ...sampleLayer,
        id: undefined,
        color: "rgba(255, 0, 0, 0.5)",
        fillColor: "rgba(0, 255, 0, 1)",
        strokeColor: "rgba(0, 0, 255, 0.25)",
      };
      mockFileReaderResult(JSON.stringify([rawData]));

      importLayersFromFile(createMockEvent([new Blob()]), importLayers);

      const payload = importLayers.mock.calls[0][0][0];
      expect(payload.id).toBeDefined();
      expect(payload.color).toBe("#ff00007f");
      expect(payload.fillColor).toBe("#00ff00ff");
      expect(payload.strokeColor).toBe("#0000ff3f");
    });
  });

  describe("parseAndNormalizeLayers and serializeLayers", () => {
    it("parses single objects or arrays interchangeably to array instances", () => {
      expect(
        parseAndNormalizeLayers(JSON.stringify(sampleLayer)),
      ).toMatchObject([sampleLayer]);
      expect(
        parseAndNormalizeLayers(JSON.stringify([sampleLayer])),
      ).toMatchObject([sampleLayer]);
    });

    it("serializes collections stripping out volatile runtime configurations", () => {
      const expectedOutput = [{ name: "Layer", color: "#fff", countries: [] }];
      const format = (data: any) => JSON.stringify(data, null, 2);

      expect(serializeLayers(sampleLayer)).toBe(format(expectedOutput));
      expect(serializeLayers([sampleLayer])).toBe(format(expectedOutput));
    });
  });

  describe("exportLayersToFile", () => {
    it("safely ignores nullish execution calls", () => {
      // @ts-expect-error
      expect(exportLayersToFile(undefined)).toBeUndefined();
    });

    it("delegates layer export to exportToFile utility", () => {
      const exportToFileSpy = vi
        .spyOn(utils, "exportToFile")
        .mockImplementation(() => {});

      exportLayersToFile([sampleLayer]);

      expect(exportToFileSpy).toHaveBeenCalledWith(
        [sampleLayer],
        undefined,
        ["id", "order", "visible", "listId"],
        "layer",
      );
    });
  });
});
