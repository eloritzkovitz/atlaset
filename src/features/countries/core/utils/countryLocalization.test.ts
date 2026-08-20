import i18next from "i18next";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockCountries } from "@test-utils/mockCountries";
import * as countryDataModule from "./countryData";
import { processLocalizedCountries } from "./countryLocalization";
import type { Country } from "../../types";

vi.mock("i18next", () => ({
  default: { getResourceBundle: vi.fn() },
}));
vi.mock("../utils/countryData", () => ({
  getTerritoryCodesByType: vi.fn(),
}));

describe("processLocalizedCountries", () => {
  const mockI18n = {
    getResourceBundle: vi.fn(),
  } as any;

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mocked(countryDataModule.getTerritoryCodesByType).mockReturnValue([]);
  });

  it("localizes countries, builds lookup maps, and accumulates region/currency/language sets", () => {
    mockI18n.getResourceBundle.mockReturnValue({
      FR: {
        name: "La France",
        capital: "Paris (FR)",
        altNames: ["République française"],
        region: "Europe",
        subregion: "Western Europe",
      },
    });

    vi.mocked(countryDataModule.getTerritoryCodesByType).mockImplementation(
      (country) => (country.isoCode === "FR" ? ["GP"] : []),
    );

    const result = processLocalizedCountries(mockCountries, "fr", mockI18n);

    expect(result.localizedCountries[0].name).toBe("La France");
    expect(result.localizedCountries[0].capital).toBe("Paris (FR)");
    expect(result.localizedCountries[0].altNames).toEqual([
      "République française",
    ]);
    expect(result.localizedCountries[5].name).toBe("Japan");

    expect(result.areaLookup.get("FR")).toBe(551695);
    expect(result.parentToRegions.get("FR")).toEqual(["GP"]);
    expect(result.childToParent.get("GP")).toBe("FR");

    expect(result.regionSet).toEqual(new Set(["Europe", "Americas", "Asia"]));
    expect(Array.from(result.tmpSub["Europe"])).toEqual(["Western Europe"]);
    expect(result.currencyMap.get("EUR")).toBe(3);
    expect(result.langSet.has("French")).toBe(true);
    expect(result.langSet.has("German")).toBe(true);
  });

  it("handles empty/missing fields, fallback i18next instance, and bundle resolution errors", () => {
    vi.mocked(i18next.getResourceBundle).mockImplementation(() => {
      throw new Error("Failed to load");
    });

    const emptyCountry: Country = { name: "Empty Land" } as Country;

    const result = processLocalizedCountries([emptyCountry], "en", {} as any);

    expect(result.localizedCountries[0]).toEqual({
      name: "Empty Land",
      capital: "",
      altNames: [],
      territories: {},
      region: undefined,
      subregion: undefined,
    });

    expect(result.areaLookup.size).toBe(0);
    expect(result.parentToRegions.size).toBe(0);
    expect(result.regionSet.size).toBe(0);
    expect(result.currencyMap.size).toBe(0);
    expect(result.langSet.size).toBe(0);
  });
});
