import i18n from "i18next";
import { Timestamp } from "firebase/firestore";
import {
  formatDate,
  formatFirestoreDate,
  formatToInputDate,
  parseInputDateToTimestamp,
  getYear,
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

  it("handles invalid date strings gracefully", () => {
    expect(formatDate("not-a-date")).toBe("");
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

describe("HTML Date Input Utilities", () => {
  const fakeTimestamp = { toDate: () => new Date("2023-01-15T00:00:00Z") };
  const nativeDate = new Date("2023-01-15T00:00:00Z");

  it.each([
    [undefined, ""],
    [null, ""],
    ["", ""],
    ["invalid-date", ""],
    [fakeTimestamp, "2023-01-15"],
    [nativeDate, "2023-01-15"],
    ["2023-01-15", "2023-01-15"],
    [1673740800000, "2023-01-15"],
  ])("formatToInputDate(%p) -> %p", (input, expected) => {
    expect(formatToInputDate(input)).toBe(expected);
  });

  it.each([
    [undefined, undefined],
    ["", undefined],
    ["invalid-date", undefined],
    ["2023-01-15", Timestamp.fromDate(new Date("2023-01-15"))],
  ])("parseInputDateToTimestamp(%p) -> %p", (input, expected) => {
    const result = parseInputDateToTimestamp(input);
    if (!expected) {
      expect(result).toBeUndefined();
    } else {
      expect(typeof result?.toMillis).toBe("function");
      expect(result?.toMillis()).toBe(expected.toMillis());
    }
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
    [undefined, undefined],
    ["", undefined],
    ["2023-01-15", 2023],
    [new Date("2023-01-15"), 2023],
    [1673740800000, 2023],
    ["not-a-date", undefined],
  ])("evaluates getYear(%p) -> %p", (input, expected) => {
    expect(getYear(input as any)).toBe(expected);
  });

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
