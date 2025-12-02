import { VISITED_OVERLAY_ID } from "@constants/overlays";
import { mockCountries } from "@test-utils/mockCountries";
import type { Country, SovereigntyType } from "@types";
import {
  getCountryIsoCode,
  getCountryByIsoCode,
  createCountryMap,
  getAllRegions,
  getAllSubregions,
  getSubregionsForRegion,
  getAllSovereigntyTypes,
  getFlagUrl,
  getCountriesWithOwnFlag,
  getRandomCountry,
  getLanguagesDisplay,
  getSovereigntyInfoForTerritory,
  getVisitedCountries,
} from "./countryData";

// Mock constants
vi.mock("../constants/sovereignty", () => ({
  EXCLUDED_ISO_CODES: ["XX"],
  SOVEREIGN_FLAG_MAP: { YY: "US" },
}));
vi.mock("../constants/sovereignDependencies", () => ({
  SOVEREIGN_DEPENDENCIES: {
    US: {
      name: "United States",
      dependencies: [{ isoCode: "GU" }],
      regions: [{ isoCode: "PR" }],
      disputes: [{ isoCode: "VI" }],
    },
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
    const countries = [{ isoCode: "US", name: "United States" }];
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
          countries.filter((c) => c.region === region).map((c) => c.subregion)
        )
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
        getSubregionsForRegion(testCountries as Country[], "Europe")
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

  describe("getSovereigntyInfoForTerritory", () => {
    it("returns dependency info", () => {
      expect(getSovereigntyInfoForTerritory("GU")).toEqual({
        type: "Dependency",
        sovereign: { name: "United States", isoCode: "US" },
      });
    });
    it("returns region info", () => {
      expect(getSovereigntyInfoForTerritory("PR")).toEqual({
        type: "Overseas Region",
        sovereign: { name: "United States", isoCode: "US" },
      });
    });
    it("returns dispute info", () => {
      expect(getSovereigntyInfoForTerritory("VI")).toEqual({
        type: "Disputed",
        sovereign: { name: "United States", isoCode: "US" },
      });
    });
    it("returns Sovereign for unknown", () => {
      expect(getSovereigntyInfoForTerritory("US")).toEqual({
        type: "Sovereign",
      });
    });
    it("returns undefined type for empty input", () => {
      expect(getSovereigntyInfoForTerritory("")).toEqual({ type: undefined });
    });
    it("sorts subregions alphabetically for a region", () => {
      const testCountries = [
        { region: "Europe", subregion: "Zulu" },
        { region: "Europe", subregion: "Alpha" },
        { region: "Europe", subregion: "Mike" },
        { region: "Americas", subregion: "Caribbean" },
      ] as Partial<Country>[];
      expect(
        getSubregionsForRegion(testCountries as Country[], "Europe")
      ).toEqual(["Alpha", "Mike", "Zulu"]);
    });
  });

  describe("getFlagUrl", () => {
    it("returns flagcdn url by default", () => {
      expect(getFlagUrl("us")).toBe("https://flagcdn.com/us.svg");
    });
    it("returns flagsapi url", () => {
      expect(getFlagUrl("us", "flagsapi", "shiny", "64")).toBe(
        "https://flagsapi.com/US/shiny/64.png"
      );
    });
    it("returns empty string for invalid iso", () => {
      expect(getFlagUrl("")).toBe("");
    });
    it("returns empty string for iso codes not length 2", () => {
      expect(getFlagUrl("u")).toBe("");
      expect(getFlagUrl("")).toBe("");
      expect(getFlagUrl(undefined as any)).toBe("");
    });
    it("uses default size for flagsapi if size is not provided", () => {
      expect(getFlagUrl("us", "flagsapi")).toBe(
        "https://flagsapi.com/US/flat/32.png"
      );
    });
    it("uses SOVEREIGN_FLAG_MAP for borrowed flags", () => {
      expect(getFlagUrl("yy")).toBe("https://flagcdn.com/us.svg");
    });
  });

  describe("getCountriesWithOwnFlag", () => {
    it("filters out excluded iso codes", () => {
      const countries = [
        { isoCode: "US", flag: true },
        { isoCode: "XX", flag: true },
        { isoCode: "FR", flag: false },
      ];
      const result = getCountriesWithOwnFlag(countries as any);
      expect(result).toEqual([{ isoCode: "US", flag: true }]);
    });
  });

  describe("getRandomCountry", () => {
    it("returns a country from the list", () => {
      const countries = [{ isoCode: "US" }, { isoCode: "FR" }];
      const result = getRandomCountry(countries as any);
      expect(countries).toContainEqual(result);
    });
  });

  describe("getLanguagesDisplay", () => {
    it("returns comma-separated string", () => {
      expect(getLanguagesDisplay(["English", "French"])).toBe(
        "English, French"
      );
    });
    it("returns 'None' for empty or undefined", () => {
      expect(getLanguagesDisplay([])).toBe("None");
      expect(getLanguagesDisplay(undefined)).toBe("None");
    });
  });

  describe("getVisitedCountries", () => {
    const countries = [
      { isoCode: "US", name: "United States" },
      { isoCode: "FR", name: "France" },
      { isoCode: "DE", name: "Germany" },
    ];

    it("returns only countries whose isoCode is in the visited overlay", () => {
      const overlays = [
        { id: VISITED_OVERLAY_ID, countries: ["US", "DE"] },
        { id: "other-overlay", countries: ["FR"] },
      ];
      const result = getVisitedCountries(countries as any, overlays as any);
      expect(result).toEqual([
        { isoCode: "US", name: "United States" },
        { isoCode: "DE", name: "Germany" },
      ]);
    });

    it("returns an empty array if no visited overlay is present", () => {
      const overlays = [{ id: "other-overlay", countries: ["FR"] }];
      const result = getVisitedCountries(countries as any, overlays as any);
      expect(result).toEqual([]);
    });

    it("returns an empty array if visited overlay has no countries", () => {
      const overlays = [{ id: VISITED_OVERLAY_ID, countries: [] }];
      const result = getVisitedCountries(countries as any, overlays as any);
      expect(result).toEqual([]);
    });

    it("returns an empty array if overlays is empty", () => {
      const overlays: any[] = [];
      const result = getVisitedCountries(countries as any, overlays);
      expect(result).toEqual([]);
    });

    it("returns an empty array if countries is empty", () => {
      const overlays = [{ id: VISITED_OVERLAY_ID, countries: ["US"] }];
      const result = getVisitedCountries([], overlays as any);
      expect(result).toEqual([]);
    });
  });
});
