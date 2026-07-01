import { setupDomMocks } from "@test-utils/mockDomGlobals";
import {
  makeSvgMockFactory,
  installCanvasMock,
  stubImage,
} from "@test-utils/mockExports";

vi.mock("@utils/file", () => ({
  downloadBlob: vi.fn(),
  downloadCanvas: vi.fn(() => Promise.resolve()),
}));
vi.mock("@utils/json", () => ({
  exportToFile: vi.fn(),
}));

import { exportToFile } from "@utils/json";
import {
  exportSvg,
  exportSvgAsImage,
  prepareSvgClone,
  getCorrespondingOriginal,
  exportMapDataAsJson,
} from "./mapExport";

setupDomMocks();

describe("exportSvg", () => {
  const createMockSvg = (viewBox: string | null = "0 0 100 100") =>
    ({
      cloneNode: vi.fn(() => ({
        getAttribute: vi.fn((attr) => (attr === "viewBox" ? viewBox : null)),
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
    }) as any;

  it("handles empty values, normal flows, missing dimensions, and options", () => {
    expect(exportSvg(null as any)).toBeUndefined();
    expect(() => exportSvg(createMockSvg(), "test.svg")).not.toThrow();
    expect(() => exportSvg(createMockSvg(null), "test.svg")).not.toThrow();
    expect(() =>
      exportSvg(
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
        "custom.svg",
        false,
      ),
    ).not.toThrow();
    expect(() =>
      exportSvg(
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
        "inline.svg",
        true,
      ),
    ).not.toThrow();
  });
});

describe("exportSvgAsImage", () => {
  let restoreCanvasMock: (() => void) | null = null;
  beforeEach(() => {
    restoreCanvasMock = installCanvasMock();
  });
  afterEach(() => {
    restoreCanvasMock?.();
  });

  const makeSvgMock = makeSvgMockFactory();

  it("does nothing if svgElement is falsy", async () => {
    await expect(exportSvgAsImage(null as any)).resolves.toBeUndefined();
  });

  it.each([
    ["PNG default", ["test.png", "png", 2, true, 2048, 1]],
    ["JPEG quality+bg", ["test.jpg", "jpeg", 2, true, 2048, 0.5, "#ff0000"]],
    ["WebP quality", ["test.webp", "webp", 2, true, 2048, 0.8]],
    ["JPEG fill background default", ["test.jpg", "jpeg", 2, true, 2048, 1]],
    ["PNG/WebP with bg", ["test.png", "png", 2, true, 2048, 1, "#00ff00"]],
    ["WebP with bg", ["test.webp", "webp", 2, true, 2048, 1, "#00ff00"]],
  ])("exports image - %s", async (_, args) => {
    await expect(
      exportSvgAsImage(makeSvgMock(), ...(args as any)),
    ).resolves.toBeUndefined();
  });

  it("handles missing dimensions and structural context edge cases", async () => {
    const svgMissing = {
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
      exportSvgAsImage(svgMissing, "test.png", "png", 2, true, 2048, 1),
    ).resolves.toBeUndefined();

    const resNull = installCanvasMock({ getContextNull: true });
    await expect(
      exportSvgAsImage(makeSvgMock(), "test.png", "png", 2, true, 2048, 1),
    ).resolves.toBeUndefined();
    resNull();
  });

  it.each([
    ["image load error", () => stubImage(false), () => {}],
    [
      "synchronous drawImage errors",
      () => stubImage(true),
      () => installCanvasMock({ throwOnDrawImage: true }),
    ],
  ])(
    "handles execution errors: %s",
    async (_, imgStub: Function, canvasStub: Function) => {
      const resImg = imgStub();
      const resCanv = canvasStub();
      const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      await expect(
        exportSvgAsImage(makeSvgMock(), "test.png", "png", 2, true, 2048, 1),
      ).resolves.toBeUndefined();

      expect(errSpy).toHaveBeenCalled();
      errSpy.mockRestore();

      if (typeof resImg === "function") resImg();
      if (typeof resCanv === "function") resCanv();
    },
  );  

  it("caps very large exports and logs a warning", async () => {
    const svg: any = {
      cloneNode: vi.fn(() => ({
        getAttribute: vi.fn((a) =>
          a === "viewBox" ? "0 0 20000 20000" : null,
        ),
        setAttribute: vi.fn(),
        querySelectorAll: vi.fn(() => []),
        width: { baseVal: { value: 20000 } },
        height: { baseVal: { value: 20000 } },
      })),
      ownerDocument: {
        defaultView: {
          getComputedStyle: vi.fn(() => ({
            getPropertyValue: vi.fn(() => ""),
          })),
        },
      },
    };
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(
      exportSvgAsImage(svg, "big.png", "png", 1, true, 1024, 1),
    ).resolves.toBeUndefined();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});

describe("prepareSvgClone", () => {
  const createBaseSvg = () =>
    document.createElementNS("http://www.w3.org/2000/svg", "svg");

  it("correctly sanitizes attributes, elements, and fallback setups", () => {
    const svg1 = createBaseSvg();
    svg1.setAttribute("width", "100");
    svg1.setAttribute("height", "100");
    expect(prepareSvgClone(svg1, false).getAttribute("xmlns")).toBe(
      "http://www.w3.org/2000/svg",
    );

    const svg2 = createBaseSvg();
    (svg2 as any).width = { baseVal: { value: 123 } };
    (svg2 as any).height = { baseVal: { value: 456 } };
    expect(prepareSvgClone(svg2, false).getAttribute("viewBox")).toBe(
      "0 0 123 456",
    );

    const svg3a = createBaseSvg();
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const r1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    r1.setAttribute("class", "background");
    g.appendChild(r1);
    svg3a.appendChild(g);
    expect(
      prepareSvgClone(svg3a, false).querySelectorAll("rect.background").length,
    ).toBe(0);

    const svg3b = createBaseSvg();
    const r2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    r2.setAttribute("data-export-ignore", "true");
    const r3 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    r3.setAttribute("data-background", "true");
    svg3b.appendChild(r2);
    svg3b.appendChild(r3);
    expect(
      prepareSvgClone(svg3b, false).querySelectorAll(
        "rect[data-export-ignore], rect[data-background]",
      ).length,
    ).toBe(0);

    const svg4 = createBaseSvg() as any;
    svg4.clientWidth = 321;
    svg4.clientHeight = 654;
    expect(prepareSvgClone(svg4, false).getAttribute("viewBox")).toBe(
      "0 0 321 654",
    );
  });

  it("handles complex style inlining variants and defaultView errors", () => {
    const svg = createBaseSvg();
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("style", "stroke:red");
    svg.appendChild(path);

    const origStyle = window.getComputedStyle;
    window.getComputedStyle = () =>
      ({
        getPropertyValue: (p: string) => (p === "fill" ? "blue" : ""),
      }) as any;

    const style1 = prepareSvgClone(svg, true)
      .querySelector("path")
      ?.getAttribute("style");
    expect(style1).toContain("stroke:red");
    expect(style1).toContain("fill:blue");

    path.removeAttribute("style");
    expect(
      prepareSvgClone(svg, true).querySelector("path")?.getAttribute("style"),
    ).toContain("fill:blue");
    window.getComputedStyle = origStyle;

    const brokenView: any = {
      cloneNode: vi.fn(() => ({
        getAttribute: vi.fn(() => null),
        setAttribute: vi.fn(),
        querySelectorAll: vi.fn(() => [
          {
            getAttribute: vi.fn(() => null),
            setAttribute: vi.fn(),
            remove: vi.fn(),
          },
        ]),
        width: { baseVal: { value: 100 } },
        height: { baseVal: { value: 100 } },
      })),
      ownerDocument: {},
    };
    expect(() => prepareSvgClone(brokenView, true)).not.toThrow();
  });
});

describe("getCorrespondingOriginal", () => {
  it("resolves tree references correctly across clone nodes", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    g.appendChild(path);
    svg.appendChild(g);

    const cloneSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    const cloneG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const clonePath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );

    cloneG.appendChild(clonePath);
    cloneSvg.appendChild(cloneG);

    expect(getCorrespondingOriginal(clonePath, svg, cloneSvg)).toBe(path);

    expect(
      getCorrespondingOriginal(
        document.createElementNS("http://www.w3.org/2000/svg", "g"),
        svg,
        cloneSvg,
      ),
    ).toBeNull();

    expect(getCorrespondingOriginal(g, svg, cloneSvg)).toBeNull();

    const orphan = document.createElementNS("http://www.w3.org/2000/svg", "g");
    Object.defineProperty(orphan, "parentNode", {
      value: null,
      configurable: true,
    });
    expect(getCorrespondingOriginal(orphan, svg, cloneSvg)).toBeNull();
  });
});

describe("exportMapDataAsJson", () => {
  beforeEach(() => {
    vi.mocked(exportToFile).mockClear();
  });

  it("extracts datasets and correctly hands off blobs to downloadBlob", () => {
    const payload = { foo: "bar" };
    exportMapDataAsJson(payload);

    expect(exportToFile).toHaveBeenCalledTimes(1);
    expect(exportToFile).toHaveBeenCalledWith(payload, "atlas-export.json");
  });

  it("respects custom filenames and handles complex or empty datasets", () => {
    const payload = { test: 123 };
    exportMapDataAsJson(payload, "custom.json");

    expect(exportToFile).toHaveBeenCalledWith(payload, "custom.json");

    exportMapDataAsJson({});
    exportMapDataAsJson(
      { arr: Array(1000).fill({ x: 1, y: 2 }) },
      "large.json",
    );

    expect(exportToFile).toHaveBeenCalledTimes(3);
  });
});
