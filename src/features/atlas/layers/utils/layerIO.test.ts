import {
  importLayersFromFile,
  exportLayersToFile,
  parseAndNormalizeLayers,
  serializeLayers,
} from "./layerIO";
import type { Layer } from "../types";

describe("layerIO utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("importLayersFromFile", () => {
    it("does nothing if no file is selected", () => {
      const importLayers = vi.fn();
      const event = {
        target: { files: undefined, value: "" },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      importLayersFromFile(event, importLayers);
      expect(importLayers).not.toHaveBeenCalled();
    });

    it("alerts on invalid JSON", () => {
      global.alert = vi.fn();
      const importLayers = vi.fn();
      const file = new Blob(["not json"], { type: "application/json" });
      const event = {
        target: {
          files: [file],
          value: "",
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      // Mock FileReader
      const onload = vi.fn();
      const readAsText = vi.fn(function (this: any) {
        this.onload({ target: { result: "not json" } });
      });
      (window as any).FileReader = function () {
        this.onload = onload;
        this.readAsText = readAsText;
      };

      importLayersFromFile(event, importLayers);
      expect(global.alert).toHaveBeenCalled();
    });

    it("imports a single layer object as array", () => {
      const importLayers = vi.fn();
      const singleLayer = {
        id: "1",
        name: "Layer",
        color: "#fff",
        countries: [],
        visible: true,
        order: 1,
      };
      const file = new Blob([JSON.stringify(singleLayer)], {
        type: "application/json",
      });
      const event = {
        target: {
          files: [file],
          value: "",
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      // Mock FileReader
      const readAsText = vi.fn(function (this: any) {
        this.onload({ target: { result: JSON.stringify(singleLayer) } });
      });
      (window as any).FileReader = function () {
        this.readAsText = readAsText;
      };

      importLayersFromFile(event, importLayers);
      expect(importLayers).toHaveBeenCalledWith([
        expect.objectContaining({ id: "1", name: "Layer" }),
      ]);
    });

    it("calls importLayers with imported layers array (array input)", () => {
      const importLayers = vi.fn();
      const layers: Layer[] = [
        {
          id: "1",
          name: "Layer",
          color: "#fff",
          countries: [],
          visible: true,
          order: 1,
        },
      ];
      const file = new Blob([JSON.stringify(layers)], {
        type: "application/json",
      });
      const event = {
        target: {
          files: [file],
          value: "",
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      // Mock FileReader
      const readAsText = vi.fn(function (this: any) {
        this.onload({ target: { result: JSON.stringify(layers) } });
      });
      (window as any).FileReader = function () {
        this.readAsText = readAsText;
      };

      importLayersFromFile(event, importLayers);
      expect(importLayers).toHaveBeenCalledWith([
        expect.objectContaining({ id: "1", name: "Layer" }),
      ]);
    });

    describe("parseAndNormalizeLayers and serializeLayers", () => {
      it("parses a single layer object and returns array", () => {
        const single = {
          id: "1",
          name: "Layer",
          color: "#fff",
          countries: [],
          visible: true,
          order: 1,
        };
        const result = parseAndNormalizeLayers(JSON.stringify(single));
        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toMatchObject(single);
      });

      it("parses an array of layers and returns array", () => {
        const arr = [
          {
            id: "1",
            name: "Layer",
            color: "#fff",
            countries: [],
            visible: true,
            order: 1,
          },
          {
            id: "2",
            name: "Layer2",
            color: "#000",
            countries: [],
            visible: false,
            order: 2,
          },
        ];
        const result = parseAndNormalizeLayers(JSON.stringify(arr));
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2);
        expect(result[1]).toMatchObject(arr[1]);
      });

      it("serializes a single layer as array JSON", () => {
        const single = {
          id: "1",
          name: "Layer",
          color: "#fff",
          countries: [],
          visible: true,
          order: 1,
        };
        const expected = [{ name: "Layer", color: "#fff", countries: [] }];
        const json = serializeLayers(single);
        expect(json).toBe(JSON.stringify(expected, null, 2));
      });

      it("serializes an array of layers as array JSON", () => {
        const arr = [
          {
            id: "1",
            name: "Layer",
            color: "#fff",
            countries: [],
            visible: true,
            order: 1,
          },
          {
            id: "2",
            name: "Layer2",
            color: "#000",
            countries: [],
            visible: false,
            order: 2,
          },
        ];
        const expected = [
          { name: "Layer", color: "#fff", countries: [] },
          { name: "Layer2", color: "#000", countries: [] },
        ];
        const json = serializeLayers(arr);
        expect(json).toBe(JSON.stringify(expected, null, 2));
      });
    });

    it("normalizes rgba color fields to hex", () => {
      const importLayers = vi.fn();
      const layers: Layer[] = [
        {
          id: "1",
          name: "Layer",
          color: "rgba(255, 0, 0, 0.5)",
          fillColor: "rgba(0, 255, 0, 1)",
          strokeColor: "rgba(0, 0, 255, 0.25)",
          countries: [],
          visible: true,
          order: 1,
        } as any,
      ];
      const file = new Blob([JSON.stringify(layers)], {
        type: "application/json",
      });
      const event = {
        target: {
          files: [file],
          value: "",
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      // Mock FileReader
      const readAsText = vi.fn(function (this: any) {
        this.onload({ target: { result: JSON.stringify(layers) } });
      });
      (window as any).FileReader = function () {
        this.readAsText = readAsText;
      };

      importLayersFromFile(event, importLayers);
      expect(importLayers).toHaveBeenCalledWith([
        expect.objectContaining({
          color: "#ff00007f",
          fillColor: "#00ff00ff",
          strokeColor: "#0000ff3f",
        }),
      ]);
    });

    it("assigns id if missing", () => {
      const importLayers = vi.fn();
      const layers = [
        {
          name: "Layer",
          color: "#fff",
          countries: [],
          visible: true,
          order: 1,
        },
      ];
      const file = new Blob([JSON.stringify(layers)], {
        type: "application/json",
      });
      const event = {
        target: {
          files: [file],
          value: "",
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      // Mock FileReader
      const readAsText = vi.fn(function (this: any) {
        this.onload({ target: { result: JSON.stringify(layers) } });
      });
      (window as any).FileReader = function () {
        this.readAsText = readAsText;
      };

      importLayersFromFile(event, importLayers);
      expect(importLayers.mock.calls[0][0][0].id).toBeDefined();
    });
  });

  describe("exportLayersToFile", () => {
    it("does nothing if layers is falsy", () => {
      // @ts-expect-error
      expect(exportLayersToFile(undefined)).toBeUndefined();
    });

    it("creates a download link and triggers click", () => {
      const layers: Layer[] = [
        {
          id: "1",
          name: "Layer",
          color: "#fff",
          countries: [],
          visible: true,
          order: 1,
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

      exportLayersToFile(layers);

      expect(createObjectURL).toHaveBeenCalled();
      expect(click).toHaveBeenCalled();
      expect(revokeObjectURL).toHaveBeenCalledWith("blob:url");

      createElement.mockRestore();
    });
  });
});
