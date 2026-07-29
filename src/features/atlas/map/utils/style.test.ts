import { resolveCountryStyle } from "./style";

describe("resolveCountryStyle", () => {
  const mockStyle = {
    default: { fill: "#cccccc", stroke: "#fff" },
    hover: { fill: "#ff0000" },
    highlight: { fill: "#00ff00" },
    pressed: { fill: "#0000ff" },
  };

  const defaultArgs = {
    geographyStyle: mockStyle,
    isHighlighted: false,
    isHovered: false,
    isSelected: false,
    isAtlasActive: false,
    isAddingMarker: false,
  };

  it("should return the default fill style by default", () => {
    const result = resolveCountryStyle(defaultArgs);
    expect(result.fill).toBe("#cccccc");
    expect(result.stroke).toBe("#fff");
  });

  it("should prioritize highlight styles above all else", () => {
    const result = resolveCountryStyle({
      ...defaultArgs,
      isHighlighted: true,
      isHovered: true,
    });
    expect(result.fill).toBe("#00ff00");
  });

  it("should fall back to default fill if atlas color is missing in active atlas mode", () => {
    const result = resolveCountryStyle({
      ...defaultArgs,
      isAtlasActive: true,
      atlasColor: undefined,
    });
    expect(result.fill).toBe("#cccccc");
  });

  it("should use the blended fill color if provided and no state modifiers are active", () => {
    const result = resolveCountryStyle({
      ...defaultArgs,
      blendedFill: "#purple-blend",
    });
    expect(result.fill).toBe("#purple-blend");
  });

  it("should apply hover styles when isHovered is true", () => {
    const result = resolveCountryStyle({
      ...defaultArgs,
      isHovered: true,
    });
    expect(result.fill).toBe("#ff0000");
  });

  it("should change cursor style when isAddingMarker is true", () => {
    const result = resolveCountryStyle({
      ...defaultArgs,
      isAddingMarker: true,
    });
    expect(result.cursor).toBe("crosshair");
  });
});
