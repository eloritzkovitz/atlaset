import { mockCountries } from "@test-utils/mockCountries";
import {
  filterCountries,
  getFilteredIsoCodes,
  getCountryCounts,
  createSovereigntyFilter,
  filterCountriesByProperty,
  applyPropertySearch,
} from "./countryFilters";

vi.mock("../constants/transcontinental", () => ({
  TRANSCONTINENTAL_MAP: new Map([
    [
      "CA",
      {
        additionalRegion: "Europe",
        additionalSubregion: "Northern Europe",
      },
    ],
  ]),
}));

describe("countryFilters utils", () => {
  const countries = mockCountries;

  describe("filterCountries", () => {
    it("filters by region", () => {
      expect(filterCountries(countries, { selectedRegion: "Europe" })).toEqual([
        countries[0],
        countries[2],
      ]);
    });

    it("filters by subregion", () => {
      expect(
        filterCountries(countries, { selectedSubregion: "Caribbean" }),
      ).toEqual([countries[1]]);
    });

    it("filters by sovereignty", () => {
      expect(
        filterCountries(countries, { selectedSovereignty: "Dependency" }),
      ).toEqual([countries[1]]);
    });

    it("filters by layerCountries", () => {
      expect(
        filterCountries(countries, { layerCountries: ["FR", "DE"] }),
      ).toEqual([countries[0], countries[2]]);
    });

    it("filters by search and region together", () => {
      expect(
        filterCountries(countries, {
          search: "germany",
          selectedRegion: "Europe",
        }),
      ).toEqual([countries[2]]);
    });

    it("filters by alias in search", () => {
      const countriesWithAlias = [
        { ...countries[0], aliases: ["Testland"] },
        ...countries.slice(1),
      ];
      expect(
        filterCountries(countriesWithAlias, { search: "Testland" }),
      ).toEqual([countriesWithAlias[0]]);
    });

    it("includes transcontinental extras when includeTranscontinental is true", () => {
      const result = filterCountries(countries, {
        selectedRegion: "Europe",
        includeTranscontinental: true,
      } as any);
      expect(result).toEqual([countries[0], countries[2], countries[3]]);
    });

    it("does not include transcontinental extras when includeTranscontinental is false", () => {
      const result = filterCountries(countries, {
        selectedRegion: "Europe",
        includeTranscontinental: false,
      } as any);
      expect(result).toEqual([countries[0], countries[2]]);
    });
  });

  describe("applyPropertySearch wrapper", () => {
    it("delegates to property search when input is property:query", () => {
      const res = applyPropertySearch(
        countries,
        "currency:EUR",
        undefined,
        {
          search: "currency:EUR",
          selectedRegion: "",
          selectedSubregion: "",
          selectedSovereignty: "",
          includeTranscontinental: false,
        } as any,
        undefined,
      );
      expect(res).toEqual([countries[0], countries[1], countries[2]]);
    });

    it("falls back to normal search with layerCountries when not a property query", () => {
      const res = applyPropertySearch(
        countries,
        "germany",
        undefined,
        {
          search: "germany",
          selectedRegion: "",
          selectedSubregion: "",
          selectedSovereignty: "",
          includeTranscontinental: false,
        } as any,
        ["DE"],
      );
      expect(res).toEqual([countries[2]]);
    });
  });

  describe("getFilteredIsoCodes", () => {
    const layers = [
      { id: "o1", countries: ["FR", "DE"] },
      { id: "o2", countries: ["GP"] },
    ];
    const allIsoCodes = mockCountries.map((c) => c.isoCode);

    it("returns all iso codes if layers are 'all'", () => {
      expect(
        getFilteredIsoCodes(countries, layers as any, {
          o1: "all",
          o2: "all",
        }),
      ).toEqual(allIsoCodes);
    });

    it("filters to only layer countries if 'only'", () => {
      expect(
        getFilteredIsoCodes(countries, layers as any, { o1: "only" }),
      ).toEqual(["FR", "DE"]);
    });

    it("excludes layer countries if 'exclude'", () => {
      const expected = allIsoCodes.filter((code) => code !== "GP");
      expect(
        getFilteredIsoCodes(countries, layers as any, { o2: "exclude" }),
      ).toEqual(expected);
    });
  });

  describe("getCountryCounts", () => {
    const countries = mockCountries;
    const visitedIsoCodes = ["FR", "GP"];
    const filteredCountries = countries;
    const filteredCountriesNoLayer = countries;

    it("returns correct counts for all, sovereign, and visited", () => {
      const counts = getCountryCounts({
        filteredCountries,
        filteredCountriesNoLayer,
        visitedIsoCodes,
      });
      expect(counts.allCount).toBe(filteredCountries.length);
      expect(counts.allCountWithoutLayers).toBe(
        filteredCountriesNoLayer.length,
      );
      expect(counts.sovereignCount).toBe(
        filteredCountries.filter((c) => c.sovereigntyType === "Sovereign")
          .length,
      );
      expect(counts.visitedCount).toBe(
        filteredCountriesNoLayer.filter((c) =>
          visitedIsoCodes.includes(c.isoCode),
        ).length,
      );
    });

    it("returns zero counts for empty arrays", () => {
      const counts = getCountryCounts({
        filteredCountries: [],
        filteredCountriesNoLayer: [],
        visitedIsoCodes: [],
      });
      expect(counts.allCount).toBe(0);
      expect(counts.allCountWithoutLayers).toBe(0);
      expect(counts.sovereignCount).toBe(0);
      expect(counts.visitedCount).toBe(0);
    });
  });

  describe("createSovereigntyFilter", () => {
    it("returns all countries when sovereignOnly is false or undefined", () => {
      const filter = createSovereigntyFilter();
      expect(mockCountries.filter(filter)).toEqual(mockCountries);
      const filterFalse = createSovereigntyFilter(false);
      expect(mockCountries.filter(filterFalse)).toEqual(mockCountries);
    });

    it("returns only sovereign countries when sovereignOnly is true", () => {
      const filter = createSovereigntyFilter(true);
      const expected = mockCountries.filter(
        (c) => c.sovereigntyType === "Sovereign",
      );
      expect(mockCountries.filter(filter)).toEqual(expected);
    });
  });

  describe("filterCountriesByProperty", () => {
    const testCases = [
      {
        label: "currency",
        property: "currency",
        value: "EUR",
        expected: [countries[0], countries[1], countries[2]],
      },
      {
        label: "currency (partial, insensitive)",
        property: "currency",
        value: "eur",
        expected: [countries[0], countries[1], countries[2]],
      },
      {
        label: "language (array property)",
        property: "language",
        value: "french",
        expected: [countries[0], countries[1]],
      },
      {
        label: "language (partial, insensitive)",
        property: "language",
        value: "fren",
        expected: [countries[0], countries[1]],
      },
      {
        label: "callingcode (token match)",
        property: "callingcode",
        value: "+1",
        expected: [countries[3], countries[4]],
      },
      {
        label: "region",
        property: "region",
        value: "europe",
        expected: [countries[0], countries[2]],
      },
      {
        label: "capital",
        property: "capital",
        value: "paris",
        expected: [countries[0]],
      },
      {
        label: "subregion",
        property: "subregion",
        value: "caribbean",
        expected: [countries[1]],
      },
      {
        label: "sovereignty",
        property: "sovereignty",
        value: "dependency",
        expected: [countries[1]],
      },
      {
        label: "isoCode",
        property: "isocode",
        value: "FR",
        expected: [countries[0]],
      },
      {
        label: "unknown property",
        property: "unknown",
        value: "value",
        expected: [],
      },
      {
        label: "region_tc includes transcontinental extras",
        property: "region_tc",
        value: "europe",
        expected: [countries[0], countries[2], countries[3]],
      },
      {
        label: "subregion_tc includes transcontinental extras",
        property: "subregion_tc",
        value: "northern europe",
        expected: [countries[3]],
      },
    ];

    testCases.forEach(({ label, property, value, expected }) => {
      it(`filters by ${label}`, () => {
        const result = filterCountriesByProperty(countries, property, value);
        expect(result).toEqual(expected);
      });
    });
  });

  describe("property-specific numeric/year/callingcode filters", () => {
    it("filters by visits > N and =0 correctly", () => {
      const visitedMap = { FR: 2, DE: 1 } as Record<string, number>;
      const visitedIsoCodes = Object.keys(visitedMap);

      const gtResult = filterCountriesByProperty(
        countries,
        "visits",
        ">1",
        visitedIsoCodes,
        visitedMap,
      );
      expect(gtResult).toEqual([countries[0]]);

      const eqZero = filterCountriesByProperty(
        countries,
        "visits",
        "=0",
        visitedIsoCodes,
        visitedMap,
      );

      expect(eqZero.map((c) => c.isoCode).sort()).toEqual([
        "CA",
        "GP",
        "JP",
        "US",
      ]);
    });

    it("filters by visityear equality and comparisons", () => {
      const visitedYearMap: Record<string, Set<number>> = {
        FR: new Set([2019, 2020]),
        DE: new Set([2018]),
        GP: new Set(),
      };

      const eq2020 = filterCountriesByProperty(
        countries,
        "visityear",
        "=2020",
        undefined,
        undefined,
        visitedYearMap,
      );
      expect(eq2020).toEqual([countries[0]]);

      const gt2018 = filterCountriesByProperty(
        countries,
        "visityear",
        ">2018",
        undefined,
        undefined,
        visitedYearMap,
      );
      expect(gt2018).toEqual([countries[0]]);
    });

    it("filters by firstvisit comparators", () => {
      const visitedYearMap: Record<string, Set<number>> = {
        FR: new Set([2019, 2020]),
        DE: new Set([2018]),
      };

      const eq2018 = filterCountriesByProperty(
        countries,
        "firstvisit",
        "=2018",
        undefined,
        undefined,
        visitedYearMap,
      );
      expect(eq2018).toEqual([countries[2]]);

      const lt2019 = filterCountriesByProperty(
        countries,
        "firstvisit",
        "<2019",
        undefined,
        undefined,
        visitedYearMap,
      );
      expect(lt2019).toEqual([countries[2]]);
    });

    it("filters by callingcode tokens", () => {
      const res = filterCountriesByProperty(countries, "callingcode", "+1");
      expect(res.map((c) => c.isoCode).sort()).toEqual(["CA", "US"]);
    });
  });
});
