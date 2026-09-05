import i18n, { type TFunction } from "i18next";
import {
  formatDate,
  formatFirestoreDate,
  formatToInputDate,
  formatTimeAgo,
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
    ["invalid", undefined, ""],
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
      new Date("2023-01-15"),
      undefined,
      new Intl.DateTimeFormat(defaultLocale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date("2023-01-15")),
    ],
    [
      1673740800000,
      undefined,
      new Intl.DateTimeFormat(defaultLocale, {
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
      { month: "short" } satisfies Intl.DateTimeFormatOptions,
      new Intl.DateTimeFormat(defaultLocale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date("2023-01-15")),
    ],
  ])("formats %p with %p", (date, options, expected) => {
    const locale =
      typeof options === "string" && options !== "long" ? options : undefined;

    const opts =
      options === "long" || typeof options === "object" ? options : undefined;

    expect(formatDate(date, opts, locale)).toBe(expected);
  });
});

describe("formatFirestoreDate", () => {
  const timestamp = {
    toDate: () => new Date("2023-01-15T00:00:00Z"),
  };

  it.each([
    [timestamp],
    ["2023-01-15"],
    [new Date("2023-01-15")],
    [1673740800000],
  ])("formats %p", (input) => {
    expect(formatFirestoreDate(input)).toBe(formatDate("2023-01-15"));
  });

  it.each([undefined, null, {}, "", false])(
    "returns Unknown for %p",
    (input) => {
      expect(formatFirestoreDate(input)).toBe("Unknown");
    },
  );
});

describe("formatToInputDate", () => {
  const timestamp = {
    toDate: () => new Date("2023-01-15T00:00:00Z"),
  };

  it.each([
    [undefined, ""],
    [null, ""],
    ["", ""],
    ["invalid", ""],
    [{}, ""],
    [false, ""],
    [timestamp, "2023-01-15"],
    [new Date("2023-01-15"), "2023-01-15"],
    ["2023-01-15", "2023-01-15"],
    [1673740800000, "2023-01-15"],
  ])("formats %p -> %p", (input, expected) => {
    expect(formatToInputDate(input)).toBe(expected);
  });
});

describe("formatTimeAgo", () => {
  const t = ((key: string, options?: { count?: number }) => {
    if (key.endsWith("justNow")) return "just now";
    if (key.endsWith("minutes")) return `${options?.count}m ago`;
    if (key.endsWith("hours")) return `${options?.count}h ago`;
    if (key.endsWith("days")) return `${options?.count}d ago`;
    return key;
  }) as TFunction;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2023-01-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.each([
    [new Date("2023-01-15T11:59:30Z"), "just now"],
    ["2023-01-15T11:59:00Z", "1m ago"],
    ["2023-01-15T11:30:00Z", "30m ago"],
    ["2023-01-15T11:00:00Z", "1h ago"],
    ["2023-01-15T00:00:00Z", "12h ago"],
    ["2023-01-14T12:00:00Z", "1d ago"],
    ["2023-01-09T12:00:00Z", "6d ago"],
  ])("formats %p as %p", (date, expected) => {
    expect(formatTimeAgo(date, t)).toBe(expected);
  });

  it("falls back to a formatted date after 7 days", () => {
    const date = "2023-01-01T12:00:00Z";

    expect(formatTimeAgo(date, t)).toBe(formatFirestoreDate(date));
  });

  it("supports Firestore timestamps", () => {
    const timestamp = {
      toDate: () => new Date("2023-01-15T11:59:30Z"),
    };

    expect(formatTimeAgo(timestamp, t)).toBe("just now");
  });

  it.each([undefined, null, "", {}, false])(
    "returns empty string for invalid input %p",
    (date) => {
      expect(formatTimeAgo(date, t)).toBe("");
    },
  );

  it("returns empty string for an invalid date string", () => {
    expect(formatTimeAgo("invalid", t)).toBe("");
  });
});

