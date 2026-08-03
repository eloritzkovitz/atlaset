/**
 * Utility functions for handling SVG elements.
 */

const SVG_INLINE_STYLE_PROPS = [
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
] as const;

/** Get the dimension of an SVG element, falling back to a default value. */
export const getElementDim = (
  val: SVGAnimatedLength | undefined,
  clientVal: number,
  fallback: number,
) => val?.baseVal?.value || clientVal || fallback;

/**
 * Finds the corresponding node in the original SVG for a given node in the cloned SVG.
 * @param node - The node in the cloned SVG.
 * @param originalRoot - The root of the original SVG.
 * @param cloneRoot - The root of the cloned SVG.
 * @returns The corresponding node in the original SVG, or null if not found.
 */
export function getCorrespondingNode(
  node: Element,
  originalRoot: Element,
  cloneRoot: Element,
): Element | null {
  const path: number[] = [];
  let current: Element | null = node;

  // Traverse up the cloned SVG tree to build the path to the root
  while (current && current !== cloneRoot) {
    const parent: Element | null = current.parentElement;
    if (!parent) return null;

    let idx = 0;
    let sib: Element | null = current.previousElementSibling;
    while (sib) {
      idx++;
      sib = sib.previousElementSibling;
    }

    path.unshift(idx);
    current = parent;
  }
  if (current !== cloneRoot) return null;

  let original: Element | null = originalRoot;
  for (const idx of path) {
    if (!original) return null;
    original = original.children[idx] ?? null;
  }
  return original;
}

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

    elements.forEach((el) => {
      try {
        const orig = getCorrespondingNode(el, original, clone);
        const cs = orig ? ownerDoc.defaultView?.getComputedStyle(orig) : null;
        if (!cs) return;

        const inlineProps: string[] = [];
        for (const p of SVG_INLINE_STYLE_PROPS) {
          const v = cs.getPropertyValue(p);
          if (v) inlineProps.push(`${p}:${v}`);
        }

        if (inlineProps.length === 0) return;

        const existing = el.getAttribute("style");
        el.setAttribute(
          "style",
          existing
            ? `${existing};${inlineProps.join(";")}`
            : inlineProps.join(";"),
        );
      } catch {
        // ignore elements we can't compute
      }
    });
  }

  return clone;
}

/** Converts an SVG element into a serialized UTF-8 Data URL Blob. */
export function svgToBlob(svgElement: SVGSVGElement): Blob {
  const svgString = new XMLSerializer().serializeToString(svgElement);
  return new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
}
