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
  const defaultLocale =
    i18n?.language ||
    (typeof navigator !== "undefined" && navigator.language) ||
    "en-GB";

  it.each([
    [undefined, undefined, ""],
    ["", undefined, ""],
    [
      "2023-01-15",
      "en-US",
      new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date("2023-01-15")),
    ],
    [
      "2023-01-15T14:30:00Z",
      "long",
      new Intl.DateTimeFormat(defaultLocale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date("2023-01-15T14:30:00Z")),
    ],
    [
      "2023-01-15",
      { month: "short" },
      new Intl.DateTimeFormat(defaultLocale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date("2023-01-15")),
    ],
  ])(
    "formats input %p with options/locale %p to expect %p",
    (date, mix, expected) => {
      const opts =
        mix === "long" || (mix && typeof mix === "object") ? mix : undefined;
      const locale =
        typeof mix === "string" && mix !== "long" ? mix : undefined;

      expect(formatDate(date as any, opts as any, locale)).toBe(expected);
    },
  );

  it("throws on invalid date evaluation", () => {
    expect(() => formatDate("not-a-date")).toThrow();
  });
});

describe("formatFirestoreDate", () => {
  const fakeTimestamp = { toDate: () => new Date("2023-01-15T00:00:00Z") };

  const getExpectedFallback = () => {
    const defaultLocale =
      i18n?.language ||
      (typeof navigator !== "undefined" && navigator.language) ||
      "en-GB";
    return new Intl.DateTimeFormat(defaultLocale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date("2023-01-15"));
  };

  it.each([
    [fakeTimestamp, "DYNAMIC_EXPECTED"],
    ["2023-01-15", "DYNAMIC_EXPECTED"],
    [undefined, "Unknown"],
    [null, "Unknown"],
    [{}, "Unknown"],
    ["", "Unknown"],
  ])("processes firestore raw state %p", (input, expected) => {
    const finalExpected =
      expected === "DYNAMIC_EXPECTED" ? getExpectedFallback() : expected;
    expect(formatFirestoreDate(input)).toBe(finalExpected);
  });
});

describe("setAppDateLocale", () => {
  afterEach(() => setAppDateLocale(undefined));

  it("applies the app-wide locale when none is provided", () => {
    setAppDateLocale("en-US");
    const expected = new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date("2023-01-15"));
    expect(formatDate("2023-01-15")).toBe(expected);
  });

  it("clearing the app locale falls back to defaults", () => {
    setAppDateLocale(null);
    const defaultLocale =
      i18n?.language ||
      (typeof navigator !== "undefined" && navigator.language) ||
      "en-GB";
    const expected = new Intl.DateTimeFormat(defaultLocale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date("2023-01-15"));
    expect(formatDate("2023-01-15")).toBe(expected);
  });
});

describe("Year Extraction Utilities", () => {
  it.each([
    [getYear, undefined, undefined],
    [getYear, "", undefined],
    [getYear, "2023-01-15", "2023"],
    [getYear, "not-a-date", undefined],
    [getYearNumber, undefined, undefined],
    [getYearNumber, "", undefined],
    [getYearNumber, "2023-01-15", 2023],
    [getYearNumber, "not-a-date", undefined],
  ])(
    "evaluates year utility helper on %p -> %p",
    (utilityFn, input, expected) => {
      expect(utilityFn(input as string)).toBe(expected as any);
    },
  );

  it("resolves getCurrentYear matching system runtime", () => {
    expect(getCurrentYear()).toBe(new Date().getFullYear());
  });
});

describe("getTimestamp & formatTimeSeconds", () => {
  const sampleDate = new Date("2021-06-30T00:00:00Z");

  it.each([
    [getTimestamp, 1625078400000, 1625078400000],
    [getTimestamp, sampleDate, sampleDate.getTime()],
    [
      getTimestamp,
      "2021-06-30T00:00:00Z",
      new Date("2021-06-30T00:00:00Z").getTime(),
    ],
    [formatTimeSeconds, undefined, "-"],
    [formatTimeSeconds, NaN, "-"],
    [formatTimeSeconds, 45, "0:45"],
    [formatTimeSeconds, 125, "2:05"],
    [formatTimeSeconds, 0, "0:00"],
  ])(
    "computes standard math parsing properties",
    (utilityFn, input, expected) => {
      expect(utilityFn(input as any)).toBe(expected as any);
    },
  );

  it("resolves NaN string conversions cleanly", () => {
    expect(getTimestamp("not-a-date")).toBeNaN();
  });
});

describe("i18n Month Transformation Pipeline", () => {
  it.each([
    [
      ["Jan", "Feb", "Mar"],
      ["Jan", "Feb", "Mar"],
    ],
    [{ "0": "Jan", "1": "Feb" }, ["Jan", "Feb"]],
    [{ a: "Alpha", b: "Beta" }, ["Alpha", "Beta"]],
    [undefined, []],
    [null, []],
    ["string", []],
  ])("normalizes translation structure input %p -> %j", (input, expected) => {
    expect(formatMonthValues(input)).toEqual(expected);
  });

  it.each([
    [getMonthsShort, "months.short", ["J", "F", "M"]],
    [getMonthsLong, "months.long", ["January", "February"]],
  ])(
    "delegates translation namespaces using hook reference configurations",
    (utilityFn, targetNamespace, returnedValue) => {
      const mockT = (key: string) =>
        key === targetNamespace ? returnedValue : [];
      expect(utilityFn(mockT as any)).toEqual(formatMonthValues(returnedValue));
    },
  );
});