describe("parseInputDateToTimestamp", () => {
  it.each([
    [undefined, undefined],
    ["", undefined],
    ["invalid", undefined],
  ])("returns undefined for %p", (input, expected) => {
    expect(parseInputDateToTimestamp(input)).toBe(expected);
  });

  it("converts a valid date", () => {
    const result = parseInputDateToTimestamp("2023-01-15");

    expect(typeof result?.toMillis).toBe("function");
    expect(result?.toMillis()).toBe(new Date("2023-01-15").getTime());
  });
});

describe("getYear", () => {
  it.each([
    [undefined, undefined],
    ["", undefined],
    ["invalid", undefined],
    ["2023-01-15", 2023],
    [new Date("2023-01-15"), 2023],
    [1673740800000, 2023],
  ])("gets year from %p", (input, expected) => {
    expect(getYear(input as string | undefined)).toBe(expected);
  });
});

describe("getCurrentYear", () => {
  it("returns the current year", () => {
    expect(getCurrentYear()).toBe(new Date().getFullYear());
  });
});

describe("getTimestamp", () => {
  const date = new Date("2021-06-30T00:00:00Z");

  it.each([
    [1625078400000, 1625078400000],
    [date, date.getTime()],
    ["2021-06-30T00:00:00Z", date.getTime()],
  ])("converts %p", (input, expected) => {
    expect(getTimestamp(input as string | number | Date)).toBe(expected);
  });

  it("returns NaN for invalid dates", () => {
    expect(getTimestamp("invalid")).toBeNaN();
  });
});

describe("formatTimeSeconds", () => {
  it.each([
    [undefined, "-"],
    [NaN, "-"],
    [45, "0:45"],
    [125, "2:05"],
    [0, "0:00"],
  ])("formats %p -> %p", (input, expected) => {
    expect(formatTimeSeconds(input as number | undefined)).toBe(expected);
  });
});

describe("setAppDateLocale", () => {
  afterEach(() => setAppDateLocale(undefined));

  it("uses the app locale", () => {
    setAppDateLocale("en-US");

    const expected = new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date("2023-01-15"));

    expect(formatDate("2023-01-15")).toBe(expected);
  });

  it("falls back when the app locale is cleared", () => {
    setAppDateLocale(null);

    const locale =
      i18n?.language ||
      (typeof navigator !== "undefined" && navigator.language) ||
      "en-GB";

    const expected = new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date("2023-01-15"));

    expect(formatDate("2023-01-15")).toBe(expected);
  });

  it("prefers an explicitly supplied locale", () => {
    setAppDateLocale("en-US");

    const expected = new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date("2023-01-15"));

    expect(formatDate("2023-01-15", undefined, "de-DE")).toBe(expected);
  });
});

describe("formatMonthValues", () => {
  it.each([
    [
      ["Jan", "Feb", "Mar"],
      ["Jan", "Feb", "Mar"],
    ],
    [{ "0": "Jan", "1": "Feb" }, ["Jan", "Feb"]],
    [{ a: "Alpha", b: "Beta" }, ["Alpha", "Beta"]],
    [{ "2": "Mar", "0": "Jan", "1": "Feb" }, ["Jan", "Feb", "Mar"]],
    [undefined, []],
    [null, []],
    ["string", []],
    [{}, []],
  ])("normalizes %p", (input, expected) => {
    expect(formatMonthValues(input)).toEqual(expected);
  });

  it("limits results to 12 months", () => {
    expect(
      formatMonthValues(Array.from({ length: 15 }, (_, i) => i)),
    ).toHaveLength(12);
  });
});

describe("month helpers", () => {
  it.each([
    [getMonthsShort, "months.short", ["J", "F", "M"]],
    [getMonthsLong, "months.long", ["January", "February"]],
  ])("gets translated months", (fn, key, value) => {
    const t = ((requestedKey: string) =>
      requestedKey === key ? value : []) as TFunction;

    expect(fn(t)).toEqual(formatMonthValues(value));
  });
});
