import { describe, it, expect } from "vitest";
import {
  formatTimezones,
  getAltNamesDisplay,
  getCurrencyDisplay,
  getLanguagesDisplay,
} from "./countryInfo";

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

describe("formatTimezones", () => {
  it("returns '—' for missing or empty inputs", () => {
    expect(formatTimezones([])).toBe("—");
    expect(formatTimezones(undefined)).toBe("—");
  });

  it("handles single and multi-line results for single & multiple timezones", () => {
    expect(formatTimezones(["UTC"])).toBe("UTC+00:00");
    expect(formatTimezones(["Europe/Berlin"])).toEqual([
      "UTC+01:00",
      "UTC+02:00 (summer)",
    ]);
    expect(formatTimezones(["UTC", "Africa/Johannesburg"])).toBe(
      "UTC+00:00 to UTC+02:00",
    );
    expect(formatTimezones(["America/New_York", "Europe/Berlin"])).toEqual([
      "UTC-05:00 to UTC+01:00",
      "UTC-04:00 to UTC+02:00 (summer)",
    ]);
  });

  it("uses custom translation function for summer label", () => {
    const mockT = vi.fn(() => "été");
    const res = formatTimezones(["Europe/Berlin"], mockT);
    expect(mockT).toHaveBeenCalledWith("countries.details.overview.summer");
    expect(res).toEqual(["UTC+01:00", "UTC+02:00 (été)"]);
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
