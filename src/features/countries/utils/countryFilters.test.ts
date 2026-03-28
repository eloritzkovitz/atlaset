import { mockCountries } from "@test-utils/mockCountries";
import {
  filterCountries,
  getFilteredIsoCodes,
  getCountryCounts,
  createSovereigntyFilter,
  filterCountriesByQualifier,
  applyQualifierSearch,
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

  describe("applyQualifierSearch wrapper", () => {
    it("delegates to qualifier search when input is qualifier:query", () => {
      const res = applyQualifierSearch(
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

    it("falls back to normal search with layerCountries when not a qualifier query", () => {
      const res = applyQualifierSearch(
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

    it("falls back to base filtered list when qualifier: has empty query", () => {
      const res = applyQualifierSearch(
        countries,
        "isocode:",
        undefined,
        {
          search: "isocode:",
          selectedRegion: "",
          selectedSubregion: "",
          selectedSovereignty: "",
          includeTranscontinental: false,
        } as any,
        ["FR", "DE"],
      );
      // should respect layerCountries (FR, DE)
      expect(res).toEqual([countries[0], countries[2]]);
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

  describe("filterCountriesByQualifier", () => {
    const testCases = [
      {
        label: "currency",
        qualifier: "currency",
        value: "EUR",
        expected: [countries[0], countries[1], countries[2]],
      },
      {
        label: "currency (partial, insensitive)",
        qualifier: "currency",
        value: "eur",
        expected: [countries[0], countries[1], countries[2]],
      },
      {
        label: "language (array qualifier)",
        qualifier: "language",
        value: "french",
        expected: [countries[0], countries[1]],
      },
      {
        label: "language (partial, insensitive)",
        qualifier: "language",
        value: "fren",
        expected: [countries[0], countries[1]],
      },
      {
        label: "callingcode (token match)",
        qualifier: "callingcode",
        value: "+1",
        expected: [countries[3], countries[4]],
      },
      {
        label: "region",
        qualifier: "region",
        value: "europe",
        expected: [countries[0], countries[2]],
      },
      {
        label: "capital",
        qualifier: "capital",
        value: "paris",
        expected: [countries[0]],
      },
      {
        label: "subregion",
        qualifier: "subregion",
        value: "caribbean",
        expected: [countries[1]],
      },
      {
        label: "sovereignty",
        qualifier: "sovereignty",
        value: "dependency",
        expected: [countries[1]],
      },
      {
        label: "isoCode",
        qualifier: "isocode",
        value: "FR",
        expected: [countries[0]],
      },
      {
        label: "unknown qualifier",
        qualifier: "unknown",
        value: "value",
        expected: [],
      },
      {
        label: "region_tc includes transcontinental extras",
        qualifier: "region_tc",
        value: "europe",
        expected: [countries[0], countries[2], countries[3]],
      },
      {
        label: "subregion_tc includes transcontinental extras",
        qualifier: "subregion_tc",
        value: "northern europe",
        expected: [countries[3]],
      },
    ];

    testCases.forEach(({ label, qualifier, value, expected }) => {
      it(`filters by ${label}`, () => {
        const result = filterCountriesByQualifier(countries, qualifier, value);
        expect(result).toEqual(expected);
      });
    });
  });

  describe("qualifier-specific numeric/year/callingcode filters", () => {
    const visitedMap = { FR: 2, DE: 1 } as Record<string, number>;
    const visitedIsoCodes = Object.keys(visitedMap);

    const visitedYearMapFull: Record<string, Set<number>> = {
      FR: new Set([2019, 2020]),
      DE: new Set([2018]),
      GP: new Set(),
    };

    const visitedYearMapSmall: Record<string, Set<number>> = {
      FR: new Set([2019, 2020]),
      DE: new Set([2018]),
    };

    it("filters by visits > N and =0 correctly", () => {
      const gtResult = filterCountriesByQualifier(countries, "visits", ">1", {
        visitedIsoCodes,
        visitedMap,
        visitedYearMap: {},
      });
      expect(gtResult).toEqual([countries[0]]);

      const eqZero = filterCountriesByQualifier(countries, "visits", "=0", {
        visitedIsoCodes,
        visitedMap,
        visitedYearMap: {},
      });

      expect(eqZero.map((c) => c.isoCode).sort()).toEqual([
        "CA",
        "GP",
        "JP",
        "US",
      ]);
    });

    it("filters by visityear equality and comparisons", () => {
      const eq2020 = filterCountriesByQualifier(countries, "visityear", "=2020", {
        visitedIsoCodes: [],
        visitedMap: {},
        visitedYearMap: visitedYearMapFull,
      });
      expect(eq2020).toEqual([countries[0]]);

      const gt2018 = filterCountriesByQualifier(
        countries,
        "visityear",
        ">2018",
        {
          visitedIsoCodes: [],
          visitedMap: {},
          visitedYearMap: visitedYearMapFull,
        },
      );
      expect(gt2018).toEqual([countries[0]]);
    });

    it("filters by firstvisit comparators", () => {
      const eq2018 = filterCountriesByQualifier(
        countries,
        "firstvisit",
        "=2018",
        {
          visitedIsoCodes: [],
          visitedMap: {},
          visitedYearMap: visitedYearMapSmall,
        },
      );
      expect(eq2018).toEqual([countries[2]]);

      const lt2019 = filterCountriesByQualifier(
        countries,
        "firstvisit",
        "<2019",
        {
          visitedIsoCodes: [],
          visitedMap: {},
          visitedYearMap: visitedYearMapSmall,
        },
      );
      expect(lt2019).toEqual([countries[2]]);
    });

    it("filters by lastvisit comparators", () => {
      const visitedYearMap: Record<string, Set<number>> = {
        FR: new Set([2019, 2020]),
        DE: new Set([2018]),
      };

      const eq2020 = filterCountriesByQualifier(
        countries,
        "lastvisit",
        "=2020",
        { visitedIsoCodes: [], visitedMap: {}, visitedYearMap: visitedYearMap },
      );
      expect(eq2020).toEqual([countries[0]]);

      const gt2019 = filterCountriesByQualifier(
        countries,
        "lastvisit",
        ">2019",
        { visitedIsoCodes: [], visitedMap: {}, visitedYearMap: visitedYearMap },
      );
      expect(gt2019).toEqual([countries[0]]);

      const lt2019 = filterCountriesByQualifier(
        countries,
        "lastvisit",
        "<2019",
        { visitedIsoCodes: [], visitedMap: {}, visitedYearMap: visitedYearMap },
      );
      expect(lt2019).toEqual([countries[2]]);
    });

    it("filters by callingcode tokens", () => {
      const res = filterCountriesByQualifier(countries, "callingcode", "+1");
      expect(res.map((c) => c.isoCode).sort()).toEqual(["CA", "US"]);
    });
  });
});
