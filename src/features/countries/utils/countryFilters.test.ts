import { mockCountries } from "@test-utils/mockCountries";
import {
  filterCountries,
  getFilteredIsoCodes,
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
        filterCountries(countries, { selectedSubregion: "Caribbean" })
      ).toEqual([countries[1]]);
    });
    it("filters by sovereignty", () => {
      expect(
        filterCountries(countries, { selectedSovereignty: "Dependency" })
      ).toEqual([countries[1]]);
    });
    it("filters by layerCountries", () => {
      expect(
        filterCountries(countries, { layerCountries: ["FR", "DE"] })
      ).toEqual([countries[0], countries[2]]);
    });
    it("filters by search and region together", () => {
      expect(
        filterCountries(countries, {
          search: "germany",
          selectedRegion: "Europe",
        })
      ).toEqual([countries[2]]);
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
        })
      ).toEqual(allIsoCodes);
    });

    it("filters to only layer countries if 'only'", () => {
      expect(
        getFilteredIsoCodes(countries, layers as any, { o1: "only" })
      ).toEqual(["FR", "DE"]);
    });

    it("excludes layer countries if 'exclude'", () => {
      const expected = allIsoCodes.filter((code) => code !== "GP");
      expect(
        getFilteredIsoCodes(countries, layers as any, { o2: "exclude" })
      ).toEqual(expected);
    });
  });
});
