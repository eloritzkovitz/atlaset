import { mockCountries } from "@test-utils/mockCountries";
import {
  filterCountries,
  getFilteredIsoCodes,
  getCountryCounts,
  createSovereigntyFilter,
  filterCountriesByQualifier,
  applyQualifierSearch,
} from "./countryFilters";
import * as searchUtils from "@utils/search";

describe("countryFilters utils", () => {
  const countries = mockCountries;

  // Helper function to apply qualifier filter with visit context and modifiers for testing
  const fq = (
    qualifier: string,
    value: string,
    visitContext?: any,
    modifiers?: any,
  ) =>
    filterCountriesByQualifier(
      countries,
      qualifier,
      value,
      visitContext,
      modifiers,
    );

  const mkVC = ({
    iso = [],
    map = undefined,
    ymap = undefined,
    firstMap = undefined,
    lastMap = undefined,
  }: {
    iso?: string[];
    map?: Record<string, number> | undefined;
    ymap?: Record<string, Set<number>> | undefined;
    firstMap?: Record<string, number> | undefined;
    lastMap?: Record<string, number> | undefined;
  } = {}): any => ({
    visitedIsoCodes: iso,
    visitedMap: map,
    visitedYearMap: ymap,
    firstVisitMap: firstMap,
    lastVisitMap: lastMap,
  });

  describe("filterCountries", () => {
    const cases = [
      {
        name: "filters by region",
        opts: { selectedRegion: "Europe" },
        expected: [countries[0], countries[2]],
      },
      {
        name: "filters by subregion",
        opts: { selectedSubregion: "Caribbean" },
        expected: [countries[1]],
      },
      {
        name: "filters by sovereignty",
        opts: { selectedSovereignty: "Dependency" },
        expected: [countries[1]],
      },
      {
        name: "filters by layerCountries",
        opts: { layerCountries: ["FR", "DE"] },
        expected: [countries[0], countries[2]],
      },
      {
        name: "filters by geoType (island)",
        opts: { selectedGeoType: "Island" },
        expected: [countries[1], countries[5]],
      },
      {
        name: "filters by geoType (landlocked)",
        opts: { selectedGeoType: "Landlocked" },
        expected: [countries[2]],
      },
      {
        name: "filters by search and region together",
        opts: { search: "germany", selectedRegion: "Europe" },
        expected: [countries[2]],
      },
    ];

    test.each(cases)("$name", ({ opts, expected }) => {
      expect(filterCountries(countries, opts as any)).toEqual(expected);
    });

    it("filters by altNames in search", () => {
      const countriesWithAltNames = [
        { ...countries[0], altNames: ["Testland"] },
        ...countries.slice(1),
      ];
      expect(
        filterCountries(countriesWithAltNames, { search: "Testland" }),
      ).toEqual([countriesWithAltNames[0]]);
    });

    const tcCases = [
      {
        name: "includes transcontinental extras (include)",
        opts: { selectedRegion: "Europe", modifiers: { tc: "include" } },
        expected: [countries[0], countries[2]],
      },
      {
        name: "excludes transcontinental extras (default)",
        opts: { selectedRegion: "Europe", modifiers: { tc: "default" } },
        expected: [countries[0], countries[2]],
      },
      {
        name: "only transcontinental (only)",
        opts: { modifiers: { tc: "only" } },
        expected: [countries[4]],
      },
      {
        name: "only contiguous scope (only:contiguous)",
        opts: { modifiers: { tc: "only:contiguous" } },
        expected: [],
      },
      {
        name: "only overseas scope (only:overseas)",
        opts: { modifiers: { tc: "only:overseas" } },
        expected: [countries[4]],
      },
    ];

    test.each(tcCases)("$name", ({ opts, expected }) => {
      expect(filterCountries(countries, opts as any)).toEqual(expected);
    });
  });

  it("filters to dependencies when using sovereign qualifier", () => {
    const res = filterCountries(countries, {
      qualifiers: { sovereign: "FR" },
    } as any);
    expect(res.map((c) => c.isoCode)).toContain("GP");
  });

  it("returns empty array for unknown sovereign modifier", () => {
    const res = applyQualifierSearch(
      countries,
      "sovereign:ZZ",
      undefined,
      {
        search: "sovereign:ZZ",
        selectedRegion: "",
        selectedSubregion: "",
        selectedSovereignty: "",
        modifiers: {},
      } as any,
      undefined,
    );
    expect(res).toEqual([]);
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
          modifiers: { tc: "default" },
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
          modifiers: { tc: false },
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
          modifiers: { tc: false },
        } as any,
        ["FR", "DE"],
      );
      expect(res).toEqual([countries[0], countries[2]]);
    });

    it("applies additional qualifier-like modifiers (subregion) after primary qualifier", () => {
      const res = applyQualifierSearch(
        countries,
        "region:europe subregion:Western",
        undefined,
        {
          search: "region:europe subregion:Western",
          selectedRegion: "",
          selectedSubregion: "",
          selectedSovereignty: "",
          modifiers: { tc: false },
        } as any,
        undefined,
      );
      expect(res).toEqual([countries[0], countries[2]]);
    });

    it("honors modifier-only keys such as of (sovereignty dependencies)", () => {
      const res = applyQualifierSearch(
        countries,
        "sovereignty:Dependency of:FR",
        undefined,
        {
          search: "sovereignty:Dependency of:FR",
          selectedRegion: "",
          selectedSubregion: "",
          selectedSovereignty: "",
          modifiers: {},
        } as any,
        undefined,
      );
      expect(res.map((c) => c.isoCode)).toContain("GP");
    });

    it("sovereign qualifier supports boolean and ISO tokens", () => {
      const baseParams = {
        search: "",
        selectedRegion: "",
        selectedSubregion: "",
        selectedSovereignty: "",
        modifiers: {},
      } as any;

      const resTrue = applyQualifierSearch(
        countries,
        "sovereign:true",
        undefined,
        { ...baseParams, search: "sovereign:true" },
        undefined,
      );
      expect(resTrue.some((c) => c.sovereigntyStatus === "Sovereign")).toBe(true);

      const resFalse = applyQualifierSearch(
        countries,
        "sovereign:false",
        undefined,
        { ...baseParams, search: "sovereign:false" },
        undefined,
      );
      expect(resFalse.some((c) => c.sovereigntyStatus !== "Sovereign")).toBe(
        true,
      );

      const resIso = applyQualifierSearch(
        countries,
        "sovereign:FR",
        undefined,
        { ...baseParams, search: "sovereign:FR" },
        undefined,
      );
      expect(resIso.map((c) => c.isoCode)).toContain("GP");
    });

    it("applies tc modifier merged into global modifiers", () => {
      const res = applyQualifierSearch(
        countries,
        "region:europe tc:include",
        undefined,
        {
          search: "region:europe tc:include",
          selectedRegion: "",
          selectedSubregion: "",
          selectedSovereignty: "",
          modifiers: {},
        } as any,
        undefined,
      );
      expect(res.map((c) => c.isoCode)).toEqual([
        countries[0].isoCode,
        countries[2].isoCode,
      ]);
    });

    it("returns empty array when selected region has no matches", () => {
      const res = filterCountries(countries, { selectedRegion: "Oceania" });
      expect(res).toEqual([]);
    });

    it("returns empty array when selected subregion has no matches", () => {
      const res = filterCountries(countries, { selectedSubregion: "Unknown" });
      expect(res).toEqual([]);
    });

    it("ignores unknown raw modifiers when applying qualifier search", () => {
      const res = applyQualifierSearch(
        countries,
        "region:europe foobar:xyz",
        undefined,
        {
          search: "region:europe foobar:xyz",
          selectedRegion: "",
          selectedSubregion: "",
          selectedSovereignty: "",
          modifiers: {},
        } as any,
        undefined,
      );
      expect(res).toEqual([countries[0], countries[2]]);
    });

    it("skips resolved qualifier modifiers when raw value is undefined", () => {
      const spy = vi
        .spyOn(searchUtils, "parseQualifierSearch")
        .mockReturnValue({
          qualifier: "region",
          query: "europe",
          modifiers: { subregion: undefined },
        } as any);

      try {
        const res = applyQualifierSearch(
          countries,
          "region:europe subregion:",
          undefined,
          {
            search: "region:europe subregion:",
            selectedRegion: "",
            selectedSubregion: "",
            selectedSovereignty: "",
            modifiers: {},
          } as any,
          undefined,
        );
        expect(res).toEqual([countries[0], countries[2]]);
      } finally {
        spy.mockRestore();
      }
    });

    it("parseQualifierSearch result for trailing empty modifier", () => {
      const parsed = searchUtils.parseQualifierSearch(
        "region:europe subregion:",
      );
      expect(parsed).toEqual({
        qualifier: "region",
        query: "europe",
        modifiers: {},
      });
    });

    it("ignores trailing qualifier tokens with empty values", () => {
      const res = applyQualifierSearch(
        countries,
        "region:europe subregion:",
        undefined,
        {
          search: "region:europe subregion:",
          selectedRegion: "",
          selectedSubregion: "",
          selectedSovereignty: "",
          modifiers: {},
        } as any,
        undefined,
      );
      expect(res).toEqual([countries[0], countries[2]]);
    });

    it("uses visitedMap when visitedIsoCodes is not provided to applyQualifierSearch", () => {
      const res = applyQualifierSearch(
        countries,
        "region:europe visited:true",
        undefined,
        {
          search: "region:europe visited:true",
          selectedRegion: "",
          selectedSubregion: "",
          selectedSovereignty: "",
          modifiers: {},
        } as any,
        undefined,
        { FR: 1 },
      );
      expect(res).toEqual([countries[0]]);
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
        filteredCountries.filter((c) => c.sovereigntyStatus === "Sovereign")
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
        (c) => c.sovereigntyStatus === "Sovereign",
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
        label: "region includes transcontinental extras (tc:true)",
        qualifier: "region",
        value: "europe",
        options: { modifiers: { tc: "include" } },
        expected: [countries[0], countries[2]],
      },
      {
        label: "subregion includes transcontinental extras (tc:true)",
        qualifier: "subregion",
        value: "northern europe",
        options: { modifiers: { tc: "include" } },
        expected: [],
      },
      {
        label: "region includes transcontinental extras (tc:include)",
        qualifier: "region",
        value: "europe",
        options: { modifiers: { tc: "include" } },
        expected: [countries[0], countries[2]],
      },
      {
        label: "region excludes transcontinental extras (tc:false)",
        qualifier: "region",
        value: "europe",
        options: { modifiers: { tc: "default" } },
        expected: [countries[0], countries[2]],
      },
      {
        label: "subregion includes overseas (tc:'overseas')",
        qualifier: "subregion",
        value: "northern europe",
        options: { modifiers: { tc: "overseas" } },
        expected: [],
      },
      {
        label: "subregion overseas scope (tc:'overseas')",
        qualifier: "subregion",
        value: "northern europe",
        options: { modifiers: { tc: "overseas" } },
        expected: [],
      },
      {
        label: "unknown qualifier",
        qualifier: "unknown",
        value: "value",
        expected: [],
      },
    ];

    testCases.forEach(({ label, qualifier, value, expected, options }: any) => {
      it(`filters by ${label}`, () => {
        const result = filterCountriesByQualifier(
          countries,
          qualifier,
          value,
          options?.visitContext,
          options?.modifiers,
        );
        expect(result).toEqual(expected);
      });
    });

    it("filters by region with visited:true modifier", () => {
      const visitContext = mkVC({ iso: ["FR"] });
      const res = fq("region", "europe", visitContext, { visited: true });
      expect(res).toEqual([countries[0], countries[2]]);
    });

    it("filters by region with visited:false modifier", () => {
      const visitContext = mkVC({ iso: ["FR"] });
      const res = fq("region", "europe", visitContext, { visited: false });
      expect(res).toEqual([countries[0], countries[2]]);
    });

    it("accepts visited modifier as boolean true/false", () => {
      const visitContext = mkVC({ iso: ["FR"] });
      const resTrue = fq("region", "europe", visitContext, { visited: true });
      expect(resTrue).toEqual([countries[0], countries[2]]);

      const resFalse = fq("region", "europe", visitContext, {
        visited: false,
      });
      expect(resFalse).toEqual([countries[0], countries[2]]);
    });

    it("filters by region with visited:true and count:>0 modifiers", () => {
      const visitContext = mkVC({ iso: ["FR"], map: { FR: 2 } });
      const res = fq("region", "europe", visitContext, {
        visited: true,
        count: { op: ">", value: 0 },
      });
      expect(res).toEqual([countries[0]]);
    });

    it("filters by number type numeric comparators", () => {
      const popCountries = [countries[1], countries[2], countries[5]];

      const gt = filterCountriesByQualifier(
        popCountries as any,
        "population",
        ">10000",
      );
      expect(gt).toEqual([popCountries[2]]);

      const eq = filterCountriesByQualifier(
        popCountries as any,
        "population",
        "=8300",
      );
      expect(eq).toEqual([popCountries[1]]);

      const lt = filterCountriesByQualifier(
        popCountries as any,
        "population",
        "<2000",
      );
      expect(lt).toEqual([popCountries[0]]);

      const res = filterCountriesByQualifier(
        popCountries as any,
        "population",
        "~12600",
      );
      expect(res).toEqual([popCountries[2]]);
    });

    it("filters by area approx (~)", () => {
      const areaCountries = [countries[0], countries[2], countries[4]];
      const res = filterCountriesByQualifier(
        areaCountries as any,
        "area",
        "~357000",
      );
      expect(res).toEqual([areaCountries[1]]);
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
      const baseVC = mkVC({ iso: visitedIsoCodes, map: visitedMap, ymap: {} });
      const gtResult = fq("visited", "", baseVC, {
        count: { op: ">", value: 1 },
      });
      expect(gtResult).toEqual([countries[0]]);

      const eqZero = fq("visited", "", baseVC, {
        count: { op: "=", value: 0 },
      });

      expect(eqZero.map((c) => c.isoCode).sort()).toEqual([
        "CA",
        "GP",
        "JP",
        "US",
      ]);
    });

    it("filters by year modifier equality and comparisons", () => {
      const yearVC = mkVC({ ymap: visitedYearMapFull });
      const eq2020 = fq("visited", "", yearVC, {
        year: { op: "=", year: 2020 },
      });
      expect(eq2020).toEqual([countries[0]]);

      const gt2018 = fq("visited", "", yearVC, {
        year: { op: ">", year: 2018 },
      });
      expect(gt2018).toEqual([countries[0]]);
    });

    it("filters by first (modifier) comparators", () => {
      const firstVC = mkVC({ ymap: visitedYearMapSmall });
      const eq2018 = fq("visited", "", firstVC, {
        first: { op: "=", year: 2018 },
      });
      expect(eq2018).toEqual([countries[2]]);

      const lt2019 = fq("visited", "", firstVC, {
        first: { op: "<", year: 2019 },
      });
      expect(lt2019).toEqual([countries[2]]);
    });

    it("filters by last (modifier) comparators", () => {
      const visitedYearMap: Record<string, Set<number>> = {
        FR: new Set([2019, 2020]),
        DE: new Set([2018]),
      };

      const lastVC = mkVC({ ymap: visitedYearMap });
      const eq2020 = fq("visited", "", lastVC, {
        last: { op: "=", year: 2020 },
      });
      expect(eq2020).toEqual([countries[0]]);

      const gt2019 = fq("visited", "", lastVC, {
        last: { op: ">", year: 2019 },
      });
      expect(gt2019).toEqual([countries[0]]);

      const lt2019 = fq("visited", "", lastVC, {
        last: { op: "<", year: 2019 },
      });
      expect(lt2019).toEqual([countries[2]]);
    });

    it("accepts typed modifier objects (ensureModifiers fast-path)", () => {
      const visitedMap = { FR: 2, DE: 1 } as Record<string, number>;
      const visitedIsoCodes = Object.keys(visitedMap);
      const baseVC = mkVC({ iso: visitedIsoCodes, map: visitedMap, ymap: {} });
      const res = fq("visited", "", baseVC, {
        count: { op: ">", value: 1 },
      } as any);
      expect(res).toEqual([countries[0]]);
    });

    it("filters by callingcode tokens", () => {
      const res = filterCountriesByQualifier(countries, "callingcode", "+1");
      expect(res.map((c) => c.isoCode).sort()).toEqual(["CA", "US"]);
    });
  });
});
