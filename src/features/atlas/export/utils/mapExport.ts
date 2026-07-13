/**
 * Utility functions for exporting map SVGs and data.
 */

import type { Layer } from "@features/atlas/layers";
import type { Marker } from "@features/atlas/markers/types";
import { downloadBlob, downloadCanvas } from "@utils/file";
import { exportToFile } from "@utils/json";
import { getExportFilename, isImageFormat } from "./format";
import type {
  ExportFormat,
  ImageExportOptions,
  ImageFormat,
  SvgExportOptions,
} from "../types";

/** Get the dimension of an SVG element, falling back to a default value. */
const getElementDim = (
  val: SVGAnimatedLength | undefined,
  clientVal: number,
  fallback: number,
) => val?.baseVal?.value || clientVal || fallback;

/**
 * Prepares an SVG clone for export by normalizing attributes and inlining styles.
 * @param original - The original SVG element to clone.
 * @param inlineStyles - Whether to inline computed styles into the clone.
 * @param includeTitles - Whether to include title elements for accessibility.
 * @returns The prepared SVG clone.
 */
export function prepareSvgClone(
  original: SVGSVGElement,
  inlineStyles = true,
  includeTitles = true,
): SVGSVGElement {
  const clone = original.cloneNode(true) as SVGSVGElement;

  if (!clone.getAttribute("xmlns")) {
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  }

  if (!clone.getAttribute("viewBox")) {
    const w = getElementDim(original.width, original.clientWidth, 1200);
    const h = getElementDim(original.height, original.clientHeight, 800);
    clone.setAttribute("viewBox", `0 0 ${w} ${h}`);
  }

  clone
    .querySelectorAll(
      "rect[data-export-ignore], rect.background, rect[data-background]",
    )
    .forEach((n) => n.remove());

  // Add <title> elements for accessibility and tooltips if requested
  if (includeTitles) {
    clone.querySelectorAll("[data-export-title]").forEach((el) => {
      const titleText = el.getAttribute("data-export-title");
      if (titleText) {
        const titleNode = original.ownerDocument.createElementNS(
          "http://www.w3.org/2000/svg",
          "title",
        );
        titleNode.textContent = titleText;

        el.appendChild(titleNode);
      }
    });
  }

  // Inline computed styles if requested
  if (inlineStyles) {
    const elements = clone.querySelectorAll<SVGElement>(
      "path, circle, rect, line, polyline, polygon, text, g",
    );
    const ownerDoc = original.ownerDocument || document;
    const styleProps = [
      "fill",
      "stroke",
      "stroke-width",
      "opacity",
      "fill-opacity",
      "stroke-opacity",
      "font-family",
      "font-size",
      "text-anchor",
      "font-weight",
      "vector-effect",
    ];

    elements.forEach((el) => {
      try {
        const orig = getCorrespondingOriginal(el, original, clone);
        const cs = orig
          ? ownerDoc.defaultView?.getComputedStyle(orig as Element)
          : null;
        if (!cs) return;

        const inline = styleProps.reduce((acc, p) => {
          const v = cs.getPropertyValue(p);
          return v ? [...acc, `${p}:${v}`] : acc;
        }, [] as string[]);

        const existing = el.getAttribute("style");
        el.setAttribute(
          "style",
          existing ? `${existing};${inline.join(";")}` : inline.join(";"),
        );
      } catch {
        // ignore elements we can't compute
      }
    });
  }

  return clone;
}

/**
 * Finds the corresponding node in the original SVG for a given node in the cloned SVG.
 * @param node - The node in the cloned SVG.
 * @param originalRoot - The root of the original SVG.
 * @param cloneRoot - The root of the cloned SVG.
 * @returns The corresponding node in the original SVG, or null if not found.
 */
export function getCorrespondingOriginal(
  node: Element,
  originalRoot: Element,
  cloneRoot: Element,
): Element | null {
  const path: number[] = [];
  let current: Element | null = node;

  while (current && current !== cloneRoot) {
    if (!current.parentNode) return null;
    const parent = current.parentNode as Element;
    const idx = Array.prototype.indexOf.call(parent.children, current);
    if (idx === -1) return null;
    path.unshift(idx);
    current = parent;
  }
  if (current !== cloneRoot) return null;

  let original = originalRoot;
  for (const idx of path) {
    if (!original.children?.[idx]) return null;
    original = original.children[idx];
  }
  return original;
}

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
  const svgString = new XMLSerializer().serializeToString(clone);
  downloadBlob(
    new Blob([svgString], { type: "image/svg+xml;charset=utf-8" }),
    filename,
  );
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

  const DPR = window.devicePixelRatio || 1;
  let canvasW = Math.round(vw * DPR * scale);
  let canvasH = Math.round(vh * DPR * scale);

  const maxSide = Math.max(canvasW, canvasH);
  if (maxSide > maxDimension) {
    const factor = maxDimension / maxSide;
    canvasW = Math.round(canvasW * factor);
    canvasH = Math.round(canvasH * factor);
    console.warn(
      `Export capped to ${maxDimension}px max side; output scaled by ${factor.toFixed(2)}`,
    );
  }

  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.imageSmoothingEnabled = true;
    if (ctx.imageSmoothingQuality) ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, canvasW, canvasH);

    // Unified solid background layer deployment block
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
      exportMapDataAsJson(jsonData, getExportFilename("json"));
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

/**
 * Exports map data (layers, markers) as a JSON file.
 * @param data - The data to serialize and download.
 * @param filename - The filename for the download.
 */
export function exportMapDataAsJson(
  data: object | object[],
  filename = "atlas-export.json",
) {
  exportToFile(data, filename);
}
