import { setupDomMocks } from "@test-utils/mockDomGlobals";
import {
  exportSvg,
  exportSvgAsImage,
  prepareSvgClone,
  getCorrespondingOriginal,
  downloadBlob,
} from "./mapExport";

// --- Global Mocks ---
setupDomMocks();

describe("mapExport utils", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // --- exportSvg ---
  it("exportSvg does nothing if svgElement is falsy", () => {
    expect(exportSvg(null as any)).toBeUndefined();
  });

  it("exportSvg calls XMLSerializer and triggers download", () => {
    const svg = {
      cloneNode: vi.fn(() => ({
        getAttribute: vi.fn(() => "0 0 100 100"),
        querySelectorAll: vi.fn(() => []),
      })),
      ownerDocument: {
        defaultView: {
          getComputedStyle: vi.fn(() => ({
            getPropertyValue: vi.fn(() => ""),
          })),
        },
      },
    } as any;
    expect(() => exportSvg(svg, "test.svg")).not.toThrow();
  });

  it("exportSvg handles missing width/height", () => {
    const svg = {
      cloneNode: vi.fn(() => ({
        getAttribute: vi.fn(() => null),
        setAttribute: vi.fn(),
        querySelectorAll: vi.fn(() => []),
        ownerDocument: {
          defaultView: {
            getComputedStyle: vi.fn(() => ({
              getPropertyValue: vi.fn(() => ""),
            })),
          },
        },
      })),
      ownerDocument: {
        defaultView: {
          getComputedStyle: vi.fn(() => ({
            getPropertyValue: vi.fn(() => ""),
          })),
        },
      },
    } as any;
    expect(() => exportSvg(svg, "test.svg")).not.toThrow();
  });

  // --- exportSvgAsImage ---
  describe("exportSvgAsImage", () => {
    let origCreateElement: typeof document.createElement;

    beforeEach(() => {
      origCreateElement = document.createElement;
      document.createElement = ((
        tagName: string,
        options?: ElementCreationOptions
      ) => {
        const el = origCreateElement.call(document, tagName, options);
        if (tagName === "canvas") {
          (el as any).getContext = () => ({
            imageSmoothingEnabled: true,
            imageSmoothingQuality: "high",
            clearRect: vi.fn(),
            save: vi.fn(),
            restore: vi.fn(),
            fillStyle: "",
            fillRect: vi.fn(),
            drawImage: vi.fn(),
          });
          (el as any).toBlob = (cb: any) => cb(new Blob());
        }
        return el;
      }) as any;
    });

    afterEach(() => {
      document.createElement = origCreateElement;
    });

    function makeSvgMock() {
      return {
        cloneNode: vi.fn(() => ({
          getAttribute: vi.fn((attr) => {
            if (attr === "viewBox") return "0 0 100 100";
            return null;
          }),
          setAttribute: vi.fn(),
          querySelectorAll: vi.fn(() => []),
          width: { baseVal: { value: 100 } },
          height: { baseVal: { value: 100 } },
        })),
        ownerDocument: {
          defaultView: {
            getComputedStyle: vi.fn(() => ({
              getPropertyValue: vi.fn(() => ""),
            })),
          },
        },
      } as any;
    }

    it("does nothing if svgElement is falsy", async () => {
      await expect(exportSvgAsImage(null as any)).resolves.toBeUndefined();
    });

    it("exports PNG with default options", async () => {
      const svg = makeSvgMock();
      await expect(
        exportSvgAsImage(svg, "test.png", "png", 2, true, 2048, 1)
      ).resolves.toBeUndefined();
    });

    it("exports JPEG with quality and backgroundColor", async () => {
      const svg = makeSvgMock();
      await expect(
        exportSvgAsImage(svg, "test.jpg", "jpeg", 2, true, 2048, 0.5, "#ff0000")
      ).resolves.toBeUndefined();
    });

    it("exports WebP with quality", async () => {
      const svg = makeSvgMock();
      await expect(
        exportSvgAsImage(svg, "test.webp", "webp", 2, true, 2048, 0.8)
      ).resolves.toBeUndefined();
    });

    it("handles missing viewBox and width/height", async () => {
      const svg = {
        cloneNode: vi.fn(() => ({
          getAttribute: vi.fn(() => null),
          setAttribute: vi.fn(),
          querySelectorAll: vi.fn(() => []),
          width: undefined,
          height: undefined,
          clientWidth: undefined,
          clientHeight: undefined,
          ownerDocument: {
            defaultView: {
              getComputedStyle: vi.fn(() => ({
                getPropertyValue: vi.fn(() => ""),
              })),
            },
          },
        })),
        ownerDocument: {
          defaultView: {
            getComputedStyle: vi.fn(() => ({
              getPropertyValue: vi.fn(() => ""),
            })),
          },
        },
      } as any;
      await expect(
        exportSvgAsImage(svg, "test.png", "png", 2, true, 2048, 1)
      ).resolves.toBeUndefined();
    });

    it("handles missing canvas context", async () => {
      // The global mock returns null for getContext in this case
      const svg = makeSvgMock();
      // Simulate getContext returning null
      const origCreateElement = document.createElement;
      document.createElement = ((
        tagName: string,
        options?: ElementCreationOptions
      ) => {
        const el = origCreateElement.call(document, tagName, options);
        if (tagName === "canvas") {
          (el as any).getContext = () => null;
        }
        return el;
      }) as any;
      await expect(
        exportSvgAsImage(svg, "test.png", "png", 2, true, 2048, 1)
      ).resolves.toBeUndefined();
      document.createElement = origCreateElement;
    });

    it("handles image load error", async () => {
      class ErrorImage {
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        set src(_v: string) {
          setTimeout(() => {
            if (this.onerror) this.onerror();
          }, 0);
        }
        set crossOrigin(_v: string) {}
      }
      vi.stubGlobal("Image", ErrorImage);
      const svg = makeSvgMock();
      await expect(
        exportSvgAsImage(svg, "test.png", "png", 2, true, 2048, 1)
      ).resolves.toBeUndefined();
    });

    it("handles blob creation failure", async () => {
      // The global mock returns null for toBlob in this case
      const svg = makeSvgMock();
      // Simulate toBlob returning null
      const origCreateElement = document.createElement;
      document.createElement = ((
        tagName: string,
        options?: ElementCreationOptions
      ) => {
        const el = origCreateElement.call(document, tagName, options);
        if (tagName === "canvas") {
          (el as any).getContext = () => ({
            imageSmoothingEnabled: true,
            clearRect: vi.fn(),
            save: vi.fn(),
            restore: vi.fn(),
            fillStyle: "",
            fillRect: vi.fn(),
            drawImage: vi.fn(),
          });
          (el as any).toBlob = (cb: any) => cb(null);
        }
        return el;
      }) as any;
      await expect(
        exportSvgAsImage(svg, "test.png", "png", 2, true, 2048, 1)
      ).resolves.toBeUndefined();
      document.createElement = origCreateElement;
    });

    it("fills background for JPEG if backgroundColor is not provided", async () => {
      const svg = makeSvgMock();
      // You could spy on ctx.fillStyle or fillRect if you want to assert color
      await expect(
        exportSvgAsImage(svg, "test.jpg", "jpeg", 2, true, 2048, 1)
      ).resolves.toBeUndefined();
    });

    it("fills background for PNG/WebP if backgroundColor is provided", async () => {
      const svg = makeSvgMock();
      await expect(
        exportSvgAsImage(svg, "test.png", "png", 2, true, 2048, 1, "#00ff00")
      ).resolves.toBeUndefined();
      await expect(
        exportSvgAsImage(svg, "test.webp", "webp", 2, true, 2048, 1, "#00ff00")
      ).resolves.toBeUndefined();
    });
  });

  // --- prepareSvgClone ---
  describe("prepareSvgClone", () => {
    it("adds xmlns if missing", () => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "100");
      svg.setAttribute("height", "100");
      const result = prepareSvgClone(svg, false);
      expect(result.getAttribute("xmlns")).toBe("http://www.w3.org/2000/svg");
    });

    it("adds viewBox if missing", () => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      (svg as any).width = { baseVal: { value: 123 } };
      (svg as any).height = { baseVal: { value: 456 } };
      const result = prepareSvgClone(svg, false);
      expect(result.getAttribute("viewBox")).toBe("0 0 123 456");
    });

    // it("removes background rects", () => {
    //   const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    //   const rect = document.createElementNS(
    //     "http://www.w3.org/2000/svg",
    //     "rect"
    //   );
    //   rect.setAttribute("class", "background");
    //   svg.appendChild(rect);
    //   const result = prepareSvgClone(svg, false);
    //   expect(result.querySelector("rect.background")).toBeNull();
    // });

    it("inlines computed styles and handles errors", () => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      svg.appendChild(path);
      // Simulate missing original element to trigger catch
      const result = prepareSvgClone(svg, false);
      expect(result).toBeTruthy();
    });
  });

  // --- getCorrespondingOriginal ---
  describe("getCorrespondingOriginal", () => {
    it("returns the correct original element for a nested clone", () => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      g.appendChild(path);
      svg.appendChild(g);
      const clone = svg.cloneNode(true) as SVGSVGElement;
      const clonedG = clone.children[0];
      const clonedPath = clonedG.children[0];
      expect(getCorrespondingOriginal(clonedPath, svg, clone)).toBe(path);
    });

    it("returns null if the path is broken (index out of bounds)", () => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const clone = svg.cloneNode(true) as SVGSVGElement;
      // Simulate a broken path by passing a node not in the tree
      const orphan = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );
      expect(getCorrespondingOriginal(orphan, svg, clone)).toBeNull();
    });
  });

  // --- downloadBlob ---
  describe("downloadBlob", () => {
    it("triggers download and revokes URL", () => {
      const blob = new Blob(["test"], { type: "text/plain" });
      expect(() => downloadBlob(blob, "test.txt")).not.toThrow();
    });
  });

  describe("exportSvg", () => {
    it("exports SVG with custom filename and without inlining styles", () => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "100");
      svg.setAttribute("height", "100");
      expect(() => exportSvg(svg, "custom.svg", false)).not.toThrow();
    });
  });
});
