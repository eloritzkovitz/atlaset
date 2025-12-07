import { clamp, percent } from "./number";

describe("percent", () => {
  it("returns correct percentage string", () => {
    expect(percent(50, 200)).toBe("25%");
  });

  it("rounds to nearest whole number", () => {
    expect(percent(33, 200)).toBe("17%");
    expect(percent(67, 200)).toBe("34%");
  });
  
  it("returns '0%' when denominator is zero", () => {
    expect(percent(50, 0)).toBe("0%");
  });
});

describe("clamp", () => {
  it("returns the value if within min and max", () => {
    expect(clamp(5, 1, 10)).toBe(5);
  });

  it("returns min if value is less than min", () => {
    expect(clamp(0, 1, 10)).toBe(1);
  });

  it("returns max if value is greater than max", () => {
    expect(clamp(15, 1, 10)).toBe(10);
  });

  it("handles undefined min (should use Number.MIN_SAFE_INTEGER)", () => {
    expect(clamp(-1e20, undefined, 10)).toBe(Number.MIN_SAFE_INTEGER);
  });

  it("handles undefined max (should use Number.MAX_SAFE_INTEGER)", () => {
    expect(clamp(1e20, 1, undefined)).toBe(Number.MAX_SAFE_INTEGER);
  });

  it("handles both min and max undefined", () => {
    expect(clamp(123)).toBe(123);
    expect(clamp(-1e20)).toBe(Number.MIN_SAFE_INTEGER);
    expect(clamp(1e20)).toBe(Number.MAX_SAFE_INTEGER);
  });
});
