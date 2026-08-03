/**
 * Utility functions for exporting map SVGs and data.
 */

import type { Layer } from "@features/atlas/layers/types";
import type { Marker } from "@features/atlas/markers/types";
import {
  calculateScaledDimensions,
  downloadBlob,
  downloadCanvas,
  exportToFile,
  getElementDim,
  prepareSvgClone,
  svgToBlob,
} from "@utils";
import { getExportFilename, isImageFormat } from "./format";
import type {
  ExportFormat,
  ImageExportOptions,
  ImageFormat,
  SvgExportOptions,
} from "../types";

/**
 * Exports the given SVG element as an SVG file.
 * @param svgElement - The SVG element to export.
 * @param filename - The desired filename for the exported SVG.
 * @param inlineStyles - Whether to inline computed styles into the SVG before export.
 * @param includeTitles - Whether to include title elements for accessibility. *
 */
export function exportSvg(
  svgElement: SVGSVGElement,
  filename = "map.svg",
  inlineStyles = true,
  includeTitles = true,
) {
  if (!svgElement) return;
  const clone = prepareSvgClone(svgElement, inlineStyles, includeTitles);
  downloadBlob(svgToBlob(clone), filename);
}

/**
 * Exports the given SVG element as an image file.
 * @param svgElement - The SVG element to export.
 * @param filename - The desired filename for the exported image.
 * @param format - The image format to export.
 * @param scale - The scale factor for the exported image.
 * @param inlineStyles - Whether to inline computed styles into the SVG before export.
 * @param maxDimension - The maximum width or height of the exported image.
 * @param quality - The quality of the exported image (for JPEG/WebP).
 * @param backgroundColor - Optional background color for the exported image.
 */
export async function exportSvgAsImage(
  svgElement: SVGSVGElement,
  filename = "map.png",
  format: ImageFormat = "png",
  scale = 3,
  inlineStyles = true,
  maxDimension = 8192,
  quality = 1,
  backgroundColor?: string,
) {
  if (!svgElement) return;

  const clone = prepareSvgClone(svgElement, inlineStyles);
  const svgString = new XMLSerializer().serializeToString(clone);

  const vb = clone.getAttribute("viewBox");
  let [vw, vh] = [0, 0];

  if (vb) {
    const parts = vb
      .split(/\s+|,/)
      .map(Number)
      .filter((n) => !Number.isNaN(n));
    if (parts.length >= 4) [vw, vh] = [parts[2], parts[3]];
  }

  if (!vw || !vh) {
    vw = getElementDim(clone.width, clone.clientWidth, 1200);
    vh = getElementDim(clone.height, clone.clientHeight, 800);
  }

  // Pure sizing math handled by shared utility
  const { width: canvasW, height: canvasH } = calculateScaledDimensions({
    width: vw,
    height: vh,
    scale,
    maxDimension,
  });

  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.imageSmoothingEnabled = true;
    if (ctx.imageSmoothingQuality) ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, canvasW, canvasH);

    if (format === "jpeg" || backgroundColor) {
      ctx.save();
      ctx.fillStyle = backgroundColor || "#fff";
      ctx.fillRect(0, 0, canvasW, canvasH);
      ctx.restore();
    }
  }

  const url = URL.createObjectURL(
    new Blob([svgString], { type: "image/svg+xml;charset=utf-8" }),
  );
  const img = new Image();
  img.crossOrigin = "anonymous";

  try {
    await new Promise<void>((resolve, reject) => {
      img.onload = async () => {
        try {
          if (ctx) ctx.drawImage(img, 0, 0, canvasW, canvasH);
          URL.revokeObjectURL(url);

          await downloadCanvas(canvas, filename, format, quality);
          resolve();
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load SVG data URL as image"));
      };
      img.src = url;
    });
  } catch (err) {
    console.error("exportSvgAsImage error:", err);
  }
}

/**
 * Exports the map based on the provided parameters.
 * @param svgRef - Reference to the SVG element to export.
 * @param format - The export format ("svg", "png", "jpeg", "webp", "json").
 * @param svgOptions - Options for SVG export.
 * @param imageOptions - Options for image export.
 * @param jsonData - Optional map data (layers, markers) required if format is "json".
 */
export function exportMap({
  svgRef,
  format,
  svgOptions,
  imageOptions,
  jsonData,
}: {
  svgRef: React.RefObject<SVGSVGElement | null>;
  format: ExportFormat;
  svgOptions: React.RefObject<SvgExportOptions>;
  imageOptions: React.RefObject<ImageExportOptions>;
  jsonData?: { layers: Layer[]; markers: Marker[] };
}) {
  // Handle JSON export first
  if (format === "json") {
    if (jsonData) {
      exportToFile(jsonData, getExportFilename("json"));
    }
    return;
  }

  const currentSvg = svgRef?.current;
  if (!currentSvg) return;

  // Handle SVG and image exports
  if (format === "svg") {
    exportSvg(
      currentSvg,
      getExportFilename("svg"),
      svgOptions.current?.svgInlineStyles,
      svgOptions.current?.includeTitles,
    );
  } else if (isImageFormat(format)) {
    const opts = imageOptions.current;
    const scale = opts?.scale ?? 1;

    exportSvgAsImage(
      currentSvg,
      getExportFilename(format, scale),
      format,
      scale,
      true,
      8192,
      opts?.quality ?? 1,
      opts?.backgroundColor,
    );
  }
}
