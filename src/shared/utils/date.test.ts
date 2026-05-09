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
} from "./date";

describe("formatDate", () => {
  const cases: Array<
    [string | undefined, string | undefined, string | RegExp]
  > = [
    [undefined, undefined, ""],
    ["", undefined, ""],
    ["2023-01-15", undefined, "15/01/2023"],
    ["2023-01-15", "en-US", "1/15/2023"],
    ["not-a-date", undefined, /Invalid/],
  ];

  test.each(cases)("formatDate(%s, %s)", (input, locale, expected) => {
    const res = formatDate(input as any, locale as any);
    if (expected instanceof RegExp) expect(res).toMatch(expected);
    else expect(res).toBe(expected);
  });
});

describe("formatFirestoreDate", () => {
  const fakeTimestamp = { toDate: () => new Date("2023-01-15T00:00:00Z") };
  const cases: Array<[unknown, string]> = [
    [fakeTimestamp, "15/01/2023"],
    ["2023-01-15", "15/01/2023"],
    [undefined, "Unknown"],
    [null, "Unknown"],
    [{}, "Unknown"],
    ["", "Unknown"],
  ];

  test.each(cases)("formatFirestoreDate(%p) -> %s", (input, expected) => {
    expect(formatFirestoreDate(input as any)).toBe(expected);
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
