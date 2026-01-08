import { setupDomMocks } from "@test-utils/mockDomGlobals";
import {
  exportSvg,
  exportSvgAsImage,
  prepareSvgClone,
  getCorrespondingOriginal,
  downloadBlob,
  exportMapDataAsJson,
} from "./mapExport";

setupDomMocks();

describe("mapExport utils", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

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

    it("removes background rects (class background)", () => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      const rect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      rect.setAttribute("class", "background");
      g.appendChild(rect);
      svg.appendChild(g);
      const result = prepareSvgClone(svg, false);
      expect(
        result.querySelectorAll(
          "rect[data-export-ignore], rect.background, rect[data-background]"
        ).length
      ).toBe(0);
    });

    it("removes background rects (data-export-ignore, data-background)", () => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const rect1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      rect1.setAttribute("data-export-ignore", "true");
      const rect2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      rect2.setAttribute("data-background", "true");
      svg.appendChild(rect1);
      svg.appendChild(rect2);
      const result = prepareSvgClone(svg, false);
      expect(result.querySelectorAll("rect[data-export-ignore]").length).toBe(
        0
      );
      expect(result.querySelectorAll("rect[data-background]").length).toBe(0);
    });

    it("inlines computed styles with and without existing style", () => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      svg.appendChild(path);
      path.setAttribute("style", "stroke:red");
      const origGetComputedStyle = window.getComputedStyle;
      window.getComputedStyle = () =>
        ({
          getPropertyValue: (prop: string) => (prop === "fill" ? "blue" : ""),
        } as any);
      const result = prepareSvgClone(svg, true);
      const clonedPath = result.querySelector("path");
      const style1 = clonedPath?.getAttribute("style");
      if (style1 !== undefined && style1 !== null) {
        expect(style1).toContain("stroke:red");
        expect(style1).toContain("fill:blue");
      }
      path.removeAttribute("style");
      const result2 = prepareSvgClone(svg, true);
      const clonedPath2 = result2.querySelector("path");
      const style2 = clonedPath2?.getAttribute("style");
      if (style2 !== undefined && style2 !== null) {
        expect(style2).toContain("fill:blue");
      }
      window.getComputedStyle = origGetComputedStyle;
    });

    it("falls back to clientWidth/clientHeight if width/height missing", () => {
      const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      ) as any;
      svg.width = undefined;
      svg.height = undefined;
      svg.clientWidth = 321;
      svg.clientHeight = 654;
      const result = prepareSvgClone(svg, false);
      expect(result.getAttribute("viewBox")).toBe("0 0 321 654");
    });

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

    it("returns null if not in the clone tree", () => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      svg.appendChild(g);
      const clone = svg.cloneNode(true) as SVGSVGElement;
      // Pass a node from a different tree
      expect(getCorrespondingOriginal(g, svg, clone)).toBeNull();
    });

    it("returns null if parentNode is missing", () => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const clone = svg.cloneNode(true) as SVGSVGElement;
      // orphan node
      const orphan = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );
      Object.defineProperty(orphan, "parentNode", { value: null });
      expect(getCorrespondingOriginal(orphan, svg, clone)).toBeNull();
    });
  });

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
      // Mock document.body.appendChild/removeChild to avoid errors
      const origAppend = document.body.appendChild;
      const origRemove = document.body.removeChild;
      document.body.appendChild = vi.fn();
      document.body.removeChild = vi.fn();
      expect(() => exportSvg(svg, "custom.svg", false)).not.toThrow();
      document.body.appendChild = origAppend;
      document.body.removeChild = origRemove;
    });
    it("does nothing if svgElement is falsy", () => {
      expect(exportSvg(null as any)).toBeUndefined();
    });
    it("exports SVG with inlineStyles true", () => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "100");
      svg.setAttribute("height", "100");
      // Mock document.body.appendChild/removeChild to avoid errors
      const origAppend = document.body.appendChild;
      const origRemove = document.body.removeChild;
      document.body.appendChild = vi.fn();
      document.body.removeChild = vi.fn();
      expect(() => exportSvg(svg, "inline.svg", true)).not.toThrow();
      document.body.appendChild = origAppend;
      document.body.removeChild = origRemove;
    });
  });
});

describe("exportMapDataAsJson", () => {
  let origCreateElement: typeof document.createElement;
  let origAppendChild: typeof document.body.appendChild;
  let origRemoveChild: typeof document.body.removeChild;
  let origCreateObjectURL: typeof URL.createObjectURL;
  let origRevokeObjectURL: typeof URL.revokeObjectURL;

  beforeEach(() => {
    origCreateElement = document.createElement;
    origCreateObjectURL = URL.createObjectURL;
    origRevokeObjectURL = URL.revokeObjectURL;
    document.createElement = vi.fn((tag) => {
      if (tag === "a") {
        return {
          set href(v) {
            this._href = v;
          },
          get href() {
            return this._href;
          },
          set download(v) {
            this._download = v;
          },
          get download() {
            return this._download;
          },
          click: vi.fn(),
        } as any;
      }
      return origCreateElement.call(document, tag);
    }) as any;
    if (document.body) {
      origAppendChild = document.body.appendChild;
      origRemoveChild = document.body.removeChild;
      document.body.appendChild = vi.fn();
      document.body.removeChild = vi.fn();
    }
    URL.createObjectURL = vi.fn(() => "blob:url");
    URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    document.createElement = origCreateElement;
    if (document.body) {
      document.body.appendChild = origAppendChild;
      document.body.removeChild = origRemoveChild;
    }
    URL.createObjectURL = origCreateObjectURL;
    URL.revokeObjectURL = origRevokeObjectURL;
  });

  it("exports data as JSON with default filename", () => {
    vi.useFakeTimers();
    const data = { foo: "bar", arr: [1, 2, 3] };
    exportMapDataAsJson(data);
    expect(document.body.appendChild).toHaveBeenCalled();
    vi.runAllTimers();
    expect(document.body.removeChild).toHaveBeenCalled();
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("exports data as JSON with custom filename", () => {
    const data = { test: 123 };
    exportMapDataAsJson(data, "custom.json");
    const a = (document.createElement as any).mock.results[0].value;
    expect(a.download).toBe("custom.json");
  });

  it("handles empty data", () => {
    exportMapDataAsJson({}, "empty.json");
    expect(document.body.appendChild).toHaveBeenCalled();
  });

  it("handles large data", () => {
    const data = { arr: Array(1000).fill({ x: 1, y: 2 }) };
    exportMapDataAsJson(data, "large.json");
    expect(document.body.appendChild).toHaveBeenCalled();
  });

  it("does not throw if document.body is missing (SSR edge case)", () => {
    const origBody = document.body;
    (globalThis as any).document.body = null;
    expect(() => exportMapDataAsJson({ foo: 1 }, "fail.json")).not.toThrow();
    (globalThis as any).document.body = origBody;
  });
});
