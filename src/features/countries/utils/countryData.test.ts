import { mockCountries } from "@test-utils/mockCountries";
import type {
  Country,
  CountryTerritories,
  GeoType,
  SovereigntyStatus,
} from "../types";
import {
  getCountryIsoCode,
  getCountryByIsoCode,
  getCountryName,
  createCountryMap,
  getAllRegions,
  getAllSubregions,
  getSubregionsForRegion,
  getAllSovereigntyStatuses,
  getCountriesWithOwnFlag,
  getRandomCountry,
  getTranscontinentalInfo,
  getCountryTerritories,
  getAllGeoTypes,
} from "./countryData";

vi.mock("../constants/countryRelations", () => ({
  FLAG_OVERRIDES: ["YY"],
}));
vi.mock("../constants/specialCountries", () => ({
  SPECIAL_COUNTRIES: {
    "GB-ENG": { name: "England" },
  },
}));

describe("countryData utils", () => {
  const countries = mockCountries;
  const findCountry = (iso: string) => countries.find((c) => c.isoCode === iso);
  const stubCountry = (iso: string) => ({ isoCode: iso }) as Country;

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

  describe("getAllGeoTypes", () => {
    it("returns unique, sorted geo types", () => {
      const expected = Array.from(
        new Set(countries.map((c) => c.geoType).filter(Boolean) as GeoType[]),
      ).sort();
      expect(getAllGeoTypes(countries)).toEqual(expected);
    });

    it("skips undefined geo types", () => {
      const testCountries = [
        { geoType: "Country" as GeoType },
        { geoType: undefined },
        {},
      ] as Partial<Country>[];
      expect(getAllGeoTypes(testCountries as Country[])).toEqual(["Country"]);
    });
  });

  describe("getAllSovereigntyStatuses", () => {
    it("returns unique, sorted sovereignty statuses", () => {
      expect(getAllSovereigntyStatuses(countries)).toEqual([
        "Dependency",
        "Sovereign",
      ]);
    });

    it("skips undefined sovereigntyStatus", () => {
      const testCountries = [
        { sovereigntyStatus: "Sovereign" as SovereigntyStatus },
        { sovereigntyStatus: undefined },
        {},
      ] as Partial<Country>[];
      expect(getAllSovereigntyStatuses(testCountries as Country[])).toEqual([
        "Sovereign",
      ]);
    });
  });

  describe("getCountryTerritories", () => {
    it("returns mutual disputes for both sides", () => {
      const a = getCountryTerritories(countries[0]);
      const b = getCountryTerritories(countries[4]);
      expect(a.groups?.disputes?.codes).toContain("US");
      expect(b.groups?.disputes?.codes).toContain("FR");
    });

    it.each([
      ["country with no relations", findCountry("DE") || stubCountry("DE")],
      ["empty input", {} as Country],
      ["special country", findCountry("GB-ENG") || stubCountry("GB-ENG")],
    ])("returns hasRelations: false for %s", (_, country) => {
      expect(getCountryTerritories(country as Country)).toMatchObject({
        hasRelations: false,
      });
    });

    it("returns full relations for a sovereign with relations", () => {
      const result = getCountryTerritories(countries[0]);
      expect(result.hasRelations).toBe(true);
      expect(Array.isArray(result.groups?.dependencies?.codes)).toBe(true);
      expect(Array.isArray(result.groups?.overseas_regions?.codes)).toBe(true);
      expect(Array.isArray(result.groups?.disputes?.codes)).toBe(true);
    });

    it("returns empty results when countries not provided", () => {
      const res = getCountryTerritories(stubCountry("FR"));
      expect(res).toMatchObject({ hasRelations: false });
      expect(res.relatedIsoCodes).toEqual([]);
      expect(res.groups).toEqual({});
    });

    it("preserves group labels and deduplicates relatedIsoCodes", () => {
      const local: Country[] = [
        {
          name: "Example",
          isoCode: "ZZ",
          territories: {
            deps: { codes: ["A", "A"], label: "Dep" },
            regions: { codes: ["B"] },
          },
        } as unknown as Country,
      ];

      const out = getCountryTerritories(local[0]);
      expect(out.groups?.deps?.label).toBe("Dep");
      expect(out.relatedIsoCodes).toBeDefined();
      expect(new Set(out.relatedIsoCodes).size).toBe(2);
      expect(out.relatedIsoCodes).toEqual(expect.arrayContaining(["A", "B"]));
    });

    it("reports hasRelations false when groups exist but have no codes", () => {
      const local: Country[] = [
        {
          name: "EmptyGroups",
          isoCode: "EM",
          territories: {
            deps: { codes: [] },
          },
        } as unknown as Country,
      ];

      const out = getCountryTerritories(local[0]);
      expect(out.groups).toBeDefined();
      expect(out.relatedIsoCodes).toEqual([]);
      expect(out.hasRelations).toBe(false);
    });

    it("handles undefined group entries and missing codes", () => {
      const local: Country = {
        name: "Edge",
        isoCode: "EG",
        // simulate odd data shapes coming from JSON
        territories: {
          missingValue: undefined as unknown as any,
          noCodes: { label: "NoCodes" } as unknown as any,
        } as unknown as CountryTerritories,
      } as Country;

      const out = getCountryTerritories(local);
      expect(out.groups).toBeDefined();
      expect(out.groups?.missingValue?.codes).toEqual([]);
      expect(out.groups?.noCodes?.codes).toEqual([]);
      expect(out.groups?.noCodes?.label).toBe("NoCodes");
      expect(out.relatedIsoCodes).toEqual([]);
      expect(out.hasRelations).toBe(false);
    });

    it("handles null codes alongside populated codes", () => {
      const local: Country = {
        name: "NullCodes",
        isoCode: "NC",
        territories: {
          someGroup: { codes: null as unknown as string[] },
          otherGroup: { codes: ["X"] },
        } as unknown as CountryTerritories,
      } as Country;

      const out = getCountryTerritories(local);
      expect(out.relatedIsoCodes).toEqual(["X"]);
      expect(out.hasRelations).toBe(true);
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
      expect(result).toEqual([
        { isoCode: "US" },
        { isoCode: "XX" },
        { isoCode: "FR" },
      ]);
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
          additionalSubregion: "North Asia",
        },
      } as Country;
      const tr = {
        isoCode: "TR",
        transcontinental: {
          additionalRegion: "Asia",
          additionalSubregion: "West Asia",
        },
      } as Country;
      expect(getTranscontinentalInfo(ru)?.additionalSubregion).toBe(
        "North Asia",
      );
      expect(getTranscontinentalInfo(tr)?.additionalSubregion).toBe(
        "West Asia",
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
