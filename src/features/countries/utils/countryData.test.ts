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
  getTranscontinentalInfo,
  getCountryRelations,
} from "./countryData";

vi.mock("../constants/countryRelations", () => ({
  COUNTRY_RELATIONS: {
    US: {
      name: "United States",
      dependencies: ["GU"],
      regions: ["PR"],
      disputes: ["VI"],
    },
    GU: {},
    PR: {},
    VI: {},
    AA: { disputes: ["BB"] },
    BB: { disputes: ["AA"] },
  },
  FLAG_OVERRIDES: { YY: { sovereign: "US" } },
  EXCLUDED_ISO_CODES: ["XX"],
}));
vi.mock("../constants/specialCountries", () => ({
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
    it("returns dependencyOf and sovereign for a dependency", () => {
      const result = getCountryRelations("GU");
      expect(result.dependencyOf).toEqual({ isoCode: "US" });
      expect(result.sovereign).toEqual({ isoCode: "US" });
    });

    it("returns regionOf and sovereign for a region", () => {
      const result = getCountryRelations("PR");
      expect(result.regionOf).toEqual({ isoCode: "US" });
      expect(result.sovereign).toEqual({ isoCode: "US" });
    });

    it("returns disputeOf and sovereign for a dispute", () => {
      const result = getCountryRelations("VI");
      expect(result.disputeOf).toEqual({ isoCode: "US" });
      expect(result.sovereign).toEqual({ isoCode: "US" });
    });

    it("returns mutual disputes for both sides", () => {
      expect(getCountryRelations("AA").disputes).toContain("BB");
      expect(getCountryRelations("BB").disputes).toContain("AA");
    });

    it.each([
      ["country with no relations", "FR"],
      ["empty input", ""],
      ["special country", "GB-ENG"],
    ])("returns hasRelations: false for %s", (_, iso) => {
      expect(getCountryRelations(iso)).toMatchObject({ hasRelations: false });
    });

    it("returns full relations for a sovereign with relations", () => {
      const result = getCountryRelations("US");
      expect(result.hasRelations).toBe(true);
      expect(Array.isArray(result.countries)).toBe(true);
      expect(Array.isArray(result.dependencies)).toBe(true);
      expect(Array.isArray(result.regions)).toBe(true);
      expect(Array.isArray(result.disputes)).toBe(true);
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

  describe("transcontinental helpers", () => {
    it("returns additional region when transcontinental (country object)", () => {
      const ru = {
        isoCode: "RU",
        transcontinental: { additionalRegion: "Europe" },
      } as Country;
      expect(getTranscontinentalInfo(ru)?.additionalRegion).toBe("Europe");
    });

    it("returns additional subregion when transcontinental (country object)", () => {
      const ru = {
        isoCode: "RU",
        transcontinental: {
          additionalRegion: "Europe",
          additionalSubregion: "Northern Asia",
        },
      } as Country;
      const tr = {
        isoCode: "TR",
        transcontinental: {
          additionalRegion: "Asia",
          additionalSubregion: "Western Asia",
        },
      } as Country;
      expect(getTranscontinentalInfo(ru)?.additionalSubregion).toBe(
        "Northern Asia",
      );
      expect(getTranscontinentalInfo(tr)?.additionalSubregion).toBe(
        "Western Asia",
      );
    });

    it("reports transcontinental status correctly (country object)", () => {
      const ru = {
        isoCode: "RU",
        transcontinental: { additionalRegion: "Europe" },
      } as Country;
      const zz = { isoCode: "ZZ" } as Country;
      expect(!!getTranscontinentalInfo(ru)).toBe(true);
      expect(!!getTranscontinentalInfo(zz)).toBe(false);
    });
  });
});
