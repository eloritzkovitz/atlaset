import {
  formatDate,
  getYear,
  getYearNumber,
  getCurrentYear,
  getTimestamp,
} from "./date";

describe("formatDate", () => {
  it("returns empty string for undefined input", () => {
    expect(formatDate(undefined)).toBe("");
  });

  it("returns empty string for empty input", () => {
    expect(formatDate("")).toBe("");
  });

  it("formats a valid date string (default locale)", () => {
    // "2023-01-15" in en-GB is "15/01/2023"
    expect(formatDate("2023-01-15")).toBe("15/01/2023");
  });

  it("formats a valid date string (US locale)", () => {
    // "2023-01-15" in en-US is "1/15/2023"
    expect(formatDate("2023-01-15", "en-US")).toBe("1/15/2023");
  });

  it("handles invalid date string gracefully", () => {
    // Invalid date returns "Invalid Date" in most locales
    expect(formatDate("not-a-date")).toMatch(/Invalid/);
  });
});

describe("getYear", () => {
  it("returns undefined for undefined input", () => {
    expect(getYear(undefined)).toBeUndefined();
  });

  it("returns undefined for empty input", () => {
    expect(getYear("")).toBeUndefined();
  });

  it("returns year as string for valid date", () => {
    expect(getYear("2023-01-15")).toBe("2023");
  });

  it("returns undefined for invalid date", () => {
    expect(getYear("not-a-date")).toBeUndefined();
  });
});

describe("getCurrentYear", () => {
  it("returns the current year as a number", () => {
    const year = getCurrentYear();
    const actual = new Date().getFullYear();
    expect(year).toBe(actual);
    expect(typeof year).toBe("number");
  });
});

describe("getYearNumber", () => {
  it("returns undefined for undefined input", () => {
    expect(getYearNumber(undefined)).toBeUndefined();
  });

  it("returns undefined for empty input", () => {
    expect(getYearNumber("")).toBeUndefined();
  });

  it("returns year as number for valid date", () => {
    expect(getYearNumber("2023-01-15")).toBe(2023);
  });

  it("returns undefined for invalid date", () => {
    expect(getYearNumber("not-a-date")).toBeUndefined();
  });
});

describe("getTimestamp", () => {
  it("returns number input as is", () => {
    expect(getTimestamp(1625078400000)).toBe(1625078400000);
  });

  it("returns timestamp from Date object", () => {
    const date = new Date("2021-06-30T00:00:00Z");
    expect(getTimestamp(date)).toBe(date.getTime());
  });

  it("returns timestamp from valid date string", () => {
    const dateStr = "2021-06-30T00:00:00Z";
    expect(getTimestamp(dateStr)).toBe(new Date(dateStr).getTime());
  });

  it("returns NaN for invalid date string", () => {
    expect(isNaN(getTimestamp("not-a-date"))).toBe(true);
  });
});
