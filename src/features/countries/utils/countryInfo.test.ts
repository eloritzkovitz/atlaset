import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  formatTimezones,
  getAltNamesDisplay,
  getCurrencyDisplay,
  getLanguagesDisplay,
  getWikipediaUrl,
} from "./countryInfo";

vi.mock("@utils/timezone", () => ({
  timezoneOffsets: vi.fn(),
  timezoneRangeLines: vi.fn(),
}));

import { timezoneOffsets, timezoneRangeLines } from "@utils/timezone";

beforeEach(() => {
  vi.resetAllMocks();
});

describe("getLanguagesDisplay", () => {
  it("returns comma-separated string", () => {
    expect(getLanguagesDisplay(["English", "French"])).toBe("English, French");
  });

  it("returns 'None' for empty or undefined", () => {
    expect(getLanguagesDisplay([])).toBe("None");
    expect(getLanguagesDisplay(undefined)).toBe("None");
  });
});

describe("getCurrencyDisplay", () => {
  it("returns formatted string for known currency code", () => {
    const currencies = [
      { code: "USD", name: "United States Dollar" },
      { code: "EUR", name: "Euro" },
    ];
    expect(getCurrencyDisplay("USD", currencies)).toBe(
      "United States Dollar (USD)",
    );
  });

  it("returns code if currency code is not found", () => {
    const currencies = [{ code: "USD", name: "United States Dollar" }];
    expect(getCurrencyDisplay("EUR", currencies)).toBe("EUR");
  });

  it("returns 'None' for undefined code", () => {
    const currencies = [{ code: "USD", name: "United States Dollar" }];
    expect(getCurrencyDisplay(undefined, currencies)).toBe("None");
  });

  it("returns 'None' for empty currencies array and undefined code", () => {
    expect(getCurrencyDisplay(undefined, [])).toBe("None");
  });

  it("returns code for empty currencies array and known code", () => {
    expect(getCurrencyDisplay("USD", [])).toBe("USD");
  });
});

describe("getAltNamesDisplay", () => {
  it("returns comma-separated string", () => {
    expect(getAltNamesDisplay(["USA", "America"])).toBe("USA, America");
  });

  it("returns 'None' for empty or undefined", () => {
    expect(getAltNamesDisplay([])).toBe("None");
    expect(getAltNamesDisplay(undefined)).toBe("None");
  });
});

describe("formatTimezones", () => {
  it("returns '—' for empty or undefined", () => {
    expect(formatTimezones([])).toBe("—");
    expect(formatTimezones(undefined)).toBe("—");
  });

  it("returns single offset string when timezoneOffsets returns one offset", () => {
    (timezoneOffsets as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      "UTC+02:00",
    ]);
    const result = formatTimezones(["Europe/Berlin"]);
    expect(result).toBe("UTC+02:00");
    expect(timezoneOffsets).toHaveBeenCalledWith("Europe/Berlin", " (summer)");
  });

  it("returns two-line array when timezoneOffsets returns two offsets (DST)", () => {
    (timezoneOffsets as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      "UTC+01:00",
      "UTC+02:00",
    ]);
    const result = formatTimezones(["Europe/Berlin"]);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual(["UTC+01:00", "UTC+02:00"]);
  });

  it("returns single line from timezoneRangeLines for multiple timezones", () => {
    (timezoneRangeLines as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      ["UTC+00:00"],
    );
    const result = formatTimezones(["Europe/London", "UTC"]);
    expect(result).toBe("UTC+00:00");
    expect(timezoneRangeLines).toHaveBeenCalledWith(
      ["Europe/London", "UTC"],
      " (summer)",
    );
  });

  it("returns two-line array from timezoneRangeLines for multiple timezones", () => {
    (timezoneRangeLines as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      ["UTC-08:00", "UTC+02:00"],
    );
    const result = formatTimezones(["America/Los_Angeles", "Europe/Berlin"]);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual(["UTC-08:00", "UTC+02:00"]);
  });
});

describe("getWikipediaUrl", () => {
  it("returns correct Wikipedia URL for a given country name and language", () => {
    const countryName = "Germany";
    const lang = "en";
    const expectedUrl = "https://en.wikipedia.org/wiki/Germany";
    expect(getWikipediaUrl(countryName, lang)).toBe(expectedUrl);
  });
});
