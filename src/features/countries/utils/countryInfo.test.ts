import { describe, it, expect } from "vitest";
import {
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
