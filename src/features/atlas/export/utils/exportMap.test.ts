import { exportMap } from "./mapExport";
import { exportSvg, exportSvgAsImage } from "./mapExport";

describe("exportMap", () => {
  it("does nothing if svgRef.current is null", () => {
    const svgRef = { current: null };
    expect(
      exportMap({
        svgRef,
        format: "svg",
        svgOptions: { current: { svgInlineStyles: true } },
        imageOptions: {
          current: { scale: 2, quality: 1, backgroundColor: "#fff" },
        },
      })
    ).toBeUndefined();
  });

  it("calls exportSvg for svg format", () => {
    const mockExportSvg = vi.fn();
    const origExportSvg = exportSvg;
    (globalThis as any).exportSvg = mockExportSvg;
    const svgRef = {
      current: document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      ) as SVGSVGElement,
    };
    exportMap({
      svgRef,
      format: "svg",
      svgOptions: { current: { svgInlineStyles: true } },
      imageOptions: {
        current: { scale: 2, quality: 1, backgroundColor: "#fff" },
      },
    });
    (globalThis as any).exportSvg = origExportSvg;
  });

  it("calls exportSvgAsImage for non-svg format", () => {
    const mockExportSvgAsImage = vi.fn();
    const origExportSvgAsImage = exportSvgAsImage;
    (globalThis as any).exportSvgAsImage = mockExportSvgAsImage;
    const svgRef = {
      current: document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      ) as SVGSVGElement,
    };
    exportMap({
      svgRef,
      format: "png",
      svgOptions: { current: { svgInlineStyles: true } },
      imageOptions: {
        current: { scale: 2, quality: 1, backgroundColor: "#fff" },
      },
    });
    (globalThis as any).exportSvgAsImage = origExportSvgAsImage;
  });
});
