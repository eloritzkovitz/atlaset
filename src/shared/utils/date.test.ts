import i18n from "i18next";
import {
  formatDate,
  formatFirestoreDate,
  getYear,
  getYearNumber,
  getCurrentYear,
  getTimestamp,
  formatTimeSeconds,
  getMonthsShort,
  getMonthsLong,
  formatMonthValues,
  setAppDateLocale,
} from "./date";

describe("formatDate", () => {
  const defaults: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  const cases: Array<[string | undefined, string | undefined]> = [
    [undefined, undefined],
    ["", undefined],
    ["2023-01-15", undefined],
    ["2023-01-15", "en-US"],
    ["not-a-date", undefined],
  ];

  const getLang = (locale?: string) =>
    (locale as string) ||
    i18n?.language ||
    (typeof navigator !== "undefined" && navigator.language) ||
    "en-GB";

  const intlFormat = (d: Date, locale?: string, opts = defaults) =>
    new Intl.DateTimeFormat(getLang(locale), opts).format(d);

  test.each(cases)("formatDate(%s, %s)", (input, locale) => {
    if (!input) return expect(formatDate(input as any, locale as any)).toBe("");

    const d = new Date(input as string);
    if (isNaN(d.getTime()))
      return expect(() => formatDate(input as any, locale as any)).toThrow(/Invalid/);

    expect(formatDate(input as any, locale as any)).toBe(intlFormat(d, locale));
  });
});

describe("formatFirestoreDate", () => {
  const fakeTimestamp = { toDate: () => new Date("2023-01-15T00:00:00Z") };
  const cases: Array<[unknown, string]> = [
    [fakeTimestamp, "EXPECTED"],
    ["2023-01-15", "EXPECTED"],
    [undefined, "Unknown"],
    [null, "Unknown"],
    [{}, "Unknown"],
    ["", "Unknown"],
  ];

  test.each(cases)("formatFirestoreDate(%p) -> %s", (input, expected) => {
    const res = formatFirestoreDate(input as any);
    if (expected === "EXPECTED") {
      const d = (input as any).toDate
        ? (input as any).toDate()
        : new Date(input as string);
      const lang =
        i18n?.language ||
        (typeof navigator !== "undefined" && navigator.language) ||
        "en-GB";
      const expectedStr = new Intl.DateTimeFormat(lang, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(d);
      expect(res).toBe(expectedStr);
    } else {
      expect(res).toBe(expected);
    }
  });
});

describe("setAppDateLocale", () => {
  afterEach(() => setAppDateLocale(undefined));

  it("applies the app-wide locale when none is provided", () => {
    setAppDateLocale("en-US");
    const d = new Date("2023-01-15");
    const expected = new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
    expect(formatDate("2023-01-15")).toBe(expected);
  });

  it("clearing the app locale falls back to defaults", () => {
    setAppDateLocale(null);
    const d = new Date("2023-01-15");
    const lang =
      i18n?.language ||
      (typeof navigator !== "undefined" && navigator.language) ||
      "en-GB";
    const expected = new Intl.DateTimeFormat(lang, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
    expect(formatDate("2023-01-15")).toBe(expected);
  });
});

describe("getYear", () => {
  test.each([
    [undefined, undefined],
    ["", undefined],
    ["2023-01-15", "2023"],
    ["not-a-date", undefined],
  ])("getYear(%p) -> %p", (input, expected) => {
    expect(getYear(input as any)).toBe(expected as any);
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
  test.each([
    [undefined, undefined],
    ["", undefined],
    ["2023-01-15", 2023],
    ["not-a-date", undefined],
  ])("getYearNumber(%p) -> %p", (input, expected) => {
    expect(getYearNumber(input as any)).toBe(expected as any);
  });
});

describe("getTimestamp", () => {
  test.each([
    [1625078400000, 1625078400000],
    [
      new Date("2021-06-30T00:00:00Z"),
      new Date("2021-06-30T00:00:00Z").getTime(),
    ],
    ["2021-06-30T00:00:00Z", new Date("2021-06-30T00:00:00Z").getTime()],
  ])("getTimestamp(%p) -> %p", (input, expected) => {
    expect(getTimestamp(input as any)).toBe(expected as any);
  });

  it("returns NaN for invalid date string", () => {
    expect(isNaN(getTimestamp("not-a-date"))).toBe(true);
  });
});

describe("formatTimeSeconds", () => {
  test.each([
    [undefined, "-"],
    [NaN, "-"],
    [45, "0:45"],
    [125, "2:05"],
    [0, "0:00"],
  ])("formatTimeSeconds(%p) -> %s", (input, expected) => {
    expect(formatTimeSeconds(input as any)).toBe(expected as any);
  });
});

describe("month normalization utilities", () => {
  test.each([
    [
      ["Jan", "Feb", "Mar"],
      ["Jan", "Feb", "Mar"],
    ],
    [{ "0": "Jan", "1": "Feb" }, ["Jan", "Feb"]],
    [{ a: "Alpha", b: "Beta" }, ["Alpha", "Beta"]],
    [undefined, []],
    [null, []],
    ["string" as unknown, []],
  ])("formatMonthValues(%p) -> %p", (input, expected) => {
    expect(formatMonthValues(input as any)).toEqual(expected as any);
  });

  it("getMonthsShort delegates to t function", () => {
    const t = (key: string) => (key === "months.short" ? ["J", "F", "M"] : []);
    expect(getMonthsShort(t as any)).toEqual(["J", "F", "M"]);
  });

  it("getMonthsLong delegates to t function", () => {
    const t = (key: string) =>
      key === "months.long" ? { 0: "January", 1: "February" } : [];
    expect(getMonthsLong(t as any)).toEqual(["January", "February"]);
  });
});
