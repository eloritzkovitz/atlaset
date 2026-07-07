import {
  rgbaToHex,
  hexToRgba,
  parseRgba,
  blendColors,
  getContrastingTextColor,
  darkenHexColor,
} from "./color";

describe("getContrastingTextColor", () => {
  it.each([
    ["#ffffff", "#222"],
    ["#eeeeee", "#222"],
    ["#000000", "#f3f3f3"],
    ["#222222", "#f3f3f3"],
    ["#12", "#222"],
    ["", "#222"],
    ["#gggggg", "#222"],
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
    ["#ff0000", 0.1, "#e50000"],
    ["#12", undefined, "#12"],
    ["", undefined, ""],
    ["#gggggg", undefined, "#gggggg"],
  ])("darkens %s by %s amount to %s", (hex, amount, expected) => {
    expect(darkenHexColor(hex, amount)).toBe(expected);
  });
});

describe("rgbaToHex", () => {
  it.each([
    ["rgba(255, 0, 0, 1)", "#ff0000ff"],
    ["rgba(0, 255, 0, 0.5)", "#00ff007f"],
    ["rgba(0, 0, 255, 0)", "#0000ff00"],
    ["rgb(255, 255, 255)", "#ffffffff"],
    ["rgba(10, 20, 30, notanumber)", "#0a141eff"],
    ["invalid", "invalid"],
    ["rgb(300, 0, 0)", "rgb(300, 0, 0)"],
    ["rgba(300, 0, 0, 1)", "rgba(300, 0, 0, 1)"],
    ["rgba(255, 0, 0)", "rgba(255, 0, 0)"],
    ["rgba(-1, 0, 0, 1)", "rgba(-1, 0, 0, 1)"],
  ])("converts '%s' to '%s'", (input, expected) => {
    expect(rgbaToHex(input)).toBe(expected);
  });
});

describe("hexToRgba", () => {
  it.each([
    ["#f0a", undefined, "rgba(255, 0, 170, 1)"],
    ["#123456", undefined, "rgba(18, 52, 86, 1)"],
    ["#ffffff", undefined, "rgba(255, 255, 255, 1)"],
    ["#000000", undefined, "rgba(0, 0, 0, 1)"],
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

describe("parseRgba", () => {
  it.each([
    ["rgba(10, 20, 30, 0.5)", [10, 20, 30, 0.5]],
    ["invalid", [255, 255, 255, 1]],
  ])("parses '%s' into %j", (input, expected) => {
    expect(parseRgba(input)).toEqual(expected);
  });
});

describe("blendColors", () => {
  it.each([
    [["rgba(255,0,0,1)"], "#ff0000"],
    [["rgba(0,0,255,0.5)"], "#8080ff"],
    [["rgba(255,0,0,0.5)", "rgba(0,255,0,0.5)"], "#80c040"],
    [[], "#ffffff"],
  ])("blends %j into %s", (input, expected) => {
    expect(blendColors(input)).toBe(expected);
  });
});
