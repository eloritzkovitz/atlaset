import {
  clamp,
  percent,
  parseComparator,
  parseYearComparator,
  compareNumeric,
} from "./number";

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

describe("parseComparator", () => {
  it("parses simple numeric string with implicit equals", () => {
    expect(parseComparator("42")).toEqual({ op: "=", value: 42 });
  });

  it("parses string with explicit operator", () => {
    expect(parseComparator("> 100")).toEqual({ op: ">", value: 100 });
    expect(parseComparator("<=50")).toEqual({ op: "<=", value: 50 });
  });

  it("returns null for invalid input", () => {
    expect(parseComparator("abc")).toBeNull();
    expect(parseComparator(">")).toBeNull();
    expect(parseComparator(">= ")).toBeNull();
  });
});

describe("parseYearComparator", () => {
  it("parses valid year comparator strings", () => {
    expect(parseYearComparator("2020")).toEqual({ op: "=", year: 2020 });
    expect(parseYearComparator("> 1990")).toEqual({ op: ">", year: 1990 });
    expect(parseYearComparator("<= 2005")).toEqual({ op: "<=", year: 2005 });
  });

  it("returns null for invalid year strings", () => {
    expect(parseYearComparator("abc")).toBeNull();
    expect(parseYearComparator("> 20a0")).toBeNull();
    expect(parseYearComparator(">= ")).toBeNull();
  });

  it("returns null for non-year numeric strings", () => {
    expect(parseYearComparator("> 99")).toBeNull();
    expect(parseYearComparator("<= 12345")).toBeNull();
  });
});

describe("compareNumeric", () => {
  it("returns true for valid comparisons", () => {
    expect(compareNumeric(">", 5, 3)).toBe(true);
    expect(compareNumeric("<", 2, 4)).toBe(true);
    expect(compareNumeric(">=", 5, 5)).toBe(true);
    expect(compareNumeric("<=", 3, 3)).toBe(true);
    expect(compareNumeric("=", 7, 7)).toBe(true);
  });

  it("returns false for invalid comparisons", () => {
    expect(compareNumeric(">", 2, 5)).toBe(false);
    expect(compareNumeric("<", 4, 2)).toBe(false);
    expect(compareNumeric(">=", 4, 5)).toBe(false);
    expect(compareNumeric("<=", 6, 5)).toBe(false);
    expect(compareNumeric("=", 8, 9)).toBe(false);
  });

  it("handles approximate comparisons with `~`", () => {
    expect(compareNumeric("~", 103, 100)).toBe(true);
    expect(compareNumeric("~", 100, 95)).toBe(true);
    expect(compareNumeric("~", 95, 100)).toBe(true);
    expect(compareNumeric("~", 106, 100)).toBe(false);
  });

  it("respects a custom tolerance parameter for `~`", () => {
    expect(compareNumeric("~", 106, 100, 0.06)).toBe(true);
    expect(compareNumeric("~", 104, 100, 0.03)).toBe(false);
  });

  it("handles `b === 0` for approximate comparisons", () => {
    expect(compareNumeric("~", 0.03, 0)).toBe(true);
    expect(compareNumeric("~", 0.1, 0)).toBe(false);
  });
});
