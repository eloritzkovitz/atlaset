import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  exportMap,
  prepareSvgClone,
  getCorrespondingOriginal,
  exportSvg,
  exportSvgAsImage,
  exportMapDataAsJson,
} from "./mapExport";
import * as utils from "@utils";

describe("exportMap Complete Test Suite", () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.spyOn(utils, "downloadBlob").mockImplementation(() => {});
    vi.spyOn(utils, "downloadCanvas").mockImplementation(() =>
      Promise.resolve(),
    );
    vi.spyOn(utils, "exportToFile").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const createMockSvg = () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "500");
    svg.setAttribute("height", "500");

    const ignoreRect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect",
    );
    ignoreRect.setAttribute("data-export-ignore", "true");
    svg.appendChild(ignoreRect);

    const titleG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    titleG.setAttribute("data-export-title", "Test Title Access");

    const pathNode = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    titleG.appendChild(pathNode);
    svg.appendChild(titleG);

    return svg;
  };

  const mockSvgOptions = {
    current: { svgInlineStyles: true, includeTitles: true },
  };
  const mockImageOptions = {
    current: { scale: 3, quality: 1, backgroundColor: "#fff" },
  };
  const mockJsonData = { layers: [], markers: [] };

  describe("Core exportMap Router Branches", () => {
    it("safely exits if the SVG ref is missing for visual formats", () => {
      exportMap({
        svgRef: { current: null },
        format: "svg",
        svgOptions: mockSvgOptions as any,
        imageOptions: mockImageOptions as any,
      });
      expect(utils.downloadBlob).not.toHaveBeenCalled();
    });

    it("routes JSON format immediately and completely skips the SVG ref check", () => {
      exportMap({
        svgRef: { current: null },
        format: "json",
        svgOptions: mockSvgOptions as any,
        imageOptions: mockImageOptions as any,
        jsonData: mockJsonData,
      });
      expect(utils.exportToFile).toHaveBeenCalledWith(
        mockJsonData,
        "atlas-data.json",
      );
    });

    it("routes SVG format correctly with context options passed along", () => {
      const svgEl = createMockSvg();
      exportMap({
        svgRef: { current: svgEl },
        format: "svg",
        svgOptions: mockSvgOptions as any,
        imageOptions: mockImageOptions as any,
      });
      expect(utils.downloadBlob).toHaveBeenCalled();
      expect(vi.mocked(utils.downloadBlob).mock.calls[0][1]).toBe("map.svg");
    });
  });

  describe("prepareSvgClone & getCorrespondingOriginal Internal Branches", () => {
    it("covers fallback defaults when attributes like viewbox, client width, and inline configurations are missing", () => {
      const bareSvg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      Object.defineProperty(bareSvg, "clientWidth", { value: 0 });
      Object.defineProperty(bareSvg, "clientHeight", { value: 0 });

      const clone = prepareSvgClone(bareSvg, false, false);
      expect(clone.getAttribute("viewBox")).toBe("0 0 1200 800");
    });

    it("covers inlining style property aggregation loops and computation failures", () => {
      const svg = createMockSvg();

      const styleStub = {
        getPropertyValue: (prop: string) =>
          prop === "fill" ? "rgb(0, 0, 0)" : "",
      };
      vi.spyOn(window, "getComputedStyle").mockImplementation(
        () => styleStub as any,
      );

      const clone = prepareSvgClone(svg, true, true);
      expect(clone).toBeDefined();
    });

    it("covers structural exit breaks inside getCorrespondingOriginal node tracking loop", () => {
      const svg = createMockSvg();
      const clone = svg.cloneNode(true) as SVGSVGElement;

      const targetCloneChild = clone.querySelector("path")!;

      const foundMatch = getCorrespondingOriginal(targetCloneChild, svg, clone);
      expect(foundMatch).not.toBeNull();

      const detachedNode = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      expect(getCorrespondingOriginal(detachedNode, svg, clone)).toBeNull();

      const externalRoot = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      expect(
        getCorrespondingOriginal(targetCloneChild, svg, externalRoot),
      ).toBeNull();
    });
  });

  describe("exportSvg & exportSvgAsImage Edge Cases", () => {
    it("exits early if exportSvg or exportSvgAsImage are called without elements", async () => {
      expect(exportSvg(null as any)).toBeUndefined();
      expect(await exportSvgAsImage(null as any)).toBeUndefined();
    });

    it("covers viewbox processing blocks with missing coordinates or space delimiters", async () => {
      const svg = createMockSvg();
      svg.setAttribute("viewBox", "invalid_string_data");

      exportSvgAsImage(svg, "test.png", "png", 1, false);
      expect(utils.downloadCanvas).not.toHaveBeenCalled();
    });

    it("triggers image resolution downscale compression ceilings if sizes cross bounds", async () => {
      const svg = createMockSvg();
      svg.setAttribute("viewBox", "0 0 5000 5000");

      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      exportSvgAsImage(svg, "test-capped.png", "png", 3, false, 2000);
      expect(warnSpy).toHaveBeenCalled();
    });

    it.each([
      ["png", 3, "map@3x.png"],
      ["jpeg", 2, "map@2x.jpg"],
      ["webp", 1, "map@1x.webp"],
    ])(
      "covers canvas image painting loaders and downloads for format %s via entry routing",
      async (imgFormat, scaleValue) => {
        const mockDrawImage = vi.fn();

        vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
          () =>
            ({
              imageSmoothingEnabled: true,
              imageSmoothingQuality: "high",
              clearRect: vi.fn(),
              save: vi.fn(),
              fillRect: vi.fn(),
              restore: vi.fn(),
              drawImage: mockDrawImage,
            }) as any,
        );

        const srcPropDesc = Object.getOwnPropertyDescriptor(
          window.Image.prototype,
          "src",
        );

        Object.defineProperty(window.Image.prototype, "src", {
          set() {
            if (typeof this.onload === "function") {
              this.onload();
            }
          },
          configurable: true,
        });

        const svgEl = createMockSvg();

        exportMap({
          svgRef: { current: svgEl },
          format: imgFormat as any,
          svgOptions: mockSvgOptions as any,
          imageOptions: {
            current: {
              scale: scaleValue,
              quality: 0.9,
              backgroundColor: imgFormat === "jpeg" ? undefined : "#000",
            },
          } as any,
        });

        expect(mockDrawImage).toHaveBeenCalled();
        expect(utils.downloadCanvas).toHaveBeenCalled();

        if (srcPropDesc) {
          Object.defineProperty(window.Image.prototype, "src", srcPropDesc);
        }
      },
    );

    it("captures media asset errors inside the canvas rendering pipeline gracefully", async () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const srcPropDesc = Object.getOwnPropertyDescriptor(
        window.Image.prototype,
        "src",
      );

      vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
        () =>
          ({
            imageSmoothingEnabled: true,
            clearRect: vi.fn(),
            drawImage: vi.fn(),
          }) as any,
      );

      Object.defineProperty(window.Image.prototype, "src", {
        set() {
          if (typeof this.onerror === "function") {
            this.onerror(new Error("Simulated image loading failure"));
          }
        },
        configurable: true,
      });

      const svgEl = createMockSvg();
      await exportSvgAsImage(svgEl, "map.png", "png", 1, false);

      expect(errorSpy).toHaveBeenCalled();

      if (srcPropDesc) {
        Object.defineProperty(window.Image.prototype, "src", srcPropDesc);
      }
    });
  });

  it("forces canvas rendering execution errors to hit the internal try/catch onload rejection pathway", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const srcPropDesc = Object.getOwnPropertyDescriptor(
      window.Image.prototype,
      "src",
    );

    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
      () =>
        ({
          imageSmoothingEnabled: true,
          clearRect: vi.fn(),
          drawImage: () => {
            throw new Error("Canvas pipeline execution corruption failure");
          },
        }) as any,
    );

    Object.defineProperty(window.Image.prototype, "src", {
      set() {
        if (typeof this.onload === "function") {
          this.onload();
        }
      },
      configurable: true,
    });

    const svgEl = createMockSvg();
    await exportSvgAsImage(svgEl, "map.png", "png", 1, false);

    expect(errorSpy).toHaveBeenCalled();

    if (srcPropDesc) {
      Object.defineProperty(window.Image.prototype, "src", srcPropDesc);
    }
  });

  describe("exportMapDataAsJson", () => {
    it("handles fallback default argument values", () => {
      exportMapDataAsJson(mockJsonData);
      expect(utils.exportToFile).toHaveBeenCalledWith(
        mockJsonData,
        "atlas-export.json",
      );
    });
  });
});
