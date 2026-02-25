import {
  rgbaToHex,
  hexToRgba,
  parseRgba,
  blendColors,
  getContrastingTextColor,
  darkenHexColor,
} from "./color";

describe("getContrastingTextColor", () => {
  it("returns #222 for light backgrounds", () => {
    expect(getContrastingTextColor("#ffffff")).toBe("#222");
    expect(getContrastingTextColor("#eeeeee")).toBe("#222");
  });

  it("returns #f3f3f3 for dark backgrounds", () => {
    expect(getContrastingTextColor("#000000")).toBe("#f3f3f3");
    expect(getContrastingTextColor("#222222")).toBe("#f3f3f3");
  });

  it("returns #222 for invalid hex", () => {
    expect(getContrastingTextColor("#12")).toBe("#222");
    expect(getContrastingTextColor("")).toBe("#222");
    // Covers NaN branch in parseHexColor
    expect(getContrastingTextColor("#gggggg")).toBe("#222");
  });
});

describe("darkenHexColor", () => {
  it("darkens a color by default amount", () => {
    expect(darkenHexColor("#888888")).toBe("#666666");
    expect(darkenHexColor("#ff0000")).toBe("#bf0000");
    expect(darkenHexColor("#00ff00")).toBe("#00bf00");
    expect(darkenHexColor("#0000ff")).toBe("#0000bf");
  });

  it("darkens a color by custom amount", () => {
    expect(darkenHexColor("#888888", 0.5)).toBe("#444444");
    expect(darkenHexColor("#ff0000", 0.1)).toBe("#e50000");
  });

  it("returns original hex for invalid input", () => {
    expect(darkenHexColor("#12")).toBe("#12");
    expect(darkenHexColor("")).toBe("");
    expect(darkenHexColor("#gggggg")).toBe("#gggggg");
  });
});

describe("rgbaToHex", () => {
  it("converts rgba to hex correctly", () => {
    expect(rgbaToHex("rgba(255, 0, 0, 1)")).toBe("#ff0000ff");
    expect(rgbaToHex("rgba(0, 255, 0, 0.5)")).toBe("#00ff007f");
    expect(rgbaToHex("rgba(0, 0, 255, 0)")).toBe("#0000ff00");
    expect(rgbaToHex("rgb(255, 255, 255)")).toBe("#ffffffff");
    expect(rgbaToHex("rgba(10, 20, 30, notanumber)")).toBe("#0a141eff");
  });

  it("returns original string for invalid input", () => {
    expect(rgbaToHex("invalid")).toBe("invalid");
    expect(rgbaToHex("rgb(300, 0, 0)")).toBe("rgb(300, 0, 0)");
    expect(rgbaToHex("rgba(300, 0, 0, 1)")).toBe("rgba(300, 0, 0, 1)");
    expect(rgbaToHex("rgba(255, 0, 0)")).toBe("rgba(255, 0, 0)");
    expect(rgbaToHex("rgba(-1, 0, 0, 1)")).toBe("rgba(-1, 0, 0, 1)");
  });
});

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
      "#80c040",
    );
  });

  it("returns white for empty array", () => {
    expect(blendColors([])).toBe("#ffffff");
  });
});
