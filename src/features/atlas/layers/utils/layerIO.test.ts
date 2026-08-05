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
    vi.restoreAllMocks();
  });

  const createMockEvent = (file?: File) =>
    ({
      target: {
        files: file ? [file] : null,
        value: "layers.json",
      },
    }) as unknown as React.ChangeEvent<HTMLInputElement>;

  const sampleLayer = {
    id: "1",
    name: "Layer",
    color: "#fff",
    countries: [],
    visible: true,
    order: 1,
  };

  describe("importLayersFromFile", () => {
    it("does nothing if no file is selected", async () => {
      const importLayers = vi.fn();
      await importLayersFromFile(createMockEvent(undefined), importLayers);
      expect(importLayers).not.toHaveBeenCalled();
    });

    it("handles parsing errors via onError callback", async () => {
      const importLayers = vi.fn();
      const onError = vi.fn();
      const invalidFile = new File(["not json"], "bad.json", {
        type: "application/json",
      });

      await importLayersFromFile(
        createMockEvent(invalidFile),
        importLayers,
        onError,
      );
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
      expect(importLayers).not.toHaveBeenCalled();
    });

    it("imports single objects and arrays, trimming colors and backfilling IDs", async () => {
      const importLayers = vi.fn();

      const rawData = {
        ...sampleLayer,
        id: undefined,
        color: " rgba(255, 0, 0, 0.5) ",
        fillColor: "rgba(0, 255, 0, 1)",
        strokeColor: "rgba(0, 0, 255, 0.25)",
      };

      const file = new File([JSON.stringify([rawData])], "layers.json", {
        type: "application/json",
      });

      await importLayersFromFile(createMockEvent(file), importLayers);

      expect(importLayers).toHaveBeenCalledTimes(1);
      const payload = importLayers.mock.calls[0][0][0];
      expect(payload.id).toBeDefined();
      expect(payload.color).toBe("rgba(255, 0, 0, 0.5)");
      expect(payload.fillColor).toBe("rgba(0, 255, 0, 1)");
      expect(payload.strokeColor).toBe("rgba(0, 0, 255, 0.25)");
    });
  });

  describe("parseAndNormalizeLayers and serializeLayers", () => {
    it("normalizes input into array format", () => {
      expect(
        parseAndNormalizeLayers(JSON.stringify(sampleLayer)),
      ).toMatchObject([sampleLayer]);
    });

    it("serializes layers stripping volatile runtime fields", () => {
      const expectedOutput = [{ name: "Layer", color: "#fff", countries: [] }];
      expect(serializeLayers(sampleLayer)).toBe(
        JSON.stringify(expectedOutput, null, 2),
      );
    });
  });

  describe("exportLayersToFile", () => {
    it("delegates layer export with correct omitted fields", () => {
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
