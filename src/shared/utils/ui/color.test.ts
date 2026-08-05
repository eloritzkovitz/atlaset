import {
  parseRgba,
  rgbToHex,
  getContrastingTextColor,
  darkenHexColor,
  hexToRgba,
} from "./color";

describe("parseRgba", () => {
  it.each([
    ["", [0, 0, 0, 0]],
    [null, [0, 0, 0, 0]],
    [undefined, [0, 0, 0, 0]],
    [123, [0, 0, 0, 0]],
    ["transparent", [0, 0, 0, 0]],
    ["none", [0, 0, 0, 0]],

    ["#f0a", [255, 0, 170, 1]],
    ["#123456", [18, 52, 86, 1]],
    ["#12345680", [18, 52, 86, 0.5019607843137255]],
    ["#12", [0, 0, 0, 0]],

    ["rgb(255, 0, 100)", [255, 0, 100, 1]],
    ["rgba(10, 20, 30, 0.5)", [10, 20, 30, 0.5]],
    ["rgba(10, 20, 30, 0)", [10, 20, 30, 0]],

    ["invalid-color", [0, 0, 0, 0]],
  ])("parses '%s' into %j", (input, expected) => {
    // @ts-expect-error testing invalid runtime inputs
    expect(parseRgba(input)).toEqual(expected);
  });
});

describe("rgbToHex", () => {
  it.each([
    [255, 0, 170, "#ff00aa"],
    [0, 0, 0, "#000000"],
    [255, 255, 255, "#ffffff"],
    [-10, 300, 128.6, "#00ff81"],
  ])("converts rgb(%s, %s, %s) to hex %s", (r, g, b, expected) => {
    expect(rgbToHex(r, g, b)).toBe(expected);
  });
});

describe("getContrastingTextColor", () => {
  it.each([
    ["#ffffff", "#222"],
    ["#eeeeee", "#222"],
    ["#000000", "#f3f3f3"],
    ["#222222", "#f3f3f3"],
    ["#12", "#f3f3f3"],
    ["", "#f3f3f3"],
    ["#gggggg", "#f3f3f3"],
  ])("returns correct contrast for '%s'", (input, expected) => {
    expect(getContrastingTextColor(input)).toBe(expected);
  });
});

describe("darkenHexColor", () => {
  it.each([
    ["#888888", undefined, "#666666"],
    ["#ff0000", undefined, "#bf0000"],
    ["#00ff00", undefined, "#00bf00"],
    ["#0000ff", undefined, "#0000bf"],
    ["#888888", 0.5, "#444444"],
    ["#ff0000", 0.1, "#e60000"],

    ["#ffffff", -0.5, "#ffffff"],
    ["#ffffff", 1.5, "#000000"],

    ["#12", undefined, "#000000"],
    ["", undefined, "#000000"],
    ["#gggggg", undefined, "#000000"],
  ])("darkens %s by %s amount to %s", (hex, amount, expected) => {
    expect(darkenHexColor(hex, amount)).toBe(expected);
  });
});

describe("hexToRgba", () => {
  it.each([
    ["#f0a", undefined, "rgba(255, 0, 170, 1)"],
    ["#123456", undefined, "rgba(18, 52, 86, 1)"],
    ["#ffffff", undefined, "rgba(255, 255, 255, 1)"],
    ["#000000", undefined, "rgba(0, 0, 0, 1)"],
    ["#f0a", 0.5, "rgba(255, 0, 170, 0.5)"],
    ["#123456", 0.25, "rgba(18, 52, 86, 0.25)"],

    ["invalid", undefined, "rgba(0, 0, 0, 1)"],
    ["#12", undefined, "rgba(0, 0, 0, 1)"],
    ["", undefined, "rgba(0, 0, 0, 1)"],
    [null, undefined, "rgba(0, 0, 0, 1)"],
    [undefined, undefined, "rgba(0, 0, 0, 1)"],
    [123, undefined, "rgba(0, 0, 0, 1)"],
    [{}, undefined, "rgba(0, 0, 0, 1)"],
  ])("converts hex %s with alpha %s to %s", (hex, alpha, expected) => {
    // @ts-expect-error testing runtime behavior for non-string types passed in matrix
    expect(hexToRgba(hex, alpha)).toBe(expected);
  });
});
