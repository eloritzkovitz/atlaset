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

  it("formats single timezone without DST as a single string", () => {
    const result = formatTimezones(["UTC"]);
    expect(result).toBe("UTC+00:00");
  });

  it("formats single timezone with DST as a two-element array (hits line 64)", () => {
    const result = formatTimezones(["Europe/Berlin"]);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
  });

  it("uses custom translation function for summer label (hits line 57)", () => {
    const mockT = vi.fn(() => "été");
    const result = formatTimezones(["Europe/Paris"], mockT);

    expect(mockT).toHaveBeenCalledWith("countries.details.overview.summer");
    expect(JSON.stringify(result)).toContain("été");
  });

  it("returns a single line for multiple timezones that collapse into one range line (hits line 68)", () => {
    const result = formatTimezones(["UTC", "Atlantic/Reykjavik"]);
    expect(typeof result).toBe("string");
  });

  it("returns a two-element array for multiple timezones spanning DST ranges", () => {
    const result = formatTimezones(["Europe/London", "America/New_York"]);
    expect(Array.isArray(result)).toBe(true);
  });
});
