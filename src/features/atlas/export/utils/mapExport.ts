import type { ImageFormat } from "../types";

/**
 * Prepare an SVG clone for export by normalizing attributes and inlining styles.
 * @param original: source SVG element
 * @param inlineStyles: whether to inline computed styles into the clone
 */
export function prepareSvgClone(original: SVGSVGElement, inlineStyles = true) {
  const clone = original.cloneNode(true) as SVGSVGElement;

  if (!clone.getAttribute("xmlns")) {
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  }

  // Ensure viewBox exists
  const vb = clone.getAttribute("viewBox");
  if (!vb) {
    const w =
      (original.width &&
        original.width.baseVal &&
        original.width.baseVal.value) ||
      original.clientWidth ||
      1200;
    const h =
      (original.height &&
        original.height.baseVal &&
        original.height.baseVal.value) ||
      original.clientHeight ||
      800;
    clone.setAttribute("viewBox", `0 0 ${w} ${h}`);
  }

  // Remove background rects (explicit markers)
  clone
    .querySelectorAll(
      "rect[data-export-ignore], rect.background, rect[data-background]"
    )
    .forEach((n) => n.remove());

  if (inlineStyles) {
    // Inline computed styles for a conservative set of elements
    const elements = Array.from(
      clone.querySelectorAll<SVGElement>(
        "path, circle, rect, line, polyline, polygon, text, g"
      )
    );
    const ownerDoc = original.ownerDocument || document;
    elements.forEach((el) => {
      try {
        const orig = getCorrespondingOriginal(el, original, clone);
        if (!orig) return;
        const cs = ownerDoc.defaultView?.getComputedStyle(orig as Element);
        if (!cs) return;
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
        const inline: string[] = [];
        styleProps.forEach((p) => {
          const v = cs.getPropertyValue(p);
          if (v) inline.push(`${p}:${v}`);
        });
        const existing = el.getAttribute("style");
        el.setAttribute(
          "style",
          existing ? `${existing};${inline.join(";")}` : inline.join(";")
        );
      } catch {
        // ignore elements we can't compute
      }
    });
  }

  return clone;
}

/**
 * Given a node in a cloned tree, find the corresponding node in the original tree.
 * @param node: node in the cloned tree
 * @param originalRoot: root of the original tree
 * @param cloneRoot: root of the cloned tree
 * @returns corresponding node in the original tree, or null if not found
 */
export function getCorrespondingOriginal(
  node: any,
  originalRoot: any,
  cloneRoot: any
): any {
  // Walk up from node to root, collecting indices
  const path: number[] = [];
  let current = node;
  while (current && current !== cloneRoot) {
    if (!current.parentNode) return null; // Not in the tree
    const idx = Array.prototype.indexOf.call(
      current.parentNode.children,
      current
    );
    if (idx === -1) return null; // Not found among parent's children
    path.unshift(idx);
    current = current.parentNode;
  }
  if (current !== cloneRoot) return null; // Not in the clone tree

  // Walk down the same path from originalRoot
  let original = originalRoot;
  for (const idx of path) {
    if (!original.children || !original.children[idx]) return null;
    original = original.children[idx];
  }
  return original;
}

/**
 * Trigger a download for a blob.
 * @param blob: data blob
 * @param filename: output filename
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export SVG as normalized SVG file.
 * @param svgElement: source SVG element
 * @param filename: output filename
 * @param inlineStyles: whether to inline computed styles into the clone
 */
export function exportSvg(
  svgElement: SVGSVGElement,
  filename = "map.svg",
  inlineStyles = true
) {
  if (!svgElement) return;

  const clone = prepareSvgClone(svgElement, inlineStyles);
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clone);
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  downloadBlob(blob, filename);
}

/**
 * Export SVG as high-quality image.
 * @param svgElement: source SVG element
 * @param filename: output filename
 * @param format: image format ("png", "jpeg", "webp")
 * @param scale: integer multiplier (1,2,4...), devicePixelRatio is applied automatically
 * @param inlineStyles: whether to inline computed styles into the clone before rasterizing
 * @param maxDimension: cap for largest canvas side to protect memory (default 8192)
 * @param quality: image quality (0 to 1; ignored for png)
 * @param backgroundColor: background color to apply (default white)
 */
export async function exportSvgAsImage(
  svgElement: SVGSVGElement,
  filename: string = "map.png",
  format: ImageFormat = "png",
  scale: number = 3,
  inlineStyles: boolean = true,
  maxDimension: number = 8192,
  quality: number = 1,
  backgroundColor?: string
) {
  if (!svgElement) return;

  const clone = prepareSvgClone(svgElement, inlineStyles);
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clone);

  // Derive source dimensions from viewBox or width/height
  const vb = clone.getAttribute("viewBox");
  let vw = 0;
  let vh = 0;

  // Parse viewBox if present
  if (vb) {
    const parts = vb
      .split(/\s+|,/)
      .map(Number)
      .filter((n) => !Number.isNaN(n));
    if (parts.length >= 4) {
      vw = parts[2];
      vh = parts[3];
    }
  }

  // Fallback to width/height attributes or client dimensions
  if (!vw || !vh) {
    vw =
      (clone.width && clone.width.baseVal && clone.width.baseVal.value) ||
      clone.clientWidth ||
      1200;
    vh =
      (clone.height && clone.height.baseVal && clone.height.baseVal.value) ||
      clone.clientHeight ||
      800;
  }

  // Calculate canvas dimensions
  const DPR = window.devicePixelRatio || 1;
  let canvasW = Math.round(vw * DPR * scale);
  let canvasH = Math.round(vh * DPR * scale);

  // Cap dimensions to avoid OOM; if capped, scale down proportionally
  const maxSide = Math.max(canvasW, canvasH);
  if (maxSide > maxDimension) {
    const factor = maxDimension / maxSide;
    canvasW = Math.round(canvasW * factor);
    canvasH = Math.round(canvasH * factor);
    console.warn(
      `Export capped to ${maxDimension}px max side; output scaled by ${factor.toFixed(
        2
      )}`
    );
  }

  // Create canvas and context
  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext("2d");

  // Clear canvas before drawing
  if (ctx) {
    ctx.imageSmoothingEnabled = true;
    if (ctx.imageSmoothingQuality) ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, canvasW, canvasH);
    // Always fill for JPEG, or use provided background for others
    if (format === "jpeg" || backgroundColor) {
      ctx.save();
      ctx.fillStyle = backgroundColor || "#fff";
      ctx.fillRect(0, 0, canvasW, canvasH);
      ctx.restore();
    }
  }

  // Fill background if specified
  if (ctx && backgroundColor) {
    ctx.save();
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasW, canvasH);
    ctx.restore();
  }

  // Render SVG data to canvas
  const svgBlob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  img.crossOrigin = "anonymous";

  try {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        try {
          if (ctx) ctx.drawImage(img, 0, 0, canvasW, canvasH);
          URL.revokeObjectURL(url);
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to create PNG blob"));
                return;
              }
              downloadBlob(blob, filename);
              resolve();
            },
            `image/${format}`,
            quality
          );
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
    console.error("exportSvgAsPng error:", err);
  }
}
