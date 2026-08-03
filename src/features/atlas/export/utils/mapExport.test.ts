import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as utils from "@utils";
import { exportMap, exportSvg, exportSvgAsImage } from "./mapExport";

describe("mapExport", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(utils, "downloadBlob").mockImplementation(() => {});
    vi.spyOn(utils, "downloadCanvas").mockResolvedValue(undefined);
    vi.spyOn(utils, "exportToFile").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const createMockSvg = (viewBoxVal = "0 0 500 500") => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "500");
    svg.setAttribute("height", "500");
    if (viewBoxVal) svg.setAttribute("viewBox", viewBoxVal);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M 0 0 L 10 10");
    svg.appendChild(path);
    return svg;
  };

  // Helper to automatically trigger Image.onload or Image.onerror upon setting .src
  const mockImageTrigger = (
    event: "onload" | "onerror" = "onload",
    errPayload?: any,
  ) => {
    const originalDesc = Object.getOwnPropertyDescriptor(
      window.Image.prototype,
      "src",
    );
    Object.defineProperty(window.Image.prototype, "src", {
      set() {
        if (event === "onload" && typeof this.onload === "function")
          this.onload();
        if (event === "onerror" && typeof this.onerror === "function") {
          this.onerror(errPayload || new Error("Image error"));
        }
      },
      configurable: true,
    });
    return () => {
      if (originalDesc)
        Object.defineProperty(window.Image.prototype, "src", originalDesc);
    };
  };

  const mockSvgOpts = {
    current: { svgInlineStyles: true, includeTitles: true },
  };
  const mockImgOpts = {
    current: { scale: 2, quality: 0.9, backgroundColor: "#ffffff" },
  };

  describe("exportMap", () => {
    it("safely exits if svgRef is empty for SVG format", () => {
      exportMap({
        svgRef: { current: null },
        format: "svg",
        svgOptions: mockSvgOpts as any,
        imageOptions: mockImgOpts as any,
      });
      expect(utils.downloadBlob).not.toHaveBeenCalled();
    });

    it("exports JSON directly when provided, or ignores if missing", () => {
      const mockJson = { layers: [], markers: [] };
      const opts = {
        svgRef: { current: null },
        format: "json" as const,
        svgOptions: mockSvgOpts as any,
        imageOptions: mockImgOpts as any,
      };

      exportMap({ ...opts, jsonData: mockJson });
      expect(utils.exportToFile).toHaveBeenCalledWith(
        mockJson,
        "atlas-data.json",
      );

      vi.clearAllMocks();
      exportMap(opts);
      expect(utils.exportToFile).not.toHaveBeenCalled();
    });

    it("runs real SVG preparation and triggers downloadBlob", () => {
      exportMap({
        svgRef: { current: createMockSvg() },
        format: "svg",
        svgOptions: mockSvgOpts as any,
        imageOptions: mockImgOpts as any,
      });
      expect(utils.downloadBlob).toHaveBeenCalledWith(
        expect.any(Blob),
        "map.svg",
      );
    });

    it("delegates to image export and handles missing options refs", () => {
      const svg = createMockSvg();
      exportMap({
        svgRef: { current: svg },
        format: "png",
        svgOptions: mockSvgOpts as any,
        imageOptions: mockImgOpts as any,
      });
      exportMap({
        svgRef: { current: svg },
        format: "png",
        svgOptions: { current: null } as any,
        imageOptions: { current: null } as any,
      });
      expect(utils.downloadCanvas).toBeDefined();
    });
  });

  describe("exportSvg", () => {
    it("exits early if element is missing", () => {
      exportSvg(null as unknown as SVGSVGElement);
      expect(utils.downloadBlob).not.toHaveBeenCalled();
    });

    it("prepares SVG clone and triggers blob download with default or custom args", () => {
      const svg = createMockSvg();
      exportSvg(svg);
      expect(utils.downloadBlob).toHaveBeenCalledWith(
        expect.any(Blob),
        "map.svg",
      );

      exportSvg(svg, "custom-name.svg", false, false);
      expect(utils.downloadBlob).toHaveBeenCalledWith(
        expect.any(Blob),
        "custom-name.svg",
      );
    });
  });

  describe("exportSvgAsImage", () => {
    it("exits early if element is missing", async () => {
      await exportSvgAsImage(null as unknown as SVGSVGElement);
      expect(utils.downloadCanvas).not.toHaveBeenCalled();
    });

    it("renders SVG to canvas and downloads image with custom options", async () => {
      const restoreImage = mockImageTrigger("onload");
      const mockCtx = {
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "low",
        clearRect: vi.fn(),
        save: vi.fn(),
        fillRect: vi.fn(),
        restore: vi.fn(),
        drawImage: vi.fn(),
      };
      vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
        mockCtx as any,
      );

      await exportSvgAsImage(
        createMockSvg(),
        "map.jpeg",
        "jpeg",
        2,
        true,
        8192,
        1,
        "#000000",
      );

      expect(mockCtx.imageSmoothingQuality).toBe("high");
      expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, 1000, 1000);
      expect(mockCtx.drawImage).toHaveBeenCalled();
      expect(utils.downloadCanvas).toHaveBeenCalledWith(
        expect.any(HTMLCanvasElement),
        "map.jpeg",
        "jpeg",
        1,
      );

      restoreImage();
    });

    it("handles incomplete/invalid viewBox strings and missing viewBox attribute", async () => {
      const restoreImage = mockImageTrigger("onload");

      await exportSvgAsImage(createMockSvg("0 0"), "map.png", "png", 1);
      await exportSvgAsImage(createMockSvg("a b c d"), "map.png", "png", 1);

      const svgNoVb = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      await exportSvgAsImage(svgNoVb, "map.png", "png", 1);

      expect(utils.downloadCanvas).toHaveBeenCalledTimes(3);
      restoreImage();
    });

    it("triggers onload even when getContext returns null", async () => {
      const restoreImage = mockImageTrigger("onload");
      vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);

      await exportSvgAsImage(createMockSvg(), "map.png", "png", 1);
      expect(utils.downloadCanvas).toHaveBeenCalled();

      restoreImage();
    });

    it("covers line 126: rejects promise when downloadCanvas throws inside onload", async () => {
      const restoreImage = mockImageTrigger("onload");
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      vi.spyOn(utils, "downloadCanvas").mockRejectedValueOnce(
        new Error("Canvas export failed"),
      );

      await exportSvgAsImage(createMockSvg(), "map.png", "png", 1);

      expect(errorSpy).toHaveBeenCalledWith(
        "exportSvgAsImage error:",
        expect.any(Error),
      );
      restoreImage();
    });

    it("handles image rendering errors gracefully via img.onerror", async () => {
      const restoreImage = mockImageTrigger(
        "onerror",
        new Error("Image decode failed"),
      );
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      await exportSvgAsImage(createMockSvg(), "map.png", "png", 1, false);

      expect(errorSpy).toHaveBeenCalled();
      restoreImage();
    });
  });
});
