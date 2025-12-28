import { importOverlaysFromFile, exportOverlaysToFile } from "./overlayFile";
import type { Overlay } from "../types";

describe("overlayFile utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("importOverlaysFromFile", () => {
    it("does nothing if no file is selected", () => {
      const setOverlays = vi.fn();
      const event = {
        target: { files: undefined, value: "" },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      importOverlaysFromFile(event, setOverlays);
      expect(setOverlays).not.toHaveBeenCalled();
    });

    it("alerts on invalid JSON", () => {
      global.alert = vi.fn();
      const setOverlays = vi.fn();
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

      importOverlaysFromFile(event, setOverlays);
      expect(global.alert).toHaveBeenCalledWith(
        "Failed to import overlays. Invalid JSON."
      );
    });

    it("alerts on non-array JSON", () => {
      global.alert = vi.fn();
      const setOverlays = vi.fn();
      const file = new Blob(['{"foo":1}'], { type: "application/json" });
      const event = {
        target: {
          files: [file],
          value: "",
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      // Mock FileReader
      const readAsText = vi.fn(function (this: any) {
        this.onload({ target: { result: '{"foo":1}' } });
      });
      (window as any).FileReader = function () {
        this.readAsText = readAsText;
      };

      importOverlaysFromFile(event, setOverlays);
      expect(global.alert).toHaveBeenCalledWith(
        "Invalid overlays file format."
      );
    });

    it("calls importOverlays with imported overlays array", () => {
      const importOverlays = vi.fn();
      const overlays: Overlay[] = [
        {
          id: "1",
          name: "Overlay",
          color: "#fff",
          countries: [],
          visible: true,
          order: 1,
        },
      ];
      const file = new Blob([JSON.stringify(overlays)], {
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
        this.onload({ target: { result: JSON.stringify(overlays) } });
      });
      (window as any).FileReader = function () {
        this.readAsText = readAsText;
      };

      importOverlaysFromFile(event, importOverlays);
      expect(importOverlays).toHaveBeenCalledWith(overlays);
    });
  });

  describe("exportOverlaysToFile", () => {
    it("does nothing if overlays is falsy", () => {
      // @ts-expect-error
      expect(exportOverlaysToFile(undefined)).toBeUndefined();
    });

    it("creates a download link and triggers click", () => {
      const overlays: Overlay[] = [
        {
          id: "1",
          name: "Overlay",
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

      exportOverlaysToFile(overlays);

      expect(createObjectURL).toHaveBeenCalled();
      expect(click).toHaveBeenCalled();
      expect(revokeObjectURL).toHaveBeenCalledWith("blob:url");

      createElement.mockRestore();
    });
  });
});
