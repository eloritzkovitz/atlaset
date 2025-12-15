import { hexToRgba, parseRgba, blendColors } from "./color";

describe("hexToRgba", () => {
  it("converts 3-digit hex to rgba", () => {
    expect(hexToRgba("#f0a")).toBe("rgba(255, 0, 170, 1)");
  });

  it("converts 6-digit hex to rgba", () => {
    expect(hexToRgba("#123456")).toBe("rgba(18, 52, 86, 1)");
    expect(hexToRgba("#ffffff")).toBe("rgba(255, 255, 255, 1)");
    expect(hexToRgba("#000000")).toBe("rgba(0, 0, 0, 1)");
  });

  it("applies custom alpha value", () => {
    expect(hexToRgba("#f0a", 0.5)).toBe("rgba(255, 0, 170, 0.5)");
    expect(hexToRgba("#123456", 0.25)).toBe("rgba(18, 52, 86, 0.25)");
  });

  it("returns white for invalid hex", () => {
    expect(hexToRgba("invalid")).toBe("rgba(0, 0, 0, 1)");
    expect(hexToRgba("#12")).toBe("rgba(0, 0, 0, 1)");
    expect(hexToRgba("")).toBe("rgba(0, 0, 0, 1)");
  });

  it("returns black for non-string input", () => {
    // @ts-expect-error testing runtime behavior
    expect(hexToRgba(null)).toBe("rgba(0, 0, 0, 1)");
    // @ts-expect-error testing runtime behavior
    expect(hexToRgba(undefined)).toBe("rgba(0, 0, 0, 1)");
    // @ts-expect-error testing runtime behavior
    expect(hexToRgba(123)).toBe("rgba(0, 0, 0, 1)");
    // @ts-expect-error testing runtime behavior
    expect(hexToRgba({})).toBe("rgba(0, 0, 0, 1)");
  });
});

describe("parseRgba", () => {
  it("parses a valid RGBA string", () => {
    expect(parseRgba("rgba(10, 20, 30, 0.5)")).toEqual([10, 20, 30, 0.5]);
  });

  it("returns default for invalid string", () => {
    expect(parseRgba("invalid")).toEqual([255, 255, 255, 1]);
  });
});

describe("blendColors", () => {
  it("blends two colors correctly", () => {
    // Blend red (fully opaque) over white
    expect(blendColors(["rgba(255,0,0,1)"])).toBe("#ff0000");
    // Blend semi-transparent blue over white
    expect(blendColors(["rgba(0,0,255,0.5)"])).toBe("#8080ff");
    // Blend two colors
    expect(blendColors(["rgba(255,0,0,0.5)", "rgba(0,255,0,0.5)"])).toBe(
      "#80c040"
    );
  });

  it("returns white for empty array", () => {
    expect(blendColors([])).toBe("#ffffff");
  });
});
