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
  getCountryTerritoryRelations,
  getTerritoryCodesByType,
  getAllGeoTypes,
} from "./countryData";
import { canonicalKey } from "@utils/string";

vi.mock("../constants/flagOverrides", () => ({
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
  const stubCountry = (iso: string, props: Partial<Country> = {}) =>
    ({ isoCode: iso, ...props }) as Country;

  describe("getCountryIsoCode", () => {
    it.each([
      ["ISO_A2", { ISO_A2: "us" }, "US"],
      ["ISO3166-1-Alpha-2", { "ISO3166-1-Alpha-2": "fr" }, "FR"],
      ["empty object", {}, undefined],
    ])("extracts ISO code from %s", (_, input, expected) => {
      expect(getCountryIsoCode(input)).toBe(expected);
    });
  });

  describe("getCountryByIsoCode", () => {
    const usOnly = mockCountries.filter((c) => c.isoCode === "US");

    it("finds country by ISO code", () => {
      expect(getCountryByIsoCode("US", { countries: usOnly })).toEqual(
        usOnly[0],
      );
    });

    it.each([
      ["non-matching code", "FR", { countries: usOnly }],
      ["invalid empty input", "", null as unknown as { countries: Country[] }],
    ])("returns null for %s", (_, iso, opts) => {
      expect(getCountryByIsoCode(iso, opts)).toBeNull();
    });
  });

  describe("getCountryName", () => {
    it.each([
      ["SPECIAL_COUNTRIES", "GB-ENG", "England"],
      ["found country", "FR", "France"],
      ["missing country (fallback to ISO)", "ZZ", "ZZ"],
    ])("returns correct name for %s", (_, iso, expected) => {
      expect(getCountryName(iso, countries)).toBe(expected);
    });
  });

  describe("createCountryMap", () => {
    const usOnly = mockCountries.filter((c) => c.isoCode === "US");
    const lookup = createCountryMap(usOnly, (c) => c);
    const nameMap = createCountryMap(usOnly, (c) => c.name);

    it("creates lookup map by lowercased isoCode", () => {
      expect(lookup["us"]).toEqual(usOnly[0]);
      expect(nameMap["us"]).toBe("United States");
      expect(lookup["US"]).toBeUndefined();
    });
  });

  describe("region and subregion getters", () => {
    it("getAllRegions returns unique, sorted regions and skips undefined", () => {
      const testSet = [
        { region: "Europe" },
        { region: undefined },
        { region: "Americas" },
      ] as Country[];
      expect(getAllRegions(testSet)).toEqual(["Americas", "Europe"]);
    });

    it("getAllSubregions returns unique, sorted subregions and skips undefined", () => {
      const testSet = [
        { subregion: "Caribbean" },
        { subregion: undefined },
      ] as Country[];
      expect(getAllSubregions(testSet)).toEqual(["Caribbean"]);
    });

    it("getSubregionsForRegion filters by region and skips undefined", () => {
      const testSet = [
        { region: "Europe", subregion: "Western Europe" },
        { region: "Europe", subregion: undefined },
        { region: "Americas", subregion: "Caribbean" },
      ] as Country[];
      expect(getSubregionsForRegion(testSet, "Europe")).toEqual([
        "Western Europe",
      ]);
    });
  });

  describe("metadata getters", () => {
    it("getAllGeoTypes returns unique, sorted geoTypes", () => {
      const testSet = [
        { geoType: "Country" as GeoType },
        { geoType: undefined },
      ] as Country[];
      expect(getAllGeoTypes(testSet)).toEqual(["Country"]);
    });

    it("getAllSovereigntyStatuses returns unique, sorted statuses", () => {
      const testSet = [
        { sovereigntyStatus: "sovereign" as SovereigntyStatus },
        {},
      ] as Country[];
      expect(getAllSovereigntyStatuses(testSet)).toEqual(["sovereign"]);
    });
  });

  describe("getCountryTerritoryRelations", () => {
    it("returns mutual disputes for both sides", () => {
      const a = getCountryTerritoryRelations(countries[0]);
      const b = getCountryTerritoryRelations(countries[4]);
      expect(a.groups?.disputes?.codes).toContain("US");
      expect(b.groups?.disputes?.codes).toContain("FR");
    });

    it.each([
      ["country with no relations", findCountry("DE") || stubCountry("DE")],
      ["empty input", {} as Country],
      ["special country", findCountry("GB-ENG") || stubCountry("GB-ENG")],
      ["countries without provided relations", stubCountry("FR")],
    ])("returns hasRelations: false for %s", (_, country) => {
      expect(getCountryTerritoryRelations(country as Country)).toMatchObject({
        hasRelations: false,
      });
    });

    it("returns full relations for a sovereign with relations", () => {
      const result = getCountryTerritoryRelations(countries[0]);
      expect(result.hasRelations).toBe(true);
      expect(Array.isArray(result.groups?.dependencies?.codes)).toBe(true);
      expect(Array.isArray(result.groups?.overseas_regions?.codes)).toBe(true);
    });

    it("handles deduplication, undefined group entries, and missing codes safely", () => {
      const edgeCountry = stubCountry("EG", {
        name: "Edge",
        territories: {
          missingValue: undefined as unknown as unknown,
          noCodes: { label: "NoCodes" },
          dupes: { codes: ["a", "a"], label: "Dupes" },
          nullCodes: { codes: null as unknown as string[] },
        } as unknown as CountryTerritories,
      });

      const out = getCountryTerritoryRelations(edgeCountry);
      expect(out.groups?.missingValue?.codes).toEqual([]);
      expect(out.groups?.noCodes?.codes).toEqual([]);
      expect(out.groups?.dupes?.codes).toEqual(["a", "a"]);
      expect(out.relatedIsoCodes).toEqual(["a"]);
      expect(out.hasRelations).toBe(true);
    });
  });

  describe("getTerritoryCodesByType", () => {
    const allowedTypes = new Set(["overseas_region", "special_territory"]);

    it("extracts and normalizes unique ISO codes matching allowed types", () => {
      const parent = stubCountry("FR", {
        territories: {
          regions: { type: "overseas_region", codes: ["gf", "yt"] },
          special: { type: "special_territory", codes: ["YT", "bl"] },
          ignored: { type: "dependency", codes: ["nc"] },
        } as unknown as CountryTerritories,
      });

      const codes = getTerritoryCodesByType(parent, allowedTypes);
      expect(codes).toEqual(["GF", "YT", "BL"]);
    });

    it.each([
      ["country with no territories", stubCountry("DE")],
      ["undefined country input", undefined as unknown as Country],
      [
        "allowedTypes that don't match any group",
        stubCountry("FR", {
          territories: {
            deps: { type: "dependency", codes: ["NC"] },
          } as unknown as CountryTerritories,
        }),
      ],
    ])("returns empty array for %s", (_, country) => {
      expect(getTerritoryCodesByType(country, allowedTypes)).toEqual([]);
    });

    it("handles missing group type or empty codes gracefully", () => {
      const malformedParent = stubCountry("XX", {
        territories: {
          noType: { codes: ["A"] },
          noCodes: { type: "overseas_region" },
          nullCodes: { type: "overseas_region", codes: null },
        } as unknown as CountryTerritories,
      });

      expect(getTerritoryCodesByType(malformedParent, allowedTypes)).toEqual(
        [],
      );
    });
  });

  describe("miscellaneous helpers", () => {
    it("getCountriesWithOwnFlag returns array unchanged when overrides not matched", () => {
      const testCountries = [{ isoCode: "US" }, { isoCode: "FR" }];
      expect(getCountriesWithOwnFlag(testCountries as Country[])).toEqual(
        testCountries,
      );
    });

    it("getRandomCountry selects a item from list", () => {
      const testCountries = [{ isoCode: "US" }, { isoCode: "FR" }];
      expect(testCountries).toContainEqual(
        getRandomCountry(testCountries as Country[]),
      );
    });
  });

  describe("transcontinental helpers", () => {
    it("extracts transcontinental info for country object", () => {
      const ru = stubCountry("RU", {
        transcontinental: {
          additionalRegion: "Europe",
          additionalSubregion: "North Asia",
        },
      });

      const info = getTranscontinentalInfo(ru);
      expect(info?.additionalRegion).toBe("Europe");
      expect(info?.additionalSubregion).toBe("North Asia");
      expect(!!getTranscontinentalInfo(ru)).toBe(true);
      expect(!!getTranscontinentalInfo(stubCountry("ZZ"))).toBe(false);
    });

    it("resolves additionalSubregionRegion from subregionsByRegion mapping", () => {
      const country = stubCountry("TR", {
        transcontinental: {
          additionalRegion: "Asia",
          additionalSubregion: "West Asia",
        },
      });

      const subregionsByRegion = {
        "Middle East": [canonicalKey("West Asia")],
      };

      const result = getTranscontinentalInfo(country, subregionsByRegion);
      expect(result?.additionalSubregionRegion).toBe("Middle East");
    });
  });
});
