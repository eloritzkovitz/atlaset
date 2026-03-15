import { mockCountries } from "@test-utils/mockCountries";
import type { Country, SovereigntyType } from "../types";
import {
  getCountryIsoCode,
  getCountryByIsoCode,
  getCountryName,
  createCountryMap,
  getAllRegions,
  getAllSubregions,
  getSubregionsForRegion,
  getAllSovereigntyTypes,
  getCountriesWithOwnFlag,
  getRandomCountry,
  getLanguagesDisplay,
  getAliasesDisplay,
  getCountryRelations,
  getCurrencyDisplay,
} from "./countryData";

// Mock constants
vi.mock("../constants/sovereignty", () => ({
  EXCLUDED_ISO_CODES: ["XX"],
  SOVEREIGN_FLAG_MAP: { YY: "US" },
}));
vi.mock("../constants/countryRelations", () => ({
  COUNTRY_RELATIONS: {
    US: {
      name: "United States",
      dependencies: ["GU"],
      regions: ["PR"],
      disputes: ["VI"],
    },
  },

  SPECIAL_COUNTRIES: {
    "GB-ENG": { name: "England" },
  },
}));

describe("countryData utils", () => {
  const countries = mockCountries;

  describe("getCountryIsoCode", () => {
    it("extracts ISO code from ISO_A2", () => {
      expect(getCountryIsoCode({ ISO_A2: "us" })).toBe("US");
    });
    it("extracts ISO code from ISO3166-1-Alpha-2", () => {
      expect(getCountryIsoCode({ "ISO3166-1-Alpha-2": "fr" })).toBe("FR");
    });
    it("returns undefined if not found", () => {
      expect(getCountryIsoCode({})).toBeUndefined();
    });
  });

  describe("getCountryByIsoCode", () => {
    const countries = mockCountries.filter((c) => c.isoCode === "US");
    it("finds country by ISO code", () => {
      expect(getCountryByIsoCode("US", { countries })).toEqual(countries[0]);
    });
    it("returns null if not found", () => {
      expect(getCountryByIsoCode("FR", { countries })).toBeNull();
    });
    it("returns null for invalid input", () => {
      expect(getCountryByIsoCode("", null as any)).toBeNull();
    });
  });

  describe("getCountryName", () => {
    it("returns the name of a country from SPECIAL_COUNTRIES", () => {
      expect(getCountryName("GB-ENG", countries)).toBe("England");
    });

    it("returns the name if country is found", () => {
      expect(getCountryName("FR", countries)).toBe("France");
    });

    it("returns isoCode if country is not found", () => {
      expect(getCountryName("ZZ", countries)).toBe("ZZ");
    });
  });

  describe("createCountryMap", () => {
    const countries = mockCountries.filter((c) => c.isoCode === "US");
    const lookup = createCountryMap(countries, (c) => c);
    const nameMap = createCountryMap(countries, (c) => c.name);

    it("creates a lookup map by isoCode", () => {
      expect(lookup["us"]).toEqual(countries[0]);
    });

    it("creates a map of isoCode to country name", () => {
      expect(nameMap["us"]).toBe("United States");
    });

    it("is case-insensitive for isoCode", () => {
      expect(lookup["us"]).toEqual(countries[0]);
      expect(lookup["US"]).toBeUndefined();
    });
  });

  describe("getAllRegions", () => {
    it("returns unique, sorted regions", () => {
      const expected = Array.from(new Set(countries.map((c) => c.region)))
        .filter(Boolean)
        .sort();
      expect(getAllRegions(countries)).toEqual(expected);
    });
    it("skips undefined regions", () => {
      const testCountries = [
        { region: "Europe" },
        { region: undefined },
        { region: "Americas" },
        {},
      ] as Partial<Country>[];
      expect(getAllRegions(testCountries as Country[])).toEqual([
        "Americas",
        "Europe",
      ]);
    });
  });

  describe("getAllSubregions", () => {
    it("returns unique, sorted subregions", () => {
      const expected = Array.from(new Set(countries.map((c) => c.subregion)))
        .filter(Boolean)
        .sort();
      expect(getAllSubregions(countries)).toEqual(expected);
    });
    it("skips undefined subregions", () => {
      const testCountries = [
        { subregion: "Caribbean" },
        { subregion: undefined },
        {},
      ] as Partial<Country>[];
      expect(getAllSubregions(testCountries as Country[])).toEqual([
        "Caribbean",
      ]);
    });
  });

  describe("getSubregionsForRegion", () => {
    it("returns subregions for a region", () => {
      const region = "Americas";
      const expected = Array.from(
        new Set(
          countries.filter((c) => c.region === region).map((c) => c.subregion),
        ),
      )
        .filter(Boolean)
        .sort();
      expect(getSubregionsForRegion(countries, region)).toEqual(expected);
    });

    it("skips undefined subregions", () => {
      const testCountries = [
        { region: "Europe", subregion: "Western Europe" },
        { region: "Europe", subregion: undefined },
        { region: "Americas", subregion: "Caribbean" },
      ] as Partial<Country>[];
      expect(
        getSubregionsForRegion(testCountries as Country[], "Europe"),
      ).toEqual(["Western Europe"]);
    });
  });

  describe("getAllSovereigntyTypes", () => {
    it("returns unique, sorted sovereignty types", () => {
      expect(getAllSovereigntyTypes(countries)).toEqual([
        "Dependency",
        "Sovereign",
      ]);
    });

    it("skips undefined sovereigntyType", () => {
      const testCountries = [
        { sovereigntyType: "Sovereign" as SovereigntyType },
        { sovereigntyType: undefined },
        {},
      ] as Partial<Country>[];
      expect(getAllSovereigntyTypes(testCountries as Country[])).toEqual([
        "Sovereign",
      ]);
    });
  });

  describe("getCountryRelations", () => {
    it("returns dependency info with sovereign and dependencyOf", () => {
      expect(getCountryRelations("GU")).toEqual({
        type: "Dependency",
        sovereign: { isoCode: "US" },
        dependencyOf: { isoCode: "US" },
      });
    });

    it("returns region info with sovereign and regionOf", () => {
      expect(getCountryRelations("PR")).toEqual({
        type: "Overseas Region",
        sovereign: { isoCode: "US" },
        regionOf: { isoCode: "US" },
      });
    });

    it("returns dispute info with sovereign and disputeOf", () => {
      expect(getCountryRelations("VI")).toEqual({
        type: "Disputed",
        sovereign: { isoCode: "US" },
        disputeOf: { isoCode: "US" },
      });
    });

    it("returns full relations for a sovereign with relations", () => {
      const result = getCountryRelations("US");
      expect(result.type).toBe("Sovereign");
      expect(result.hasRelations).toBe(true);
      expect(Array.isArray(result.countries)).toBe(true);
      expect(Array.isArray(result.dependencies)).toBe(true);
      expect(Array.isArray(result.regions)).toBe(true);
      expect(Array.isArray(result.disputes)).toBe(true);
    });

    it("returns Sovereign for a country with no relations", () => {
      const result = getCountryRelations("FR");
      expect(result).toEqual({
        type: "Sovereign",
        countries: [],
        dependencies: [],
        regions: [],
        disputes: [],
        hasRelations: false,
      });
    });

    it("returns Sovereign with empty arrays for empty input", () => {
      const result = getCountryRelations("");
      expect(result).toEqual({
        type: "Sovereign",
        countries: [],
        dependencies: [],
        regions: [],
        disputes: [],
        hasRelations: false,
      });
    });
  });

  describe("getCountriesWithOwnFlag", () => {
    it("filters out excluded iso codes", () => {
      const countries = [
        { isoCode: "US" },
        { isoCode: "XX" },
        { isoCode: "FR" },
      ];
      const result = getCountriesWithOwnFlag(countries as any);
      expect(result).toEqual([{ isoCode: "US" }, { isoCode: "FR" }]);
    });
  });

  describe("getRandomCountry", () => {
    it("returns a country from the list", () => {
      const countries = [{ isoCode: "US" }, { isoCode: "FR" }];
      const result = getRandomCountry(countries as any);
      expect(countries).toContainEqual(result);
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

    it("returns 'N/A' for undefined code", () => {
      const currencies = [{ code: "USD", name: "United States Dollar" }];
      expect(getCurrencyDisplay(undefined, currencies)).toBe("N/A");
    });

    it("returns 'N/A' for empty currencies array and undefined code", () => {
      expect(getCurrencyDisplay(undefined, [])).toBe("N/A");
    });

    it("returns code for empty currencies array and known code", () => {
      expect(getCurrencyDisplay("USD", [])).toBe("USD");
    });
  });

  describe("getLanguagesDisplay", () => {
    it("returns comma-separated string", () => {
      expect(getLanguagesDisplay(["English", "French"])).toBe(
        "English, French",
      );
    });

    it("returns 'None' for empty or undefined", () => {
      expect(getLanguagesDisplay([])).toBe("None");
      expect(getLanguagesDisplay(undefined)).toBe("None");
    });
  });

  describe("getAliasesDisplay", () => {
    it("returns comma-separated string", () => {
      expect(getAliasesDisplay(["USA", "America"])).toBe("USA, America");
    });

    it("returns 'None' for empty or undefined", () => {
      expect(getAliasesDisplay([])).toBe("None");
      expect(getAliasesDisplay(undefined)).toBe("None");
    });
  });
});
