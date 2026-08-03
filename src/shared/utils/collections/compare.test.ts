import {
  parseComparator,
  parseYearComparator,
  compareNumeric,
} from "./compare";

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
