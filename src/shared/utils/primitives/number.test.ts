import { clamp, formatFraction, formatPercent, formatRank } from "./number";

describe("formatPercent", () => {
  it("returns correct percentage string for ratio inputs", () => {
    expect(formatPercent(0.25)).toBe("25%");
    expect(formatPercent(0)).toBe("0%");
    expect(formatPercent(1)).toBe("100%");
  });

  it("returns correct percentage string for value and total", () => {
    expect(formatPercent(50, 200)).toBe("25%");
  });

  it("rounds to nearest whole number by default", () => {
    expect(formatPercent(33, 200)).toBe("17%");
    expect(formatPercent(67, 200)).toBe("34%");
  });

  it("formats decimal places when options are provided", () => {
    expect(formatPercent(33, 200, { decimals: 1 })).toBe("16.5%");
    expect(formatPercent(1, 3, { decimals: 2 })).toBe("33.33%");
  });

  it("returns '0%' when denominator is zero", () => {
    expect(formatPercent(50, 0)).toBe("0%");
  });
});

describe("formatFraction", () => {
  it("formats count and total into fraction string", () => {
    expect(formatFraction(5, 10)).toBe("5/10");
    expect(formatFraction(1, 3)).toBe("1/3");
  });

  it("supports custom decimal precision for the percentage", () => {
    expect(formatFraction(5, 10, { showPercent: true, decimals: 1 })).toBe(
      "5/10 (50.0%)",
    );
    expect(formatFraction(1, 3, { showPercent: true, decimals: 2 })).toBe(
      "1/3 (33.33%)",
    );
  });

  it("handles zero denominator safely", () => {
    expect(formatFraction(5, 0, { showPercent: true })).toBe("5/0 (0%)");
  });

  it("does not show percentage when showPercent is false", () => {
    expect(formatFraction(5, 10, { showPercent: false })).toBe("5/10");
  });
});

describe("formatRank", () => {
  it("formats valid ranks with '#' prefix by default", () => {
    expect(formatRank(1)).toBe("#1");
    expect(formatRank(2)).toBe("#2");
    expect(formatRank(100)).toBe("#100");
  });

  it("floors decimal inputs to whole numbers", () => {
    expect(formatRank(1.8)).toBe("#1");
  });

  it("supports omitting the hash symbol", () => {
    expect(formatRank(1, { showHash: false })).toBe("1");
  });

  it("returns fallback for null, undefined, NaN, or non-positive values", () => {
    expect(formatRank(null)).toBe("—");
    expect(formatRank(undefined)).toBe("—");
    expect(formatRank(NaN)).toBe("—");
    expect(formatRank(0)).toBe("—");
    expect(formatRank(-5)).toBe("—");
  });

  it("uses custom fallback when provided", () => {
    expect(formatRank(null, { fallback: "N/A" })).toBe("N/A");
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
