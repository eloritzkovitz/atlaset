import { mockCountries } from "@test-utils/mockCountries";
import {
  filterCountries,
  getFilteredIsoCodes,
  getCountryCounts,
  createSovereigntyFilter,
  filterCountriesByProperty,
} from "./countryFilters";

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
        label: "aliases (array property)",
        property: "aliases",
        value: "Testland",
        countries: [
          { ...countries[0], aliases: ["Testland"] },
          ...countries.slice(1),
        ],
        expected: [{ ...countries[0], aliases: ["Testland"] }],
      },
    ];

    testCases.forEach(
      ({ label, property, value, expected, countries: customCountries }) => {
        it(`filters by ${label}`, () => {
          const inputCountries = customCountries || countries;
          const result = filterCountriesByProperty(
            inputCountries,
            property,
            value,
          );
          expect(result).toEqual(expected);
        });
      },
    );
  });
});
