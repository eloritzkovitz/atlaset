import { describe, expect, it, vi } from "vitest";
import {
  getElementDim,
  getCorrespondingNode,
  prepareSvgClone,
  svgToBlob,
} from "./svg";

describe("svg utils", () => {
  describe("getElementDim", () => {
    it("handles value, clientValue, and fallback branches", () => {
      const animatedLen = { baseVal: { value: 500 } } as SVGAnimatedLength;
      expect(getElementDim(animatedLen, 0, 100)).toBe(500);
      expect(getElementDim(undefined, 300, 100)).toBe(300);
      expect(getElementDim(undefined, 0, 100)).toBe(100);
    });
  });

  describe("getCorrespondingNode", () => {
    it("finds corresponding node across multi-sibling trees and hits all loop/branch conditions", () => {
      const origRoot = document.createElement("div");
      origRoot.innerHTML =
        "<div><span id='a'></span><span id='b'></span><span id='c'></span></div>";

      const cloneRoot = origRoot.cloneNode(true) as Element;
      const cloneTarget = cloneRoot.querySelector("#c")!;
      const origTarget = origRoot.querySelector("#c")!;

      expect(getCorrespondingNode(cloneTarget, origRoot, cloneRoot)).toBe(
        origTarget,
      );
      expect(getCorrespondingNode(cloneRoot, origRoot, cloneRoot)).toBe(
        origRoot,
      );

      const detached = document.createElement("span");
      expect(getCorrespondingNode(detached, origRoot, cloneRoot)).toBeNull();

      const wrongRoot = document.createElement("div");
      const wrapper = document.createElement("div");
      wrapper.appendChild(cloneTarget);
      expect(getCorrespondingNode(cloneTarget, origRoot, wrongRoot)).toBeNull();

      const missingChildOrig = document.createElement("div");
      missingChildOrig.innerHTML = "<div></div>";
      expect(
        getCorrespondingNode(
          cloneRoot.querySelector("#c")!,
          missingChildOrig,
          cloneRoot,
        ),
      ).toBeNull();

      const deepCloneRoot = document.createElement("div");
      deepCloneRoot.innerHTML = "<div><span><a></a></span></div>";
      const deepCloneTarget = deepCloneRoot.querySelector("a")!;

      const emptyOrigRoot = document.createElement("div");

      expect(
        getCorrespondingNode(deepCloneTarget, emptyOrigRoot, deepCloneRoot),
      ).toBeNull();
    });
  });

  describe("prepareSvgClone", () => {
    it("clones SVG with viewBox, inline styles, title elements, and ignored element filtering", () => {
      const origSvg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      origSvg.innerHTML = `
        <g data-export-title="Region A">
          <path d="M0 0" style="fill:red" />
        </g>
        <rect class="background" />
      `;

      vi.spyOn(window, "getComputedStyle").mockReturnValue({
        getPropertyValue: (p: string) => (p === "fill" ? "blue" : ""),
      } as CSSStyleDeclaration);

      const clone = prepareSvgClone(origSvg, true, true);

      expect(clone.getAttribute("xmlns")).toBe("http://www.w3.org/2000/svg");
      expect(clone.getAttribute("viewBox")).toBe("0 0 1200 800");
      expect(clone.querySelector("rect.background")).toBeNull();
      expect(clone.querySelector("g > title")?.textContent).toBe("Region A");
      expect(clone.querySelector("path")?.getAttribute("style")).toBe(
        "fill:red;fill:blue",
      );
    });

    it("handles falsy titleText, pre-existing viewBox, and empty inline props", () => {
      const origSvg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      origSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      origSvg.setAttribute("viewBox", "0 0 500 500");
      origSvg.innerHTML = `<g data-export-title=""><circle style="opacity:1" /></g>`;

      vi.spyOn(window, "getComputedStyle").mockReturnValue({
        getPropertyValue: () => "",
      } as unknown as CSSStyleDeclaration);

      const clone = prepareSvgClone(origSvg, true, true);

      expect(clone.getAttribute("viewBox")).toBe("0 0 500 500");
      expect(clone.querySelector("title")).toBeNull();
      expect(clone.querySelector("circle")?.getAttribute("style")).toBe(
        "opacity:1",
      );
    });

    it("covers Line 121: orig is null branch, defaultView is null, ownerDocument fallback, and throw catch", () => {
      const originalSvg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      const dummyClone = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      dummyClone.innerHTML = `<path d="M0 0" />`;

      vi.spyOn(originalSvg, "cloneNode").mockReturnValue(dummyClone);

      const cloneNullOrig = prepareSvgClone(originalSvg, true, false);
      expect(cloneNullOrig).toBeDefined();

      vi.restoreAllMocks();

      const origSvg2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      origSvg2.innerHTML = `<path d="M0 0" />`;

      Object.defineProperty(origSvg2, "ownerDocument", {
        value: { defaultView: null },
        configurable: true,
      });

      const clone1 = prepareSvgClone(origSvg2, true, false);
      expect(clone1).toBeDefined();

      Object.defineProperty(origSvg2, "ownerDocument", {
        value: undefined,
        configurable: true,
      });

      const clone2 = prepareSvgClone(origSvg2, true, false);
      expect(clone2).toBeDefined();

      vi.spyOn(window, "getComputedStyle").mockImplementation(() => {
        throw new Error("Computed style failure");
      });

      const clone3 = prepareSvgClone(origSvg2, true, false);
      expect(clone3).toBeDefined();
    });
  });

  describe("svgToBlob", () => {
    it("serializes SVG to Blob", () => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const blob = svgToBlob(svg);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe("image/svg+xml;charset=utf-8");
    });
  });
});
